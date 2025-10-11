import MapComponent from '@/components/Map/MapComponent';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@radix-ui/react-label';
import React from 'react';
import Link from 'next/link';
import { Facebook, Youtube, Twitter, Send } from 'lucide-react';

export default function ContactUs() {
  const center = {
    lat: 23.8103, // Dhaka
    lng: 90.4125,
  };
  return (
    <div className="pt-[64px]">
      {/* top section with bg */}
      <div className="relative min-h-[70vh] max-h-[75vh] bg-[url(/contact.jpg)] bg-cover bg-center flex justify-center items-center">
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-transparent"></div>

        {/* text */}
        <div className="text-4xl text-white md:text-6xl font-bold text-center z-10">
          Contact <br /> FoodieFrog
        </div>
      </div>

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

      {/*social links section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-7xl w-95/100 mx-auto mb-16">
        {/* Telegram */}
        <Card>
          <CardHeader className="space-y-3">
            {/* Icon */}
            <div className="flex justify-center">
              <div className="w-12 h-12 rounded-full bg-sky-500/10 text-sky-600 flex items-center justify-center">
                <Send className="w-6 h-6" />
              </div>
            </div>
            {/* text */}
            <CardTitle>Join our Telegram</CardTitle>
            <CardDescription>
              Get the latest updates and community alerts.
            </CardDescription>
          </CardHeader>
          <CardContent className="h-full flex items-end">
            <Button asChild className="w-full">
              <Link href="#" aria-label="Join our Telegram channel">
                Join Telegram
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Facebook */}
        <Card>
          <CardHeader className="space-y-3">
            {/* Icon */}
            <div className="flex justify-center">
              <div className="w-12 h-12 rounded-full bg-sky-500/10 text-sky-600 flex items-center justify-center">
                <Facebook className="w-6 h-6" />
              </div>
            </div>
            {/* text */}
            <CardTitle>Follow us on Facebook</CardTitle>
            <CardDescription>
              News, photos, and specials on our page.
            </CardDescription>
          </CardHeader>
          <CardContent className="h-full flex items-end">
            <Button asChild className="w-full">
              <Link href="#" aria-label="Follow us on Facebook">
                Like on Facebook
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* YouTube */}
        <Card>
          <CardHeader className="space-y-3">
            {/* Icon */}
            <div className="flex justify-center">
              <div className="w-12 h-12 rounded-full bg-sky-500/10 text-sky-600 flex items-center justify-center">
                <Youtube className="w-6 h-6" />
              </div>
            </div>
            {/* text */}
            <CardTitle>Subscribe on YouTube</CardTitle>
            <CardDescription>
              Watch recipes, behind‑the‑scenes, and tips.
            </CardDescription>
          </CardHeader>
          <CardContent className="h-full flex items-end">
            <Button asChild className="w-full">
              <Link href="#" aria-label="Subscribe to our YouTube channel">
                Subscribe
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* X / Twitter */}
        <Card>
          <CardHeader className="space-y-3">
            {/* Icon */}
            <div className="flex justify-center">
              <div className="w-12 h-12 rounded-full bg-sky-500/10 text-sky-600 flex items-center justify-center">
                <Twitter className="w-6 h-6" />
              </div>
            </div>
            {/* text */}
            <CardTitle>Follow us on X</CardTitle>
            <CardDescription>
              Real‑time announcements and quick bites.
            </CardDescription>
          </CardHeader>
          <CardContent className="h-full flex items-end">
            <Button asChild className="w-full">
              <Link href="#" aria-label="Follow us on X (Twitter)">
                Follow on X
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
