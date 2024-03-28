import type { TextHighlighter } from '../types';

export type TextSegment =
  | {
      type: 'plain';
      text: string;
    }
  | {
      type: 'match';
      text: string;
      groups: Array<string> | undefined;
    };

export function segmentText(
  text: string | undefined,
  highlighter: TextHighlighter | undefined,
): Array<TextSegment> {
  if (!highlighter || !text) {
    return [{ type: 'plain', text: text ?? '' }];
  }

  const segments: Array<TextSegment> = [];
  let pos = 0;

  try {
    const markTextSeggmentMatches = text.matchAll(highlighter.pattern);
    for (const markTextMatch of markTextSeggmentMatches) {
      if (markTextMatch.index !== 0) {
        segments.push({
          type: 'plain',
          text: text.substring(pos, markTextMatch.index),
        });
      }
      segments.push({
        type: 'match',
        text: markTextMatch[0],
        groups:
          markTextMatch.groups &&
          Object.keys(markTextMatch.groups).filter(
            (key) => markTextMatch.groups![key],
          ),
      });
      pos = markTextMatch.index + markTextMatch[0].length;
    }

    if (pos < text.length - 1) {
      segments.push({
        type: 'plain',
        text: text.substring(pos),
      });
    }

    return segments;
  } catch (_e) {}

  return [{ type: 'plain', text }];
}
