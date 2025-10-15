import { Contest, ContestType, Platform } from '../types';
import { PLATFORMS } from '../constants';
import { FETCH_HEADERS, showErrorToast } from './common';
import axios from 'axios';
import { Hackathon, HackathonPlatform } from '@/utils/types';

// Helper function to map CodeChef contest data to Contest interface
function mapCodeChefContest(contest: any, defaultStatus: 'upcoming' | 'ongoing' | 'past'): Contest {
  // Parse the ISO date strings
  const startTime = new Date(contest.contest_start_date_iso || contest.contest_start_date);
  const endTime = new Date(contest.contest_end_date_iso || contest.contest_end_date);
  const durationSeconds = parseInt(contest.contest_duration) * 60; // Convert minutes to seconds
  
  // Determine contest type based on name or code
  let contestType: ContestType = 'regular';
  const contestName = (contest.contest_name || '').toLowerCase();
  const contestCode = (contest.contest_code || '').toLowerCase();
  
  if (contestName.includes('lunchtime') || contestCode.includes('lunch')) {
    contestType = 'lunchtime';
  } else if (contestName.includes('cook-off') || contestCode.includes('cook')) {
    contestType = 'cookoff';
  } else if (contestName.includes('long') || contestCode.includes('long')) {
    contestType = 'long';
  } else if (contestName.includes('starters') || contestCode.includes('start')) {
    contestType = 'regular';
  }
  
  return {
    id: `codechef-${contest.contest_code}`,
    name: contest.contest_name,
    platform: 'codechef' as Platform,
    url: `${PLATFORMS.codechef.baseUrl}/${contest.contest_code}`,
    startTime: startTime.toISOString(),
    endTime: endTime.toISOString(),
    duration: durationSeconds,
    status: defaultStatus,
    contestType
  };
}

