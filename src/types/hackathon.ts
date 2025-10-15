// /types/hackathon.ts

export interface NormalizedHackathon {
  title: string;
  url: string;
  imageUrl: string;
  startDate: string;
  endDate: string;
  organizer: string;
  prize: string;
  tags: string[];
  source: "devpost" | "unstop" | "devfolio";
  registrationCount: number;
  timeLeft?: string; // Optional, as Unstop doesn't provide it
  location: string;
}