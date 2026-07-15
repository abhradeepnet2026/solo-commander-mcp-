import { Header } from "@/components/commander/header";
import { Hero } from "@/components/commander/hero";
import { StatsBar } from "@/components/commander/stats-bar";
import { ModulesGrid } from "@/components/commander/modules-grid";
import { Architecture } from "@/components/commander/architecture";
import { Workflow } from "@/components/commander/workflow";
import { TerminalDemo } from "@/components/commander/terminal-demo";
import { Installation } from "@/components/commander/installation";
import { ConfigSecurity } from "@/components/commander/config-security";
import { Comparison } from "@/components/commander/comparison";
import { Footer } from "@/components/commander/footer";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <StatsBar />
        <ModulesGrid />
        <Architecture />
        <Workflow />
        <TerminalDemo />
        <Installation />
        <ConfigSecurity />
        <Comparison />
      </main>
      <Footer />
    </>
  );
}
