import React, { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useLocalStorage } from "@/hooks/useLocalStorage";

export interface RoadmapTopic {
  id: string;
  title: string;
  description?: string;
}

interface RoadmapProps {
  topics: RoadmapTopic[];
}

export function DSARoadmap({ topics }: RoadmapProps) {
  const [completedTopics, setCompletedTopics] = useLocalStorage<string[]>("dsa-roadmap-completed", []);
  const [progressPercent, setProgressPercent] = useState(0);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const timelineRef = React.useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (timelineRef.current) {
      const rect = timelineRef.current.getBoundingClientRect();
      setHeight(rect.height);
    }
  }, [timelineRef]);

  useEffect(() => {
    // Calculate progress percentage
    const percent = topics.length > 0 
      ? Math.round((completedTopics.length / topics.length) * 100) 
      : 0;
    setProgressPercent(percent);
  }, [completedTopics, topics]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 10%", "end 50%"],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  const handleTopicToggle = (topicId: string) => {
    setCompletedTopics(prev => {
      if (prev.includes(topicId)) {
        return prev.filter(id => id !== topicId);
      } else {
        return [...prev, topicId];
      }
    });
  };

  return (
    <div 
      className="w-full bg-background font-sans md:px-10"
      ref={containerRef}
    >
      <div className="max-w-7xl mx-auto py-20 px-4 md:px-8 lg:px-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight mb-4">
              DSA Learning Roadmap
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl">
              Track your progress through essential data structures and algorithms topics. 
              Check off each topic as you complete it.
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center gap-2">
            <div className="w-full md:w-32 h-3 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-sm font-medium whitespace-nowrap">{progressPercent}% Complete</span>
          </div>
        </div>
      </div>

      <div ref={timelineRef} className="relative max-w-7xl mx-auto pb-20">
        {topics.map((topic, index) => (
          <div
            key={topic.id}
            className="flex justify-start pt-6 md:gap-10"
          >
            <div className="sticky flex flex-col md:flex-row z-40 items-center top-20 self-start md:w-1/3">
              <div className="h-10 absolute left-3 md:left-3 w-10 rounded-full bg-background flex items-center justify-center">
                <div 
                  className={`h-4 w-4 rounded-full ${
                    completedTopics.includes(topic.id) 
                      ? "bg-primary" 
                      : "bg-muted border border-border"
                  } transition-colors duration-300`} 
                />
              </div>
              <h3 className="hidden md:block text-xl md:pl-20 font-bold text-foreground">
                {topic.title}
              </h3>
            </div>

            <div className="relative pl-20 pr-4 md:pl-4 w-full md:w-2/3">
              <div className="flex items-center gap-3 mb-3">
                <h3 className="md:hidden block text-xl text-left font-bold">
                  {topic.title}
                </h3>
              </div>
              
              <div className="flex items-center gap-2">
                <Checkbox 
                  id={`topic-${topic.id}`}
                  checked={completedTopics.includes(topic.id)}
                  onCheckedChange={() => handleTopicToggle(topic.id)}
                  className="h-5 w-5"
                />
                <Label 
                  htmlFor={`topic-${topic.id}`}
                  className={`text-sm ${
                    completedTopics.includes(topic.id) 
                      ? "line-through text-muted-foreground" 
                      : "text-foreground"
                  }`}
                >
                  Mark as completed
                </Label>
              </div>
              
              {topic.description && (
                <p className="mt-2 text-sm text-muted-foreground">
                  {topic.description}
                </p>
              )}
            </div>
          </div>
        ))}
        <div
          style={{
            height: height + "px",
          }}
          className="absolute md:left-8 left-8 top-0 overflow-hidden w-[2px] bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))] from-transparent from-[0%] via-muted via-neutral-200 dark:via-neutral-700 to-transparent to-[99%] [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)]"
        >
          <motion.div
            style={{
              height: heightTransform,
              opacity: opacityTransform,
            }}
            className="absolute inset-x-0 top-0 w-[2px] bg-gradient-to-t from-primary via-primary to-transparent from-[0%] via-[10%] rounded-full"
          />
        </div>
      </div>
    </div>
  );
} 