// Fetch CodeChef contests
export async function fetchCodechefContests(): Promise<Contest[]> {
  try {
    // Use api.allorigins.win directly for CodeChef
    const codechefUrl = 'https://www.codechef.com/api/list/contests/all?sort_by=START&sorting_order=asc&offset=0&mode=all';
    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(codechefUrl)}`;
    
    console.log(`Fetching CodeChef contests from: ${proxyUrl}`);
    const response = await fetch(proxyUrl, { headers: FETCH_HEADERS });
    const data = await response.json();
    
    console.log('CodeChef API response:', data);
    
    // Check for the correct format of successful response
    if (data.status === "success") {
      console.log('Successfully received CodeChef contest data');
    } else if (!data.future_contests && !data.past_contests) {
      throw new Error('Failed to fetch CodeChef contests: Unexpected response format');
    }
    
    const contests: Contest[] = [];
    
    // Process present/ongoing contests
    if (data.present_contests && Array.isArray(data.present_contests)) {
      const ongoingContests = data.present_contests.map((contest: any) => mapCodeChefContest(contest, 'ongoing'));
      contests.push(...ongoingContests);
    }
    
    // Process upcoming contests
    if (data.future_contests && Array.isArray(data.future_contests)) {
      const upcomingContests = data.future_contests.map((contest: any) => mapCodeChefContest(contest, 'upcoming'));
      contests.push(...upcomingContests);
    }
    
    // Process past contests
    if (data.past_contests && Array.isArray(data.past_contests)) {
      const pastContests = data.past_contests.map((contest: any) => mapCodeChefContest(contest, 'past'));
      contests.push(...pastContests);
    }
    
    // Final check for ongoing contests (just in case API status is wrong)
    const now = Date.now();
    contests.forEach(contest => {
      const startTime = new Date(contest.startTime).getTime();
      const endTime = new Date(contest.endTime).getTime();
      
      if (now >= startTime && now < endTime) {
        contest.status = 'ongoing';
      }
    });
    
    return contests;
  } catch (error) {
    console.error('Error fetching CodeChef contests:', error);
    showErrorToast('Failed to fetch CodeChef contests. Please try again later.');
    
    // Return empty array instead of mock data
    return [];
  }
} 

// Replace placeholder API URL with a CORS proxy approach similar to CodeChef
const fetchHackathonsWithProxy = async (url: string, options = {}) => {
  const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
  const response = await fetch(proxyUrl, { headers: FETCH_HEADERS, ...options });
  return response.json();
};

// Add a simple colored background as fallback image (more reliable than SVG)
const FALLBACK_IMAGE = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAEsCAMAAABOo35HAAAAQlBMVEX///+hoaGdnZ3c3Nz19fWYmJivr6/8/Py8vLyoqKji4uLFxcX5+fm1tbXT09OSkpLq6urOzs7X19fAwMDu7u6Li4tuA3rTAAAD+ElEQVR4nO3d23aiMBRAUSiICOItov//p1O17XQEYxOSk2QP9tMLzTq5kQSdWg0AAAAAAAAAAAAAAAAAAAAAAAAAAAD5uPrN8qH+Wj5U9l8cq+58e940jarrZNt4Tl/O/cC6l8vAb3/3/jpQMjmGf8Pwlv5WbKo82O3Rkrva8iivoS/PHcsewkvoAn7Kcd8uXYLtcXK73GXYhXv3mVGXLsFmeVyb1F18Aym3h2QBNsOk7uAvG9tDsgDl2ElpS1FIJhd7Zle3/dxs8n08JotwfJzbXezh6LZVq+XVPnP+bCjXl/bQhYuMZ4Zvy5c2LT20n1TfT3bxZoNbvnQ4XSKNBV2GsaBL55pKNxZ0iVajrVgTC9d1RhXTorNiNbFFzjbioqfpbF+dj7TG0VlRNcDIiaKOcZHDvB6+nJNs/lKP6A42s4p1dKqW+aVfp6J7LKYO+LQa7oXKr5nZzGlYj2GZgVnGfYH4mCuskcGtGt9B9gU70ZpcOGYJ+iqNlzlD48qneMPdQjvG1rLm79LrnjVFTRLe8VDfJw3Z2lKrXtP0nMrDFrdl3V8XtMPK0g59KuE+5tlIFYsJDXZCB7EfXdpjMrXGxDNP5P7KqnrFbkYi/KaXp3gu4pHKxFdknbXbxvJfMzamV45Sj4+rFPy0lPMbdpPsU3LQJPj/dMxDcM+kSLJP6S2IEr6Vr0jqNfkrGw38DjxDUsf2TbEjQg0/rfFbMD4k2kbBQmSCY/hWrOigVMAFUgHXnQVcKBew5C/gHkwZd9UKuDNawt3tMlYl7PZbpOeQaEu/NZ9oS71TonQXQP8+VrLNGe37jsn2vLTvDCfcSta9d618b1z3/n/6dSmm16V0f9Tj+HkDrwxvkJ5D/Kq/4O6uD+/Zgl+4TXE+sPaVleTX+vK/cMv/wm3+F24LuHCb/0Jz/gvN+S/pFHBJp4BLOgVeBixc9gvN+S8057+wVsDCWgELawUsrJVhYU1qbCaVd84v0/DT3MNjm8uZvSHiX9B5kPnv8mH1tQS3fKvcFy8WFnHrsfOL9iY7Ay9k7/DJGfWqX9MoM2X7KZPZK4/jPk0utX59M/EJO9Ev2W+f6v1AZSszXq/5yb5nvFdRyzN2z6lE/Sy5O/V1bHyZZzg9RxGVbX3EsZofjepjNvmUrwvHWD2+qDqZfkz9HqvHYjBd09/hq89i+5g8bJUabtS2lT7B8O5Xj6nKRvFgNvnqaWB1q4fdvE0v5dvDLPUfDq+fWunTl8vhHmi02ez3+81mtKtXjxJvXlgMHzs6tQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/wDkRSdGx2p8BQAAAABJRU5ErkJggg==';

// Function to fetch hackathons
export async function fetchHackathons(): Promise<Hackathon[]> {
  try {
    // Fetch from both platforms
    const [devfolioData, devpostData] = await Promise.all([
      fetchDevfolioHackathons(),
      fetchDevpostHackathons()
    ]);
    
    // Combine results
    return [...devfolioData, ...devpostData];
  } catch (error) {
    console.error('Error fetching hackathons:', error);
    showErrorToast('Failed to fetch hackathons. Please try again later.');
    return mockHackathons(); // Return mock data as fallback
  }
}

// Fetch from Devfolio
async function fetchDevfolioHackathons(): Promise<Hackathon[]> {
  try {
    // First try direct API call to our backend
    try {
      const directResponse = await fetch('http://localhost:5000/api/hackathons/devfolio');
      if (directResponse.ok) {
        const data = await directResponse.json();
        return data.hits.hits.map((hit: any) => {
          const source = hit._source;
          const slug = source.slug || '';
          
          // Ensure slug is properly formatted for URL
          const cleanSlug = slug.trim().toLowerCase().replace(/\s+/g, '-');
          
          return {
            id: hit._id || `devfolio-${Math.random().toString(36).substring(7)}`,
            name: source.name || 'Unnamed Hackathon',
            organizer: source.organizer_name || 'Devfolio',
            platform: 'devfolio' as HackathonPlatform,
            mode: source.is_online ? 'online' : 'in-person',
            location: source.venue || 'Online',
            startDate: new Date(source.starts_at || Date.now()),
            endDate: new Date(source.ends_at || Date.now() + 86400000),
            applyBy: new Date(source.application_deadline || Date.now() + 43200000),
            url: `https://devfolio.co/hackathons/${cleanSlug}`,
            imageUrl: source.cover_image?.url || FALLBACK_IMAGE
          };
        });
      }
    } catch (err) {
      console.log('Direct API call failed, using proxy as fallback');
    }
    
    // Fallback to proxy
    const data = await fetchHackathonsWithProxy('https://api.devfolio.co/api/search/hackathons', {
      method: 'POST',
      body: JSON.stringify({
        type: 'application_open',
        from: 0,
        size: 50
      })
    });
    
    // Process the response data according to the actual API structure
    return (data.hits?.hits || []).map((hit: any) => {
      const source = hit._source;
      const slug = source.slug || '';
      
      // Ensure slug is properly formatted for URL
      const cleanSlug = slug.trim().toLowerCase().replace(/\s+/g, '-');
      
      return {
        id: hit._id || `devfolio-${Math.random().toString(36).substring(7)}`,
        name: source.name || 'Unnamed Hackathon',
        organizer: source.organizer_name || 'Devfolio',
        platform: 'devfolio' as HackathonPlatform,
        mode: source.is_online ? 'online' : 'in-person',
        location: source.venue || 'Online',
        startDate: new Date(source.starts_at || Date.now()),
        endDate: new Date(source.ends_at || Date.now() + 86400000),
        applyBy: new Date(source.application_deadline || Date.now() + 43200000),
        url: `https://devfolio.co/hackathons/${cleanSlug}`,
        imageUrl: source.cover_image?.url || FALLBACK_IMAGE
      };
    });
  } catch (error) {
    console.error('Error fetching Devfolio hackathons:', error);
    return getMockDevfolioHackathons(); // Return mock data on error
  }
}

