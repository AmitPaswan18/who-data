"use client";

import { Navigation } from "@/components/Navgation";
import { StatCard } from "@/components/StatCard";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Syringe,
  Activity,
  Globe,
  ArrowRight,
  Database,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import heroImage from "@/assets/hero-health.jpg";
import { useHealthData } from "@/hooks/useHealthData";

const Index = () => {
  const { infections, stats, loading } = useHealthData();

  const formatNumber = (num: number) => {
    if (num >= 1000000000) return `${(num / 1000000000).toFixed(1)}B+`;
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M+`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K+`;
    return num.toString();
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}>
          <div className="absolute inset-0 bg-gradient-to-r from-primary/95 to-primary/80" />
        </div>

        <div className="relative container mx-auto px-4 py-24 md:py-32">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full mb-6">
              <Database className="h-4 w-4" />
              <span className="text-sm font-medium">Powered by WHO Data</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Global Vaccination & Disease Insights
            </h1>

            <p className="text-xl text-white/90 mb-8 max-w-2xl">
              Access comprehensive WHO health data to combat misinformation,
              support research, and drive evidence-based public health decisions
              worldwide.
            </p>

            <div className="flex flex-wrap gap-4">
              <Button size="lg" variant="secondary" asChild className="group">
                <Link href="#statistics">
                  Explore Data
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-white/10 border-white text-white hover:bg-white hover:text-primary"
                asChild>
                <Link href="/about">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Topics Covered */}
      <section className="py-16 bg-accent/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">What We Cover</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Comprehensive data spanning multiple dimensions of global health
              and vaccination programs
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-card rounded-lg border hover:shadow-lg transition-shadow">
              <div className="inline-flex p-4 bg-primary/10 rounded-full mb-4">
                <Syringe className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Vaccination Coverage</h3>
              <p className="text-sm text-muted-foreground">
                Global immunization rates and trends
              </p>
            </div>

            <div className="text-center p-6 bg-card rounded-lg border hover:shadow-lg transition-shadow">
              <div className="inline-flex p-4 bg-secondary/10 rounded-full mb-4">
                <Activity className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="font-semibold mb-2">Disease Surveillance</h3>
              <p className="text-sm text-muted-foreground">
                Tracking preventable diseases
              </p>
            </div>

            <div className="text-center p-6 bg-card rounded-lg border hover:shadow-lg transition-shadow">
              <div className="inline-flex p-4 bg-primary/10 rounded-full mb-4">
                <Globe className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Regional Analysis</h3>
              <p className="text-sm text-muted-foreground">
                Data across all WHO regions
              </p>
            </div>

            <div className="text-center p-6 bg-card rounded-lg border hover:shadow-lg transition-shadow">
              <div className="inline-flex p-4 bg-secondary/10 rounded-full mb-4">
                <TrendingUp className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="font-semibold mb-2">Historical Trends</h3>
              <p className="text-sm text-muted-foreground">
                Multi-year trend analysis
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Key Statistics */}
      <section id="statistics" className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Data at a Glance</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Key insights from the WHO global health database
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              icon={Calendar}
              label="Time Period Coverage"
              value={loading ? "Loading..." : stats.yearRange}
              description="24 years of comprehensive health data"
              gradient
            />

            <StatCard
              icon={Syringe}
              label="Vaccine Doses Administered"
              value={loading ? "Loading..." : formatNumber(stats.totalDoses)}
              description="Global vaccination programs tracked"
            />

            <StatCard
              icon={Activity}
              label="Preventable Disease Cases"
              value={loading ? "Loading..." : formatNumber(stats.totalCases)}
              description="Documented cases worldwide"
            />

            <StatCard
              icon={Globe}
              label="Diseases Tracked"
              value={loading ? "Loading..." : stats.diseasesCount.toString()}
              description="Including measles, rubella, and pertussis"
            />
          </div>

          {/* Disease List */}
          <div className="mt-12 bg-card border rounded-lg p-8">
            <h3 className="text-xl font-semibold mb-6 text-center">
              Diseases Covered in Our Database
            </h3>
            {loading ? (
              <p className="text-center text-muted-foreground">
                Loading diseases...
              </p>
            ) : (
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                {infections.map((infection) => (
                  <div
                    key={infection.id}
                    className="flex items-center gap-2 p-3 bg-accent/50 rounded-lg hover:bg-accent transition-colors">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                    <span className="text-sm font-medium">
                      {infection.description}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-primary to-primary/80">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Explore?
          </h2>
          <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
            Learn more about our mission, user personas, and the team behind
            this initiative
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/about">
              Visit Our About Page
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              <span className="font-semibold">WHO Health Data Platform</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Data sourced from World Health Organization (WHO) • Milestone 1
              Project
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
