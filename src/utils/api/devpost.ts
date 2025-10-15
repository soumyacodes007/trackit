import { FALLBACK_IMAGE, Hackathon, HackathonPlatform } from '@/types/hackathon';
import { fetchHackathonsWithProxy } from './proxy';

export async function fetchDevpostHackathons(): Promise<Hackathon[]> {
  try {
    // First try direct API call to our backend
    try {
      const directResponse = await fetch('http://localhost:5000/api/hackathons/devpost');
      if (directResponse.ok) {
        const data = await directResponse.json();
        return processDevpostData(data);
      }
    } catch (err) {
      console.log('Direct API call failed for Devpost, using proxy as fallback');
    }
    
    // Fallback to proxy with improved parameters to fetch more hackathons
    const data = await fetchHackathonsWithProxy('https://devpost.com/api/hackathons', {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      },
      params: {
        open_state: 'open',
        sort: 'recently_added',
        page: 1,
        per_page: 20 // Increased from default to fetch more hackathons
      }
    });
    
    return processDevpostData(data);
  } catch (error) {
    console.error('Error fetching Devpost hackathons:', error);
    return getMockDevpostHackathons(); // Return mock data on error
  }
}

// Helper function to process Devpost API data
function processDevpostData(data: any): Hackathon[] {
  if (!data || !Array.isArray(data.hackathons)) {
    return getMockDevpostHackathons();
  }
  
  return data.hackathons.map((hackathon: any) => {
    // Extract the slug/id from the URL for consistent URL construction
    const urlParts = (hackathon.url || '').split('/');
    const slug = urlParts.length > 0 ? urlParts[urlParts.length - 1] : '';
    
    return {
      id: `devpost-${hackathon.id || Math.random().toString(36).substring(7)}`,
      name: hackathon.title || 'Unnamed Hackathon',
      organizer: hackathon.organization_name || 'Devpost',
      platform: 'devpost' as HackathonPlatform,
      mode: hackathon.online_only ? 'online' : (hackathon.location ? 'in-person' : 'hybrid'),
      location: hackathon.location || 'Online',
      startDate: new Date(hackathon.submission_period_starts_at || Date.now()),
      endDate: new Date(hackathon.submission_period_ends_at || Date.now() + 86400000),
      applyBy: new Date(hackathon.submission_period_ends_at || Date.now() + 43200000),
      url: hackathon.url || `https://devpost.com/hackathons/${slug}`,
      imageUrl: hackathon.thumbnail_url || FALLBACK_IMAGE
    };
  });
}

// Generate mock data for Devpost 
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