// /pages/NewHackathons.tsx
import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import NewHackathonList from '@/components/NewHackathonList';
import { useHackathons } from '@/hooks/useHackathons';

const NewHackathons = () => {
  const { hackathons, loading, error, refetch } = useHackathons();
  const [selectedSources, setSelectedSources] = useState<Array<"devpost" | "unstop" | "devfolio">>(['devpost', 'unstop', 'devfolio']);

  // Toggle a source's selection
  const toggleSource = (source: "devpost" | "unstop" | "devfolio") => {
    setSelectedSources(prev => {
      if (prev.includes(source)) {
        // Remove source if already selected
        return prev.filter(s => s !== source);
      } else {
        // Add source if not selected
        return [...prev, source];
      }
    });
  };

  // Reset all filters
  const resetFilters = () => {
    setSelectedSources(['devpost', 'unstop', 'devfolio']);
  };

  // Filter hackathons based on selected sources
  const filteredHackathons = hackathons.filter(hackathon => 
    selectedSources.length === 0 || selectedSources.includes(hackathon.source as "devpost" | "unstop" | "devfolio")
  );

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Hackathons</h1>
            <p className="text-muted-foreground mt-2">
              Discover upcoming hackathons from Devpost, Unstop, and Devfolio
            </p>
          </div>
          <button 
            onClick={refetch}
            className="mt-4 md:mt-0 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Refresh
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Filter sidebar */}
          <div className="md:col-span-1">
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Filters</h2>
                <button 
                  onClick={resetFilters}
                  className="text-sm text-primary hover:underline"
                >
                  Reset
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Sources</h3>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedSources.includes('devpost')}
                        onChange={() => toggleSource('devpost')}
                        className="rounded border-border text-primary focus:ring-primary"
                      />
                      <span className="ml-2">Devpost</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedSources.includes('unstop')}
                        onChange={() => toggleSource('unstop')}
                        className="rounded border-border text-primary focus:ring-primary"
                      />
                      <span className="ml-2">Unstop</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedSources.includes('devfolio')}
                        onChange={() => toggleSource('devfolio')}
                        className="rounded border-border text-primary focus:ring-primary"
                      />
                      <span className="ml-2">Devfolio</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Hackathon list */}
          <div className="md:col-span-3">
            <NewHackathonList 
              hackathons={filteredHackathons} 
              loading={loading} 
              error={error} 
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default NewHackathons;