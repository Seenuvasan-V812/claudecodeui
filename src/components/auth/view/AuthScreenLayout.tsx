import React, { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { MessageSquare } from 'lucide-react';
import { IS_PLATFORM } from '../../../constants/config';

type AuthScreenLayoutProps = {
  title: string;
  description: string;
  children: ReactNode;
  footerText: string;
  logo?: ReactNode;
};

const features = [
  {
    title: 'Vibe Coding Workspace',
    description: 'Describe requirements in plain English, let the agent write code, and iterate collaboratively in a visually rich browser environment.',
    tag: 'Flow State',
  },
  {
    title: 'Spec-Driven Development',
    description: 'Maintain strict quality control. Formulate detailed specifications and watch agents build, verify, and document implementations automatically.',
    tag: 'High Fidelity',
  },
  {
    title: 'Local-First Autonomy',
    description: 'Runs completely on your local machine, keeping your workspaces, source code, and credentials fully secure.',
    tag: 'Security First',
  },
  {
    title: 'Interactive Tool Approvals',
    description: 'Keep absolute command. Review agent tool requests and approve actions with a single click.',
    tag: 'Full Control',
  },
  {
    title: 'Multi-Model Freedom',
    description: 'Swap dynamically between Claude, Gemini, OpenAI Codex, and OpenCode providers in one workspace.',
    tag: 'Power & Flexibility',
  },
];

export default function AuthScreenLayout({
  title,
  description,
  children,
  footerText,
  logo,
}: AuthScreenLayoutProps) {
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setIndex((previous) => (previous + 1) % features.length);
        setFade(true);
      }, 500);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[55fr_45fr] h-screen w-screen overflow-hidden bg-background dark:bg-zinc-950 font-sans">
      {/* Left Showcase Panel (55%) */}
      <div className="hidden lg:flex relative flex-col justify-between p-16 bg-zinc-950 text-white overflow-hidden select-none border-r border-zinc-900">
        {/* Subtle dynamic grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_at_center,white,transparent_80%)] pointer-events-none" />
        
        {/* Glowing Orbs */}
        <div className="absolute top-1/4 left-1/4 w-[380px] h-[380px] rounded-full bg-indigo-500/10 blur-[120px] animate-[pulse_8s_infinite] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] rounded-full bg-violet-600/10 blur-[130px] animate-[pulse_10s_infinite] pointer-events-none" />

        {/* Brand Header */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-500 shadow-md">
            <MessageSquare className="h-5.5 w-5.5 text-white" />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
              CloudCLI-UI
            </span>
            <span className="ml-2.5 text-[10px] font-semibold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-full">
              Self-Hosted
            </span>
          </div>
        </div>

        {/* Dynamic Carousel Feature Details */}
        <div className="relative z-10 my-auto max-w-2xl pl-4">
          <div className="space-y-6">
            <div 
              className={`transition-all duration-500 ease-in-out transform ${
                fade ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
              }`}
            >
              <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 px-3.5 py-1 text-xs font-semibold tracking-wide text-indigo-400 uppercase">
                {features[index].tag}
              </span>
              <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl leading-tight">
                {features[index].title}
              </h2>
              <p className="mt-4 text-lg text-zinc-400 leading-relaxed font-medium">
                {features[index].description}
              </p>
            </div>

            {/* Slide Indicators */}
            <div className="flex gap-2.5 pt-6">
              {features.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setFade(false);
                    setTimeout(() => {
                      setIndex(i);
                      setFade(true);
                    }, 300);
                  }}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === index ? 'w-8 bg-indigo-500' : 'w-2 bg-zinc-800 hover:bg-zinc-700'
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 text-xs font-medium text-zinc-500 flex justify-between items-center">
          <span>© {new Date().getFullYear()} CloudCLI UI. Open source development workspace.</span>
          <span>Local Developer Agency Platform</span>
        </div>
      </div>

      {/* Right Form Panel (45%) */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12 bg-background dark:bg-zinc-950 overflow-y-auto min-h-screen">
        <div className="w-full max-w-sm space-y-8">
          
          {/* Logo only on mobile */}
          <div className="lg:hidden mb-6 flex justify-center">
            {logo ?? (
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-500 shadow-md">
                <MessageSquare className="h-6 w-6 text-white" />
              </div>
            )}
          </div>

          {/* Form Header */}
          <div className="text-center lg:text-left">
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground">{title}</h1>
            <p className="mt-2.5 text-sm text-muted-foreground leading-normal font-medium">{description}</p>
          </div>

          {/* Core Auth Glassmorphic Card */}
          <div className="space-y-6 rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 bg-white/80 dark:bg-zinc-900/40 backdrop-blur-xl p-6 sm:p-8 shadow-xl transition-all duration-300">
            {children}
          </div>

          {/* Footer Text / API limitations info */}
          <div className="text-center text-xs text-muted-foreground font-medium px-4">
            {footerText}
          </div>
          
          {/* GitHub Open Source Attribution */}
          {!IS_PLATFORM && (
            <div className="flex items-center justify-center gap-1.5 pt-2">
              <svg className="h-3.5 w-3.5 text-muted-foreground/40" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              <a
                href="https://github.com/siteboon/claudecodeui"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-muted-foreground/40 hover:text-muted-foreground transition-colors font-semibold"
              >
                CloudCLI is open source
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
