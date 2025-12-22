import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { MapPin, Users, Calendar } from "lucide-react";

interface ProjectCardProps {
  title: string;
  description: string;
  category: string;
  location: string;
  fundingGoal: number;
  currentFunding: number;
  backers: number;
  daysLeft: number;
  score: "A" | "B" | "C";
  image: string;
}

export const ProjectCard = ({
  title,
  description,
  category,
  location,
  fundingGoal,
  currentFunding,
  backers,
  daysLeft,
  score,
  image,
}: ProjectCardProps) => {
  const progress = (currentFunding / fundingGoal) * 100;
  
  const scoreColors = {
    A: "bg-success text-white",
    B: "bg-warning text-white",
    C: "bg-info text-white",
  };

  return (
    <Card className="group hover:shadow-glow transition-all duration-300 hover:-translate-y-1 overflow-hidden">
      <div className="relative h-48 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute top-4 left-4 flex gap-2">
          <Badge className="bg-primary text-primary-foreground">
            {category}
          </Badge>
          <Badge className={scoreColors[score]}>
            Score {score}
          </Badge>
        </div>
      </div>

      <CardHeader>
        <h3 className="text-xl font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span>{location}</span>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-semibold text-foreground">
              {currentFunding.toLocaleString()} FCFA
            </span>
            <span className="text-muted-foreground">
              sur {fundingGoal.toLocaleString()} FCFA
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{backers} contributeurs</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{daysLeft} jours restants</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
