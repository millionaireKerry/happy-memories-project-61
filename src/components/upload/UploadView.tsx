import { useState, useCallback, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { 
  Upload, 
  Image as ImageIcon, 
  X,
  Camera,
  Heart,
  Calendar as CalendarIcon,
  MapPin,
  Mic,
  MicOff,
  Play,
  Pause,
  Square,
  Trash2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const UploadView = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [caption, setCaption] = useState("");
  const [memoryDate, setMemoryDate] = useState<Date>();
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [customTag, setCustomTag] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  
  // Voice recording states
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  const { toast } = useToast();

  // Voice recording functions
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      const chunks: BlobPart[] = [];
      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        setAudioBlob(blob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      // Start timer
      recordingTimerRef.current = setInterval(() => {
        setRecordingTime(prev => {
          if (prev >= 30) { // 30 second limit
            stopRecording();
            return prev;
          }
          return prev + 1;
        });
      }, 1000);

      toast({
        title: "Recording started",
        description: "Speak about this memory (30 seconds max)"
      });
    } catch (error) {
      toast({
        title: "Recording failed",
        description: "Could not access microphone. Please check permissions.",
        variant: "destructive"
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
    }
  };

  const playAudio = () => {
    if (audioBlob) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      
      const audio = new Audio(URL.createObjectURL(audioBlob));
      audioRef.current = audio;
      
      audio.onended = () => setIsPlaying(false);
      audio.play();
      setIsPlaying(true);
    }
  };

  const pauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const deleteVoiceNote = () => {
    setAudioBlob(null);
    setRecordingTime(0);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setIsPlaying(false);
  };

  const suggestedTags = [
    "family", "holiday", "birthday", "christmas", "garden", "pets", 
    "wedding", "children", "grandchildren", "friends", "home", "celebration"
  ];

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedFiles(prev => [...prev, ...files]);
  }, []);

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const addTag = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags(prev => [...prev, tag]);
    }
  };

  const removeTag = (tag: string) => {
    setSelectedTags(prev => prev.filter(t => t !== tag));
  };

  const handleCustomTag = () => {
    if (customTag.trim() && !selectedTags.includes(customTag.trim())) {
      setSelectedTags(prev => [...prev, customTag.trim()]);
      setCustomTag("");
    }
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      toast({
        title: "No files selected",
        description: "Please select at least one photo to upload.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    
    try {
      // Create memory objects with enhanced data
      const memories = selectedFiles.map((file, index) => ({
        file,
        caption: caption || "",
        memoryDate: memoryDate ? memoryDate.toISOString().split('T')[0] : null,
        tags: selectedTags,
        voiceNote: audioBlob ? URL.createObjectURL(audioBlob) : null,
        voiceNoteDuration: recordingTime
      }));

      console.log("Uploading memories with enhanced data:", memories);
      
      // Simulate upload process with enhanced features
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      let description = `${selectedFiles.length} memory${selectedFiles.length > 1 ? 'ies' : ''} uploaded`;
      if (memoryDate) description += ` with date`;
      if (audioBlob) description += ` and voice note`;
      if (selectedTags.length > 0) description += ` with ${selectedTags.length} tags`;
      
      toast({
        title: "Enhanced Memory uploaded successfully! 🎉",
        description: description,
      });
      
      // Reset form completely
      setSelectedFiles([]);
      setCaption("");
      setMemoryDate(undefined);
      setSelectedTags([]);
      setCustomTag("");
      setAudioBlob(null);
      setRecordingTime(0);
      setIsPlaying(false);
      setIsRecording(false);
      
      // Clean up audio references
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
      
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "There was an error uploading your memories. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-primary mb-2">Upload Happy Memories</h2>
        <p className="text-muted-foreground">Share precious moments with your loved ones and care team</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload Area */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5 text-primary" />
                Select Photos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="upload-zone border-2 border-dashed border-border rounded-lg p-8 text-center">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="photo-upload"
                />
                <label htmlFor="photo-upload" className="cursor-pointer">
                  <div className="flex flex-col items-center gap-4">
                    <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                      <Upload className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-primary">Drop photos here or click to browse</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Support for JPG, PNG, GIF up to 10MB each
                      </p>
                    </div>
                    <Button variant="gradient" size="lg">
                      <ImageIcon className="mr-2 h-5 w-5" />
                      Choose Photos
                    </Button>
                  </div>
                </label>
              </div>

              {/* Selected Files */}
              {selectedFiles.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-semibold mb-3">Selected Photos ({selectedFiles.length})</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {selectedFiles.map((file, index) => (
                      <div key={index} className="relative group">
                        <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={file.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute -top-2 -right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeFile(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                        <p className="text-xs text-muted-foreground mt-1 truncate">
                          {file.name}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Caption and Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-accent" />
                Add Memory Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="caption">Caption (optional)</Label>
                <Textarea
                  id="caption"
                  placeholder="Tell us about this memory... When was it taken? What made it special?"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  rows={3}
                  className="mt-1"
                  maxLength={280}
                />
                <div className="text-right text-xs text-muted-foreground mt-1">
                  {caption.length}/280 characters
                </div>
              </div>

              {/* Memory Date */}
              <div>
                <Label>Memory Date (optional)</Label>
                <p className="text-sm text-muted-foreground mb-2">When did this memory happen?</p>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {memoryDate ? format(memoryDate, "PPP") : "Select a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={memoryDate}
                      onSelect={setMemoryDate}
                      initialFocus
                      disabled={(date) => date > new Date()}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Voice Note */}
              <div>
                <Label>Voice Note (optional)</Label>
                <p className="text-sm text-muted-foreground mb-3">Record a personal message about this memory (max 30 seconds)</p>
                
                {!audioBlob ? (
                  <div className="space-y-3">
                    <Button
                      variant="outline" 
                      onClick={isRecording ? stopRecording : startRecording}
                      className="w-full"
                      disabled={isUploading}
                    >
                      {isRecording ? (
                        <>
                          <MicOff className="mr-2 h-4 w-4 text-destructive animate-pulse" />
                          Stop Recording ({30 - recordingTime}s)
                        </>
                      ) : (
                        <>
                          <Mic className="mr-2 h-4 w-4" />
                          Start Voice Recording
                        </>
                      )}
                    </Button>
                    {isRecording && (
                      <div className="text-center">
                        <div className="text-sm text-muted-foreground">
                          Recording: {recordingTime}s / 30s
                        </div>
                        <div className="w-full bg-secondary rounded-full h-2 mt-2">
                          <div 
                            className="bg-primary h-2 rounded-full transition-all duration-1000"
                            style={{ width: `${(recordingTime / 30) * 100}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 p-3 bg-secondary/50 rounded-lg">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={isPlaying ? pauseAudio : playAudio}
                      >
                        {isPlaying ? (
                          <Pause className="h-4 w-4" />
                        ) : (
                          <Play className="h-4 w-4" />
                        )}
                      </Button>
                      <span className="text-sm flex-1">Voice note recorded ({recordingTime}s)</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={deleteVoiceNote}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <Label>Tags</Label>
                <div className="mt-2 space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {suggestedTags.map((tag) => (
                      <Badge
                        key={tag}
                        variant={selectedTags.includes(tag) ? "default" : "outline"}
                        className="cursor-pointer hover:bg-primary/10"
                        onClick={() => selectedTags.includes(tag) ? removeTag(tag) : addTag(tag)}
                      >
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add custom tag..."
                      value={customTag}
                      onChange={(e) => setCustomTag(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleCustomTag()}
                      className="flex-1"
                    />
                    <Button variant="outline" onClick={handleCustomTag}>
                      Add
                    </Button>
                  </div>

                  {selectedTags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {selectedTags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="gap-1">
                          #{tag}
                          <X 
                            className="h-3 w-3 cursor-pointer" 
                            onClick={() => removeTag(tag)}
                          />
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upload Summary */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Upload Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Photos:</span>
                <span className="font-semibold">{selectedFiles.length}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Tags:</span>
                <span className="font-semibold">{selectedTags.length}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Caption:</span>
                <span className="font-semibold">{caption.length > 0 ? "✓" : "—"}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Memory Date:</span>
                <span className="font-semibold">{memoryDate ? "✓" : "—"}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Voice Note:</span>
                <span className="font-semibold">{audioBlob ? "✓" : "—"}</span>
              </div>

              <Button 
                variant="gradient" 
                className="w-full" 
                size="lg"
                onClick={handleUpload}
                disabled={isUploading || selectedFiles.length === 0}
              >
                {isUploading ? (
                  "Uploading..."
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Memories
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex gap-2">
                <Heart className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                <p>Add meaningful captions to help care staff understand the context</p>
              </div>
              <div className="flex gap-2">
                <CalendarIcon className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <p>Set the memory date to help organise your life story chronologically</p>
              </div>
              <div className="flex gap-2">
                <Mic className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <p>Record a voice note to share the emotions and stories behind the photo</p>
              </div>
              <div className="flex gap-2">
                <MapPin className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <p>Use tags to categorize memories for easy finding during activities</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};