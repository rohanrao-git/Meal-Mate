import { ReactNode } from "react";
import BottomNav from "./BottomNav";

const AppShell = ({ children }: { children: ReactNode }) => (
  <div className="min-h-screen bg-secondary/40">
    <div className="app-shell flex flex-col">
      <main className="flex-1 pb-4">{children}</main>
      <BottomNav />
    </div>
  </div>
);

export default AppShell;
