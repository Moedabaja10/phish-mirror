"use client";

import { useState } from "react";
import { Upload, MessageSquare, AlertTriangle, Shield, FileText } from "lucide-react";

interface ScanResult {
  isScam: boolean;
  confidence: number;
  reason: string;
  indicators: string[];
  recommendation: string;
}

export default function SMSCheckerPage() {
  const [text, setText] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [dragActive, setDragActive] = useState(false);

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
  };

  return (
    <main className="min-h-screen bg-background p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-monitor-500/10 rounded-lg">
              <MessageSquare className="w-8 h-8 text-monitor-500" />
            </div>
            <div>
              <h1 className="text-5xl font-display text-gradient-primary">
                SMS Scam Detector
              </h1>
              <p className="text-muted-foreground text-lg mt-1">
                Upload a screenshot or paste text message content to analyze
              </p>
            </div>
          </div>
        </div>

        {/* Input Section */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Image Upload */}
          <div className="glass p-6 rounded-lg space-y-4">
            <div className="flex items-center gap-2">
              <Upload className="w-5 h-5 text-monitor-500" />
              <h2 className="text-xl font-display">Upload Screenshot</h2>
            </div>

            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-lg p-8 transition-all ${
                dragActive
                  ? "border-monitor-500 bg-monitor-500/5"
                  : "border-border hover:border-monitor-500/50"
              }`}
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleFileInput}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />

              {imagePreview ? (
                <div className="space-y-3">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-48 object-contain rounded-lg bg-muted/30"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setImage(null);
                      setImagePreview(null);
                    }}
                    className="text-sm text-threat-400 hover:text-threat-300 transition-colors"
                  >
                    Remove image
                  </button>
                </div>
              ) : (
                <div className="text-center space-y-3">
                  <div className="inline-flex p-4 bg-muted/30 rounded-full">
                    <Upload className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">Drop image here or click to upload</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      PNG, JPG, or WebP
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Text Input */}
          <div className="glass p-6 rounded-lg space-y-4">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-monitor-500" />
              <h2 className="text-xl font-display">Paste SMS Text</h2>
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">
                Sender's Phone Number (Optional)
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+1 (555) 123-4567"
                className="w-full bg-muted/30 border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-monitor-500 transition-all"
              />
            </div>

            {/* Message Text */}
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste the text message here...&#10;&#10;Include:&#10;• Full message content&#10;• Any links or shortcodes&#10;• Reply instructions"
              className="w-full h-48 bg-muted/30 border border-border rounded-lg p-4 text-sm font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-monitor-500 transition-all resize-none"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={analyzeSMS}
            disabled={loading || (!text && !image)}
            className={`flex-1 py-4 rounded-lg font-medium text-lg transition-all ${
              loading || (!text && !image)
                ? "bg-muted text-muted-foreground cursor-not-allowed"
                : "bg-gradient-to-r from-monitor-500 to-primary hover:from-monitor-600 hover:to-primary/90 text-white hover-lift shadow-glow-md"
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Analyzing with AI...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <Shield className="w-5 h-5" />
                Analyze SMS
              </span>
            )}
          </button>

          {(text || image || phoneNumber) && (
            <button
              onClick={clearAll}
              className="px-6 py-4 rounded-lg font-medium border border-border hover:bg-muted/50 transition-all"
            >
              Clear
            </button>
          )}
        </div>

        {/* Results */}
        {result && (
          <div className="glass-strong p-8 rounded-lg space-y-6 animate-scale-in">
            {/* Verdict Header */}
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <h2 className="text-3xl font-display">Analysis Results</h2>
                <div className="flex items-center gap-3">
                  <span
                    className={`px-4 py-2 rounded-full font-medium text-lg ${
                      result.isScam ? "badge-threat" : "badge-safe"
                    }`}
                  >
                    {result.isScam ? (
                      <>
                        <AlertTriangle className="inline w-5 h-5 mr-2" />
                        LIKELY SCAM
                      </>
                    ) : (
                      <>
                        <Shield className="inline w-5 h-5 mr-2" />
                        APPEARS SAFE
                      </>
                    )}
                  </span>
                  <div className="text-sm text-muted-foreground">
                    Confidence: {result.confidence}%
                  </div>
                </div>
              </div>
            </div>

            {/* Confidence Meter */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Threat Level</span>
                <span className="font-mono font-bold">{result.confidence}%</span>
              </div>
              <div className="w-full h-3 bg-muted/20 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-1000 ease-out ${
                    result.isScam
                      ? "bg-gradient-to-r from-warning-500 to-threat-500"
                      : "bg-gradient-to-r from-safe-500 to-monitor-500"
                  }`}
                  style={{ width: `${result.confidence}%` }}
                />
              </div>
            </div>

            {/* Reason */}
            <div className="glass p-6 rounded-lg space-y-2">
              <h3 className="font-display text-lg">Summary</h3>
              <p className="text-foreground/90 leading-relaxed">{result.reason}</p>
            </div>

            {/* Indicators */}
            {result.indicators.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-display text-lg">Red Flags Detected</h3>
                <ul className="space-y-2">
                  {result.indicators.map((indicator, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 glass p-4 rounded-lg border-l-4 border-threat-500"
                    >
                      <AlertTriangle className="w-5 h-5 text-threat-400 flex-shrink-0 mt-0.5" />
                      <span className="text-foreground/90">{indicator}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Recommendation */}
            <div
              className={`p-6 rounded-lg border-2 ${
                result.isScam
                  ? "bg-threat-500/5 border-threat-500/20"
                  : "bg-safe-500/5 border-safe-500/20"
              }`}
            >
              <h3 className="font-display text-lg mb-2">Recommendation</h3>
              <p className="text-foreground/90 leading-relaxed">
                {result.recommendation}
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}