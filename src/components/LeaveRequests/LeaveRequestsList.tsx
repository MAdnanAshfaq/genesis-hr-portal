
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LeaveRequestForm } from './LeaveRequestForm';
import { mockLeaveRequests } from '@/data/mockData';
import { Plus, Calendar, Clock } from 'lucide-react';

export function LeaveRequestsList() {
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [requests, setRequests] = useState(mockLeaveRequests);

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
  };

  const handleRejectRequest = (requestId: string) => {
    setRequests(prev => prev.map(req => 
      req.id === requestId 
        ? { ...req, status: 'rejected' as const, approvedBy: `${user.firstName} ${user.lastName}`, approvedDate: new Date().toISOString().split('T')[0] }
        : req
    ));
  };

  const userRequests = user.role === 'employee' 
    ? requests.filter(req => req.userId === user.id)
    : requests;

  const canApprove = user.role === 'manager' || user.role === 'hr' || user.role === 'admin';

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
            {user.role === 'employee' ? 'Manage your leave requests' : 'Review and approve leave requests'}
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

                {canApprove && request.status === 'pending' && (
                  <div className="flex gap-2 pt-3 border-t">
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
