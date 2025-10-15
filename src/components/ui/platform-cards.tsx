"use client";

import { Code, Trophy, Puzzle } from "lucide-react";
import DisplayCards from "./display-cards";
import { cn } from "@/lib/utils";

export function PlatformCards() {
  const platformCards = [
    {
      icon: <Code className="size-4 text-green-300" />,
      title: "LeetCode",
      description: "Master algorithms & data structures",
      date: "Regular contests",
      iconClassName: "bg-[#1a1a1a]",
      titleClassName: "text-[#ffa116]",
      className: cn(
        "[grid-area:stack] hover:-translate-y-10 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration:700 hover:grayscale-0 before:left-0 before:top-0",
        "border-[#ffa116]/20 hover:border-[#ffa116]/50 bg-[#1a1a1a]/10"
      ),
    },
    {
      icon: <Trophy className="size-4 text-zinc-300" />,
      title: "CodeForces",
      description: "Competitive programming contests",
      date: "Regular rounds",
      iconClassName: "bg-[#1a1a1a]",
      titleClassName: "text-[#1a1a1a]",
      className: cn(
        "[grid-area:stack] translate-x-16 translate-y-10 hover:-translate-y-1 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration:700 hover:grayscale-0 before:left-0 before:top-0",
        "border-[#1a1a1a]/20 hover:border-[#1a1a1a]/50 bg-[#1a1a1a]/10"
      ),
    },
    {
      icon: <Puzzle className="size-4 text-red-300" />,
      title: "CodeChef",
      description: "Cook your way to the top",
      date: "Long & short challenges",
      iconClassName: "bg-[#5b4638]",
      titleClassName: "text-[#cd5c5c]",
      className: cn(
        "[grid-area:stack] translate-x-32 translate-y-20 hover:translate-y-10",
        "border-[#cd5c5c]/20 hover:border-[#cd5c5c]/50 bg-[#5b4638]/10"
      ),
    },
  ];

  return <DisplayCards cards={platformCards} />;
} 