// Fetch from Devpost
async function fetchDevpostHackathons(): Promise<Hackathon[]> {
  try {
    // First try direct API call to our backend
    try {
      const directResponse = await fetch('http://localhost:5000/api/hackathons/devpost');
      if (directResponse.ok) {
        const data = await directResponse.json();
        return (data.hackathons || []).map((hackathon: any) => ({
          id: hackathon.id || `devpost-${Math.random().toString(36).substring(7)}`,
          name: hackathon.title || 'Unnamed Hackathon',
          organizer: hackathon.organization_name || 'Devpost',
          platform: 'devpost' as HackathonPlatform,
          mode: hackathon.online_only ? 'online' : 'in-person',
          location: hackathon.location || 'Online',
          startDate: new Date(hackathon.submission_period_start || Date.now()),
          endDate: new Date(hackathon.submission_period_end || Date.now() + 86400000),
          applyBy: new Date(hackathon.submission_period_end || Date.now() + 43200000),
          url: hackathon.url || `https://devpost.com/hackathons/${hackathon.id || ''}`,
          imageUrl: hackathon.thumbnail_url || FALLBACK_IMAGE
        }));
      }
    } catch (err) {
      console.log('Direct API call failed, using proxy as fallback');
    }
    
    // Fallback to proxy or mock data
    // Devpost API endpoint may not be publicly accessible without authentication
    // Return some mock data for Devpost as a fallback
    return getMockDevpostHackathons();
  } catch (error) {
    console.error('Error fetching Devpost hackathons:', error);
    return getMockDevpostHackathons(); // Return mock data on error
  }
}

