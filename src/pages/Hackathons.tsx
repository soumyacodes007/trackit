import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import HackathonList from '../components/HackathonList';
import HackathonFilter from '../components/HackathonFilter';
import { HackathonPlatform } from '../utils/types';

const Hackathons = () => {
  // State to track selected platforms
  const [selectedPlatforms, setSelectedPlatforms] = useState<HackathonPlatform[]>(['devfolio', 'devpost']);

  // Toggle a platform's selection
  const togglePlatform = (platform: HackathonPlatform) => {
    setSelectedPlatforms(prev => {
      if (prev.includes(platform)) {
        // Remove platform if already selected
        return prev.filter(p => p !== platform);
      } else {
        // Add platform if not selected
        return [...prev, platform];
      }
    });
  };

  // Reset all filters
  const resetFilters = () => {
    setSelectedPlatforms(['devfolio', 'devpost']);
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Upcoming Hackathons</h1>
        <p className="text-muted-foreground mb-8">
          Find and participate in the latest hackathons from Devfolio and Devpost.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Filter sidebar */}
          <div className="md:col-span-1">
            <HackathonFilter 
              selectedPlatforms={selectedPlatforms}
              togglePlatform={togglePlatform}
              resetFilters={resetFilters}
            />
          </div>
          
          {/* Hackathon list */}
          <div className="md:col-span-3">
            <HackathonList selectedPlatforms={selectedPlatforms} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Hackathons; 