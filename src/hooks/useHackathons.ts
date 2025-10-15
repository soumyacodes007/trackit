// /hooks/useHackathons.ts
import { useState, useEffect } from 'react';
import { NormalizedHackathon } from '@/types/hackathon';

interface UseHackathonsReturn {
  hackathons: NormalizedHackathon[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Custom hook to fetch hackathons from our API endpoint
 * @returns Object containing hackathons, loading state, error state, and refetch function
 */
export const useHackathons = (): UseHackathonsReturn => {
  const [hackathons, setHackathons] = useState<NormalizedHackathon[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHackathons = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Use environment variable for API URL in production, fallback to proxy in development
      const apiUrl = import.meta.env.VITE_API_URL || '';
      const response = await fetch(`${apiUrl}/api/hackathons`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch hackathons: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      setHackathons(data.hackathons || []);
    } catch (err) {
      console.error('Error fetching hackathons:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setHackathons([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHackathons();
  }, []);

  return {
    hackathons,
    loading,
    error,
    refetch: fetchHackathons
  };
};