"use client";

import {useState} from "react";
import dynamic from 'next/dynamic';
import {Button} from "@/components/ui/button";
import {generateDocumentation} from "@/ai/flows/generate-documentation";
import {Textarea} from "@/components/ui/textarea";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {ArrowRight, Code, FileText} from "lucide-react";
import { saveAs } from 'file-saver';

const CodeEditor = dynamic(() => import('@/components/code-editor'), {
  ssr: false,
});

export default function Home() {
  const [code, setCode] = useState('');
  const [documentation, setDocumentation] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateDocumentation = async () => {
    setIsGenerating(true);
    try {
      const result = await generateDocumentation({code});
      setDocumentation(result?.documentation || 'No documentation generated.');
    } catch (error) {
      console.error("Error generating documentation:", error);
      setDocumentation('Failed to generate documentation. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExportToMarkdown = () => {
    const markdownContent = `# Documentation\n\n${documentation}`;
    const blob = new Blob([markdownContent], { type: "text/markdown;charset=utf-8" });
    saveAs(blob, "README.md");
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-secondary">
      {/* Code Editor Section */}
      <div className="w-full lg:w-1/2 p-4">
        <Card className="h-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-2xl font-bold tracking-tight flex items-center">
              <Code className="mr-2 h-6 w-6"/> Code Editor
            </CardTitle>
            <CardDescription>Write or paste your code here</CardDescription>
          </CardHeader>
          <CardContent className="h-[calc(100%-100px)]">
            <CodeEditor value={code} onChange={setCode}/>
          </CardContent>
        </Card>
      </div>

      {/* Documentation Display Section */}
      <div className="w-full lg:w-1/2 p-4">
        <Card className="h-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-2xl font-bold tracking-tight flex items-center">
              <FileText className="mr-2 h-6 w-6"/> Documentation
            </CardTitle>
            <CardDescription>Generated documentation will appear here</CardDescription>
          </CardHeader>
          <CardContent className="relative h-[calc(100%-100px)]">
            {documentation ? (
              <Textarea readOnly value={documentation} className="min-h-[200px]"/>
            ) : (
              <div className="flex flex-col items-center justify-center h-full">
                <p className="text-muted-foreground">No documentation generated yet.</p>
              </div>
            )}

            <Button
              onClick={handleGenerateDocumentation}
              disabled={isGenerating}
              className="absolute bottom-4 right-4"
            >
              {isGenerating ? "Generating..." : <>Generate Documentation <ArrowRight className="ml-2"/></>}
            </Button>
            <Button
              onClick={handleExportToMarkdown}
              className="absolute bottom-4 left-4"
            >
              Export to Markdown
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

