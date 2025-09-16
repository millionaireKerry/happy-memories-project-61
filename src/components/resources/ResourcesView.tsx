import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Upload, Search, Download, FileImage, FolderOpen, Package } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ResourceCategory {
  id: string;
  name: string;
  description: string;
}

interface Resource {
  id: string;
  title: string;
  description: string;
  category_id: string;
  file_path: string;
  file_name: string;
  file_size: number;
  file_type: string;
  tags: string[];
  is_pack: boolean;
  pack_size: number;
  created_at: string;
  category?: ResourceCategory;
}

export const ResourcesView = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [categories, setCategories] = useState<ResourceCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [uploadingFiles, setUploadingFiles] = useState<string[]>([]);

  useEffect(() => {
    fetchCategories();
    fetchResources();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('resource_categories')
        .select('*')
        .order('name', { ascending: true });
      
      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error("Failed to load categories");
    }
  };

  const fetchResources = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('resources')
        .select(`
          *,
          category:resource_categories(*)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setResources(data || []);
    } catch (error) {
      console.error('Error fetching resources:', error);
      toast.error("Failed to load resources");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (files: FileList, categoryId: string) => {
    if (!categoryId) {
      toast.error("Please select a category first");
      return;
    }

    const fileArray = Array.from(files);
    const fileNames = fileArray.map(f => f.name);
    setUploadingFiles(prev => [...prev, ...fileNames]);

    try {
      for (const file of fileArray) {
        // Upload file to storage
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `${categoryId}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('resources')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        // Create resource record
        const { error: insertError } = await supabase
          .from('resources')
          .insert({
            title: file.name.replace(/\.[^/.]+$/, ""), // Remove file extension
            description: `Uploaded resource: ${file.name}`,
            category_id: categoryId,
            file_path: filePath,
            file_name: file.name,
            file_size: file.size,
            file_type: file.type,
            tags: [],
            is_pack: false,
            pack_size: 1
          });

        if (insertError) throw insertError;
      }

      toast.success(`Uploaded ${fileArray.length} file(s) successfully`);
      fetchResources();
    } catch (error) {
      console.error('Error uploading files:', error);
      toast.error("Failed to upload files");
    } finally {
      setUploadingFiles(prev => prev.filter(name => !fileNames.includes(name)));
    }
  };

  const handleDownload = async (resource: Resource) => {
    try {
      const { data, error } = await supabase.storage
        .from('resources')
        .download(resource.file_path);

      if (error) throw error;

      // Create download link
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = resource.file_name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success(`Downloaded ${resource.file_name}`);
    } catch (error) {
      console.error('Error downloading file:', error);
      toast.error("Failed to download file");
    }
  };

  const filteredResources = resources.filter(resource => {
    const matchesCategory = selectedCategory === "all" || resource.category_id === selectedCategory;
    const matchesSearch = searchTerm === "" || 
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FolderOpen className="h-6 w-6" />
            Resources Hub
          </CardTitle>
          <CardDescription>
            Upload and manage resources for care homes - quiz packs, newsletters, reminiscence materials and more
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload Resources
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Select Category</label>
              <Select onValueChange={(value) => setSelectedCategory(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Upload Files</label>
              <Input
                type="file"
                multiple
                accept="image/*,.pdf,.doc,.docx,.ppt,.pptx,.zip,.rar,.7z"
                onChange={(e) => {
                  if (e.target.files && selectedCategory !== "all") {
                    handleFileUpload(e.target.files, selectedCategory);
                  }
                }}
                disabled={selectedCategory === "all" || uploadingFiles.length > 0}
              />
            </div>
          </div>

          {uploadingFiles.length > 0 && (
            <div className="mt-4">
              <p className="text-sm text-muted-foreground mb-2">Uploading files:</p>
              <div className="flex flex-wrap gap-2">
                {uploadingFiles.map((fileName, index) => (
                  <Badge key={index} variant="secondary">
                    {fileName}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Search and Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search resources..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-muted rounded w-1/2 mb-4"></div>
                <div className="h-8 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))
        ) : filteredResources.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="p-12 text-center">
              <FileImage className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No resources found</h3>
              <p className="text-muted-foreground">
                {searchTerm || selectedCategory !== "all" 
                  ? "Try adjusting your search or filter criteria"
                  : "Upload your first resource to get started"
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredResources.map((resource) => (
            <Card key={resource.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg flex items-center gap-2">
                      {resource.is_pack ? (
                        <Package className="h-4 w-4" />
                      ) : (
                        <FileImage className="h-4 w-4" />
                      )}
                      {resource.title}
                    </CardTitle>
                    <Badge variant="secondary" className="mt-2">
                      {resource.category?.name}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {resource.description && (
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {resource.description}
                  </p>
                )}
                
                <div className="flex flex-wrap gap-1">
                  {resource.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <Separator />

                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{formatFileSize(resource.file_size)}</span>
                  {resource.is_pack && (
                    <span>{resource.pack_size} files</span>
                  )}
                </div>

                <Button 
                  onClick={() => handleDownload(resource)}
                  className="w-full"
                  variant="gradient"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Category Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Resource Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category) => {
              const categoryCount = resources.filter(r => r.category_id === category.id).length;
              return (
                <div key={category.id} className="p-4 border rounded-lg">
                  <h4 className="font-semibold">{category.name}</h4>
                  <p className="text-sm text-muted-foreground mt-1">{category.description}</p>
                  <Badge className="mt-2">{categoryCount} resources</Badge>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};