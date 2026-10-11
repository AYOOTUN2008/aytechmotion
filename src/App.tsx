// @ts-nocheck
import React, { useState } from 'react';
import {
  Video,
  Image as ImageIcon,
  Play,
  Sparkles,
  Upload,
  Camera,
  Film,
  Type,
  LayoutDashboard,
  Settings,
  UserSquare2,
  ChevronDown,
  Activity,
  Layers,
  Hexagon,
  Maximize2,
} from 'lucide-react';

const App = () => {
  const [prompt, setPrompt] = useState(
    "Scene-by-scene video launch featuring text overlays, visual transitions, and key feature highlights for AY TECH's new AI product."
  );

  // Camera & Motion States
  const [controls, setControls] = useState({
    dolly: 50,
    pan: 50,
    tilt: 50,
    speed: 1.0,
    path: 'Linear',
  });

  // Timeline State
  const [timelineEvents, setTimelineEvents] = useState([
    {
      id: 1,
      time: 2,
      duration: 4,
      track: 'Text Overlays',
      desc: 'Title reveal: AY TECH Vision',
    },
    {
      id: 2,
      time: 6,
      duration: 3,
      track: 'Camera Path',
      desc: 'Slow cinematic push-in',
    },
    {
      id: 3,
      time: 10,
      duration: 5,
      track: 'Motion Transfer',
      desc: 'Subject gesturing to holograms',
    },
  ]);

  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleSuggestDirection = async () => {
    setIsAnalyzing(true);
    try {
      const payload = {
        contents: [
          {
            parts: [
              {
                text: `Act as an expert AI cinematic director. Analyze this video scene prompt for a 20-second video: "${prompt}". 
            Suggest optimal cinematic camera settings and 3-4 timeline transition points.
            
            Return ONLY a valid JSON object with this exact schema (no markdown, no backticks):
            {
              "camera": {
                "dolly": <number 0-100, 50 is neutral>,
                "pan": <number 0-100, 50 is neutral>,
                "tilt": <number 0-100, 50 is neutral>,
                "speed": <number between 0.1 and 3.0>,
                "path": <string: "Linear", "Curved", or "Chaotic">
              },
              "timeline": [
                { 
                  "time": <number start second, e.g., 2>, 
                  "duration": <number duration in seconds, e.g., 3>,
                  "track": <string, exactly one of: "Motion Transfer", "Camera Path", "Text Overlays">, 
                  "desc": <string description of event> 
                }
              ]
            }`,
              },
            ],
          },
        ],
        generationConfig: {
          responseMimeType: 'application/json',
        },
      };

      const apiKey = ''; // Canvas handles API key injection automatically
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
        const jsonText = data.candidates[0].content.parts[0].text;
        const result = JSON.parse(jsonText);

        if (result.camera) {
          setControls(result.camera);
        }
        if (result.timeline) {
          const newEvents = result.timeline.map((event, index) => ({
            ...event,
            id: Date.now() + index,
          }));
          setTimelineEvents(newEvents);
        }
      }
    } catch (error) {
      console.error('Failed to generate AI suggestions:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="h-screen w-full flex flex-col bg-[#07070B] text-slate-300 font-sans overflow-hidden selection:bg-purple-500/30">
      {/* Top Navigation - Glassmorphism & Branding */}
      <header className="h-16 border-b border-white/10 bg-[#0A0A0F]/80 backdrop-blur-xl flex items-center justify-between px-6 z-20 shrink-0 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-transparent to-blue-600/10 pointer-events-none" />

        <div className="flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center shadow-[0_0_20px_rgba(147,51,234,0.4)] border border-white/20">
            <Hexagon size={22} className="text-white fill-white/20" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 tracking-wider text-lg leading-tight">
              AY TECH
            </span>
            <span className="text-[10px] font-medium text-purple-400 uppercase tracking-[0.2em] leading-tight">
              Motion Studio
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-white/5 hover:bg-white/10 transition-all cursor-pointer border border-white/10 px-4 py-2 rounded-lg backdrop-blur-md relative z-10">
          <Film size={16} className="text-purple-400" />
          <span className="text-sm font-semibold text-slate-200">
            Vision_Promo_v2.mp4
          </span>
          <span className="px-1.5 py-0.5 rounded text-[10px] bg-white/10 text-slate-400 font-mono">
            20s
          </span>
          <ChevronDown size={14} className="text-slate-500 ml-2" />
        </div>

        <div className="flex items-center gap-4 relative z-10">
          <button className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-all">
            <Settings size={18} />
          </button>
          <button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white px-6 py-2 rounded-lg text-sm font-bold transition-all shadow-[0_0_20px_rgba(147,51,234,0.3)] hover:shadow-[0_0_25px_rgba(147,51,234,0.5)] border border-white/10">
            Export Video
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-900/20 rounded-full blur-[120px] pointer-events-none" />

        <aside className="w-80 border-r border-white/10 bg-[#0D0D14]/80 backdrop-blur-lg flex flex-col overflow-y-auto custom-scrollbar shrink-0 z-10">
          <div className="p-5 border-b border-white/5">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-5 flex items-center gap-2">
              <Upload size={14} className="text-purple-400" /> Assets & Inputs
            </h2>

            <div className="space-y-5">
              {/* Character Input */}
              <div className="group cursor-pointer">
                <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wide">
                  Character Reference
                </label>
                <div className="h-28 rounded-xl border-2 border-dashed border-white/10 group-hover:border-purple-500/50 bg-white/5 group-hover:bg-purple-500/5 flex flex-col items-center justify-center transition-all duration-300">
                  <div className="w-10 h-10 rounded-full bg-white/5 group-hover:bg-purple-500/20 flex items-center justify-center mb-2 transition-all">
                    <UserSquare2
                      size={20}
                      className="text-slate-400 group-hover:text-purple-400 transition-colors"
                    />
                  </div>
                  <span className="text-xs font-medium text-slate-500 group-hover:text-purple-300 transition-colors">
                    Drag & drop image here
                  </span>
                </div>
              </div>

              {/* Motion Input */}
              <div className="group cursor-pointer">
                <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wide">
                  Motion Performance
                </label>
                <div className="h-28 rounded-xl border-2 border-dashed border-white/10 group-hover:border-blue-500/50 bg-white/5 group-hover:bg-blue-500/5 flex flex-col items-center justify-center transition-all duration-300">
                  <div className="w-10 h-10 rounded-full bg-white/5 group-hover:bg-blue-500/20 flex items-center justify-center mb-2 transition-all">
                    <Activity
                      size={20}
                      className="text-slate-400 group-hover:text-blue-400 transition-colors"
                    />
                  </div>
                  <span className="text-xs font-medium text-slate-500 group-hover:text-blue-300 transition-colors">
                    Drag & drop video here
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-5 flex-1 flex flex-col">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-5 flex items-center gap-2">
              <Type size={14} className="text-purple-400" /> Scene Direction
            </h2>

            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full flex-1 bg-black/40 border border-white/10 rounded-xl p-4 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30 resize-none mb-5 custom-scrollbar transition-all leading-relaxed shadow-inner"
              placeholder="Describe your scene, camera movements, and subject actions..."
            />

            <button
              onClick={handleSuggestDirection}
              disabled={isAnalyzing}
              className={`w-full py-3.5 rounded-xl flex items-center justify-center gap-2 text-sm font-bold transition-all duration-300 relative overflow-hidden ${
                isAnalyzing
                  ? 'bg-white/5 text-slate-500 cursor-not-allowed border border-white/5'
                  : 'bg-purple-600/10 text-purple-300 hover:text-white hover:bg-purple-600/20 border border-purple-500/30 hover:border-purple-400 hover:shadow-[0_0_20px_rgba(147,51,234,0.2)]'
              }`}
            >
              {isAnalyzing ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-500 border-t-transparent rounded-full animate-spin" />
                  Generating AI Script...
                </>
              ) : (
                <>
                  <Sparkles size={16} className="text-purple-400" />
                  Auto-Direct Scene
                </>
              )}
            </button>
          </div>
        </aside>

        <main className="flex-1 flex flex-col min-w-0 z-10">
          {/* Video Preview Area */}
          <div className="flex-1 p-6 flex flex-col min-h-0 items-center justify-center relative">
            <div className="w-full max-w-5xl aspect-video bg-[#050508] rounded-2xl border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.8)] overflow-hidden relative flex flex-col group">
              {/* Preview Header - Glassmorphic Overlay */}
              <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start z-10 bg-gradient-to-b from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1.5 bg-purple-600/20 text-purple-300 border border-purple-500/30 rounded-lg text-xs font-bold backdrop-blur-md flex items-center gap-1.5">
                    <Hexagon size={12} className="fill-purple-400/20" /> AY Veo
                    Engine
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button className="w-8 h-8 rounded bg-black/50 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white backdrop-blur-md transition-all">
                    <Maximize2 size={14} />
                  </button>
                </div>
              </div>

              {/* Mock Video Content */}
              <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-[#0a0a0f] to-[#12121a]">
                <div className="text-center">
                  <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-6 shadow-2xl">
                    <ImageIcon size={32} className="text-slate-600" />
                  </div>
                  <h3 className="text-slate-300 text-lg font-semibold tracking-wide mb-1">
                    Canvas Ready
                  </h3>
                  <p className="text-slate-500 text-sm">
                    Configure your AI motion parameters and render.
                  </p>
                </div>
              </div>

              {/* Player Controls */}
              <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/90 to-transparent flex items-end px-6 pb-4 gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button className="w-10 h-10 rounded-full bg-white hover:bg-slate-200 text-black flex items-center justify-center transition-transform hover:scale-105 shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                  <Play size={18} className="fill-current ml-1" />
                </button>
                <div className="flex-1 mb-3 group/scrubber cursor-pointer">
                  <div className="h-1.5 bg-white/20 rounded-full overflow-hidden relative">
                    <div className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"></div>
                  </div>
                </div>
                <span className="text-xs font-mono text-slate-300 mb-2 bg-black/50 px-2 py-1 rounded border border-white/10 backdrop-blur-md">
                  00:00 / 00:20
                </span>
              </div>
            </div>
          </div>

          <div className="h-[320px] bg-[#0A0A0F]/90 backdrop-blur-xl border-t border-white/10 flex flex-col shrink-0 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
            <div className="h-10 border-b border-white/5 flex items-center px-4 bg-black/20">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 w-56 shrink-0">
                <Layers size={14} className="text-blue-400" /> Timeline Tracks
              </span>
              <div className="flex-1 flex text-[10px] font-mono text-slate-500 relative h-full items-end pb-1">
                {/* Time markers */}
                {[0, 5, 10, 15, 20].map((time) => (
                  <div
                    key={time}
                    className="absolute h-3 border-l border-white/20"
                    style={{ left: `${(time / 20) * 100}%` }}
                  >
                    <span className="absolute -top-4 -left-3 text-slate-400">
                      0:{time.toString().padStart(2, '0')}
                    </span>
                  </div>
                ))}
                {/* Playhead marker */}
                <div
                  className="absolute top-0 bottom-0 w-px bg-red-500 z-20"
                  style={{ left: '33.33%' }}
                >
                  <div className="absolute -top-2 -left-1.5 w-3 h-3 bg-red-500 rounded-sm" />
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2 relative">
              {/* Grid Lines */}
              <div className="absolute inset-y-0 left-[236px] right-3 pointer-events-none z-0">
                {[0, 5, 10, 15, 20].map((time) => (
                  <div
                    key={`grid-${time}`}
                    className="absolute border-l border-white/5 h-full"
                    style={{ left: `${(time / 20) * 100}%` }}
                  />
                ))}
              </div>

              {['Motion Transfer', 'Camera Path', 'Text Overlays'].map(
                (trackName, idx) => (
                  <div
                    key={trackName}
                    className="flex items-center h-14 bg-white/[0.02] rounded-xl border border-white/5 group hover:bg-white/[0.04] transition-colors relative z-10"
                  >
                    <div className="w-56 shrink-0 px-4 flex items-center border-r border-white/5 h-full">
                      <span className="text-xs font-semibold text-slate-400 group-hover:text-slate-200 transition-colors">
                        {trackName}
                      </span>
                    </div>
                    <div className="flex-1 relative h-full mx-2">
                      {/* Render Events */}
                      {timelineEvents
                        .filter((e) => e.track === trackName)
                        .map((event) => (
                          <div
                            key={event.id}
                            className={`absolute top-2 bottom-2 rounded-lg ${
                              idx === 0
                                ? 'bg-gradient-to-r from-blue-600/80 to-cyan-500/80 border-blue-400/50'
                                : idx === 1
                                ? 'bg-gradient-to-r from-purple-600/80 to-pink-500/80 border-purple-400/50'
                                : 'bg-gradient-to-r from-emerald-600/80 to-teal-500/80 border-emerald-400/50'
                            } border px-3 py-1 flex flex-col justify-center overflow-hidden cursor-pointer hover:brightness-125 transition-all shadow-lg group/event backdrop-blur-md`}
                            style={{
                              left: `${(event.time / 20) * 100}%`,
                              width: `${(event.duration / 20) * 100}%`,
                            }}
                          >
                            <span className="text-[10px] font-bold text-white truncate drop-shadow-md">
                              {event.desc}
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </main>

        <aside className="w-80 border-l border-white/10 bg-[#0D0D14]/80 backdrop-blur-lg flex flex-col overflow-y-auto custom-scrollbar shrink-0 z-10">
          <div className="p-6 border-b border-white/5">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
              <Camera size={14} className="text-blue-400" /> Cinematic Camera
            </h2>

            <div className="space-y-8">
              {/* Dolly */}
              <div className="group">
                <div className="flex justify-between items-center mb-3">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wide">
                    Dolly{' '}
                    <span className="text-slate-500 normal-case font-normal ml-1">
                      (Push/Pull)
                    </span>
                  </label>
                  <span className="text-xs font-mono text-purple-400 bg-purple-500/10 px-2 py-1 rounded-md border border-purple-500/20">
                    {controls.dolly}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={controls.dolly}
                  onChange={(e) =>
                    setControls({
                      ...controls,
                      dolly: parseInt(e.target.value),
                    })
                  }
                  className="w-full custom-slider purple-slider"
                />
              </div>

              {/* Pan */}
              <div className="group">
                <div className="flex justify-between items-center mb-3">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wide">
                    Orbital Pan
                  </label>
                  <span className="text-xs font-mono text-blue-400 bg-blue-500/10 px-2 py-1 rounded-md border border-blue-500/20">
                    {controls.pan}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={controls.pan}
                  onChange={(e) =>
                    setControls({ ...controls, pan: parseInt(e.target.value) })
                  }
                  className="w-full custom-slider blue-slider"
                />
              </div>

              {/* Tilt */}
              <div className="group">
                <div className="flex justify-between items-center mb-3">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wide">
                    Vertical Tilt
                  </label>
                  <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-md border border-emerald-500/20">
                    {controls.tilt}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={controls.tilt}
                  onChange={(e) =>
                    setControls({ ...controls, tilt: parseInt(e.target.value) })
                  }
                  className="w-full custom-slider emerald-slider"
                />
              </div>
            </div>
          </div>

          <div className="p-6">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
              <UserSquare2 size={14} className="text-pink-400" /> Subject &
              Physics
            </h2>

            <div className="space-y-6">
              {/* Speed */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wide">
                    Motion Speed
                  </label>
                  <span className="text-xs font-mono text-pink-400 bg-pink-500/10 px-2 py-1 rounded-md border border-pink-500/20">
                    {controls.speed.toFixed(1)}x
                  </span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="3.0"
                  step="0.1"
                  value={controls.speed}
                  onChange={(e) =>
                    setControls({
                      ...controls,
                      speed: parseFloat(e.target.value),
                    })
                  }
                  className="w-full custom-slider pink-slider"
                />
              </div>

              {/* Path Type */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-3 uppercase tracking-wide">
                  Trajectory Path
                </label>
                <div className="relative group">
                  <select
                    value={controls.path}
                    onChange={(e) =>
                      setControls({ ...controls, path: e.target.value })
                    }
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm font-medium text-slate-200 focus:outline-none focus:border-purple-500/50 appearance-none cursor-pointer transition-all group-hover:bg-white/5"
                  >
                    <option value="Linear">Linear (Direct & Smooth)</option>
                    <option value="Curved">Curved (Cinematic Arc)</option>
                    <option value="Chaotic">Chaotic (Handheld Jitter)</option>
                  </select>
                  <ChevronDown
                    size={16}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-purple-400 transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        /* Scrollbar Styling */
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: rgba(255, 255, 255, 0.2);
        }

        /* Custom Range Sliders */
        .custom-slider {
          -webkit-appearance: none;
          width: 100%;
          height: 6px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 5px;
          outline: none;
          border: 1px solid rgba(255,255,255,0.1);
        }

        .custom-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.2s ease-in-out;
          border: 2px solid #fff;
          box-shadow: 0 0 10px rgba(0,0,0,0.5);
        }

        .custom-slider::-webkit-slider-thumb:hover {
          transform: scale(1.2);
        }

        /* Specific Color Accents for Sliders */
        .purple-slider::-webkit-slider-thumb { background: #a855f7; box-shadow: 0 0 10px rgba(168, 85, 247, 0.5); }
        .blue-slider::-webkit-slider-thumb { background: #3b82f6; box-shadow: 0 0 10px rgba(59, 130, 246, 0.5); }
        .emerald-slider::-webkit-slider-thumb { background: #10b981; box-shadow: 0 0 10px rgba(16, 185, 129, 0.5); }
        .pink-slider::-webkit-slider-thumb { background: #ec4899; box-shadow: 0 0 10px rgba(236, 72, 153, 0.5); }
      `,
        }}
      />
    </div>
  );
};

export default App;
