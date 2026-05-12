import { ReactNode } from "react";

interface Props {
  title: string;
  subtitle?: string;
  right?: ReactNode;
  eyebrow?: string;
}

const ScreenHeader = ({ title, subtitle, right, eyebrow }: Props) => (
  <header className="px-5 pt-10 pb-5 flex items-end justify-between gap-3 border-b-2 border-border mb-5">
    <div>
      {eyebrow && <p className="label-mono text-muted-foreground mb-1.5">{eyebrow}</p>}
      <h1 className="text-[34px] leading-[0.95] font-black">{title}</h1>
      {subtitle && <p className="text-sm text-muted-foreground mt-2 max-w-[260px]">{subtitle}</p>}
    </div>
    {right}
  </header>
);

export default ScreenHeader;
