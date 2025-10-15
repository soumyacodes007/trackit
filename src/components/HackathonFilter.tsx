import React from 'react';
import { HackathonPlatform } from '../utils/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface HackathonFilterProps {
  selectedPlatforms: HackathonPlatform[];
  togglePlatform: (platform: HackathonPlatform) => void;
  resetFilters: () => void;
}

const HackathonFilter: React.FC<HackathonFilterProps> = ({ 
  selectedPlatforms, 
  togglePlatform,
  resetFilters
}) => {
  const allPlatforms: HackathonPlatform[] = ['devfolio', 'devpost'];
  
  return (
    <div className="bg-card p-4 rounded-lg border shadow-sm">
      <h3 className="font-medium mb-4">Filter Hackathons</h3>
      
      <div className="mb-4">
        <p className="text-sm text-muted-foreground mb-2">Platforms</p>
        <div className="flex flex-wrap gap-2">
          {allPlatforms.map(platform => (
            <Badge
              key={platform}
              variant={selectedPlatforms.includes(platform) ? "default" : "outline"}
              className="cursor-pointer capitalize"
              onClick={() => togglePlatform(platform)}
            >
              {platform}
            </Badge>
          ))}
        </div>
      </div>
      
      <Button 
        variant="outline" 
        size="sm" 
        onClick={resetFilters}
        disabled={selectedPlatforms.length === allPlatforms.length}
        className="w-full mt-2"
      >
        Reset Filters
      </Button>
    </div>
  );
};

export default HackathonFilter; 