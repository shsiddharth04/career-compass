import React from 'react';

export const MarkdownText: React.FC<{ text: string }> = ({ text }) => {
  if (!text) return null;

  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];

  let currentListType: 'ul' | 'ol' | null = null;
  let currentListItems: React.ReactNode[] = [];

  const flushList = () => {
    if (currentListType === 'ul') {
      elements.push(
        <ul key={`list-${elements.length}`} className="list-disc list-outside ml-5 space-y-1 mb-4 text-slate-300">
          {currentListItems}
        </ul>
      );
    } else if (currentListType === 'ol') {
      elements.push(
        <ol key={`list-${elements.length}`} className="list-decimal list-outside ml-5 space-y-1 mb-4 text-slate-300">
          {currentListItems}
        </ol>
      );
    }
    currentListType = null;
    currentListItems = [];
  };

  const processInlineFormatting = (line: string) => {
    // Bold: **text**
    const parts = line.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index} className="text-white font-semibold">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  lines.forEach((line, index) => {
    const trimmedLine = line.trim();

    if (!trimmedLine) {
        flushList();
        return; 
    }

    // Headers
    if (trimmedLine.startsWith('### ')) {
      flushList();
      elements.push(
        <h3 key={`h3-${index}`} className="text-lg font-bold text-blue-100 mt-6 mb-2 first:mt-0">
          {processInlineFormatting(trimmedLine.replace(/^###\s+/, ''))}
        </h3>
      );
      return;
    }
    if (trimmedLine.startsWith('## ')) {
        flushList();
        elements.push(
          <h2 key={`h2-${index}`} className="text-xl font-bold text-white mt-6 mb-3 first:mt-0">
            {processInlineFormatting(trimmedLine.replace(/^##\s+/, ''))}
          </h2>
        );
        return;
      }

    // Unordered Lists
    if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('* ')) {
        if (currentListType !== 'ul') flushList();
        currentListType = 'ul';
        currentListItems.push(
            <li key={`li-${index}`} className="pl-1">
                {processInlineFormatting(trimmedLine.replace(/^[-*]\s+/, ''))}
            </li>
        );
        return;
    }

    // Ordered Lists
    if (/^\d+\.\s/.test(trimmedLine)) {
        if (currentListType !== 'ol') flushList();
        currentListType = 'ol';
        currentListItems.push(
            <li key={`li-${index}`} className="pl-1">
                {processInlineFormatting(trimmedLine.replace(/^\d+\.\s+/, ''))}
            </li>
        );
        return;
    }

    // Regular Paragraphs
    flushList();
    elements.push(
      <p key={`p-${index}`} className="mb-3 text-slate-300 leading-relaxed">
        {processInlineFormatting(trimmedLine)}
      </p>
    );
  });

  flushList();

  return <div className="markdown-content text-sm">{elements}</div>;
};