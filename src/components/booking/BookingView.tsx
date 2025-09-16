import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format, addDays, isSameDay } from "date-fns";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Check, 
  X, 
  Users,
  AlertCircle,
  BookOpen,
  Star
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface BookingRequest {
  id: number;
  familyName: string;
  residentName: string;
  date: Date;
  time: string;
  notes?: string;
  status: 'pending' | 'approved' | 'declined';
  requestedAt: Date;
}

export const BookingView = () => {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [notes, setNotes] = useState("");
  const [userRole] = useState<'family' | 'staff'>('family'); // In real app, this would come from auth
  const { toast } = useToast();

  // Sample booking data
  const [bookingRequests, setBookingRequests] = useState<BookingRequest[]>([
    {
      id: 1,
      familyName: "Emma Johnson",
      residentName: "Margaret Johnson",
      date: new Date(2024, 11, 15),
      time: "2:00 PM",
      notes: "Would love to show Mum the garden photos from summer",
      status: 'pending',
      requestedAt: new Date(2024, 11, 12)
    },
    {
      id: 2,
      familyName: "Michael Smith", 
      residentName: "Robert Smith",
      date: new Date(2024, 11, 16),
      time: "10:00 AM",
      status: 'approved',
      requestedAt: new Date(2024, 11, 11)
    }
  ]);

  // Available time slots
  const timeSlots = [
    "9:00 AM", "10:00 AM", "11:00 AM", 
    "2:00 PM", "3:00 PM", "4:00 PM"
  ];

  // Blocked dates/times (simulated)
  const blockedSlots = [
    { date: new Date(2024, 11, 14), time: "10:00 AM", reason: "Group Activity" },
    { date: new Date(2024, 11, 15), time: "9:00 AM", reason: "Maintenance" }
  ];

  const handleBookingRequest = () => {
    if (!selectedDate || !selectedTime) {
      toast({
        title: "Missing Information",
        description: "Please select both a date and time slot.",
        variant: "destructive"
      });
      return;
    }

    const newBooking: BookingRequest = {
      id: Date.now(),
      familyName: "Current User", // In real app, from auth
      residentName: "Resident Name", // In real app, from user profile
      date: selectedDate,
      time: selectedTime,
      notes,
      status: 'pending',
      requestedAt: new Date()
    };

    setBookingRequests(prev => [...prev, newBooking]);
    
    toast({
      title: "Booking Request Sent! 📅",
      description: `Your request for ${format(selectedDate, 'PPP')} at ${selectedTime} has been sent to staff for approval.`
    });

    // Reset form
    setSelectedDate(undefined);
    setSelectedTime("");
    setNotes("");
  };

  const handleStaffAction = (id: number, action: 'approved' | 'declined') => {
    setBookingRequests(prev => 
      prev.map(booking => 
        booking.id === id 
          ? { ...booking, status: action }
          : booking
      )
    );

    const booking = bookingRequests.find(b => b.id === id);
    toast({
      title: `Booking ${action}`,
      description: `${booking?.familyName}'s request has been ${action}.`
    });
  };

  const isSlotAvailable = (date: Date, time: string) => {
    // Check if slot is blocked
    const isBlocked = blockedSlots.some(slot => 
      isSameDay(slot.date, date) && slot.time === time
    );
    
    // Check if slot is already booked
    const isBooked = bookingRequests.some(booking => 
      isSameDay(booking.date, date) && 
      booking.time === time && 
      booking.status === 'approved'
    );

    return !isBlocked && !isBooked;
  };

  const getSlotStatus = (date: Date, time: string) => {
    const blocked = blockedSlots.find(slot => 
      isSameDay(slot.date, date) && slot.time === time
    );
    if (blocked) return { status: 'blocked', reason: blocked.reason };

    const booked = bookingRequests.find(booking => 
      isSameDay(booking.date, date) && 
      booking.time === time && 
      booking.status === 'approved'
    );
    if (booked) return { status: 'booked', family: booked.familyName };

    const pending = bookingRequests.find(booking => 
      isSameDay(booking.date, date) && 
      booking.time === time && 
      booking.status === 'pending'
    );
    if (pending) return { status: 'pending', family: pending.familyName };

    return { status: 'available' };
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-primary mb-2">Magic Table 360 Booking</h2>
        <p className="text-muted-foreground">
          Book a private session with the interactive projector for your visit
        </p>
      </div>

      {userRole === 'family' ? (
        // Family Member View
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Booking Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                Request a Session
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Date Selection */}
              <div>
                <Label>Select Date</Label>
                <p className="text-sm text-muted-foreground mb-2">Choose a date for your visit</p>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, "PPP") : "Select a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      disabled={(date) => date < new Date()}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Time Selection */}
              {selectedDate && (
                <div>
                  <Label>Available Time Slots</Label>
                  <p className="text-sm text-muted-foreground mb-3">
                    Select an available time for {format(selectedDate, "PPP")}
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {timeSlots.map((time) => {
                      const slotInfo = getSlotStatus(selectedDate, time);
                      const isAvailable = slotInfo.status === 'available';
                      
                      return (
                        <Button
                          key={time}
                          variant={selectedTime === time ? "default" : "outline"}
                          disabled={!isAvailable}
                          onClick={() => setSelectedTime(time)}
                          className="h-auto p-3 flex-col gap-1"
                        >
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span className="font-medium">{time}</span>
                          </div>
                          <Badge 
                            variant={
                              slotInfo.status === 'available' ? 'default' :
                              slotInfo.status === 'booked' ? 'destructive' :
                              slotInfo.status === 'pending' ? 'secondary' : 'outline'
                            }
                            className="text-xs"
                          >
                            {slotInfo.status === 'available' ? 'Available' :
                             slotInfo.status === 'booked' ? 'Booked' :
                             slotInfo.status === 'pending' ? 'Pending' : 
                             slotInfo.reason}
                          </Badge>
                        </Button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Notes */}
              <div>
                <Label htmlFor="booking-notes">Notes (Optional)</Label>
                <Textarea
                  id="booking-notes"
                  placeholder="Any special requests or memories you'd like to explore together..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="mt-1"
                />
              </div>

              <Button 
                onClick={handleBookingRequest} 
                className="w-full" 
                size="lg"
                disabled={!selectedDate || !selectedTime}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                Request Booking
              </Button>
            </CardContent>
          </Card>

          {/* My Bookings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-accent" />
                My Booking Requests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {bookingRequests.filter(b => b.familyName === "Current User").length === 0 ? (
                  <div className="text-center py-6">
                    <CalendarIcon className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">No booking requests yet</p>
                  </div>
                ) : (
                  bookingRequests
                    .filter(b => b.familyName === "Current User")
                    .map((booking) => (
                      <div key={booking.id} className="border rounded-lg p-3">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-medium">{format(booking.date, "PPP")}</p>
                            <p className="text-sm text-muted-foreground">{booking.time}</p>
                          </div>
                          <Badge
                            variant={
                              booking.status === 'approved' ? 'default' :
                              booking.status === 'declined' ? 'destructive' : 'secondary'
                            }
                          >
                            {booking.status}
                          </Badge>
                        </div>
                        {booking.notes && (
                          <p className="text-sm text-muted-foreground">{booking.notes}</p>
                        )}
                      </div>
                    ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        // Staff Admin View
        <Tabs defaultValue="requests" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="requests">Booking Requests</TabsTrigger>
            <TabsTrigger value="calendar">Manage Calendar</TabsTrigger>
          </TabsList>

          <TabsContent value="requests">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Pending Requests
                  {bookingRequests.filter(b => b.status === 'pending').length > 0 && (
                    <Badge variant="destructive">
                      {bookingRequests.filter(b => b.status === 'pending').length}
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {bookingRequests.filter(b => b.status === 'pending').map((booking) => (
                    <div key={booking.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-semibold">{booking.familyName}</h4>
                          <p className="text-sm text-muted-foreground">for {booking.residentName}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{format(booking.date, "PPP")}</p>
                          <p className="text-sm text-muted-foreground">{booking.time}</p>
                        </div>
                      </div>
                      
                      {booking.notes && (
                        <div className="mb-3 p-2 bg-muted/50 rounded">
                          <p className="text-sm">{booking.notes}</p>
                        </div>
                      )}

                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          onClick={() => handleStaffAction(booking.id, 'approved')}
                          className="flex-1"
                        >
                          <Check className="mr-2 h-3 w-3" />
                          Approve
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleStaffAction(booking.id, 'declined')}
                          className="flex-1"
                        >
                          <X className="mr-2 h-3 w-3" />
                          Decline
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  {bookingRequests.filter(b => b.status === 'pending').length === 0 && (
                    <div className="text-center py-6">
                      <Check className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground">No pending requests</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="calendar">
            <Card>
              <CardHeader>
                <CardTitle>Calendar Management</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Block times for maintenance or group activities
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Calendar would go here for staff to block times */}
                  <div className="text-center py-6">
                    <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">Calendar management interface</p>
                    <p className="text-xs text-muted-foreground">Staff can block dates/times for maintenance</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};