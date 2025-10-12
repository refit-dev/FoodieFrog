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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-10 sm:my-20 max-w-7xl w-95/100 mx-auto">
        {/* form */}
        <div>
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
        <div className="rounded-3xl max-h-fit overflow-hidden">
          <MapComponent markerPosition={center} />
        </div>
      </div>
    </div>
  );
}
