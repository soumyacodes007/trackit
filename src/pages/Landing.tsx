import { Hero } from "@/components/ui/animated-hero";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MoveRight, Calendar, Video, Star, Code, CheckCircle, Zap, BookOpen, ExternalLink, Book, Map } from "lucide-react";
import { PLATFORMS } from "@/utils/constants";
import { Link } from "react-router-dom";
import { DSARoadmap } from "@/components/ui/dsa-roadmap";
import { dsaTopics } from "@/data/dsa-roadmap";
import { PlatformCards } from "@/components/ui/platform-cards";

// Define the structure for resources
interface Resource {
  title: string;
  description: string;
  url: string;
  sourceUrl?: string;
  sourceName?: string;
}

// Define the structure for books
interface Book {
  title: string;
  authors: string;
  description: string;
  url: string;
  level: "Beginner" | "Intermediate" | "Advanced";
}

// Create books array
const books: Book[] = [
  {
    title: "Introduction to Algorithms (CLRS)",
    authors: "Thomas H. Cormen, Charles E. Leiserson, Ronald L. Rivest, Clifford Stein",
    description: "The bible of algorithms, comprehensive coverage of algorithms and data structures",
    url: "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
    level: "Advanced"
  },
  {
    title: "Algorithms",
    authors: "Robert Sedgewick, Kevin Wayne",
    description: "Practical implementation-focused approach with examples in Java",
    url: "https://algs4.cs.princeton.edu/home/",
    level: "Intermediate"
  },
  {
    title: "Cracking the Coding Interview",
    authors: "Gayle Laakmann McDowell",
    description: "The most popular book for interview preparation with 189 programming questions and solutions",
    url: "https://www.crackingthecodinginterview.com/",
    level: "Intermediate"
  },
  {
    title: "The Algorithm Design Manual",
    authors: "Steven S. Skiena",
    description: "Focuses on algorithm design techniques with real-world applications",
    url: "https://www.algorist.com/",
    level: "Intermediate"
  },
  {
    title: "Competitive Programming 3",
    authors: "Steven Halim, Felix Halim",
    description: "Specifically targets competitive programming contests with problem-solving strategies",
    url: "https://cpbook.net/",
    level: "Intermediate"
  },
  {
    title: "Elements of Programming Interviews",
    authors: "Adnan Aziz, Tsung-Hsien Lee, Amit Prakash",
    description: "Collection of over 250 problems with detailed solutions for interview preparation",
    url: "https://elementsofprogramminginterviews.com/",
    level: "Advanced"
  },
  {
    title: "Data Structures and Algorithms Made Easy",
    authors: "Narasimha Karumanchi",
    description: "Well-structured content with focus on problem solving and interview preparation",
    url: "https://www.amazon.com/Data-Structures-Algorithms-Made-Easy/dp/819324527X",
    level: "Beginner"
  },
  {
    title: "Grokking Algorithms",
    authors: "Aditya Bhargava",
    description: "Illustrated, beginner-friendly guide to algorithms with practical examples",
    url: "https://www.manning.com/books/grokking-algorithms",
    level: "Beginner"
  }
];

