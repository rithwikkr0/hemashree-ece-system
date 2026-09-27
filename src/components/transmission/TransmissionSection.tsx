import React from 'react';
import { SYSTEM_PROFILE } from '../../data/education';
import { ASSET_PATHS } from '../../config/assets';
import { 
  Mail, 
  Linkedin, 
  Github, 
  FileText, 
  ArrowRight,
  ExternalLink
} from 'lucide-react';

export const TransmissionSection: React.FC = () => {
  const mailtoSubject = encodeURIComponent('ECE Engineering Inquiry // Hemashree B M');
  const mailtoBody = encodeURIComponent(
    'Hello Hemashree,\n\nI reviewed your portfolio and would like to connect regarding:\n\n[Project / Internship / Opportunity Details]\n\nBest regards,\n[Your Name]'
  );
  const directMailtoUrl = `mailto:${SYSTEM_PROFILE.email}?subject=${mailtoSubject}&body=${mailtoBody}`;

  const CHANNELS = [
    {
      id: 'email',
      label: 'EMAIL',
      value: SYSTEM_PROFILE.email,
      description: 'Direct inquiry mailbox',
      href: directMailtoUrl,
      icon: Mail,
      isExternal: false,
      action: 'SEND EMAIL →'
    },
    {
      id: 'github',
      label: 'GITHUB',
      value: 'Hemashreebm',
      description: 'Repositories & project code',
      href: SYSTEM_PROFILE.github,
      icon: Github,
      isExternal: true,
      action: 'VIEW CODE →'
    },
    {
      id: 'linkedin',
      label: 'LINKEDIN',
      value: 'hemashree-b-m',
      description: 'Professional networking',
      href: SYSTEM_PROFILE.linkedin,
      icon: Linkedin,
      isExternal: true,
      action: 'CONNECT →'
    },
    {
      id: 'resume',
      label: 'RESUME',
      value: 'Hemashree_BM_Resume.pdf',
      description: 'Standardized technical CV',
      href: ASSET_PATHS.resume.pdfPath,
      icon: FileText,
      isExternal: true,
      action: 'VIEW PDF →'
    },
  ];

  return (
    <section id="transmission" className="scroll-mt-24 space-y-12">
      {/* Visual Anchor for both #transmission and #contact */}
      <div id="contact" />

      {/* Header */}
      <div className="space-y-3 max-w-2xl">
        <span className="font-mono text-xs text-ece-cyan tracking-widest uppercase">
          CONTACT // TRANSMISSION CHANNEL
        </span>
        <h2 className="font-tech text-4xl sm:text-5xl font-extrabold uppercase text-white">
          GET IN TOUCH
        </h2>
        <p className="font-sans text-base sm:text-lg text-slate-300 leading-relaxed">
          Open for B.Tech ECE engineering internships, embedded systems roles, and hardware-software research collaborations.
        </p>
      </div>

      {/* 4 Large Clean Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {CHANNELS.map((channel) => {
          const Icon = channel.icon;
          return (
            <a
              key={channel.id}
              href={channel.href}
              target={channel.isExternal ? '_blank' : undefined}
              rel={channel.isExternal ? 'noopener noreferrer' : undefined}
              className="p-6 sm:p-7 bg-black/40 hover:bg-black/70 border border-white/10 hover:border-white/30 rounded-2xl transition-all duration-300 flex flex-col justify-between space-y-6 group"
            >
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white group-hover:bg-white/15 transition-colors">
                  <Icon className="w-5 h-5 text-ece-cyan" />
                </div>

                <div className="space-y-1">
                  <span className="font-mono text-xs text-slate-500 uppercase">
                    {channel.label}
                  </span>
                  <h3 className="font-tech text-lg font-bold text-white uppercase break-all">
                    {channel.value}
                  </h3>
                  <p className="font-sans text-xs text-slate-400">
                    {channel.description}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs font-mono text-ece-cyan group-hover:text-cyan-300">
                <span>{channel.action}</span>
                {channel.isExternal ? (
                  <ExternalLink className="w-3.5 h-3.5" />
                ) : (
                  <ArrowRight className="w-3.5 h-3.5" />
                )}
              </div>
            </a>
          );
        })}
      </div>

      {/* Clean Footer Cadence */}
      <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-500">
        <div>
          HEMASHREE B M • B.TECH ECE • ALLIANCE UNIVERSITY
        </div>
        <div>
          BENGALURU, KARNATAKA, INDIA
        </div>
      </div>
    </section>
  );
};

export default TransmissionSection;