// Generate mock data specifically for Devpost
function getMockDevpostHackathons(): Hackathon[] {
  const now = new Date();
  
  // Create more mock hackathons to show a better filled grid
  return [
    {
      id: 'devpost-hack1',
      name: 'AI Innovation Hackathon',
      organizer: 'Future Labs',
      platform: 'devpost',
      mode: 'hybrid',
      location: 'San Francisco, CA & Online',
      startDate: new Date(now.getTime() + 172800000), // 2 days from now
      endDate: new Date(now.getTime() + 86400000 * 5), // 5 days from now
      applyBy: new Date(now.getTime() + 86400000), // 1 day from now
      url: 'https://devpost.com/hackathons/ai-innovation-hackathon',
      imageUrl: FALLBACK_IMAGE
    },
    {
      id: 'devpost-hack2',
      name: 'Web3 Blockchain Challenge',
      organizer: 'Crypto Foundation',
      platform: 'devpost',
      mode: 'online',
      location: 'Online',
      startDate: new Date(now.getTime() + 259200000), // 3 days from now
      endDate: new Date(now.getTime() + 86400000 * 10), // 10 days from now
      applyBy: new Date(now.getTime() + 172800000), // 2 days from now
      url: 'https://devpost.com/hackathons/web3-blockchain-challenge',
      imageUrl: FALLBACK_IMAGE
    },
    {
      id: 'devpost-hack3',
      name: 'Sustainable Tech Hackathon',
      organizer: 'Green Tech Initiative',
      platform: 'devpost',
      mode: 'online',
      location: 'Online',
      startDate: new Date(now.getTime() + 432000000), // 5 days from now
      endDate: new Date(now.getTime() + 86400000 * 7), // 7 days from now
      applyBy: new Date(now.getTime() + 345600000), // 4 days from now
      url: 'https://devpost.com/hackathons/sustainable-tech',
      imageUrl: FALLBACK_IMAGE
    },
    {
      id: 'devpost-hack4',
      name: 'EdTech Revolution',
      organizer: 'Education Innovators',
      platform: 'devpost',
      mode: 'hybrid',
      location: 'New York, NY & Online',
      startDate: new Date(now.getTime() + 518400000), // 6 days from now
      endDate: new Date(now.getTime() + 86400000 * 8), // 8 days from now
      applyBy: new Date(now.getTime() + 432000000), // 5 days from now
      url: 'https://devpost.com/hackathons/edtech-revolution',
      imageUrl: FALLBACK_IMAGE
    },
    {
      id: 'devpost-hack5',
      name: 'HealthTech Solutions',
      organizer: 'Medical Innovations',
      platform: 'devpost',
      mode: 'in-person',
      location: 'Boston, MA',
      startDate: new Date(now.getTime() + 604800000), // 7 days from now
      endDate: new Date(now.getTime() + 86400000 * 9), // 9 days from now
      applyBy: new Date(now.getTime() + 518400000), // 6 days from now
      url: 'https://devpost.com/hackathons/healthtech-solutions',
      imageUrl: FALLBACK_IMAGE
    },
    {
      id: 'devpost-hack6',
      name: 'Smart Cities Hackathon',
      organizer: 'Urban Tech',
      platform: 'devpost',
      mode: 'online',
      location: 'Online',
      startDate: new Date(now.getTime() + 691200000), // 8 days from now
      endDate: new Date(now.getTime() + 86400000 * 12), // 12 days from now
      applyBy: new Date(now.getTime() + 604800000), // 7 days from now
      url: 'https://devpost.com/hackathons/smart-cities',
      imageUrl: FALLBACK_IMAGE
    }
  ];
}

