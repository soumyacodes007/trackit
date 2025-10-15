// /services/hackathons.ts
import { NormalizedHackathon } from '@/types/hackathon';
import { cleanCurrencySpan, formatImageUrl } from '@/lib/utils';

const DEVPOST_BASE_URL = 'https://devpost.com/api/hackathons';
const UNSTOP_BASE_URL = 'https://unstop.com/api/public/opportunity/search-result';
const DEVFOLIO_BASE_URL = 'https://api.devfolio.co/api/search/hackathons';

/**
 * Fetch hackathons from Devpost
 * @param page Page number to fetch
 * @returns Array of normalized hackathons
 */
export async function fetchDevpostHackathons(page: number = 1): Promise<NormalizedHackathon[]> {
  try {
    const response = await fetch(`${DEVPOST_BASE_URL}?page=${page}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Devpost API responded with status ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data || !Array.isArray(data.hackathons)) {
      return [];
    }
    
    return data.hackathons.map(hackathon => {
      // Parse submission period dates
      let startDate = '';
      let endDate = '';
      
      if (hackathon.submission_period_dates) {
        const dates = hackathon.submission_period_dates.split(' - ');
        if (dates.length === 2) {
          try {
            const start = new Date(dates[0]);
            const end = new Date(dates[1]);
            if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
              startDate = start.toISOString();
              endDate = end.toISOString();
            }
          } catch (dateError) {
            console.warn('Error parsing dates for hackathon:', hackathon.title, dateError);
          }
        }
      }
      
      return {
        title: hackathon.title || '',
        url: hackathon.url || '',
        imageUrl: formatImageUrl(hackathon.thumbnail_url || ''),
        startDate,
        endDate,
        organizer: hackathon.organization_name || '',
        prize: cleanCurrencySpan(hackathon.prize_amount || ''),
        tags: (hackathon.themes || []).map((theme: any) => typeof theme === 'string' ? theme : theme.name || theme.title || String(theme)),
        source: 'devpost',
        registrationCount: hackathon.registrations_count || 0,
        timeLeft: hackathon.time_left_to_submission || '',
        location: hackathon.displayed_location?.location || ''
      };
    });
  } catch (error) {
    console.error('Error fetching Devpost hackathons:', error);
    return [];
  }
}

/**
 * Fetch hackathons from Unstop
 * @param page Page number to fetch
 * @returns Array of normalized hackathons
 */
export async function fetchUnstopHackathons(page: number = 1): Promise<NormalizedHackathon[]> {
  try {
    const response = await fetch(
      `${UNSTOP_BASE_URL}?opportunity=hackathons&page=${page}`,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'application/json'
        }
      }
    );
    
    if (!response.ok) {
      throw new Error(`Unstop API responded with status ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data || !data.data || !Array.isArray(data.data.data)) {
      return [];
    }
    
    // Log the first hackathon to see its structure
    if (data.data.data.length > 0) {
      console.log('Unstop hackathon sample:', data.data.data[0]);
    }
    
    return data.data.data.map((hackathon: any) => {
      // Calculate total prize amount
      let prize = '';
      try {
        if (Array.isArray(hackathon.prizes)) {
          const totalPrize = hackathon.prizes.reduce((sum: number, prize: any) => {
            if (prize?.cash && typeof prize.cash === 'number') {
              return sum + prize.cash;
            }
            return sum;
          }, 0);
          
          if (totalPrize > 0) {
            // Format as localized string with currency
            prize = `$${totalPrize.toLocaleString()}`;
          }
        }
      } catch (err) {
        console.warn('Error calculating prize amount for Unstop hackathon:', err);
      }
      
      return {
        title: hackathon.title || '',
        url: `https://unstop.com/${hackathon.public_url || ''}`,
        imageUrl: hackathon.banner_mobile?.image_url || '',
        startDate: hackathon.start_date ? (() => {
          try {
            const date = new Date(hackathon.start_date);
            return isNaN(date.getTime()) ? '' : date.toISOString();
          } catch (error) {
            console.warn('Error parsing start date for Unstop hackathon:', hackathon.title, error);
            return '';
          }
        })() : '',
        endDate: hackathon.end_date ? (() => {
          try {
            const date = new Date(hackathon.end_date);
            return isNaN(date.getTime()) ? '' : date.toISOString();
          } catch (error) {
            console.warn('Error parsing end date for Unstop hackathon:', hackathon.title, error);
            return '';
          }
        })() : '',
        organizer: hackathon.organisation?.name || '',
        prize,
        tags: (hackathon.filters || []).map((filter: any) => typeof filter === 'string' ? filter : filter.name || filter.title || String(filter)),
        source: 'unstop',
        registrationCount: hackathon.registerCount || 0,
        location: hackathon.region || ''
      };
    });
  } catch (error) {
    console.error('Error fetching Unstop hackathons:', error);
    return [];
  }
}

/**
 * Fetch hackathons from Devfolio
 * @param page Page number to fetch (Devfolio uses from/size instead of page)
 * @returns Array of normalized hackathons
 */
export async function fetchDevfolioHackathons(page: number = 1): Promise<NormalizedHackathon[]> {
  try {
    const from = (page - 1) * 50; // Devfolio uses 'from' and 'size' parameters
    const size = 50;
    
    const response = await fetch(DEVFOLIO_BASE_URL, {
      method: 'POST',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Origin': 'https://devfolio.co',
        'Referer': 'https://devfolio.co/'
      },
      body: JSON.stringify({
        type: 'application_open',
        from,
        size
      })
    });
    
    if (!response.ok) {
      throw new Error(`Devfolio API responded with status ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data || !data.hits || !Array.isArray(data.hits.hits)) {
      return [];
    }
    
    return data.hits.hits.map((hit: any) => {
      const source = hit._source;
      const slug = source.slug || '';
      
      // Ensure slug is properly formatted for URL
      const cleanSlug = slug.trim().toLowerCase().replace(/\s+/g, '-');
      
      // Parse dates
      let startDate = '';
      let endDate = '';
      
      try {
        if (source.starts_at) {
          const start = new Date(source.starts_at);
          if (!isNaN(start.getTime())) {
            startDate = start.toISOString();
          }
        }
        if (source.ends_at) {
          const end = new Date(source.ends_at);
          if (!isNaN(end.getTime())) {
            endDate = end.toISOString();
          }
        }
      } catch (dateError) {
        console.warn('Error parsing dates for Devfolio hackathon:', source.name, dateError);
      }
      
      return {
        title: source.name || '',
        url: `https://${cleanSlug}.devfolio.co/overview`,
        imageUrl: formatImageUrl(source.cover_image?.url || ''),
        startDate,
        endDate,
        organizer: source.organizer_name || '',
        prize: source.prize_amount || '',
        tags: (source.themes || []).map((theme: any) => typeof theme === 'string' ? theme : theme.name || theme.title || String(theme)),
        source: 'devfolio',
        registrationCount: source.registrations_count || 0,
        location: source.venue || source.location || ''
      };
    });
  } catch (error) {
    console.error('Error fetching Devfolio hackathons:', error);
    return [];
  }
}