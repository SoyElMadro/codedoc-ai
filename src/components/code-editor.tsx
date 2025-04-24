"use client";

import React, {useEffect, useRef} from 'react';
import MonacoEditor, {EditorDidMount, IEditorProps} from '@monaco-editor/react';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: string;
  options?: IEditorProps["options"];
}

const CodeEditor: React.FC<CodeEditorProps> = ({value, onChange, language = 'javascript', options}) => {
  const editorRef = useRef<any>(null);

  useEffect(() => {
    // Fix: Resize observer loop limit reached
    // https://github.com/react-monaco-editor/react-monaco-editor/issues/341
    const handleResize = () => {
      if (editorRef.current) {
        editorRef.current.layout();
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleEditorDidMount: EditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
  };

  const handleEditorChange = (newValue: string | undefined) => {
    if (newValue !== undefined) {
      onChange(newValue);
    }
  };

  return (
    <MonacoEditor
      width="100%"
      height="100%"
      language={language}
      value={value}
      options={{
        selectOnLineNumbers: true,
        roundedSelection: false,
        readOnly: false,
        cursorStyle: 'line',
        automaticLayout: true,
        theme: 'vs-dark',
        ...options,
      }}
      onChange={handleEditorChange}
      editorDidMount={handleEditorDidMount}
    />
  );
};

export default CodeEditor;
