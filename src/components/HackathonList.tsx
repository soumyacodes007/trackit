import React, { useEffect, useState } from 'react';
import { fetchHackathons } from '../utils/api/codechef';
import { Hackathon, HackathonPlatform } from '../utils/types';
import { motion } from 'framer-motion';
import { Calendar, ExternalLink, Globe, Users } from 'lucide-react';

// Add a simple colored background as fallback image (more reliable than SVG)
const FALLBACK_IMAGE = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAEsCAMAAABOo35HAAAAQlBMVEX///+hoaGdnZ3c3Nz19fWYmJivr6/8/Py8vLyoqKji4uLFxcX5+fm1tbXT09OSkpLq6urOzs7X19fAwMDu7u6Li4tuA3rTAAAD+ElEQVR4nO3d23aiMBRAUSiICOItov//p1O17XQEYxOSk2QP9tMLzTq5kQSdWg0AAAAAAAAAAAAAAAAAAAAAAAAAAAD5uPrN8qH+Wj5U9l8cq+58e940jarrZNt4Tl/O/cC6l8vAb3/3/jpQMjmGf8Pwlv5WbKo82O3Rkrva8iivoS/PHcsewkvoAn7Kcd8uXYLtcXK73GXYhXv3mVGXLsFmeVyb1F18Aym3h2QBNsOk7uAvG9tDsgDl2ElpS1FIJhd7Zle3/dxs8n08JotwfJzbXezh6LZVq+XVPnP+bCjXl/bQhYuMZ4Zvy5c2LT20n1TfT3bxZoNbvnQ4XSKNBV2GsaBL55pKNxZ0iVajrVgTC9d1RhXTorNiNbFFzjbioqfpbF+dj7TG0VlRNcDIiaKOcZHDvB6+nJNs/lKP6A42s4p1dKqW+aVfp6J7LKYO+LQa7oXKr5nZzGlYj2GZgVnGfYH4mCuskcGtGt9B9gU70ZpcOGYJ+iqNlzlD48qneMPdQjvG1rLm79LrnjVFTRLe8VDfJw3Z2lKrXtP0nMrDFrdl3V8XtMPK0g59KuE+5tlIFYsJDXZCB7EfXdpjMrXGxDNP5P7KqnrFbkYi/KaXp3gu4pHKxFdknbXbxvJfMzamV45Sj4+rFPy0lPMbdpPsU3LQJPj/dMxDcM+kSLJP6S2IEr6Vr0jqNfkrGw38DjxDUsf2TbEjQg0/rfFbMD4k2kbBQmSCY/hWrOigVMAFUgHXnQVcKBew5C/gHkwZd9UKuDNawt3tMlYl7PZbpOeQaEu/NZ9oS71TonQXQP8+VrLNGe37jsn2vLTvDCfcSta9d618b1z3/n/6dSmm16V0f9Tj+HkDrwxvkJ5D/Kq/4O6uD+/Zgl+4TXE+sPaVleTX+vK/cMv/wm3+F24LuHCb/0Jz/gvN+S/pFHBJp4BLOgVeBixc9gvN+S8057+wVsDCWgELawUsrJVhYU1qbCaVd84v0/DT3MNjm8uZvSHiX9B5kPnv8mH1tQS3fKvcFy8WFnHrsfOL9iY7Ay9k7/DJGfWqX9MoM2X7KZPZK4/jPk0utX59M/EJO9Ev2W+f6v1AZSszXq/5yb5nvFdRyzN2z6lE/Sy5O/V1bHyZZzg9RxGVbX3EsZofjepjNvmUrwvHWD2+qDqZfkz9HqvHYjBd09/hq89i+5g8bJUabtS2lT7B8O5Xj6nKRvFgNvnqaWB1q4fdvE0v5dvDLPUfDq+fWunTl8vhHmi02ez3+81mtKtXjxJvXlgMHzs6tQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/wDkRSdGx2p8BQAAAABJRU5ErkJggg==';

interface HackathonListProps {
  selectedPlatforms: HackathonPlatform[];
}

const HackathonList: React.FC<HackathonListProps> = ({ selectedPlatforms }) => {
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadHackathons = async () => {
      try {
        setLoading(true);
        const data = await fetchHackathons();
        console.log('Fetched hackathons:', data); // Debug log
        setHackathons(data);
      } catch (err) {
        console.error('Error loading hackathons:', err);
        setError('Failed to load hackathons');
      } finally {
        setLoading(false);
      }
    };

    loadHackathons();
  }, []);

  // Filter hackathons based on selected platforms
  const filteredHackathons = hackathons.filter(hackathon => 
    selectedPlatforms.length === 0 || selectedPlatforms.includes(hackathon.platform)
  );

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

  if (hackathons.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-lg text-muted-foreground">No hackathons found.</p>
        <p className="mt-2">Check back later for upcoming hackathons.</p>
      </div>
    );
  }

  if (filteredHackathons.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-lg text-muted-foreground">No hackathons match your filter criteria.</p>
        <p className="mt-2">Try adjusting your filters or check back later.</p>
      </div>
    );
  }

  // Get random pastel background for platform badge
  const getPlatformColor = (platform: HackathonPlatform) => {
    return platform === 'devfolio' 
      ? 'bg-gradient-to-r from-blue-500 to-indigo-600' 
      : 'bg-gradient-to-r from-green-500 to-teal-600';
  };

  // Get time until the hackathon starts or ends
  const getTimeStatus = (hackathon: Hackathon) => {
    const now = new Date();
    const startDate = new Date(hackathon.startDate);
    const endDate = new Date(hackathon.endDate);
    
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
  const getStatusColor = (hackathon: Hackathon) => {
    const now = new Date();
    const startDate = new Date(hackathon.startDate);
    const endDate = new Date(hackathon.endDate);
    
    if (now < startDate) {
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
    } else if (now < endDate) {
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
    } else {
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

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
      {filteredHackathons.map((hackathon) => (
        <motion.div
          key={hackathon.id}
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
            <div className={`h-28 ${getPlatformColor(hackathon.platform)} relative`}>
              <div className="absolute inset-0 opacity-20 bg-gradient-to-br from-white via-transparent to-white"></div>
              <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-medium">
                {hackathon.platform}
              </div>
              <div className={`absolute bottom-4 left-4 px-2 py-1 rounded-md ${getStatusColor(hackathon)} text-xs font-medium`}>
                {getTimeStatus(hackathon)}
              </div>
            </div>
            
            <div className="p-5">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-bold line-clamp-2 mb-3 flex-1">{hackathon.name}</h3>
                <ExternalLink className="h-4 w-4 text-muted-foreground ml-2 mt-1" />
              </div>
              
              <div className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-2 opacity-70" />
                  <span className="truncate">{hackathon.organizer}</span>
                </div>
                
                <div className="flex items-center">
                  <Globe className="h-4 w-4 mr-2 opacity-70" />
                  <span className="truncate">{hackathon.mode} • {hackathon.location}</span>
                </div>
                
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 opacity-70" />
                  <span className="truncate">
                    {new Date(hackathon.startDate).toLocaleDateString()} - {new Date(hackathon.endDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-border">
                <div className="text-xs rounded-full inline-block px-3 py-1 bg-primary/10 text-primary">
                  Apply by {new Date(hackathon.applyBy).toLocaleDateString()}
                </div>
              </div>
            </div>
          </a>
        </motion.div>
      ))}
    </motion.div>
  );
};

// Default props to show all platforms by default
HackathonList.defaultProps = {
  selectedPlatforms: ['devfolio', 'devpost']
};

export default HackathonList; 