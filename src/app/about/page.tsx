import { Navigation } from "@/components/Navgation";
import { PersonaCard } from "@/components/PersonaCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, Users, BookOpen, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const About = () => {
  const personas = [
    {
      name: "Dr. Sarah Chen",
      age: 42,
      role: "Public Health Researcher",
      avatar: "/personas/sarah.jpg",
      initials: "SC",
      goals: [
        "Access reliable vaccination data for policy recommendations",
        "Identify trends in disease prevention globally",
        "Support evidence-based public health initiatives",
      ],
      needs: [
        "Verified, up-to-date WHO data",
        "Easy data export capabilities",
        "Historical trend analysis",
      ],
      frustrations: [
        "Scattered data sources",
        "Lack of standardized formats",
        "Time-consuming data collection",
      ],
    },
    {
      name: "James Martinez",
      age: 29,
      role: "Health Journalist",
      avatar: "/personas/james.jpg",
      initials: "JM",
      goals: [
        "Find compelling statistics for health stories",
        "Understand global health trends",
        "Create data-driven narratives",
      ],
      needs: [
        "Quick access to key statistics",
        "Visual data representations",
        "Clear, citable sources",
      ],
      frustrations: [
        "Complex medical terminology",
        "Difficulty finding story angles",
        "Limited visualization tools",
      ],
    },
    {
      name: "Prof. Aisha Okonkwo",
      age: 51,
      role: "University Professor",
      avatar: "/personas/aisha.jpg",
      initials: "AO",
      goals: [
        "Provide students with real-world data examples",
        "Teach epidemiological concepts",
        "Foster data literacy skills",
      ],
      needs: [
        "Educational resources",
        "Student-friendly interface",
        "Downloadable datasets",
      ],
      frustrations: [
        "Outdated teaching materials",
        "Complex data platforms",
        "Limited educational tools",
      ],
    },
  ];

  const teamMembers = [
    { name: "Student Name 1", studentNumber: "000000001" },
    { name: "Student Name 2", studentNumber: "000000002" },
    { name: "Student Name 3", studentNumber: "000000003" },
    { name: "Student Name 4", studentNumber: "000000004" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 py-12 space-y-16">
        {/* Mission Statement */}
        <section>
          <div className="text-center max-w-3xl mx-auto mb-12">
            <Badge className="mb-4">Our Mission</Badge>
            <h1 className="text-4xl font-bold mb-4">
              Making Global Health Data Accessible
            </h1>
            <p className="text-xl text-muted-foreground">
              Empowering researchers, journalists, and educators with trusted
              WHO vaccination and disease data
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Target className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Our Purpose</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                <p className="mb-4">
                  In an era of health misinformation, access to verified,
                  comprehensive vaccination data is critical. Our platform
                  bridges the gap between complex WHO datasets and the people
                  who need them.
                </p>
                <p>
                  We're committed to combating vaccine hesitancy and supporting
                  evidence-based decision-making by making global health data
                  transparent, accessible, and actionable.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-secondary/10 rounded-lg">
                    <Shield className="h-6 w-6 text-secondary" />
                  </div>
                  <CardTitle>Social Impact</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                <p className="mb-4">
                  By democratizing access to WHO health data, we address
                  multiple social challenges:
                </p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Combat misinformation with verified data</li>
                  <li>Support public health policy development</li>
                  <li>Enable educational research and learning</li>
                  <li>Promote global health awareness</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* How to Use */}
        <section>
          <div className="text-center mb-8">
            <Badge className="mb-4">User Guide</Badge>
            <h2 className="text-3xl font-bold mb-4">How to Use This Site</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Navigate our platform with ease using this simple guide
            </p>
          </div>

          <Card>
            <CardContent className="p-8">
              <div className="grid md:grid-cols-3 gap-8">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold">
                      1
                    </div>
                    <h3 className="font-semibold text-lg">Explore the Data</h3>
                  </div>
                  <p className="text-muted-foreground">
                    Browse key statistics on the homepage to understand the
                    scope of our dataset
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold">
                      2
                    </div>
                    <h3 className="font-semibold text-lg">Filter & Search</h3>
                  </div>
                  <p className="text-muted-foreground">
                    Use filters to find specific diseases, time periods, or
                    vaccination trends
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold">
                      3
                    </div>
                    <h3 className="font-semibold text-lg">Export Data</h3>
                  </div>
                  <p className="text-muted-foreground">
                    Download datasets for your research, reports, or educational
                    purposes
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* User Personas */}
        <section>
          <div className="text-center mb-8">
            <Badge className="mb-4">User Research</Badge>
            <h2 className="text-3xl font-bold mb-4">Who We Serve</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our platform is designed with these key user groups in mind
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {personas.map((persona, index) => (
              <PersonaCard key={index} {...persona} />
            ))}
          </div>
        </section>

        {/* Team Members */}
        <section>
          <div className="text-center mb-8">
            <Badge className="mb-4">The Team</Badge>
            <h2 className="text-3xl font-bold mb-4">Meet Our Team</h2>
            <p className="text-muted-foreground">
              The dedicated students behind this project
            </p>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-accent rounded-lg">
                  <Users className="h-6 w-6 text-accent-foreground" />
                </div>
                <CardTitle>Project Team Members</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-4">
                {teamMembers.map((member, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                        {member.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Student #{member.studentNumber}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
};

export default About;
