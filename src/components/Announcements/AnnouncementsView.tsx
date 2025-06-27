
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { mockAnnouncements } from '@/data/mockData';
import { Plus, Megaphone, Calendar, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Logo } from '@/components/ui/logo';

export function AnnouncementsView() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [announcements, setAnnouncements] = useState(mockAnnouncements);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    content: '',
    priority: 'medium',
    department: ''
  });

  const canCreateAnnouncement = user?.role === 'hr' || user?.role === 'admin';

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const handleCreateAnnouncement = () => {
    if (!newAnnouncement.title || !newAnnouncement.content) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const announcement = {
      id: Date.now().toString(),
      title: newAnnouncement.title,
      content: newAnnouncement.content,
      priority: newAnnouncement.priority as 'high' | 'medium' | 'low',
      department: newAnnouncement.department || undefined,
      author: `${user?.firstName} ${user?.lastName}`,
      createdDate: new Date().toLocaleDateString()
    };

    setAnnouncements([announcement, ...announcements]);
    setNewAnnouncement({ title: '', content: '', priority: 'medium', department: '' });
    setShowCreateForm(false);
    
    toast({
      title: "Announcement Created",
      description: "Your announcement has been published successfully.",
    });
  };

  if (showCreateForm) {
    return (
      <div className="dashboard-bg">
        <div className="floating-particles">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="particle floating-particle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 p-6 max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <Button variant="outline" size="sm" onClick={() => setShowCreateForm(false)} className="glass-card">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-3">
              <Logo size="md" />
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
                  New Announcement
                </h1>
                <p className="text-gray-400">Share important updates with your team</p>
              </div>
            </div>
          </div>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Megaphone className="h-5 w-5" />
                Create Announcement
              </CardTitle>
              <CardDescription className="text-gray-400">
                Fill in the details for your new announcement
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title" className="text-gray-300">Title *</Label>
                <Input
                  id="title"
                  value={newAnnouncement.title}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                  placeholder="Enter announcement title"
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                />
              </div>

              <div>
                <Label htmlFor="content" className="text-gray-300">Content *</Label>
                <Textarea
                  id="content"
                  value={newAnnouncement.content}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
                  placeholder="Enter announcement content"
                  rows={6}
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="priority" className="text-gray-300">Priority</Label>
                  <Select value={newAnnouncement.priority} onValueChange={(value) => setNewAnnouncement({ ...newAnnouncement, priority: value })}>
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-white/10">
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="department" className="text-gray-300">Department (Optional)</Label>
                  <Select value={newAnnouncement.department} onValueChange={(value) => setNewAnnouncement({ ...newAnnouncement, department: value })}>
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                      <SelectValue placeholder="All departments" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-white/10">
                      <SelectItem value="">All Departments</SelectItem>
                      <SelectItem value="sales">Sales</SelectItem>
                      <SelectItem value="production">Production</SelectItem>
                      <SelectItem value="hr">HR</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={handleCreateAnnouncement} className="flex-1 ripple-effect">
                  Create Announcement
                </Button>
                <Button variant="outline" onClick={() => setShowCreateForm(false)} className="glass-card">
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-bg">
      <div className="floating-particles">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="particle floating-particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 p-6 space-y-6">
        <div className="flex items-center justify-between glass-card p-6">
          <div className="flex items-center gap-4">
            <Logo size="lg" />
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
                Company Announcements
              </h1>
              <p className="text-gray-400">Share important updates with your team</p>
            </div>
          </div>
          {canCreateAnnouncement && (
            <Button onClick={() => setShowCreateForm(true)} className="flex items-center gap-2 ripple-effect">
              <Plus className="h-4 w-4" />
              New Announcement
            </Button>
          )}
        </div>

        <div className="grid gap-6">
          {announcements.map((announcement, index) => (
            <Card key={announcement.id} className="glass-card calm-card" style={{ animationDelay: `${index * 100}ms` }}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/20 rounded-lg backdrop-blur-sm">
                      <Megaphone className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-xl text-white number-counter">{announcement.title}</CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-1 text-gray-400">
                        <Calendar className="h-4 w-4" />
                        {announcement.createdDate} • By {announcement.author}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge className={`${getPriorityColor(announcement.priority)} backdrop-blur-sm`}>
                    {announcement.priority} priority
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 leading-relaxed">{announcement.content}</p>
                {announcement.department && (
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <span className="text-sm text-gray-400">
                      Department: <span className="font-medium text-gray-300">{announcement.department}</span>
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {announcements.length === 0 && (
          <Card className="glass-card">
            <CardContent className="text-center py-12">
              <Megaphone className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No announcements</h3>
              <p className="text-gray-400 mb-4">
                {canCreateAnnouncement 
                  ? "Create your first announcement to share important updates with your team."
                  : "No announcements have been posted yet."
                }
              </p>
              {canCreateAnnouncement && (
                <Button onClick={() => setShowCreateForm(true)} className="ripple-effect">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Announcement
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
