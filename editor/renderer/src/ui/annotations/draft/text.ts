import { TextPosition, Position } from '../types';

type Offset = {
  startOffset: number;
  endOffset: number;
};

export const splitText = (
  text: string,
  { startOffset, endOffset }: Offset,
): string[] | null => {
  if (endOffset > text.length || endOffset - startOffset <= 0) {
    return null;
  }

  return [
    text.slice(0, startOffset),
    text.slice(startOffset, endOffset),
    text.slice(endOffset),
  ].filter(Boolean);
};

export const calcTextSplitOffset = (
  position: Position,
  textPosition: TextPosition,
  text: string,
) => {
  const { start, end } = textPosition;
  const startOffset = Math.max(position.from - start, 0);
  const endOffset = Math.min(
    Math.abs(end - position.to - text.length),
    text.length,
  );

  return {
    startOffset,
    endOffset,
  };
};
