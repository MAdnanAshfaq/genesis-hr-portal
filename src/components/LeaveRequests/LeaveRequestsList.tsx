
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { LeaveRequestForm } from './LeaveRequestForm';
import { mockLeaveRequests } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';
import { Plus, Calendar, Clock, MessageSquare, Send } from 'lucide-react';

export function LeaveRequestsList() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [requests, setRequests] = useState(mockLeaveRequests);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  if (!user) return null;

  const handleSubmitRequest = (data: any) => {
    const newRequest = {
      id: String(requests.length + 1),
      userId: user.id,
      userName: `${user.firstName} ${user.lastName}`,
      ...data,
    };
    
    setRequests(prev => [newRequest, ...prev]);
    setShowForm(false);
  };

  const handleApproveRequest = (requestId: string) => {
    setRequests(prev => prev.map(req => 
      req.id === requestId 
        ? { ...req, status: 'approved' as const, approvedBy: `${user.firstName} ${user.lastName}`, approvedDate: new Date().toISOString().split('T')[0] }
        : req
    ));
    toast({
      title: "Request Approved",
      description: "Leave request has been approved successfully.",
    });
  };

  const handleRejectRequest = (requestId: string) => {
    setRequests(prev => prev.map(req => 
      req.id === requestId 
        ? { ...req, status: 'rejected' as const, approvedBy: `${user.firstName} ${user.lastName}`, approvedDate: new Date().toISOString().split('T')[0] }
        : req
    ));
    toast({
      title: "Request Rejected",
      description: "Leave request has been rejected.",
    });
  };

  const handleSendReply = (requestId: string) => {
    if (!replyText.trim()) return;
    
    setRequests(prev => prev.map(req => 
      req.id === requestId 
        ? { 
            ...req, 
            replies: [
              ...(req.replies || []),
              {
                id: String(Date.now()),
                message: replyText,
                from: `${user.firstName} ${user.lastName}`,
                timestamp: new Date().toISOString(),
              }
            ]
          }
        : req
    ));
    
    setReplyText('');
    setReplyingTo(null);
    toast({
      title: "Reply Sent",
      description: "Your reply has been sent to the employee.",
    });
  };

  // Filter requests based on user role
  let userRequests = requests;
  
  if (user.role === 'employee') {
    userRequests = requests.filter(req => req.userId === user.id);
  } else if (user.role === 'manager') {
    // Manager sees requests from their department only
    userRequests = requests.filter(req => {
      // You would need to get the requester's department from their user data
      // For now, showing all requests for managers
      return req.status === 'pending' || req.approvedBy === `${user.firstName} ${user.lastName}`;
    });
  }
  // HR and Admin see all requests

  const canApprove = user.role === 'manager' || user.role === 'hr' || user.role === 'admin';
  const canReply = user.role === 'manager' || user.role === 'hr';

  if (showForm) {
    return (
      <div className="p-6">
        <LeaveRequestForm
          onSubmit={handleSubmitRequest}
          onCancel={() => setShowForm(false)}
        />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leave Requests</h1>
          <p className="text-gray-600">
            {user.role === 'employee' 
              ? 'Manage your leave requests' 
              : user.role === 'manager' 
              ? 'Review and manage team leave requests'
              : 'Review and approve leave requests'
            }
          </p>
        </div>
        {user.role === 'employee' && (
          <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Request
          </Button>
        )}
      </div>

      <div className="grid gap-4">
        {userRequests.map((request) => (
          <Card key={request.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-primary" />
                  <div>
                    <CardTitle className="text-lg">{request.userName}</CardTitle>
                    <CardDescription className="capitalize">
                      {request.type} • {request.days} day{request.days > 1 ? 's' : ''}
                    </CardDescription>
                  </div>
                </div>
                <Badge variant={
                  request.status === 'pending' ? 'secondary' :
                  request.status === 'approved' ? 'default' :
                  'destructive'
                }>
                  {request.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Start Date:</span>
                    <p>{request.startDate}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">End Date:</span>
                    <p>{request.endDate}</p>
                  </div>
                </div>
                
                <div>
                  <span className="font-medium text-gray-700">Reason:</span>
                  <p className="text-gray-600 mt-1">{request.reason}</p>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock className="h-4 w-4" />
                  Submitted on {request.submittedDate}
                  {request.approvedBy && (
                    <span>• {request.status} by {request.approvedBy}</span>
                  )}
                </div>

                {/* Replies Section */}
                {request.replies && request.replies.length > 0 && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-sm text-gray-700 mb-2">Manager Comments:</h4>
                    {request.replies.map((reply) => (
                      <div key={reply.id} className="text-sm">
                        <p className="text-gray-600">{reply.message}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {reply.from} • {new Date(reply.timestamp).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2 pt-3 border-t">
                  {canApprove && request.status === 'pending' && (
                    <>
                      <Button 
                        size="sm" 
                        onClick={() => handleApproveRequest(request.id)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Approve
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => handleRejectRequest(request.id)}
                      >
                        Reject
                      </Button>
                    </>
                  )}
                  
                  {canReply && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => setReplyingTo(replyingTo === request.id ? null : request.id)}
                      className="flex items-center gap-1"
                    >
                      <MessageSquare className="h-3 w-3" />
                      Reply
                    </Button>
                  )}
                </div>

                {/* Reply Form */}
                {replyingTo === request.id && (
                  <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                    <Textarea
                      placeholder="Write a reply to the employee..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      className="mb-2"
                    />
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        onClick={() => handleSendReply(request.id)}
                        disabled={!replyText.trim()}
                        className="flex items-center gap-1"
                      >
                        <Send className="h-3 w-3" />
                        Send
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => {
                          setReplyingTo(null);
                          setReplyText('');
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {userRequests.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No leave requests</h3>
              <p className="text-gray-600">
                {user.role === 'employee' 
                  ? "You haven't submitted any leave requests yet."
                  : "No leave requests to review at the moment."
                }
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
