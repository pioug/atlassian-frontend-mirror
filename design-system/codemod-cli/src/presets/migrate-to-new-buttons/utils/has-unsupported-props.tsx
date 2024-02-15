import type { JSXAttribute, JSXSpreadAttribute } from 'jscodeshift';
import { unsupportedProps } from './constants';

export const ifHasUnsupportedProps = (
  attributes: (JSXAttribute | JSXSpreadAttribute)[] | undefined,
): boolean =>
  Boolean(
    attributes &&
      attributes?.some(
        (node) =>
          node.type === 'JSXAttribute' &&
          unsupportedProps.includes(String(node.name.name)),
      ),
  );
