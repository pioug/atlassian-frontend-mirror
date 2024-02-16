import { defaultSchema } from '@atlaskit/adf-schema/schema-default';
import { adf2wiki, wiki2adf } from '../_test-helpers';

import {
  blockquote,
  doc,
  hardBreak,
  p,
  table,
  tr,
  td,
  ul,
  li,
} from '@atlaskit/editor-test-helpers/doc-builder';

describe('ADF => WikiMarkup => ADF - BlockQuote', () => {
  test('should convert blockquote node', () => {
    adf2wiki(
      doc(
        blockquote(
          p('This is a blockquote'),
          p('and it can only contain paragraphs'),
          p('a lot paragraphs'),
        ),
      )(defaultSchema),
    );
  });

  test('should convert blockquote node with a single paragraph with hardbreak', () => {
    adf2wiki(
      doc(
        blockquote(
          p(
            'This is a blockquote',
            hardBreak(),
            'with a single paragraph',
            hardBreak(),
            'and hardbreaks',
          ),
        ),
      )(defaultSchema),
    );
  });

  test('should convert blockquote with lists properly', () => {
    adf2wiki(
      doc(blockquote(ul(li(p('item 1')), li(p('item 2')))))(defaultSchema),
    );
  });

  test('should convert blockquote with lists nested in a table properly', () => {
    adf2wiki(
      doc(table()(tr(td()(blockquote(ul(li(p('item 1')), li(p('item 2'))))))))(
        defaultSchema,
      ),
    );
  });
});

describe('WikiMarkup => ADF => WikiMarkup - Blockquote', () => {
  test('should convert blockquote with lists nested in a table properly', () => {
    wiki2adf(
      `|{quote}* list item 1\n* list item 2\n\n# Numbered list 1\n# Numbered list 2{quote}|`,
    );
  });
});
