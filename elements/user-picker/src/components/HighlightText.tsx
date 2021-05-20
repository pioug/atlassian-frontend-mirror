import React from 'react';
import { HighlightRange } from '../types';

type Part = {
  value: string;
  matches: boolean;
};

export interface Props {
  highlights?: HighlightRange[];
  children: string;
}

export class HighlightText extends React.PureComponent<Props> {
  render() {
    const { children, highlights } = this.props;

    const parts: Part[] = [];

    let lastIndex = 0;
    if (highlights) {
      highlights
        .sort((a, b) => a.start - b.start)
        .reduce<HighlightRange[]>((highlights, highlight) => {
          const lastHighlight = highlights[highlights.length - 1];
          if (!lastHighlight || highlight.start > lastHighlight.end + 1) {
            return highlights.concat(highlight);
          }
          if (highlight.end > lastHighlight.end) {
            lastHighlight.end = highlight.end;
          }
          return highlights;
        }, [])
        .forEach((highlight) => {
          const { start, end } = highlight;
          if (start >= end) {
            return;
          }
          if (start > lastIndex) {
            parts.push({
              value: children.substring(lastIndex, start),
              matches: false,
            });
          }
          parts.push({
            value: children.substring(start, end + 1),
            matches: true,
          });
          lastIndex = end + 1;
        });
    }

    if (lastIndex < children.length) {
      parts.push({
        value: children.substring(lastIndex, children.length),
        matches: false,
      });
    }

    return parts.map((part, index) => {
      if (part.matches) {
        return <b key={index}>{part.value}</b>;
      }
      return part.value;
    });
  }
}
