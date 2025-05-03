"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { generateDocumentation } from "@/ai/flows/generate-documentation";
import { translateDocumentation } from "@/ai/flows/translate-documentation";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowRight, Code, FileText, Globe } from "lucide-react";
import { saveAs } from "file-saver";
import { htmlDecode } from '@/utils/htmlDecode';

const CodeEditor = dynamic(() => import("@/components/code-editor"), {
  ssr: false,
});

export default function Page() {
  const [code, setCode] = useState("");
  const [documentation, setDocumentation] = useState("");
  const [translatedDoc, setTranslatedDoc] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [language, setLanguage] = useState<"en" | "es">("en");

  const handleGenerateDocumentation = async () => {
    setIsGenerating(true);
    setDocumentation("");
    setTranslatedDoc("");
    try {
      const res = await generateDocumentation({ code });
      setDocumentation(res.documentation || "No documentation generated.");
    } catch (e) {
      console.error("Error generating documentation:", e);
      setDocumentation("Failed to generate documentation. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleTranslate = async () => {
    if (!documentation) return;
    setIsTranslating(true);
    try {
      const res = await translateDocumentation({
        text: documentation,
        targetLanguage: language,
      });
      setTranslatedDoc(res.translatedText || "No translation available.");
    } catch (e) {
      console.error("Error translating documentation:", e);
      setTranslatedDoc("Failed to translate documentation. Please try again.");
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
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-secondary">
      {/* Editor */}
      <div className="w-full lg:w-1/2 p-4 flex flex-col">
        <Card className="flex-1 flex flex-col">
          <CardHeader className="flex items-center justify-between pb-2">
            <CardTitle className="text-2xl font-bold flex items-center">
              <Code className="mr-2 h-6 w-6" /> Code Editor
            </CardTitle>
            <CardDescription>Write or paste your code here</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 min-h-[200px] sm:min-h-[300px] md:min-h-[400px]">
            <CodeEditor value={code} onChange={setCode} />
          </CardContent>
        </Card>
      </div>

      {/* Documentation */}
      <div className="w-full lg:w-1/2 p-4 flex flex-col">
        <Card className="flex-1 flex flex-col">
          <CardHeader className="flex items-center justify-between pb-2">
            <CardTitle className="text-2xl font-bold flex items-center">
              <FileText className="mr-2 h-6 w-6" /> Documentation
            </CardTitle>
            <CardDescription>
              Generated documentation will appear here
            </CardDescription>
          </CardHeader>
          <CardContent className="relative flex-1">
            <div className="mb-4 flex items-center space-x-2">
              <Globe className="h-5 w-5" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as "en" | "es")}
                className="p-1 border rounded"
              >
                <option value="en">English</option>
                <option value="es">Español</option>
              </select>
              <Button
                onClick={handleTranslate}
                disabled={!documentation || isTranslating}
              >
                {isTranslating ? "Translating..." : "Translate"}
              </Button>
            </div>

            <Textarea
              readOnly
              value={htmlDecode(
                language === "es" && translatedDoc
                  ? translatedDoc
                  : documentation
              )}
              className="h-[85%] resize-none p-2"
            />

            <div className="absolute bottom-4 left-4">
              <Button
                onClick={handleExport}
                disabled={isGenerating || isTranslating}
              >
                Export to Markdown
              </Button>
            </div>
            <div className="absolute bottom-4 right-4">
              <Button
                onClick={handleGenerateDocumentation}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  "Generating..."
                ) : (
                  <>
                    <>Generate Documentation</>
                    <ArrowRight className="ml-2" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
