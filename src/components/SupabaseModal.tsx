import React, { useState } from 'react';
import { X, Database, Copy, Check, ExternalLink, ShieldCheck } from 'lucide-react';
import { SUPABASE_SETUP_SQL, isSupabaseConfigured } from '../services/supabase';

interface SupabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupabaseModal: React.FC<SupabaseModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(SUPABASE_SETUP_SQL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-modal border border-giftly-border overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-giftly-lavender-light to-giftly-pink-light border-b border-giftly-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white shadow-soft flex items-center justify-center text-giftly-purple">
              <Database className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-extrabold text-lg text-giftly-dark">
                  Supabase & Database Architecture
                </h3>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isSupabaseConfigured
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {isSupabaseConfigured ? 'Supabase Connected' : 'Local Persistence Mode'}
                </span>
              </div>
              <p className="text-xs text-giftly-muted">
                PostgreSQL schema, authentication policies, and setup instructions.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white hover:bg-slate-100 flex items-center justify-center text-giftly-dark transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-giftly-dark leading-relaxed">
          {/* Status Alert */}
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-emerald-900">Seamless Dual-Mode Architecture</p>
              <p className="text-emerald-800 text-[11px] mt-0.5">
                GIFTLY includes a complete fallback engine. When Supabase keys are not present in the environment, the app automatically runs in <strong>Local Storage Persistence Mode</strong> with pre-authenticated demo access. When keys are supplied in <code className="bg-emerald-100 px-1 py-0.5 rounded">.env</code>, it connects to live Supabase PostgreSQL.
              </p>
            </div>
          </div>

          {/* Quick Setup Steps */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-giftly-dark mb-2">
              How to Connect to your Supabase Project:
            </h4>
            <ol className="list-decimal list-inside space-y-2 text-giftly-muted text-xs">
              <li>Create a free project at <a href="https://supabase.com" target="_blank" rel="noreferrer" className="text-giftly-purple font-semibold inline-flex items-center gap-0.5">supabase.com <ExternalLink className="w-3 h-3 inline" /></a>.</li>
              <li>Navigate to the <strong>SQL Editor</strong> in the Supabase Dashboard.</li>
              <li>Copy and paste the schema below and click <strong>Run</strong>.</li>
              <li>Add your project credentials to your <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">.env</code> file:
                <pre className="mt-2 p-3 bg-slate-900 text-slate-100 rounded-xl font-mono text-[11px] overflow-x-auto">
{`VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key`}
                </pre>
              </li>
            </ol>
          </div>

          {/* SQL Schema */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-bold text-xs uppercase tracking-wider text-giftly-dark">
                PostgreSQL SQL Schema (Tables & RLS)
              </h4>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-giftly-purple text-white text-xs font-bold hover:bg-giftly-purple-hover transition-colors shadow-sm"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied SQL!' : 'Copy SQL Script'}</span>
              </button>
            </div>
            <pre className="p-4 bg-slate-900 text-slate-200 rounded-2xl font-mono text-[11px] overflow-x-auto max-h-56 leading-relaxed border border-slate-800">
              {SUPABASE_SETUP_SQL}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-giftly-border flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-full bg-giftly-dark text-white font-bold text-xs hover:bg-slate-800 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
