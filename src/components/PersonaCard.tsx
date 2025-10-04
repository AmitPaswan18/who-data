import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface PersonaCardProps {
  name: string;
  age: number;
  role: string;
  avatar: string;
  initials: string;
  goals: string[];
  needs: string[];
  frustrations: string[];
}

export const PersonaCard = ({
  name,
  age,
  role,
  avatar,
  initials,
  goals,
  needs,
  frustrations,
}: PersonaCardProps) => {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={avatar} alt={name} />
            <AvatarFallback className="bg-primary text-primary-foreground text-xl">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-xl">{name}</CardTitle>
            <p className="text-muted-foreground">
              {role}, {age}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
            <Badge variant="default">Goals</Badge>
          </h4>
          <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
            {goals.map((goal, i) => (
              <li key={i}>{goal}</li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
            <Badge variant="secondary">Needs</Badge>
          </h4>
          <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
            {needs.map((need, i) => (
              <li key={i}>{need}</li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
            <Badge variant="outline">Frustrations</Badge>
          </h4>
          <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
            {frustrations.map((frustration, i) => (
              <li key={i}>{frustration}</li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
