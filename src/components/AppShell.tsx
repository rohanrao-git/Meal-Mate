import { ReactNode } from "react";
import BottomNav from "./BottomNav";

const AppShell = ({ children }: { children: ReactNode }) => (
  <div className="min-h-screen" style={{ background: "hsl(33 55% 95%)" }}>
    <div className="app-shell flex flex-col">
      <main className="flex-1 pb-2">{children}</main>
      <BottomNav />
    </div>
  </div>
);

export default AppShell;
