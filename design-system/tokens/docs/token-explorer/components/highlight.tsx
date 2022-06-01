import React from 'react';

interface HighlightProps {
  children: string;
  highlight?: string;
}

const Highlight = ({ children, highlight }: HighlightProps) => {
  const parts = highlight
    ? children.split(
        new RegExp(
          `(${highlight.replace(/[-[\]{}()*+?.,\\^$|]/g, '\\$&')})`,
          'gi',
        ),
      )
    : undefined;

  const highlightedName = parts
    ? parts.map((part, i) =>
        part.toLowerCase() === highlight ? (
          <mark key={`${part}${i}`}>{part}</mark>
        ) : (
          part
        ),
      )
    : children;

  return <>{highlightedName}</>;
};

export default Highlight;
