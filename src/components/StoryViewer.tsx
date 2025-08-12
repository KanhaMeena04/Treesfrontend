import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, ChevronLeft, ChevronRight, Clock, Eye, Heart } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface StoryViewerProps {
  isOpen: boolean;
  onClose: () => void;
  stories: StoryData[];
  currentStoryIndex: number;
  onStoryChange: (index: number) => void;
}

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

export const StoryViewer: React.FC<StoryViewerProps> = ({
  isOpen,
  onClose,
  stories,
  currentStoryIndex,
  onStoryChange
}) => {
  const [currentStory, setCurrentStory] = useState<StoryData | null>(null);
  const [progress, setProgress] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState<string>('');
  const [isPaused, setIsPaused] = useState(false);
  const [hasLiked, setHasLiked] = useState(false);
  
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const storyDuration = 5000; // 5 seconds per story

  useEffect(() => {
    if (isOpen && stories.length > 0) {
      setCurrentStory(stories[currentStoryIndex]);
      setProgress(0);
      setIsPaused(false);
      setHasLiked(false);
      startProgress();
    }
  }, [isOpen, currentStoryIndex, stories]);

  useEffect(() => {
    if (currentStory) {
      updateTimeRemaining();
      const timeInterval = setInterval(updateTimeRemaining, 1000);
      return () => clearInterval(timeInterval);
    }
  }, [currentStory]);

  const startProgress = () => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }

    progressIntervalRef.current = setInterval(() => {
      if (!isPaused) {
        setProgress(prev => {
          if (prev >= 100) {
            nextStory();
            return 0;
          }
          return prev + (100 / (storyDuration / 100));
        });
      }
    }, 100);
  };

  const updateTimeRemaining = () => {
    if (!currentStory) return;

    const now = new Date();
    const expiresAt = new Date(currentStory.expiresAt);
    const timeLeft = expiresAt.getTime() - now.getTime();

    if (timeLeft <= 0) {
      setTimeRemaining('Expired');
      return;
    }

    const hours = Math.floor(timeLeft / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      setTimeRemaining(`${hours}h ${minutes}m left`);
    } else {
      setTimeRemaining(`${minutes}m left`);
    }
  };

  const nextStory = () => {
    if (currentStoryIndex < stories.length - 1) {
      onStoryChange(currentStoryIndex + 1);
    } else {
      onClose();
    }
  };

  const previousStory = () => {
    if (currentStoryIndex > 0) {
      onStoryChange(currentStoryIndex - 1);
    }
  };

  const handleLike = () => {
    setHasLiked(!hasLiked);
    toast({
      title: hasLiked ? 'Story unliked' : 'Story liked!',
      description: hasLiked ? 'You unliked this story' : 'You liked this story',
    });
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
    if (isPaused) {
      startProgress();
    }
  };

  const handleClose = () => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }
    onClose();
  };

  if (!currentStory) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md p-0 bg-black border-0">
        <div className="relative">
          {/* Progress Bar */}
          <div className="absolute top-0 left-0 right-0 z-10 p-4">
            <div className="flex gap-1">
              {stories.map((_, index) => (
                <div
                  key={index}
                  className={`h-1 flex-1 rounded-full transition-all duration-100 ${
                    index === currentStoryIndex
                      ? index < currentStoryIndex
                        ? 'bg-white'
                        : 'bg-white/50'
                      : 'bg-white/30'
                  }`}
                >
                  {index === currentStoryIndex && (
                    <div
                      className="h-full bg-white rounded-full transition-all duration-100"
                      style={{ width: `${progress}%` }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Header */}
          <div className="absolute top-16 left-0 right-0 z-10 p-4">
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">
                    {currentStory.id.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <div className="font-medium">Your Story</div>
                  <div className="text-xs text-white/70 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {timeRemaining}
                  </div>
                </div>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClose}
                className="text-white hover:bg-white/20"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Story Image */}
          <div className="relative w-full h-[600px]">
            <img
              src={currentStory.image}
              alt="Story"
              className="w-full h-full object-cover"
              onClick={handlePause}
            />
            
            {/* Text Overlays */}
            {currentStory.textOverlays.map((overlay) => (
              <div
                key={overlay.id}
                className="absolute select-none"
                style={{
                  left: overlay.x,
                  top: overlay.y,
                  fontSize: overlay.fontSize,
                  color: overlay.color,
                  fontFamily: overlay.fontFamily,
                  textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
                }}
              >
                {overlay.text}
              </div>
            ))}
            
            {/* Stickers */}
            {currentStory.stickers.map((sticker) => (
              <div
                key={sticker.id}
                className="absolute select-none"
                style={{
                  left: sticker.x,
                  top: sticker.y,
                  fontSize: sticker.size
                }}
              >
                {sticker.emoji}
              </div>
            ))}

            {/* Navigation Arrows */}
            {stories.length > 1 && (
              <>
                {currentStoryIndex > 0 && (
                  <button
                    onClick={previousStory}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/30 hover:bg-black/50 text-white rounded-full flex items-center justify-center transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                )}
                
                {currentStoryIndex < stories.length - 1 && (
                  <button
                    onClick={nextStory}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/30 hover:bg-black/50 text-white rounded-full flex items-center justify-center transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                )}
              </>
            )}
          </div>

          {/* Bottom Actions */}
          <div className="absolute bottom-0 left-0 right-0 z-10 p-4">
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center gap-4">
                <button
                  onClick={handleLike}
                  className={`flex items-center gap-2 px-3 py-2 rounded-full transition-colors ${
                    hasLiked 
                      ? 'bg-red-500 hover:bg-red-600' 
                      : 'bg-black/30 hover:bg-black/50'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${hasLiked ? 'fill-current' : ''}`} />
                  <span className="text-sm">
                    {hasLiked ? 'Liked' : 'Like'}
                  </span>
                </button>
                
                <div className="flex items-center gap-2 px-3 py-2 bg-black/30 rounded-full">
                  <Eye className="w-4 h-4" />
                  <span className="text-sm">
                    {currentStory.views || 0} views
                  </span>
                </div>
              </div>
              
              <div className="text-xs text-white/70">
                {stories.length > 1 && `${currentStoryIndex + 1} of ${stories.length}`}
              </div>
            </div>
          </div>

          {/* Pause Indicator */}
          {isPaused && (
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
              <div className="bg-black/70 text-white px-4 py-2 rounded-lg">
                <div className="text-center">
                  <div className="text-lg font-medium">Story Paused</div>
                  <div className="text-sm text-white/70">Tap to resume</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
