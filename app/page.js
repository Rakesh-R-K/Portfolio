'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { ActivityProvider } from '@/components/ActivityLog';
import { GhostModeProvider } from '@/components/GhostMode';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import ProjectsSection from '@/components/ProjectsSection';
import SkillsSection from '@/components/SkillsSection';
import TypingChallenge from '@/components/TypingChallenge';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';
import ScrollProgress from '@/components/ScrollProgress';
import BootSequence from '@/components/BootSequence';

import Writeups from '@/components/Writeups';
import SocialLinks from '@/components/SocialLinks';
import Timeline from '@/components/Timeline';



import SectionDivider from '@/components/SectionDivider';
import StatsCounter from '@/components/StatsCounter';
import ExperienceEducation from '@/components/ExperienceEducation';
import AvailabilityBanner from '@/components/AvailabilityBanner';
import CTFParticipations from '@/components/CTFParticipations';


const MatrixRain = dynamic(() => import('@/components/MatrixRain'), { ssr: false });


const ActivityLog = dynamic(() => import('@/components/ActivityLog'), { ssr: false });
const KonamiCode = dynamic(() => import('@/components/KonamiCode'), { ssr: false });
const GhostModeToggle = dynamic(() => import('@/components/GhostMode'), { ssr: false });
const VisitorCounter = dynamic(() => import('@/components/VisitorCounter'), { ssr: false });
const AmbientSound = dynamic(() => import('@/components/AmbientSound'), { ssr: false });
const PageTransition = dynamic(() => import('@/components/PageTransition'), { ssr: false });
const BackToTop = dynamic(() => import('@/components/BackToTop'), { ssr: false });
const CommandPalette = dynamic(() => import('@/components/CommandPalette'), { ssr: false });
const ResumeModal = dynamic(() => import('@/components/ResumeModal'), { ssr: false });

export default function Home() {
    const [booted, setBooted] = useState(false);
    const [matrixActive, setMatrixActive] = useState(false);
    const [mockIP, setMockIP] = useState('...');
    const [realIP, setRealIP] = useState('0.0.0.0');
    const [knockUnlocked, setKnockUnlocked] = useState(false);
    const [dissolved, setDissolved] = useState(false);
    const ipIntervalRef = useRef(null);

    useEffect(() => {
        fetch('https://api.ipify.org?format=json')
            .then(r => r.json())
            .then(d => { setRealIP(d.ip); setMockIP(d.ip); })
            .catch(() => { setRealIP('0.0.0.0'); setMockIP('0.0.0.0'); });
    }, []);

    const handleHack = useCallback(() => {
        setMatrixActive(true);
    }, []);

    const handleMatrixComplete = useCallback(() => {
        setMatrixActive(false);
    }, []);

    const handleGhostnet = useCallback(() => {
        setTimeout(() => {
            const el = document.getElementById('projects');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 1500);
    }, []);

    const handleKnockSequence = useCallback((success) => {
        if (success) setKnockUnlocked(true);
    }, []);

    const handleHoverIP = useCallback((isHovering) => {
        if (isHovering) {
            const randomIP = () =>
                `${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`;
            ipIntervalRef.current = setInterval(() => setMockIP(randomIP()), 80);
        } else {
            clearInterval(ipIntervalRef.current);
            setMockIP(realIP);
        }
    }, [realIP]);

    const handleDissolve = useCallback(() => {
        setDissolved(true);
        setTimeout(() => {
            setDissolved(false);
            const el = document.createElement('div');
            el.className = 'fixed inset-0 z-[20000] bg-cyber-black flex items-center justify-center font-mono text-cyber-green text-sm tracking-wider';
            el.innerHTML = '[SYSTEM] Rebooting... kernel recovered.<br><br>Don\'t do that again.';
            el.style.textAlign = 'center';
            document.body.appendChild(el);
            setTimeout(() => el.remove(), 2000);
        }, 5000);
    }, []);

    useEffect(() => {
        return () => clearInterval(ipIntervalRef.current);
    }, []);

    return (
        <GhostModeProvider>
            <ActivityProvider>
                {!booted && <BootSequence onComplete={() => setBooted(true)} />}
                <MatrixRain active={matrixActive} onComplete={handleMatrixComplete} />

                <ScrollProgress />
                <KonamiCode />
                <ActivityLog />
                <GhostModeToggle />
                <VisitorCounter />
                <AmbientSound />
                <BackToTop />
                <CommandPalette />

                {/* Dissolve overlay */}
                {dissolved && (
                    <div className="fixed inset-0 z-[19999] pointer-events-none dissolve-effect">
                        <style jsx>{`
              .dissolve-effect {
                animation: dissolve 3s ease-in forwards;
              }
              @keyframes dissolve {
                0% { background: transparent; backdrop-filter: none; }
                20% { background: rgba(255,45,85,0.05); backdrop-filter: blur(1px); }
                40% { background: rgba(255,45,85,0.1); backdrop-filter: blur(4px) saturate(0.5); }
                60% { background: rgba(255,45,85,0.15); backdrop-filter: blur(8px) saturate(0); }
                80% { background: rgba(5,5,5,0.8); backdrop-filter: blur(20px) saturate(0) brightness(0.3); }
                100% { background: #050505; backdrop-filter: blur(30px) saturate(0) brightness(0); }
              }
            `}</style>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="font-mono text-cyber-magenta text-lg tracking-widest animate-pulse" style={{ animationDelay: '2s' }}>
                                KERNEL PANIC
                            </div>
                        </div>
                    </div>
                )}

                <Navbar mockIP={mockIP} />

                <PageTransition>
                    <main className="pt-16">
                        <HeroSection
                            onHack={handleHack}
                            onGhostnet={handleGhostnet}
                            onKnockSequence={handleKnockSequence}
                            onDissolve={handleDissolve}
                        />

                        <SectionDivider />

                        <AboutSection />

                        {/* Verified metrics */}
                        <section className="relative pb-16 px-6 sm:px-10 lg:px-20">
                            <div className="max-w-6xl mx-auto">
                                <StatsCounter />
                            </div>
                        </section>

                        <SectionDivider />

                        <Timeline />

                        <SectionDivider />

                        <ProjectsSection onHoverIP={handleHoverIP} />



                        <SectionDivider />

                        <CTFParticipations />

                        <Writeups />

                        <SectionDivider />

                        <SkillsSection />

                        <SectionDivider />

                        <ExperienceEducation />

                        <TypingChallenge />

                        <SocialLinks />

                        <AvailabilityBanner />

                        <ContactSection />
                    </main>
                </PageTransition>

                <Footer />
                <ResumeModal />
            </ActivityProvider>
        </GhostModeProvider>
    );
}