// Create resources array
const resources: Resource[] = [
  {
    title: "Striver's A2Z DSA Course Sheet",
    description: "Comprehensive DSA course with step-by-step solutions",
    url: "https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2",
  },
  {
    title: "Ask Senior Sheet Solutions",
    description: "Complete solutions including math for beginners section",
    url: "https://docs.google.com/spreadsheets/d/1WqBHyKfCUX0ZuxcLS38YjncOE26B6dweNxuor0Eh11g/edit?usp=sharing",
    sourceUrl: "https://asksenior.in/learn",
    sourceName: "Ask Senior"
  },
  {
    title: "AlgoZenith Premium Sheet",
    description: "Curated problems for advanced competitive programmers",
    url: "https://docs.google.com/spreadsheets/d/1-kFigIqH3xcWjsjnGqKiVx_eoOXGOgzXMLGwie7S4S4/edit?gid=0#gid=0",
  },
  {
    title: "ACD Sheet",
    description: "Collection of 800-rated problems with solutions",
    url: "https://docs.google.com/spreadsheets/d/1k6F1hVOQhyHuNJHuOCTFukyBbXiTX3Y4Arz2cx-YH94/edit?usp=sharing",
    sourceUrl: "https://acodedaily.com/",
    sourceName: "A Code Daily"
  },
  {
    title: "Kartik Arora Specialist Sheet",
    description: "Targeted practice for reaching Specialist level",
    url: "https://docs.google.com/spreadsheets/d/1krbQLgfxedAREtSGAmQ7LzxrC5WZfpHMl1pqgj5Mxdo/edit?usp=sharing",
    sourceUrl: "https://docs.google.com/document/d/1EUTucOFpmHPnblOXO0J7hEyVH0RvM91j1pTO60AdzVM/edit?tab=t.0",
    sourceName: "Kartik Arora's Guide"
  },
  {
    title: "Kartik Arora Expert Sheet",
    description: "Advanced problems for Expert-level competitors",
    url: "https://docs.google.com/spreadsheets/d/1yLiZfGNqnaZo2MDCgWNSFdFk_H830sNjXEA22p5VInc/edit?usp=sharing",
    sourceUrl: "https://docs.google.com/document/d/1-wkEQSYLLaKne-6GJ4Wc_dTGmnRn5Fv_Ax64LrheK_M/edit?tab=t.0",
    sourceName: "Kartik Arora's Guide"
  },
  {
    title: "Neetcode Sheet",
    description: "Popular coding interview preparation resource",
    url: "https://docs.google.com/spreadsheets/d/1YGM46-1ORNcLccldQOU-bhovFG-Hl6UUJJhrFP0vyHs/edit?usp=sharing",
    sourceUrl: "https://neetcode.io/practice?tab=allNC",
    sourceName: "Neetcode.io"
  },
  {
    title: "A2OJ Ladders",
    description: "Progressive problem sets organized by difficulty",
    url: "https://docs.google.com/spreadsheets/d/1BHlu1Y0KyZBWjQeLtjNZGryRXROUgPlfgJF52LVQbBc/edit?usp=sharing",
    sourceUrl: "https://earthshakira.github.io/a2oj-clientside/server/",
    sourceName: "A2OJ"
  },
  {
    title: "Coding 75 Expert Sheet",
    description: "Structured approach to master DSA in 75 days",
    url: "https://docs.google.com/spreadsheets/d/145k2fuCde-DbXoeo7U3TGKOJjJZR8TKW17hdQlkATj8/edit?usp=sharing",
    sourceUrl: "https://coding75.com/dsa-cp/sheets/expert-sheet",
    sourceName: "Coding75"
  },
  {
    title: "Striver CP Sheet",
    description: "Focused sheet for competitive programming practice",
    url: "https://docs.google.com/spreadsheets/d/18x9USXwYoGLUlLiDu6FFNtW_UbvIBy-XGfxlrZoyjt8/edit?gid=0#gid=0",
    sourceUrl: "https://takeuforward.org/interview-experience/strivers-cp-sheet",
    sourceName: "Take U Forward"
  },
  {
    title: "TLE Eliminators CP Sheet",
    description: "Structured approach to eliminate TLE (Time Limit Exceeded) issues",
    url: "https://docs.google.com/spreadsheets/d/1KWa_8CAaHg96j1FolJMwZ2t0lFtZ9HTtPY55rETeDw4/edit?gid=0#gid=0",
    sourceUrl: "https://www.tle-eliminators.com/cp-sheet",
    sourceName: "TLE Eliminators"
  },
  {
    title: "CSES Problem Set",
    description: "Comprehensive collection of standard algorithm problems",
    url: "https://docs.google.com/spreadsheets/d/1e9AeRjFmmKpsYAP8AHhKuZ1rESmErk00Vrr6odGrG6o/edit?usp=sharing",
    sourceUrl: "https://cses.fi/problemset",
    sourceName: "CSES"
  },
  {
    title: "AtCoder Training by Kenkoo",
    description: "Structured training path using AtCoder problems",
    url: "https://docs.google.com/spreadsheets/d/143j0SigIb4V5VLkSaTQDk_Yk-4IqVqqotMte23Rt4OU/edit?usp=sharing",
    sourceUrl: "https://kenkoooo.com/atcoder/#/training/",
    sourceName: "Kenkoooo"
  },
  {
    title: "C2OJ Ladders",
    description: "Progressive problem sets specifically for CodeForces",
    url: "https://docs.google.com/spreadsheets/d/1ZePvdQBefqT1HXM1qD0Bq_mvKjhCy0RMnn0-3r32s0k/edit?usp=sharing",
    sourceUrl: "https://c2-ladders-juol.onrender.com/",
    sourceName: "C2 Ladders"
  }
];

