'use client';

import { motion } from 'framer-motion';
import { profile } from '@/data/profile';

const socialLinks = [
    { name: 'GITHUB', url: profile.links.github, icon: (<svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>), color: 'text-gray-300' },
    { name: 'LINKEDIN', url: profile.links.linkedin, icon: (<svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>), color: 'text-[#0a66c2]' },
    { name: 'MEDIUM', url: profile.links.medium, icon: (<svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z"/></svg>), color: 'text-gray-200' },
    { name: 'X / TWITTER', url: profile.links.twitter, icon: (<svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>), color: 'text-gray-200' },
    { name: 'REDDIT', url: profile.links.reddit, icon: (<svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 01-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 01.042.52c0 2.694-3.13 4.884-7.003 4.884-3.874 0-7.004-2.19-7.004-4.884 0-.18.015-.36.041-.521-.576-.28-1.01-.898-1.01-1.613 0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 01.14-.197.35.35 0 01.238-.042l2.906.617a1.214 1.214 0 011.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 00-.231.094.33.33 0 000 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 000-.462.342.342 0 00-.465 0c-.533.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 00-.232-.095z"/></svg>), color: 'text-[#ff4500]' },
    { name: 'QUORA', url: profile.links.quora, icon: (<svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M12.738 17.625c-.746-1.547-1.656-3.08-3.074-3.08-.534 0-.895.199-.895.199l-.438-.93s.706-.659 1.93-.659c1.73 0 2.811.81 3.63 1.996C14.838 12.876 15.5 9.896 15.5 6.875 15.5 2.41 13.43 0 9.988 0 6.555 0 4.5 2.41 4.5 6.875S6.555 13.75 9.988 13.75c.355 0 .691-.027 1.008-.078.334.649.738 1.262 1.242 1.781-.684.14-1.438.422-2.25.422C5.34 15.875 1.5 12.725 1.5 6.875 1.5 1.156 5.34-2 9.988-2c4.652 0 8.512 3.156 8.512 8.875 0 4.308-1.543 7.592-3.762 10.75z"/></svg>), color: 'text-[#b92b27]' },
];

export default function SocialLinks() {
    return (
        <section className="relative py-14 sm:py-20 px-6 sm:px-10 lg:px-20">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-px bg-cyber-cyan/30" />
                    <span className="font-mono text-xs tracking-[0.4em] text-gray-600 uppercase">
                        connect
                    </span>
                </div>
                <h3 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-gray-300 mb-4">
                    FIND ME ONLINE
                </h3>
                <p className="font-body text-base sm:text-lg text-gray-500 mb-10 max-w-2xl leading-relaxed">
                    Active on multiple platforms - follow for security research, CTF writeups, and open-source projects.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                    {socialLinks.map((link, i) => (
                        <motion.a
                            key={link.name}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.08, duration: 0.5 }}
                            className="magnetic group border border-gray-800/30 p-6 text-center hover:border-cyber-green/20 hover:bg-cyber-green/[0.02] transition-all duration-500 flex flex-col items-center"
                        >
                            <span className={`block mb-3 group-hover:scale-110 transform transition-transform ${link.color}`}>
                                {link.icon}
                            </span>
                            <span className="font-mono text-xs tracking-widest text-gray-600 group-hover:text-cyber-green transition-colors">
                                {link.name}
                            </span>
                        </motion.a>
                    ))}
                </div>
            </div>
        </section>
    );
}
