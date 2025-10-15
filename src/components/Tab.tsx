import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function MainTabs() {
  return (
    <Tabs defaultValue="contests" className="w-full">
      <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
        <TabsTrigger value="contests">Contests</TabsTrigger>
        <TabsTrigger value="videos">Videos</TabsTrigger>
      </TabsList>
      
      <TabsContent value="contests" className="mt-4">
        {/* Contests content */}
      </TabsContent>
      
      <TabsContent value="videos" className="mt-4">
        {/* Videos content */}
      </TabsContent>
    </Tabs>
  );
} 