import { Platform } from './types';

// Application-wide constants

// YouTube API configuration
export const YOUTUBE_API_KEY = 'AIzaSyA4e4qw33gOKaviupxqj-fL2WWJpS_AFiM'; // User's actual API key
export const DEFAULT_YOUTUBE_PLAYLIST_URL = ''; // No default playlist needed

export const PLATFORMS: Record<Platform, { name: string; color: string; baseUrl: string }> = {
  codeforces: {
    name: 'Codeforces',
    color: '#1195F5',
    baseUrl: 'https://codeforces.com'
  },
  codechef: {
    name: 'CodeChef',
    color: '#9D5D07',
    baseUrl: 'https://www.codechef.com'
  },
  leetcode: {
    name: 'LeetCode',
    color: '#FFA116',
    baseUrl: 'https://leetcode.com'
  }
};

export const CONTEST_TYPE_LABELS = {
  regular: 'Regular',
  weekly: 'Weekly',
  biweekly: 'Biweekly',
  long: 'Long Challenge',
  lunchtime: 'Lunchtime',
  cookoff: 'Cook-Off'
};

// Updated to use the default playlist URL as the first option
export const YOUTUBE_PLAYLISTS: Record<Platform, string> = {
  codeforces: DEFAULT_YOUTUBE_PLAYLIST_URL || 'https://www.youtube.com/playlist?list=PLcXpkI9A-RZLUfBSNp-YQBCOezZKbDSgB',
  codechef: DEFAULT_YOUTUBE_PLAYLIST_URL || 'https://www.youtube.com/playlist?list=PLcXpkI9A-RZIZ6lsE0KCcLWeKNoG45fYr',
  leetcode: DEFAULT_YOUTUBE_PLAYLIST_URL || 'https://www.youtube.com/playlist?list=PLcXpkI9A-RZI6FhydNz3JBt_-p_i25Cbr'
};

// Local storage keys
export const BOOKMARKS_STORAGE_KEY = 'contest-tracker-bookmarks';
export const THEME_STORAGE_KEY = 'contest-tracker-theme';

// Contest refresh interval in milliseconds (5 minutes)
export const REFRESH_INTERVAL = 5 * 60 * 1000;

// Timezone information
export const IST_TIMEZONE = 'Asia/Kolkata';
export const IST_UTC_OFFSET = '+05:30';