const Landing = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <Hero />
      
      {/* DSA Roadmap Section */}
      <section className="bg-muted/5">
        <DSARoadmap topics={dsaTopics} />
      </section>
      
      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Everything you need for competitive programming</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Track contests, find solutions, and improve your coding skills all in one place
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard 
              icon={<Calendar className="h-8 w-8 text-primary" />}
              title="Contest Tracking"
              description="Stay updated with upcoming and ongoing contests from Codeforces, LeetCode, and CodeChef"
            />
            <FeatureCard 
              icon={<Video className="h-8 w-8 text-primary" />}
              title="Video Solutions"
              description="Find high-quality video solutions for past contests and improve your problem-solving skills"
            />
            <FeatureCard 
              icon={<Star className="h-8 w-8 text-primary" />}
              title="Bookmarks"
              description="Save your favorite contests and access them quickly whenever you want"
            />
            <FeatureCard 
              icon={<Map className="h-8 w-8 text-primary" />}
              title="DSA Roadmap"
              description="Track your progress through essential DSA topics with our interactive roadmap"
            />
            <FeatureCard 
              icon={<CheckCircle className="h-8 w-8 text-primary" />}
              title="Smart Matching"
              description="Automatically find the best video solutions for your bookmarked contests"
            />
            <FeatureCard 
              icon={<Zap className="h-8 w-8 text-primary" />}
              title="Fast & Responsive"
              description="Enjoy a smooth experience on any device, whether you're on desktop or mobile"
            />
          </div>
        </div>
      </section>
      
      {/* Resources Section */}
      <section className="py-20 bg-muted/10 overflow-hidden">
        <div className="container mx-auto">
          <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-5 duration-1000">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Learning Resources</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Curated collection of the best competitive programming resources to help you improve your skills
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((resource, index) => (
              <a 
                href={resource.url} 
                target="_blank" 
                rel="noopener noreferrer"
                key={index} 
                className="block animate-in fade-in slide-in-from-bottom-5 duration-1000 fill-mode-forwards"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <Card className="h-full group hover:shadow-lg transition-all duration-300 border border-border/50 hover:border-primary/20 hover:-translate-y-2">
                  <CardHeader className="pb-2 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg group-hover:text-primary transition-colors duration-300">{resource.title}</CardTitle>
                      <ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0 group-hover:text-primary group-hover:rotate-12 transition-all duration-300" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm mb-3 group-hover:text-foreground/90 transition-colors duration-300">
                      {resource.description}
                    </CardDescription>
                    {resource.sourceUrl && (
                      <div className="flex items-center mt-2 transform translate-y-0 group-hover:translate-y-0 transition-transform duration-300">
                        <BookOpen className="h-3 w-3 text-muted-foreground mr-1 group-hover:text-primary transition-colors duration-300" />
                        <a 
                          href={resource.sourceUrl} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-xs text-primary hover:underline transition-all duration-300"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {resource.sourceName || "Original Source"}
                        </a>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </a>
            ))}
          </div>
        </div>
      </section>
      
      {/* Books Section */}
      <section className="py-20 bg-muted/20 overflow-hidden">
        <div className="container mx-auto">
          <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-5 duration-1000">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Recommended Books</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Essential reading material for mastering data structures and algorithms
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {books.map((book, index) => (
              <a 
                href={book.url} 
                target="_blank" 
                rel="noopener noreferrer"
                key={index} 
                className="block animate-in fade-in slide-in-from-bottom-5 duration-1000 fill-mode-forwards perspective-1000"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <Card className="h-full hover:shadow-xl transition-all duration-500 border border-border/50 hover:border-primary/20 group hover:-translate-y-2 hover:scale-[1.02] relative bg-card">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-lg"></div>
                  <CardHeader className="pb-2 relative">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg group-hover:text-primary transition-colors duration-300">{book.title}</CardTitle>
                      <Book className="h-4 w-4 text-primary flex-shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300" />
                    </div>
                    <div className="flex items-center mt-1">
                      <Badge variant="outline" className="text-xs font-normal group-hover:bg-primary/10 transition-colors duration-300">
                        {book.level}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground mb-2 group-hover:text-foreground/80 transition-colors duration-300">
                      by {book.authors}
                    </p>
                    <CardDescription className="text-sm group-hover:text-foreground/90 transition-colors duration-300">
                      {book.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </a>
            ))}
          </div>
        </div>
      </section>
      
      {/* Platforms Section */}
      <section className="py-20">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Supported Platforms</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We support all major competitive programming platforms
            </p>
          </div>
          
          <div className="flex justify-center py-6">
            <PlatformCards />
          </div>
        </div>
      </section>
    </Layout>
  );
};

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => {
  return (
    <Card className="border-none shadow-none hover:bg-accent/5 transition-colors">
      <CardHeader>
        <div className="mb-4">{icon}</div>
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-base">{description}</CardDescription>
      </CardContent>
    </Card>
  );
};

export default Landing; 