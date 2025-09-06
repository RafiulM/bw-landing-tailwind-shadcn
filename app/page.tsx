"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AuthButtons } from "@/components/auth-buttons";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-black/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Image
                src="/codeguide-logo.png"
                alt="CodeGuide Logo"
                width={40}
                height={40}
                className="rounded-lg"
              />
              <h1 className="text-xl font-bold text-black">
                Codeguide
              </h1>
            </div>
            <AuthButtons />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main>
        <section className="py-20 text-center">
          <div className="container mx-auto px-4">
            <h1 className="text-5xl font-bold text-black mb-6">
              Modern Full-Stack Development
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Build powerful web applications with TypeScript, authentication, and beautiful UI components
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="bg-black text-white hover:bg-gray-800 px-8 py-3 text-lg">
                <Link href="/sign-up">Get Started</Link>
              </Button>
              <Button asChild variant="outline" className="border-black text-black hover:bg-black hover:text-white px-8 py-3 text-lg">
                <Link href="/sign-in">Sign In</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-black mb-12">
              Everything You Need
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="p-6 border border-black/10 bg-white">
                <h3 className="text-xl font-semibold text-black mb-3">
                  Modern Stack
                </h3>
                <p className="text-gray-600">
                  Built with Next.js 15, React 19, TypeScript, and Tailwind CSS for optimal performance
                </p>
              </Card>
              <Card className="p-6 border border-black/10 bg-white">
                <h3 className="text-xl font-semibold text-black mb-3">
                  Secure Auth
                </h3>
                <p className="text-gray-600">
                  Integrated authentication with session management and multiple provider support
                </p>
              </Card>
              <Card className="p-6 border border-black/10 bg-white">
                <h3 className="text-xl font-semibold text-black mb-3">
                  Database Ready
                </h3>
                <p className="text-gray-600">
                  PostgreSQL with Drizzle ORM for type-safe database operations and migrations
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-black text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Start Building?
            </h2>
            <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of developers who use our starter template to build amazing applications
            </p>
            <Button asChild className="bg-white text-black hover:bg-gray-100 px-8 py-3 text-lg">
              <Link href="/sign-up">Start Your Project</Link>
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-black/10 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-600">
            © 2024 Codeguide. Built with Next.js and Tailwind CSS.
          </p>
        </div>
      </footer>
    </div>
  );
}