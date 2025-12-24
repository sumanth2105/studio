import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Shield, Zap } from 'lucide-react';
import Image from 'next/image';
import { placeholderImages } from '@/lib/placeholder-images';

export default function Home() {
  const heroImage = placeholderImages.find(p => p.id === 'hero-family');

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
           <svg
              className="h-8 w-8 text-primary"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <path d="m12 10 4 2-4 2-4-2 4-2z" />
            </svg>
          <h1 className="text-2xl font-bold font-headline text-primary">Suraksha Kavach</h1>
        </div>
        <Button asChild>
          <Link href="/dashboard">Login</Link>
        </Button>
      </header>

      <main className="flex-grow">
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold font-headline text-foreground mb-4">
              Instant Insurance Approvals, When It Matters Most.
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              Suraksha Kavach eliminates treatment delays with a trust-based platform, ensuring you get the emergency care you need, instantly.
            </p>
            <Button size="lg" asChild>
              <Link href="/dashboard">Access Your Dashboard</Link>
            </Button>
          </div>
        </section>

        {heroImage && (
           <section className="container mx-auto px-4 sm:px-6 lg:px-8">
             <div className="relative aspect-[2/1] md:aspect-[3/1] rounded-xl overflow-hidden shadow-2xl">
                <Image
                    src={heroImage.imageUrl}
                    alt={heroImage.description}
                    fill
                    className="object-cover"
                    data-ai-hint={heroImage.imageHint}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
             </div>
           </section>
        )}

        <section className="bg-card py-16 md:py-24 mt-16 md:mt-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold font-headline text-foreground">A New Standard in Health Insurance</h3>
              <p className="text-lg text-muted-foreground mt-2">How we're changing the game for patients, hospitals, and insurers.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="text-center">
                <CardHeader>
                  <div className="mx-auto bg-primary/10 rounded-full p-3 w-fit">
                    <Zap className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="mt-4">Instant Approvals</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Our Trust Score system enables immediate approval for emergency treatments, eliminating stressful waits.</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardHeader>
                  <div className="mx-auto bg-accent/10 rounded-full p-3 w-fit">
                    <Shield className="h-8 w-8 text-accent" />
                  </div>
                  <CardTitle className="mt-4">Enhanced Security</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">With AI-powered fraud detection and immutable records, we build a secure and transparent ecosystem.</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardHeader>
                  <div className="mx-auto bg-secondary/20 rounded-full p-3 w-fit">
                    <CheckCircle className="h-8 w-8 text-secondary" />
                  </div>
                  <CardTitle className="mt-4">Seamless Experience</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">A unified platform for holders, hospitals, and insurers simplifies the entire claims process from start to finish.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <footer className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Suraksha Kavach. All Rights Reserved.</p>
      </footer>
    </div>
  );
}
