import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Clock, Eye } from 'lucide-react';
import { StoryUpload } from './StoryUpload';
import { StoryViewer } from './StoryViewer';
import { toast } from '@/hooks/use-toast';

interface StoryData {
  id: string;
  image: string;
  textOverlays: TextOverlay[];
  stickers: Sticker[];
  createdAt: Date;
  expiresAt: Date;
  views?: number;
  likes?: number;
}

interface TextOverlay {
  id: string;
  text: string;
  x: number;
  y: number;
  fontSize: number;
  color: string;
  fontFamily: string;
}

interface Sticker {
  id: string;
  emoji: string;
  x: number;
  y: number;
  size: number;
}

// Mock stories data
const mockStories: StoryData[] = [
  {
    id: '1',
    image: '/placeholder.svg',
    textOverlays: [
      {
        id: '1',
        text: 'Beautiful day! 🌞',
        x: 50,
        y: 100,
        fontSize: 24,
        color: '#FFFFFF',
        fontFamily: 'Inter'
      }
    ],
    stickers: [
      {
        id: '1',
        emoji: '😍',
        x: 200,
        y: 150,
        size: 40
      }
    ],
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    expiresAt: new Date(Date.now() + 22 * 60 * 60 * 1000), // 22 hours left
    views: 45,
    likes: 12
  },
  {
    id: '2',
    image: '/placeholder.svg',
    textOverlays: [
      {
        id: '2',
        text: 'Coffee time ☕',
        x: 80,
        y: 120,
        fontSize: 28,
        color: '#FFD700',
        fontFamily: 'Inter'
      }
    ],
    stickers: [
      {
        id: '2',
        emoji: '☕',
        x: 180,
        y: 200,
        size: 50
      }
    ],
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
    expiresAt: new Date(Date.now() + 23 * 60 * 60 * 1000), // 23 hours left
    views: 32,
    likes: 8
  }
];

export const StoryBar = () => {
  const [stories, setStories] = useState<StoryData[]>(mockStories);
  const [showStoryUpload, setShowStoryUpload] = useState(false);
  const [showStoryViewer, setShowStoryViewer] = useState(false);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [expiredStories, setExpiredStories] = useState<string[]>([]);

  // Check for expired stories every minute
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const expired = stories
        .filter(story => new Date(story.expiresAt) <= now)
        .map(story => story.id);
      
      if (expired.length > 0) {
        setExpiredStories(prev => [...prev, ...expired]);
        setStories(prev => prev.filter(story => !expired.includes(story.id)));
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [stories]);

  const handleStorySave = (storyData: StoryData) => {
    setStories(prev => [storyData, ...prev]);
    toast({
      title: 'Story Created!',
      description: 'Your story will be visible for 24 hours',
    });
  };

  const handleStoryClick = (index: number) => {
    setCurrentStoryIndex(index);
    setShowStoryViewer(true);
  };

  const handleStoryChange = (index: number) => {
    setCurrentStoryIndex(index);
  };

  const getTimeRemaining = (expiresAt: Date): string => {
    const now = new Date();
    const timeLeft = expiresAt.getTime() - now.getTime();
    
    if (timeLeft <= 0) return 'Expired';
    
    const hours = Math.floor(timeLeft / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  };

  const getProgressPercentage = (expiresAt: Date): number => {
    const now = new Date();
    const createdAt = new Date(expiresAt.getTime() - 24 * 60 * 60 * 1000);
    const totalDuration = expiresAt.getTime() - createdAt.getTime();
    const elapsed = now.getTime() - createdAt.getTime();
    
    return Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
  };

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center gap-4 overflow-x-auto">
        {/* Create Story Button */}
        <div className="flex flex-col items-center gap-2 min-w-[80px]">
          <button
            onClick={() => setShowStoryUpload(true)}
            className="w-16 h-16 rounded-full border-2 border-dashed border-gray-300 hover:border-primary hover:bg-primary/5 transition-colors flex items-center justify-center"
          >
            <Plus className="w-6 h-6 text-gray-400" />
          </button>
          <span className="text-xs text-gray-600 text-center">Create Story</span>
        </div>

        {/* Existing Stories */}
        {stories.map((story, index) => {
          const timeRemaining = getTimeRemaining(story.expiresAt);
          const progress = getProgressPercentage(story.expiresAt);
          const isExpired = timeRemaining === 'Expired';

          return (
            <div key={story.id} className="flex flex-col items-center gap-2 min-w-[80px]">
              <div className="relative">
                {/* Story Circle with Progress */}
                <div className="w-16 h-16 rounded-full p-1 bg-gradient-to-r from-purple-500 to-pink-500">
                  <div className="w-full h-full rounded-full bg-white p-1">
                    <div className="w-full h-full rounded-full overflow-hidden relative">
                      <img
                        src={story.image}
                        alt="Story"
                        className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={() => handleStoryClick(index)}
                      />
                      
                      {/* Progress Ring */}
                      <div className="absolute inset-0 rounded-full">
                        <svg className="w-full h-full transform -rotate-90">
                          <circle
                            cx="50%"
                            cy="50%"
                            r="30"
                            stroke="currentColor"
                            strokeWidth="2"
                            fill="transparent"
                            className="text-primary/30"
                          />
                          <circle
                            cx="50%"
                            cy="50%"
                            r="30"
                            stroke="currentColor"
                            strokeWidth="2"
                            fill="transparent"
                            className="text-primary"
                            strokeDasharray={`${2 * Math.PI * 30}`}
                            strokeDashoffset={`${2 * Math.PI * 30 * (1 - progress / 100)}`}
                            strokeLinecap="round"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Time Remaining Badge */}
                <div className="absolute -bottom-1 -right-1 bg-black/80 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {timeRemaining}
                </div>

                {/* Views Badge */}
                <div className="absolute -top-1 -right-1 bg-black/80 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  {story.views || 0}
                </div>
              </div>
              
              <span className="text-xs text-gray-600 text-center">
                {story.textOverlays[0]?.text.slice(0, 10)}...
              </span>
            </div>
          );
        })}

        {/* Expired Stories Info */}
        {expiredStories.length > 0 && (
          <div className="flex flex-col items-center gap-2 min-w-[80px]">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
              <Clock className="w-6 h-6 text-gray-400" />
            </div>
            <span className="text-xs text-gray-500 text-center">
              {expiredStories.length} expired
            </span>
          </div>
        )}
      </div>

      {/* Story Upload Modal */}
      <StoryUpload
        isOpen={showStoryUpload}
        onClose={() => setShowStoryUpload(false)}
        onSave={handleStorySave}
      />

      {/* Story Viewer Modal */}
      <StoryViewer
        isOpen={showStoryViewer}
        onClose={() => setShowStoryViewer(false)}
        stories={stories}
        currentStoryIndex={currentStoryIndex}
        onStoryChange={handleStoryChange}
      />
    </div>
  );
};