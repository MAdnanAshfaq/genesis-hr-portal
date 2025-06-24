
import { useState, useEffect } from 'react';
import { ApiService } from '@/services/api';
import { Announcement } from '@/types/hr';

export function useAnnouncements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAnnouncements = async () => {
    try {
      setIsLoading(true);
      const data = await ApiService.getAnnouncements();
      setAnnouncements(data);
    } catch (error) {
      console.error('Error fetching announcements:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createAnnouncement = async (announcementData: Omit<Announcement, 'id' | 'createdDate'>) => {
    try {
      const success = await ApiService.createAnnouncement(announcementData);
      if (success) {
        await fetchAnnouncements();
      }
      return success;
    } catch (error) {
      console.error('Error creating announcement:', error);
      return false;
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  return {
    announcements,
    isLoading,
    createAnnouncement,
    refreshAnnouncements: fetchAnnouncements,
  };
}
