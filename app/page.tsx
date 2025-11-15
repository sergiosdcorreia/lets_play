import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trophy, Users, Calendar, TrendingUp } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-500 to-blue-600 text-white">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">⚽ Let&apos;s Play</h1>
            <p className="text-xl mb-8 text-green-50">
              Organize soccer matches, manage teams, and run tournaments with
              ease. The ultimate platform for football enthusiasts.
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/sign-up">
                <Button size="lg" variant="secondary" className="text-lg">
                  Get Started
                </Button>
              </Link>
              <Link href="/sign-in">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg bg-white/10 hover:bg-white/20 text-white border-white"
                >
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Everything You Need to Organize Football
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6">
              <Users className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Team Management</h3>
              <p className="text-gray-600">
                Create teams, invite players, and manage your squad with ease.
              </p>
            </Card>

            <Card className="p-6">
              <Trophy className="w-12 h-12 text-yellow-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Tournaments</h3>
              <p className="text-gray-600">
                Run tournaments with automatic fixtures and live standings.
              </p>
            </Card>

            <Card className="p-6">
              <Calendar className="w-12 h-12 text-green-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Match Scheduling</h3>
              <p className="text-gray-600">
                Schedule matches based on player availability and weather
                forecasts.
              </p>
            </Card>

            <Card className="p-6">
              <TrendingUp className="w-12 h-12 text-red-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Statistics</h3>
              <p className="text-gray-600">
                Track goals, assists, and player performance with detailed
                stats.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of football enthusiasts organizing matches worldwide.
          </p>
          <Link href="/register">
            <Button size="lg" className="text-lg">
              Create Your Free Account
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">
            © 2025 Let&apos;s Play. Built with ⚽ by Sergio Correia
          </p>
        </div>
      </footer>
    </div>
  );
}
