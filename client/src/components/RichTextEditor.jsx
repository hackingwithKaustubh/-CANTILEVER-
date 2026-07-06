import React, { useRef, useEffect } from 'react';
import { 
  Bold, Italic, Underline, List, ListOrdered, 
  Quote, Code, Link2, Eraser
} from 'lucide-react';

const RichTextEditor = ({ value, onChange }) => {
  const editorRef = useRef(null);

  useEffect(() => {
    // Only set initial content once to prevent losing focus during state renders
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || '';
    }
  }, []);

  const executeCommand = (command, argument = null) => {
    document.execCommand(command, false, argument);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const addLink = () => {
    const url = prompt('Enter link URL:');
    if (url) executeCommand('createLink', url);
  };

  return (
    <div className="border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden focus-within:ring-4 focus-within:ring-violet-500/10 focus-within:border-violet-500 transition-all duration-300">
      {/* Tool panel */}
      <div className="flex flex-wrap gap-1.5 p-3 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800/80">
        <button
          type="button"
          onClick={() => executeCommand('bold')}
          className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white transition-colors"
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => executeCommand('italic')}
          className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white transition-colors"
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => executeCommand('underline')}
          className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white transition-colors"
          title="Underline"
        >
          <Underline className="h-4 w-4" />
        </button>

        <div className="w-[1px] h-6 bg-slate-200 dark:bg-slate-800 self-center mx-1" />

        <button
          type="button"
          onClick={() => executeCommand('formatBlock', '<h1>')}
          className="px-2.5 py-1 text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white transition-colors"
          title="Header 1"
        >
          H1
        </button>
        <button
          type="button"
          onClick={() => executeCommand('formatBlock', '<h2>')}
          className="px-2.5 py-1 text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white transition-colors"
          title="Header 2"
        >
          H2
        </button>
        <button
          type="button"
          onClick={() => executeCommand('formatBlock', '<h3>')}
          className="px-2.5 py-1 text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white transition-colors"
          title="Header 3"
        >
          H3
        </button>

        <div className="w-[1px] h-6 bg-slate-200 dark:bg-slate-800 self-center mx-1" />

        <button
          type="button"
          onClick={() => executeCommand('insertUnorderedList')}
          className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white transition-colors"
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => executeCommand('insertOrderedList')}
          className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white transition-colors"
          title="Numbered List"
        >
          <ListOrdered className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => executeCommand('formatBlock', '<blockquote>')}
          className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white transition-colors"
          title="Blockquote"
        >
          <Quote className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => executeCommand('formatBlock', '<pre>')}
          className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white transition-colors"
          title="Code Block"
        >
          <Code className="h-4 w-4" />
        </button>

        <div className="w-[1px] h-6 bg-slate-200 dark:bg-slate-800 self-center mx-1" />

        <button
          type="button"
          onClick={addLink}
          className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white transition-colors"
          title="Insert Link"
        >
          <Link2 className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => executeCommand('removeFormat')}
          className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white transition-colors"
          title="Clear Format"
        >
          <Eraser className="h-4 w-4" />
        </button>
      </div>

      {/* Editor Surface */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        className="p-6 min-h-[350px] max-h-[600px] overflow-y-auto focus:outline-none bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 prose prose-indigo dark:prose-invert max-w-none"
        style={{ direction: 'ltr' }}
      />
    </div>
  );
};

export default RichTextEditor;
