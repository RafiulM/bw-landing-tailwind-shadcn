import React from "react";
"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail } from "lucide-react";

export function ContactForm() {
  return (
    <Card className="p-6 bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-900/50 dark:to-gray-900/50 mt-8">
      <CardHeader>
        <CardTitle className="font-bold text-xl mb-4 flex items-center gap-2">
          <Mail className="w-5 h-5 text-yellow-500" />
          Contact Us
        </CardTitle>
        <CardDescription>
          Have a question or want to work with us? Fill out the form below.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="Your name" />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" placeholder="Your email" type="email" />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="message">Message</Label>
              <Textarea id="message" placeholder="Your message" />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button>Send Message</Button>
      </CardFooter>
    </Card>
  );
}
