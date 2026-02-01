"use client";

import { useState, useEffect } from "react";
import { Upload, MessageSquare, AlertTriangle, Shield, FileText, Sparkles, CheckCircle2, TrendingUp, ChevronDown, Lightbulb } from "lucide-react";

interface HighlightedSegment {
  text: string;
  type: "scam" | "suspicious" | "safe" | "neutral";
  explanation: string;
  category: string;
}

interface ScanResult {
  isScam: boolean;
  confidence: number;
  reason: string;
  indicators: string[];
  recommendation: string;
  highlightedText?: HighlightedSegment[];
  educationalTips?: string[];
}

export default function SMSCheckerPage() {
  const [text, setText] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [expandedSegment, setExpandedSegment] = useState<number | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Mouse parallax
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (file.type.startsWith("image/")) {
      setImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeSMS = async () => {
    if (!text && !image) return;

    setLoading(true);
    setResult(null);

    try {
      const formData = new FormData();
      if (text) formData.append("text", text);
      if (phoneNumber) formData.append("phoneNumber", phoneNumber);
      if (image) formData.append("image", image);
      formData.append("interactive", "true");

      const res = await fetch("/api/check-sms", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setResult(data);
    } catch (error) {
      console.error("Error analyzing SMS:", error);
    } finally {
      setLoading(false);
    }
  };

  const clearAll = () => {
    setText("");
    setPhoneNumber("");
    setImage(null);
    setImagePreview(null);
    setResult(null);
    setExpandedSegment(null);
  };

  const getTypeConfig = (type: string) => {
    switch (type) {
      case "scam":
        return {
          bg: "bg-threat-500/10",
          border: "border-threat-500/30",
          icon: "text-threat-500",
          badge: "bg-threat-500 text-white",
        };
      case "suspicious":
        return {
          bg: "bg-warning-500/10",
          border: "border-warning-500/30",
          icon: "text-warning-500",
          badge: "bg-warning-500 text-white",
        };
      case "safe":
        return {
          bg: "bg-safe-500/10",
          border: "border-safe-500/30",
          icon: "text-safe-500",
          badge: "bg-safe-500 text-white",
        };
      default:
        return {
          bg: "bg-muted/10",
          border: "border-border/30",
          icon: "text-muted-foreground",
          badge: "bg-muted text-foreground",
        };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute top-20 left-20 w-96 h-96 bg-monitor-500/10 rounded-full blur-3xl animate-float"
          style={{ transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`, transition: 'transform 0.3s ease-out' }}
        />
        <div 
          className="absolute bottom-20 right-20 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl animate-float" 
          style={{ animationDelay: '1s', animationDuration: '4s', transform: `translate(${-mousePosition.x}px, ${-mousePosition.y}px)`, transition: 'transform 0.3s ease-out' }} 
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-gradient-to-r from-monitor-500/5 to-primary/5 rounded-full blur-3xl animate-pulse-slow" />
      </div>

      {/* Header */}
      <div className="relative border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-8 py-12">
          <div className="flex items-start justify-between">
            <div className="space-y-4 animate-slide-in-up">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-monitor-500/30 blur-xl rounded-full animate-pulse-glow" />
                  <div className="relative p-3 bg-gradient-to-br from-monitor-500/20 to-primary/20 rounded-xl border border-monitor-500/30">
                    <MessageSquare className="w-8 h-8 text-monitor-500" />
                  </div>
                </div>
                <div>
                  <h1 className="text-5xl font-display font-bold tracking-tight text-white drop-shadow-[0_0_30px_rgba(6,182,212,0.3)]">
                    SMS Security
                  </h1>
                  <p className="text-muted-foreground text-lg mt-1">
                    AI-powered text message scam detection
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 animate-slide-in-up" style={{ animationDelay: '0.1s' }}>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-safe-500/10 border border-safe-500/30">
                <div className="w-2 h-2 rounded-full bg-safe-500 animate-pulse" />
                <span className="text-sm font-medium text-safe-400">System Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-8 py-12 space-y-12">
        {/* Input Section */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Image Upload */}
          <div className="animate-slide-in-up" style={{ animationDelay: '0.2s' }}>
            <label className="block text-sm font-medium mb-3 text-white">Upload Screenshot</label>
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-2xl transition-all duration-300 ${
                dragActive
                  ? "border-monitor-500 bg-monitor-500/5 scale-105"
                  : "border-border/40 hover:border-monitor-500/50 bg-card/50"
              }`}
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleFileInput}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />

              {imagePreview ? (
                <div className="p-6 space-y-4">
                  <div className="relative rounded-xl overflow-hidden bg-muted/10 border border-border/40">
                    <img src={imagePreview} alt="Preview" className="w-full h-56 object-contain" />
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setImage(null);
                      setImagePreview(null);
                    }}
                    className="text-sm text-threat-400 hover:text-threat-300 transition-colors font-medium"
                  >
                    Remove File
                  </button>
                </div>
              ) : (
                <div className="p-12 text-center space-y-4">
                  <div className="inline-flex p-4 bg-muted/10 rounded-2xl border border-border/20">
                    <Upload className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <div className="space-y-2">
                    <p className="font-medium text-white">Drop screenshot here</p>
                    <p className="text-sm text-muted-foreground">or click to browse • PNG, JPG up to 10MB</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Text Input */}
          <div className="animate-slide-in-up" style={{ animationDelay: '0.3s' }}>
            <label className="block text-sm font-medium mb-3 text-white">SMS Content</label>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-muted-foreground mb-2">Sender's Phone Number (Optional)</label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+1 (555) 123-4567"
                  className="w-full bg-card/50 border-2 border-border/40 rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-monitor-500/50 focus:bg-card transition-all"
                />
              </div>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste the text message here...&#10;&#10;Include full message content, links, and any reply instructions"
                className="w-full h-[200px] bg-card/50 border-2 border-border/40 rounded-xl p-5 text-sm font-mono text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-monitor-500/50 focus:bg-card transition-all resize-none scrollbar-thin"
              />
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex gap-4 animate-slide-in-up" style={{ animationDelay: '0.4s' }}>
          <button
            onClick={analyzeSMS}
            disabled={loading || (!text && !image)}
            className={`flex-1 relative group overflow-hidden py-5 px-8 rounded-xl font-semibold text-base transition-all ${
              loading || (!text && !image)
                ? "bg-muted/50 text-muted-foreground cursor-not-allowed"
                : "bg-gradient-to-r from-monitor-500 via-primary to-monitor-500 hover:shadow-glow-lg text-white"
            }`}
          >
            {!loading && (text || image) && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            )}
            <span className="relative flex items-center justify-center gap-3">
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Analyzing with AI...
                </>
              ) : (
                <>
                  <Shield className="w-5 h-5" />
                  Analyze SMS
                </>
              )}
            </span>
          </button>

          {(text || image || phoneNumber) && (
            <button
              onClick={clearAll}
              className="px-6 py-5 rounded-xl font-medium border-2 border-border/40 hover:bg-muted/50 hover:border-border transition-all"
            >
              Clear All
            </button>
          )}
        </div>

        {/* Results */}
        {result && (
          <div className="space-y-8 animate-scale-in">
            {/* Verdict */}
            <div className="glass-strong rounded-2xl p-8 border border-border/40">
              <div className="flex items-start justify-between mb-6">
                <div className="space-y-3">
                  <h2 className="text-2xl font-display font-semibold text-white">Analysis Complete</h2>
                  <div className="flex items-center gap-3">
                    <div className={`px-5 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 shadow-lg ${
                      result.isScam ? "bg-threat-500 text-white" : "bg-safe-500 text-white"
                    }`}>
                      {result.isScam ? <AlertTriangle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                      {result.isScam ? "LIKELY SCAM" : "APPEARS SAFE"}
                    </div>
                    <div className="px-4 py-2 rounded-full bg-muted/50 text-sm font-mono">
                      {result.confidence}% Confidence
                    </div>
                  </div>
                </div>
              </div>

              {/* Confidence Meter */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm font-medium">
                  <span className="text-muted-foreground">Threat Level</span>
                  <span className="font-mono text-white">{result.confidence}/100</span>
                </div>
                <div className="relative h-3 bg-muted/20 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-1000 ease-out ${
                    result.isScam
                      ? "bg-gradient-to-r from-warning-500 via-threat-500 to-threat-600"
                      : "bg-gradient-to-r from-safe-500 via-monitor-500 to-primary"
                  }`} style={{ width: `${result.confidence}%` }}>
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent" />
                  </div>
                </div>
              </div>

              {/* Summary */}
              <div className="p-5 rounded-xl bg-muted/20 border border-border/30">
                <p className="text-foreground/90 leading-relaxed">{result.reason}</p>
              </div>
            </div>

            {/* Threat Intelligence - Premium Cards */}
            {result.highlightedText && result.highlightedText.some(s => s.type !== "neutral") && (
              <div className="glass-strong rounded-2xl p-8 border border-border/40 space-y-6">
                <div className="flex items-center gap-3">
                  <Lightbulb className="w-6 h-6 text-warning-400" />
                  <div>
                    <h3 className="text-2xl font-display font-semibold text-white">Threat Intelligence</h3>
                    <p className="text-sm text-muted-foreground">Click any item for detailed analysis</p>
                  </div>
                </div>

                <div className="grid gap-4">
                  {result.highlightedText.filter(s => s.type !== "neutral").map((segment, i) => {
                    const config = getTypeConfig(segment.type);
                    const isExpanded = expandedSegment === i;

                    return (
                      <div
                        key={i}
                        className={`border-2 rounded-xl transition-all ${config.border} ${config.bg} ${isExpanded ? 'shadow-xl' : 'hover:shadow-lg'}`}
                      >
                        <button
                          onClick={() => setExpandedSegment(isExpanded ? null : i)}
                          className="w-full p-6 text-left"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex items-start gap-3 flex-1">
                              <div className={`p-2.5 rounded-lg bg-${segment.type === 'scam' ? 'threat' : segment.type === 'suspicious' ? 'warning' : 'safe'}-500/10`}>
                                {segment.type === 'scam' ? <AlertTriangle className={`w-5 h-5 ${config.icon}`} /> :
                                 segment.type === 'suspicious' ? <AlertTriangle className={`w-5 h-5 ${config.icon}`} /> :
                                 <Shield className={`w-5 h-5 ${config.icon}`} />}
                              </div>
                              <div className="flex-1 space-y-2">
                                <span className={`text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-md ${config.badge}`}>
                                  {segment.category}
                                </span>
                                <p className="text-base font-medium text-white leading-relaxed">"{segment.text}"</p>
                              </div>
                            </div>
                            <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                          </div>
                        </button>
                        {isExpanded && (
                          <div className="px-6 pb-6 pt-2 border-t border-border/30 animate-slide-in-up">
                            <p className="text-sm text-foreground/80 leading-relaxed pl-14">{segment.explanation}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Educational Tips - Security Best Practices */}
            {result.educationalTips && (
              <div className="rounded-2xl border border-border/40 bg-gradient-to-br from-primary/5 to-transparent p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Lightbulb className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="text-xl font-display font-semibold text-white">Security Best Practices</h3>
                </div>
                
                <div className="grid gap-4">
                  {result.educationalTips.map((tip, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-4 p-5 rounded-xl bg-card/50 border border-border/30 hover:border-border/50 transition-all"
                    >
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                        <span className="text-sm font-bold text-primary">{i + 1}</span>
                      </div>
                      <p className="text-foreground/90 leading-relaxed pt-0.5">{tip}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendation */}
            <div className={`rounded-2xl border-2 p-8 ${
              result.isScam ? "bg-threat-500/5 border-threat-500/30" : "bg-safe-500/5 border-safe-500/30"
            }`}>
              <h3 className="font-display text-lg mb-3 flex items-center gap-2 text-white">
                <Shield className="w-5 h-5" />
                What You Should Do
              </h3>
              <p className="text-foreground/90 leading-relaxed text-lg">{result.recommendation}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}