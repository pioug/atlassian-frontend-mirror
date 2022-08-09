import { HTMLProps, useCallback, useMemo } from 'react';

import type { CodeBlockProps } from '../types';

const DEFAULT_LINE_EL_ATTR_OBJ = { 'data-ds--code--row': '' };

const getLineStyleObject = (
  lineNumber: number,
  testId?: string,
): HTMLProps<HTMLElement> => {
  return (testId
    ? {
        'data-testid': `${testId}-line-${lineNumber}`,
        ...DEFAULT_LINE_EL_ATTR_OBJ,
      }
    : DEFAULT_LINE_EL_ATTR_OBJ) as HTMLProps<HTMLElement>;
};

export const useHighlightLines = ({
  highlight = '',
  testId,
}: Pick<CodeBlockProps, 'highlight' | 'testId'>) => {
  const highlightedLines = useMemo(() => {
    if (!highlight) {
      return [];
    }
    return (
      highlight
        .split(',')
        .map((num) => {
          if (num.indexOf('-') > 0) {
            // We found a line group, e.g. 1-3
            const [from, to] = num
              .split('-')
              .map(Number)
              // Sort by lowest value first, highest value last.
              .sort((a, b) => a - b);
            return Array(to + 1)
              .fill(undefined)
              .map((_, index) => index)
              .slice(from, to + 1);
          }

          return Number(num);
        })
        .reduce<number[]>((acc, val) => acc.concat(val), []) || []
    );
  }, [highlight]);

  const getHighlightStyles = useCallback(
    (
      lineNumber: number,
      highlightedLines: number[],
    ): HTMLProps<HTMLElement> => {
      if (!highlight || highlightedLines.length === 0) {
        return getLineStyleObject(lineNumber, testId);
      }

      if (highlightedLines.includes(lineNumber)) {
        const highlightedDataAttrObj = {
          'data-ds--code--row--highlight': '',
        };
        return {
          ...highlightedDataAttrObj,
          ...getLineStyleObject(lineNumber, testId),
        };
      }

      return getLineStyleObject(lineNumber, testId);
    },
    [highlight, testId],
  );

  return {
    getHighlightStyles,
    highlightedLines,
  };
};
