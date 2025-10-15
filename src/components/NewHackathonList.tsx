// /components/NewHackathonList.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, ExternalLink, Globe, Users, Award, Tag } from 'lucide-react';
import { NormalizedHackathon } from '@/types/hackathon';

interface NewHackathonListProps {
  hackathons: NormalizedHackathon[];
  loading: boolean;
  error: string | null;
}

const NewHackathonList: React.FC<NewHackathonListProps> = ({ hackathons, loading, error }) => {
  // Get random pastel background for platform badge
  const getPlatformColor = (platform: string) => {
    if (platform === 'devpost') {
      return 'bg-gradient-to-r from-purple-500 to-indigo-600';
    } else if (platform === 'unstop') {
      return 'bg-gradient-to-r from-orange-500 to-red-600';
    } else {
      return 'bg-gradient-to-r from-gray-500 to-gray-600';
    }
  };

  // Get time until the hackathon starts or ends
  const getTimeStatus = (hackathon: NormalizedHackathon) => {
    const now = new Date();
    const startDate = new Date(hackathon.startDate);
    const endDate = new Date(hackathon.endDate);
    
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return 'Date not available';
    }
    
    if (now < startDate) {
      const days = Math.ceil((startDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      return `Starts in ${days} day${days !== 1 ? 's' : ''}`;
    } else if (now < endDate) {
      const days = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      return `Ends in ${days} day${days !== 1 ? 's' : ''}`;
    } else {
      return 'Ended';
    }
  };

  // Get status color for the hackathon
  const getStatusColor = (hackathon: NormalizedHackathon) => {
    const now = new Date();
    const startDate = new Date(hackathon.startDate);
    const endDate = new Date(hackathon.endDate);
    
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
    
    if (now < startDate) {
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
    } else if (now < endDate) {
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
    } else {
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        <p className="text-lg font-medium">Error: {error}</p>
        <p className="mt-2">Please try again later or check your connection.</p>
      </div>
    );
  }

  if (!hackathons || hackathons.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-lg text-muted-foreground">No hackathons found.</p>
        <p className="mt-2">Check back later for upcoming hackathons.</p>
      </div>
    );
  }

  // Container animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  // Item animation variants
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {hackathons.map((hackathon, index) => (
        <motion.div
          key={`${hackathon.source}-${index}`}
          variants={itemVariants}
          whileHover={{ 
            y: -5, 
            boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
            transition: { duration: 0.2 }
          }}
          className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 bg-card shadow-sm"
        >
          <a 
            href={hackathon.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="block h-full"
          >
            <div className={`h-28 ${getPlatformColor(hackathon.source)} relative`}>
              <div className="absolute inset-0 opacity-20 bg-gradient-to-br from-white via-transparent to-white"></div>
              <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-medium">
                {hackathon.source}
              </div>
              <div className={`absolute bottom-4 left-4 px-2 py-1 rounded-md ${getStatusColor(hackathon)} text-xs font-medium`}>
                {getTimeStatus(hackathon)}
              </div>
            </div>
            
            <div className="p-5">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-bold line-clamp-2 mb-3 flex-1">{hackathon.title}</h3>
                <ExternalLink className="h-4 w-4 text-muted-foreground ml-2 mt-1" />
              </div>
              
              <div className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-2 opacity-70" />
                  <span className="truncate">{hackathon.organizer}</span>
                </div>
                
                <div className="flex items-center">
                  <Globe className="h-4 w-4 mr-2 opacity-70" />
                  <span className="truncate">{hackathon.location}</span>
                </div>
                
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 opacity-70" />
                  <span className="truncate">
                    {hackathon.startDate ? new Date(hackathon.startDate).toLocaleDateString() : 'N/A'} - 
                    {hackathon.endDate ? new Date(hackathon.endDate).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
                
                {hackathon.prize && (
                  <div className="flex items-center">
                    <Award className="h-4 w-4 mr-2 opacity-70" />
                    <span className="truncate">{hackathon.prize}</span>
                  </div>
                )}
                
                {hackathon.registrationCount > 0 && (
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2 opacity-70" />
                    <span className="truncate">{hackathon.registrationCount} registered</span>
                  </div>
                )}
              </div>
              
              {hackathon.tags && hackathon.tags.length > 0 && (
                <div className="mt-4 pt-4 border-t border-border">
                  <div className="flex flex-wrap gap-2">
                    {hackathon.tags.slice(0, 3).map((tag, tagIndex) => {
                      // Handle both string tags and object tags
                      const tagText = typeof tag === 'string' ? tag : tag.name || tag.title || String(tag);
                      return (
                        <div 
                          key={tagIndex} 
                          className="text-xs rounded-full px-2 py-1 bg-primary/10 text-primary flex items-center"
                        >
                          <Tag className="h-3 w-3 mr-1" />
                          {tagText}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </a>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default NewHackathonList;