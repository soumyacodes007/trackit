// /app/api/hackathons/route.ts
import { fetchDevpostHackathons, fetchUnstopHackathons, fetchDevfolioHackathons } from '@/services/hackathons';
import { NormalizedHackathon } from '@/types/hackathon';

// Number of pages to fetch from each source
const PAGE_SIZE = 6;

/**
 * GET endpoint to fetch hackathons from Devpost and Unstop
 */
export async function GET() {
  try {
    // Create arrays of promises for fetching multiple pages concurrently
    const devpostPromises = Array.from({ length: PAGE_SIZE }, (_, i) => 
      fetchDevpostHackathons(i + 1)
    );
    
    const unstopPromises = Array.from({ length: PAGE_SIZE }, (_, i) => 
      fetchUnstopHackathons(i + 1)
    );
    
    const devfolioPromises = Array.from({ length: PAGE_SIZE }, (_, i) => 
      fetchDevfolioHackathons(i + 1)
    );
    
    // Fetch data from all sources concurrently
    const [devpostResults, unstopResults, devfolioResults] = await Promise.all([
      Promise.all(devpostPromises),
      Promise.all(unstopPromises),
      Promise.all(devfolioPromises)
    ]);
    
    // Flatten the results from paginated calls
    const devpostHackathons = devpostResults.flat();
    const unstopHackathons = unstopResults.flat();
    const devfolioHackathons = devfolioResults.flat();
    
    // Combine the arrays
    const hackathons: NormalizedHackathon[] = [...devpostHackathons, ...unstopHackathons, ...devfolioHackathons];
    
    // Return successful response
    return new Response(
      JSON.stringify({
        hackathons,
        count: hackathons.length
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error) {
    console.error('Error fetching hackathons:', error);
    
    // Return error response
    return new Response(
      JSON.stringify({
        error: 'Failed to fetch hackathons',
        message: error instanceof Error ? error.message : 'Unknown error'
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
}