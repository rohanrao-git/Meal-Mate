import { ReactNode } from "react";

interface Props {
  title: string;
  subtitle?: string;
  right?: ReactNode;
}

const ScreenHeader = ({ title, subtitle, right }: Props) => (
  <header className="px-5 pt-8 pb-4 flex items-start justify-between gap-3">
    <div>
      <h1 className="text-2xl font-bold text-foreground">{title}</h1>
      {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
    </div>
    {right}
  </header>
);

export default ScreenHeader;
