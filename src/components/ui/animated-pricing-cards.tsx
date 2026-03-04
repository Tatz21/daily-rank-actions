import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const Wave = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 1440 320"
    className="w-full"
  >
    <path
      fill="hsl(var(--primary) / 0.15)"
      d="M0,224L48,218.7C96,213,192,203,288,186.7C384,171,480,149,576,149.3C672,149,768,171,864,186.7C960,203,1056,213,1152,208C1248,203,1344,181,1392,170.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
    />
  </svg>
);

const Cross = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="hsl(var(--primary) / 0.2)"
    strokeWidth="1"
  >
    <line x1="12" y1="2" x2="12" y2="22" />
    <line x1="2" y1="12" x2="22" y2="12" />
  </svg>
);

export const PricingWrapper: React.FC<{
  children: React.ReactNode;
  type?: "waves" | "crosses";
  contactHref: string;
  className?: string;
}> = ({ children, contactHref, className, type = "waves" }) => (
  <div
    className={cn(
      "relative overflow-hidden rounded-2xl border border-border bg-card",
      className
    )}
  >
    <div className="relative z-10">
      {children}
      <div className="p-6 pt-0">
        <div className="text-center">
          <Link
            to={contactHref}
            className="text-sm text-primary hover:underline transition-colors"
          >
            contact
          </Link>
        </div>
      </div>
    </div>
    {type === "waves" && (
      <>
        <div className="absolute bottom-0 left-0 right-0 opacity-60 animate-[waves_8s_ease-in-out_infinite_alternate]">
          <Wave />
        </div>
        <div className="absolute bottom-0 left-0 right-0 opacity-30 animate-[waves_12s_ease-in-out_infinite_alternate-reverse]">
          <Wave />
        </div>
      </>
    )}
    {type === "crosses" && (
      <>
        <div className="absolute top-4 right-4 opacity-20">
          <Cross />
        </div>
        <div className="absolute bottom-4 left-4 opacity-20">
          <Cross />
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10">
          <Cross />
        </div>
      </>
    )}
  </div>
);

export const Heading: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => (
  <h3 className={cn("text-lg font-semibold text-foreground", className)}>
    {children}
  </h3>
);

export const Price: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => (
  <div
    className={cn(
      "mt-4 flex items-baseline gap-1 text-foreground",
      className
    )}
  >
    {children}
  </div>
);

export const Paragraph: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => (
  <p className={cn("mt-3 text-sm text-muted-foreground leading-relaxed", className)}>
    {children}
  </p>
);
