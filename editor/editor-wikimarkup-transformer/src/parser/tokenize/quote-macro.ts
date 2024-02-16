import type {
  Node as PMNode,
  Schema,
} from '@atlaskit/editor-prosemirror/model';
import type { Token, TokenParser } from '.';
import type { Context } from '../../interfaces';
import { commonMacro } from './common-macro';
import { hasAnyOfMarks } from '../utils/text';
import { normalizePMNodes } from '../utils/normalize';
import { parseString } from '../text';

export const quoteMacro: TokenParser = ({
  input,
  position,
  schema,
  context,
}) => {
  return commonMacro(input.substring(position), schema, {
    keyword: 'quote',
    paired: true,
    rawContentProcessor,
    context,
  });
};

export const rawContentProcessor = (
  _rawAttrs: string,
  rawContent: string,
  length: number,
  schema: Schema,
  context: Context,
): Token => {
  if (!rawContent.length) {
    const emptyQuote = emptyBlockquote(schema);
    return {
      type: 'pmnode',
      nodes: [emptyQuote],
      length,
    };
  }
  const parsedContent = parseString({
    schema,
    context,
    ignoreTokenTypes: [],
    input: rawContent,
  });
  const normalizedContent = normalizePMNodes(parsedContent, schema);

  return {
    type: 'pmnode',
    nodes: sanitize(normalizedContent, schema),
    length,
  };
};

function emptyBlockquote(schema: Schema) {
  const p = schema.nodes.paragraph.createChecked({}, []);
  return schema.nodes.blockquote.createChecked({}, p);
}

function sanitize(nodes: PMNode[], schema: Schema) {
  const output: PMNode[] = [];
  let contentBuffer: PMNode[] = [];

  for (const n of nodes) {
    switch (n.type.name) {
      case 'paragraph':
      case 'bulletList':
      case 'orderedList': {
        /**
         * blockquote is happy with paragraph and list
         */
        contentBuffer.push(n);
        break;
      }
      case 'heading': {
        /**
         * If a heading is inside a list item
         * - h1. Bold, Uppercase
         * - h2. Bold, Italic
         * - h3. Bold
         * - h4. Bold, Gray
         * - h5. Gray, Italic
         * - h6. Gray
         */
        contentBuffer.push(transformHeading(n, schema));
        break;
      }
      default:
        /**
         * Anything else should be lifted
         */
        if (contentBuffer.length) {
          const blockquote = schema.nodes.blockquote.createChecked(
            {},
            contentBuffer,
          );
          output.push(blockquote);
          contentBuffer = [];
        }
        output.push(n);
    }
  }
  if (contentBuffer.length) {
    const blockquote = schema.nodes.blockquote.createChecked({}, contentBuffer);
    output.push(blockquote);
  }
  return output;
}

export type Writeable<T> = { -readonly [P in keyof T]: T[P] };

function transformHeading(heading: PMNode, schema: Schema): PMNode {
  const contentBuffer: PMNode[] = [];
  heading.content.forEach((n) => {
    const strong = schema.marks.strong.create();
    const italic = schema.marks.em.create();
    const gray = schema.marks.textColor.create({ color: '#97a0af' });

    if (n.type.name === 'text') {
      if (n.text && heading.attrs.level === 1) {
        // @ts-ignore assigning to readonly prop to transform text
        n.text = n.text.toUpperCase();
      }
      if (heading.attrs.level <= 4 && !hasAnyOfMarks(n, ['strong', 'code'])) {
        n = n.mark([...n.marks, strong]);
      }
      if (
        (heading.attrs.level === 5 || heading.attrs.level === 2) &&
        !hasAnyOfMarks(n, ['em', 'code'])
      ) {
        n = n.mark([...n.marks, italic]);
      }
      if (heading.attrs.level > 3 && !hasAnyOfMarks(n, ['textColor', 'code'])) {
        n = n.mark([...n.marks, gray]);
      }
    }
    contentBuffer.push(n);
  });
  return schema.nodes.paragraph.createChecked({}, contentBuffer);
}
