import React, { useEffect, useRef } from 'react';
import MonacoEditor, { OnMount, EditorProps } from '@monaco-editor/react';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: string;
  options?: EditorProps['options'];
  className?: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  value,
  onChange,
  language = 'javascript',
  options,
  className = '',
}) => {
  const editorRef = useRef<any>(null);

  useEffect(() => {
    const handleResize = () => {
      editorRef.current?.layout();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleEditorMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
  };

  const handleEditorChange: EditorProps['onChange'] = (value) => {
    if (value !== undefined) onChange(value);
  };

  return (
    <div className={`w-full h-full min-h-[200px] sm:min-h-[300px] md:min-h-[400px] ${className}`}>  
      <MonacoEditor
        className="border rounded-lg overflow-hidden"
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
          fontSize: 14,
          ...options,
        }}
        onMount={handleEditorMount}
        onChange={handleEditorChange}
      />
    </div>
  );
};

export default CodeEditor;
