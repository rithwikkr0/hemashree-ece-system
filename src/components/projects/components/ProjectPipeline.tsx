import React, { useState, useEffect } from 'react';
import { PipelineStep } from '../../../types';
import { ArrowRight, Zap, CheckCircle2 } from 'lucide-react';
import clsx from 'clsx';

interface ProjectPipelineProps {
  pipeline: PipelineStep[];
  activeStepIndex?: number;
  onStepClick?: (index: number) => void;
}

export const ProjectPipeline: React.FC<ProjectPipelineProps> = ({
  pipeline,
  activeStepIndex = 0,
  onStepClick,
}) => {
  const [currentStep, setCurrentStep] = useState(activeStepIndex);

  // Auto cycling pulse packet along the pipeline
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % pipeline.length);
    }, 2400);
    return () => clearInterval(timer);
  }, [pipeline.length]);

  return (
    <div className="absolute top-16 right-4 sm:right-6 z-30 pointer-events-auto select-none max-w-sm hidden md:block">
      <div className="p-3 bg-ece-obsidian/90 backdrop-blur-md border border-ece-cyan/30 rounded tech-corner-cut-sm shadow-[0_0_20px_rgba(0,0,0,0.8)] space-y-2 font-mono text-xs">
        <div className="flex items-center justify-between border-b border-white/10 pb-1 text-[10px]">
          <span className="text-ece-cyan font-bold flex items-center gap-1.5">
            <Zap className="w-3 h-3 text-ece-cyan animate-pulse" />
            ENGINEERING PIPELINE
          </span>
          <span className="text-slate-400">
            STEP {String(currentStep + 1).padStart(2, '0')} / {String(pipeline.length).padStart(2, '0')}
          </span>
        </div>

        {/* Steps List */}
        <div className="space-y-1">
          {pipeline.map((step, idx) => {
            const isActive = currentStep === idx;
            return (
              <div
                key={step.stepNumber}
                onClick={() => {
                  setCurrentStep(idx);
                  if (onStepClick) onStepClick(idx);
                }}
                className={clsx(
                  'flex items-center justify-between p-1.5 rounded border transition-all duration-200 cursor-pointer text-[10px]',
                  isActive
                    ? 'bg-ece-cyan/20 border-ece-cyan text-white shadow-[0_0_10px_rgba(0,240,255,0.2)]'
                    : 'bg-black/40 border-white/5 text-slate-400 hover:text-slate-200 hover:bg-white/5'
                )}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className={clsx('font-bold', isActive ? 'text-ece-cyan' : 'text-slate-600')}>
                    {String(step.stepNumber).padStart(2, '0')}
                  </span>
                  <span className="font-semibold truncate">{step.label}</span>
                </div>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-ece-cyan animate-ping flex-shrink-0" />
                )}
              </div>
            );
          })}
        </div>

        {/* Active Step Description */}
        <div className="p-2 bg-black/60 rounded border border-white/5 text-[9px] text-slate-300 font-sans leading-tight">
          <strong className="text-ece-cyan font-mono block uppercase mb-0.5">
            {pipeline[currentStep]?.sublabel || pipeline[currentStep]?.label}
          </strong>
          {pipeline[currentStep]?.description}
        </div>
      </div>
    </div>
  );
};
