import MarqueeBanner from "@/components/sections/Marquee";
import Banner from "../components/sections/Banner";
import FeaturesSection from "@/components/sections/FeatureSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import RestaurantCarousel from "@/components/sections/TopRatedRest";
import BrandPartners from "@/components/sections/BrandPartners";
import MapComponent from "@/components/Map/MapComponent";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import React from "react";
import FoodCategoryExplorer from "@/components/Map/MapComponent";
import FoodieCommunityFeed from "@/components/sections/FoodieCommunityFeed";
import LottieSimple from "@/components/LottieSimple";

const center = {
  lat: 23.8103, // Dhaka
  lng: 90.4125,
};

export default function Home() {
  return (
    <div className="mx-auto">
      <Banner />
      <MarqueeBanner />
      <RestaurantCarousel />
      <FeaturesSection />
      <TestimonialsSection />
      <BrandPartners />
      {/* form map container */}
      <div className=" flex justify-center items-center w-full flex-col lg:flex-row p-3">
        {/* form */}
        <div className="lg:w-6/12  w-full">
          <Card>
            <CardHeader>
              <CardTitle>Contact Form</CardTitle>
              <CardDescription>Contact From Anywhere</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* name */}
              <div className="space-y-2">
                <Label htmlFor="text">Name</Label>
                <Input id="name" type="text" placeholder="Enter your Name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="Enter your email" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Your Message</Label>
                <textarea
                  id="message"
                  placeholder="Enter Your Message Here"
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-vertical"
                  rows={2}
                />
              </div>
              <Button className="w-full cursor-pointer">Send Message</Button>
            </CardContent>
          </Card>
        </div>

        {/* map */}
        
           <LottieSimple />
      
      </div>
 
    </div>


  );
}
