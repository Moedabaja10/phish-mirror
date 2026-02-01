"use client";

import { useState } from "react";
import { Upload, Mail, AlertTriangle, Shield, FileText, Lightbulb, ChevronDown, ChevronUp, Sparkles, TrendingUp, CheckCircle2 } from "lucide-react";

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

export default function EmailCheckerPage() {
  const [text, setText] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [expandedSegment, setExpandedSegment] = useState<number | null>(null);

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

  const analyzeEmail = async () => {
    if (!text && !image) return;

    setLoading(true);
    setResult(null);

    try {
      const formData = new FormData();
      if (text) formData.append("text", text);
      if (image) formData.append("image", image);
      formData.append("interactive", "true");

      const res = await fetch("/api/check-email", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setResult(data);
    } catch (error) {
      console.error("Error analyzing email:", error);
    } finally {
      setLoading(false);
    }
  };

  const clearAll = () => {
    setText("");
    setImage(null);
    setImagePreview(null);
    setResult(null);
    setExpandedSegment(null);
  };

  const getTypeConfig = (type: string) => {
    switch (type) {
      case "scam":
        return {
          gradient: "from-threat-500/10 via-threat-500/5 to-transparent",
          border: "border-threat-500/20 hover:border-threat-500/40",
          iconBg: "bg-threat-500/10",
          iconColor: "text-threat-500",
          badge: "bg-threat-500 text-white",
          label: "Critical Risk"
        };
      case "suspicious":
        return {
          gradient: "from-warning-500/10 via-warning-500/5 to-transparent",
          border: "border-warning-500/20 hover:border-warning-500/40",
          iconBg: "bg-warning-500/10",
          iconColor: "text-warning-500",
          badge: "bg-warning-500 text-white",
          label: "Warning"
        };
      case "safe":
        return {
          gradient: "from-safe-500/10 via-safe-500/5 to-transparent",
          border: "border-safe-500/20 hover:border-safe-500/40",
          iconBg: "bg-safe-500/10",
          iconColor: "text-safe-500",
          badge: "bg-safe-500 text-white",
          label: "Verified Safe"
        };
      default:
        return {
          gradient: "from-muted/5 to-transparent",
          border: "border-border/20",
          iconBg: "bg-muted/10",
          iconColor: "text-muted-foreground",
          badge: "bg-muted text-foreground",
          label: "Neutral"
        };
    }
  };

  return (
    <main className="min-h-screen bg-background">
      {/* Premium Header Section */}
      <div className="border-b border-border/40 bg-gradient-to-b from-background to-background/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-8 py-12">
          <div className="flex items-start justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full"></div>
                  <div className="relative p-3 bg-gradient-to-br from-primary/20 to-monitor-500/20 rounded-xl border border-primary/20">
                    <Mail className="w-8 h-8 text-primary" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h1 className="text-4xl font-display font-bold tracking-tight">
                      Email Security Analysis
                    </h1>
                    <Sparkles className="w-5 h-5 text-primary" />
                  </div>
                  <p className="text-muted-foreground">
                    Enterprise-grade threat detection powered by advanced AI
                  </p>
                </div>
              </div>
            </div>
            
            {/* Trust Indicators */}
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-safe-500 animate-pulse"></div>
                <span className="text-muted-foreground">System Active</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Encrypted</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-12 space-y-12">
        {/* Input Section - Premium Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Image Upload - Premium Design */}
          <div className="group">
            <label className="block text-sm font-medium mb-3 text-foreground/80">
              Upload Evidence
            </label>
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-2xl transition-all duration-300 ${
                dragActive
                  ? "border-primary bg-primary/5 shadow-glow-lg"
                  : "border-border/40 hover:border-primary/50 bg-card/50"
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
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-56 object-contain"
                    />
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
                    <p className="font-medium text-foreground">
                      Drop screenshot here
                    </p>
                    <p className="text-sm text-muted-foreground">
                      or click to browse • PNG, JPG up to 10MB
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Text Input - Premium Design */}
          <div className="group">
            <label className="block text-sm font-medium mb-3 text-foreground/80">
              Email Content
            </label>
            <div className="relative">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste the full email content here...&#10;&#10;Include headers, body, links, and sender information for comprehensive analysis."
                className="w-full h-[280px] bg-card/50 border-2 border-border/40 rounded-2xl p-6 text-sm font-mono text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 focus:bg-card transition-all resize-none scrollbar-thin"
              />
              <div className="absolute bottom-4 right-4 text-xs text-muted-foreground">
                {text.length} characters
              </div>
            </div>
          </div>
        </div>

        {/* Action Button - Premium */}
        <div className="flex items-center gap-4">
          <button
            onClick={analyzeEmail}
            disabled={loading || (!text && !image)}
            className={`flex-1 relative group overflow-hidden py-5 px-8 rounded-xl font-semibold text-base transition-all duration-300 ${
              loading || (!text && !image)
                ? "bg-muted/50 text-muted-foreground cursor-not-allowed"
                : "bg-gradient-to-r from-primary via-primary to-monitor-500 hover:shadow-glow-lg text-white"
            }`}
          >
            {!loading && !(!text && !image) && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            )}
            <span className="relative flex items-center justify-center gap-3">
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Analyzing Security Threats...
                </>
              ) : (
                <>
                  <Shield className="w-5 h-5" />
                  Run Security Analysis
                </>
              )}
            </span>
          </button>

          {(text || image) && (
            <button
              onClick={clearAll}
              className="px-6 py-5 rounded-xl font-medium border-2 border-border/40 hover:bg-muted/50 hover:border-border transition-all"
            >
              Clear All
            </button>
          )}
        </div>

        {/* Results Section - Premium Design */}
        {result && (
          <div className="space-y-8 animate-slide-in-up">
            {/* Executive Summary Card */}
            <div className="relative overflow-hidden rounded-2xl border border-border/40 bg-gradient-to-br from-card/50 to-card/30 backdrop-blur-sm">
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
              
              <div className="p-8 space-y-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h2 className="text-2xl font-display font-semibold">Security Assessment</h2>
                      <CheckCircle2 className="w-5 h-5 text-safe-500" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Analysis completed in real-time using GPT-4 Vision
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div
                      className={`px-5 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 shadow-lg ${
                        result.isScam
                          ? "bg-threat-500 text-white"
                          : "bg-safe-500 text-white"
                      }`}
                    >
                      {result.isScam ? (
                        <>
                          <AlertTriangle className="w-4 h-4" />
                          HIGH RISK
                        </>
                      ) : (
                        <>
                          <Shield className="w-4 h-4" />
                          VERIFIED SAFE
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Confidence Score - Premium Meter */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Confidence Score</p>
                      <p className="text-3xl font-display font-bold tabular-nums">{result.confidence}%</p>
                    </div>
                    <TrendingUp className={`w-8 h-8 ${result.isScam ? 'text-threat-500' : 'text-safe-500'}`} />
                  </div>
                  
                  <div className="relative h-3 bg-muted/20 rounded-full overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-muted/10 to-muted/5"></div>
                    <div
                      className={`relative h-full rounded-full transition-all duration-1000 ease-out ${
                        result.isScam
                          ? "bg-gradient-to-r from-warning-500 via-threat-500 to-threat-600"
                          : "bg-gradient-to-r from-safe-500 via-monitor-500 to-primary"
                      }`}
                      style={{ width: `${result.confidence}%` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"></div>
                    </div>
                  </div>
                </div>

                {/* Summary */}
                <div className="p-5 rounded-xl bg-muted/20 border border-border/30">
                  <p className="text-foreground/90 leading-relaxed">{result.reason}</p>
                </div>
              </div>
            </div>

            {/* Threat Analysis - Premium Cards */}
            {result.highlightedText && result.highlightedText.some(s => s.type !== "neutral") && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 pb-2">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Lightbulb className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-display font-semibold">Threat Intelligence</h3>
                    <p className="text-sm text-muted-foreground">
                      Click any item to view detailed analysis
                    </p>
                  </div>
                </div>

                <div className="grid gap-4">
                  {result.highlightedText
                    .filter(segment => segment.type !== "neutral")
                    .map((segment, i) => {
                      const config = getTypeConfig(segment.type);
                      const isExpanded = expandedSegment === i;

                      return (
                        <div
                          key={i}
                          className={`relative group rounded-xl border-2 transition-all duration-300 bg-gradient-to-br ${config.gradient} ${config.border} ${
                            isExpanded ? 'shadow-xl' : 'hover:shadow-lg'
                          }`}
                        >
                          <button
                            onClick={() => setExpandedSegment(isExpanded ? null : i)}
                            className="w-full p-6 text-left"
                          >
                            <div className="flex items-start gap-4">
                              <div className={`p-2.5 rounded-lg ${config.iconBg}`}>
                                {segment.type === "scam" && <AlertTriangle className={`w-5 h-5 ${config.iconColor}`} />}
                                {segment.type === "suspicious" && <AlertTriangle className={`w-5 h-5 ${config.iconColor}`} />}
                                {segment.type === "safe" && <Shield className={`w-5 h-5 ${config.iconColor}`} />}
                              </div>
                              
                              <div className="flex-1 space-y-2">
                                <div className="flex items-center gap-2">
                                  <span className={`text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-md ${config.badge}`}>
                                    {config.label}
                                  </span>
                                  <span className="text-xs font-semibold text-foreground/60 uppercase tracking-wide">
                                    {segment.category}
                                  </span>
                                </div>
                                <p className="text-base font-medium text-foreground leading-relaxed">
                                  "{segment.text}"
                                </p>
                              </div>

                              <div className="flex-shrink-0">
                                <div className={`p-2 rounded-lg transition-transform ${isExpanded ? 'rotate-180 bg-muted/20' : 'group-hover:bg-muted/10'}`}>
                                  <ChevronDown className="w-5 h-5 text-muted-foreground" />
                                </div>
                              </div>
                            </div>
                          </button>

                          {isExpanded && (
                            <div className="px-6 pb-6 pt-2 border-t border-border/30 animate-slide-in-up">
                              <div className="pl-14 pr-4">
                                <p className="text-sm text-foreground/80 leading-relaxed">
                                  {segment.explanation}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>
              </div>
            )}

            {/* Educational Insights */}
            {result.educationalTips && (
              <div className="rounded-2xl border border-border/40 bg-gradient-to-br from-primary/5 to-transparent p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Lightbulb className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="text-xl font-display font-semibold">Security Best Practices</h3>
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

            {/* Action Recommendation */}
            <div
              className={`rounded-2xl border-2 p-8 ${
                result.isScam
                  ? "bg-gradient-to-br from-threat-500/10 to-threat-500/5 border-threat-500/30"
                  : "bg-gradient-to-br from-safe-500/10 to-safe-500/5 border-safe-500/30"
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl ${result.isScam ? 'bg-threat-500/10' : 'bg-safe-500/10'}`}>
                  <Shield className={`w-6 h-6 ${result.isScam ? 'text-threat-500' : 'text-safe-500'}`} />
                </div>
                <div className="flex-1 space-y-2">
                  <h3 className="text-lg font-display font-semibold">Recommended Action</h3>
                  <p className="text-base text-foreground/90 leading-relaxed">
                    {result.recommendation}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}