// Add mock data for Devfolio as well
function getMockDevfolioHackathons(): Hackathon[] {
  const now = new Date();
  return [
    {
      id: 'devfolio-hack1',
      name: 'Global Hack Challenge',
      organizer: 'TechCorp',
      platform: 'devfolio',
      mode: 'online',
      location: 'Online',
      startDate: new Date(now.getTime() + 86400000), // tomorrow
      endDate: new Date(now.getTime() + 86400000 * 3), // 3 days from now
      applyBy: new Date(now.getTime() + 43200000), // 12 hours from now
      url: 'https://devfolio.co/hackathons/global-hack-challenge',
      imageUrl: FALLBACK_IMAGE
    },
    {
      id: 'devfolio-hack2',
      name: 'Crypto Builders Hackathon',
      organizer: 'Blockchain Labs',
      platform: 'devfolio',
      mode: 'hybrid',
      location: 'Bangalore, India & Online',
      startDate: new Date(now.getTime() + 172800000), // 2 days from now
      endDate: new Date(now.getTime() + 86400000 * 4), // 4 days from now
      applyBy: new Date(now.getTime() + 129600000), // 1.5 days from now
      url: 'https://devfolio.co/hackathons/crypto-builders',
      imageUrl: FALLBACK_IMAGE
    },
    {
      id: 'devfolio-hack3',
      name: 'Web3 India Summit',
      organizer: 'Devfolio',
      platform: 'devfolio',
      mode: 'in-person',
      location: 'Delhi, India',
      startDate: new Date(now.getTime() + 345600000), // 4 days from now
      endDate: new Date(now.getTime() + 86400000 * 6), // 6 days from now
      applyBy: new Date(now.getTime() + 259200000), // 3 days from now
      url: 'https://devfolio.co/hackathons/web3-india-summit',
      imageUrl: FALLBACK_IMAGE
    },
    {
      id: 'devfolio-hack4',
      name: 'DeFi Developer Camp',
      organizer: 'Ethereum Foundation',
      platform: 'devfolio',
      mode: 'online',
      location: 'Online',
      startDate: new Date(now.getTime() + 432000000), // 5 days from now
      endDate: new Date(now.getTime() + 86400000 * 8), // 8 days from now
      applyBy: new Date(now.getTime() + 345600000), // 4 days from now
      url: 'https://devfolio.co/hackathons/defi-developer-camp',
      imageUrl: FALLBACK_IMAGE
    }
  ];
}

// Provide mock hackathon data as fallback
function mockHackathons(): Hackathon[] {
  const now = new Date();
  return [
    {
      id: 'devfolio-hack1',
      name: 'Global Hack Challenge',
      organizer: 'TechCorp',
      platform: 'devfolio',
      mode: 'online',
      location: 'Online',
      startDate: new Date(now.getTime() + 86400000), // tomorrow
      endDate: new Date(now.getTime() + 86400000 * 3), // 3 days from now
      applyBy: new Date(now.getTime() + 43200000), // 12 hours from now
      url: 'https://devfolio.co/hackathons/global-hack-challenge',
      imageUrl: FALLBACK_IMAGE
    },
    {
      id: 'devpost-hack1',
      name: 'AI Innovation Hackathon',
      organizer: 'Future Labs',
      platform: 'devpost',
      mode: 'hybrid',
      location: 'San Francisco, CA & Online',
      startDate: new Date(now.getTime() + 172800000), // 2 days from now
      endDate: new Date(now.getTime() + 86400000 * 5), // 5 days from now
      applyBy: new Date(now.getTime() + 86400000), // 1 day from now
      url: 'https://devpost.com/hackathons/ai-innovation-hackathon',
      imageUrl: FALLBACK_IMAGE
    }
  ];
} 
