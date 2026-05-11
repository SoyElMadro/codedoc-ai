"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { generateDocumentation } from "@/ai/flows/generate-documentation";
import { translateDocumentation } from "@/ai/flows/translate-documentation";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowRight,
  Code,
  FileText,
  Globe,
  Sparkles,
  Download,
  Moon,
  Sun,
  Loader2,
  Languages,
  ChevronDown,
} from "lucide-react";
import { saveAs } from "file-saver";
import { htmlDecode } from '@/utils/htmlDecode';
import { toast } from "@/hooks/use-toast";

const CodeEditor = dynamic(() => import("@/components/code-editor"), {
  ssr: false,
  loading: () => (
    <div className="h-full min-h-[400px] rounded-lg bg-muted/50 animate-pulse" />
  ),
});

export default function Page() {
  const [code, setCode] = useState("");
  const [documentation, setDocumentation] = useState("");
  const [translatedDoc, setTranslatedDoc] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [language, setLanguage] = useState<"en" | "es">("en");
  const [isDark, setIsDark] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const dark = stored !== "light";
    setIsDark(dark);
    document.documentElement.classList.toggle("dark", dark);
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  const handleGenerateDocumentation = async () => {
    if (!code.trim()) {
      toast({
        title: "No code to document",
        description: "Please write or paste some code first.",
        variant: "destructive",
      });
      return;
    }
    setIsGenerating(true);
    setDocumentation("");
    setTranslatedDoc("");
    try {
      const res = await generateDocumentation({ code });
      setDocumentation(res.documentation || "No documentation generated.");
      toast({
        title: "Documentation generated!",
        description: "Your documentation is ready to review.",
      });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "";
      const isQuota = msg.includes("429") || /quota|rate limit/i.test(msg);
      const isExpired = /API_KEY_INVALID|API key expired/i.test(msg);
      const short = isExpired
        ? "API key expired. Renew it at https://aistudio.google.com/apikey"
        : isQuota
          ? "API quota exceeded. Get a new key at https://aistudio.google.com/apikey or wait for daily reset."
          : "Generation failed. Please try again.";
      setDocumentation(`Error: ${short}\n\n${msg}`);
      toast({ title: "Generation failed", description: short, variant: "destructive" });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleTranslate = async () => {
    if (!documentation) {
      toast({
        title: "Nothing to translate",
        description: "Generate documentation first.",
        variant: "destructive",
      });
      return;
    }
    setIsTranslating(true);
    try {
      const res = await translateDocumentation({
        text: documentation,
        targetLanguage: language,
      });
      setTranslatedDoc(res.translatedText || "No translation available.");
      toast({
        title: "Translation complete",
        description: `Documentation translated to ${language === "en" ? "English" : "Spanish"}.`,
      });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "";
      const isQuota = msg.includes("429") || /quota|rate limit/i.test(msg);
      const isExpired = /API_KEY_INVALID|API key expired/i.test(msg);
      const short = isExpired
        ? "API key expired. Renew it at https://aistudio.google.com/apikey"
        : isQuota
          ? "API quota exceeded. Get a new key at https://aistudio.google.com/apikey or wait for daily reset."
          : "Translation failed. Please try again.";
      setTranslatedDoc(`Error: ${short}\n\n${msg}`);
      toast({ title: "Translation failed", description: short, variant: "destructive" });
    } finally {
      setIsTranslating(false);
    }
  };

  const handleExport = () => {
    const content =
      language === "es" && translatedDoc
        ? `# Documentación\n\n${translatedDoc}`
        : `# Documentation\n\n${documentation}`;
    const filename = language === "es" ? "README_es.md" : "README.md";
    const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
    saveAs(blob, filename);
    toast({
      title: "Export successful",
      description: `File saved as ${filename}.`,
    });
  };

  const displayContent = htmlDecode(
    language === "es" && translatedDoc ? translatedDoc : documentation
  );

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background" />
    );
  }

  return (
    <div className="relative min-h-screen bg-background overflow-hidden selection:bg-primary/20">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-grid opacity-[0.04]" />
        <div className="absolute top-1/4 -left-48 w-[500px] h-[500px] bg-primary/8 rounded-full blur-[120px] animate-float" />
        <div className="absolute bottom-1/4 -right-48 w-[500px] h-[500px] bg-accent/8 rounded-full blur-[120px] animate-float" style={{ animationDelay: "-3s" }} />
      </div>

      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/70 backdrop-blur-2xl">
        <div className="flex items-center justify-between px-4 md:px-6 h-14 max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/20">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-lg tracking-tight">
              CodeDoc AI
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary/60" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
              </span>
              AI Ready
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full h-9 w-9"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </header>

      <main className="relative p-3 md:p-6 gap-3 md:gap-6 grid grid-cols-1 lg:grid-cols-2 max-w-7xl mx-auto min-h-[calc(100vh-56px)]">
        <Card className="flex flex-col glass border-0 shadow-2xl animate-fade-in">
          <CardHeader className="pb-3 px-4 pt-4">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              <Code className="w-4 h-4 text-primary" />
              Editor
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 p-2 md:p-3 pt-0">
            <div className="h-full min-h-[350px] md:min-h-[450px] rounded-xl overflow-hidden border border-border/40 bg-[#1e1e1e]">
              <CodeEditor value={code} onChange={setCode} />
            </div>
          </CardContent>
        </Card>

        <Card className="flex flex-col glass border-0 shadow-2xl animate-fade-in" style={{ animationDelay: "100ms" }}>
          <CardHeader className="pb-3 px-4 pt-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                <FileText className="w-4 h-4 text-primary" />
                Documentation
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col p-2 md:p-3 pt-0 gap-3">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <select
                  value={language}
                  onChange={(e) =>
                    setLanguage(e.target.value as "en" | "es")
                  }
                  className="w-full appearance-none rounded-xl border border-border/50 bg-background/50 pl-9 pr-8 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent cursor-pointer transition-all duration-200"
                >
                  <option value="en">English</option>
                  <option value="es">Español</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              </div>
              <Button
                onClick={handleTranslate}
                disabled={!documentation || isTranslating}
                variant="secondary"
                size="sm"
                className="shrink-0 gap-1.5"
              >
                {isTranslating ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Languages className="w-3.5 h-3.5" />
                )}
                <span className="hidden sm:inline">Translate</span>
              </Button>
            </div>

            <div className="flex-1 relative min-h-[250px]">
              {!documentation && !isGenerating ? (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="text-center">
                    <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground/20" />
                    <p className="text-sm font-medium text-muted-foreground">
                      No documentation yet
                    </p>
                    <p className="text-xs text-muted-foreground/60 mt-1">
                      Write code and generate documentation
                    </p>
                  </div>
                </div>
              ) : null}
              {isGenerating ? (
                <div className="h-full min-h-[300px] rounded-xl bg-muted/30 animate-pulse flex items-center justify-center">
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span className="text-sm">Generating documentation...</span>
                  </div>
                </div>
              ) : (
                <Textarea
                  readOnly
                  value={displayContent}
                  placeholder="Documentation will appear here..."
                  className={`h-full min-h-[300px] resize-none bg-background/40 border-border/40 ${
                    !documentation ? "opacity-40" : ""
                  }`}
                />
              )}
            </div>

            <div className="flex items-center justify-between gap-2 pt-1">
              <Button
                onClick={handleExport}
                disabled={!documentation || isGenerating || isTranslating}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Export</span>
                <span className="sm:hidden">MD</span>
              </Button>
              <Button
                onClick={handleGenerateDocumentation}
                disabled={isGenerating}
                size="default"
                variant="gradient"
                className="gap-2 px-5"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Generate
                    <ArrowRight className="w-4 h-4 hidden sm:block" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
