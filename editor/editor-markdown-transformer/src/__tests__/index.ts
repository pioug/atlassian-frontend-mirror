import { MarkdownTransformer } from '../index';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  doc,
  blockquote,
  code_block,
  p,
  strong,
  ul,
  li,
  media,
  mediaSingle,
  table,
  tr,
  th,
  td,
  ol,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { JSONTransformer } from '@atlaskit/editor-json-transformer';
import type { JSONDocNode } from '@atlaskit/editor-json-transformer';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';

const transformer = new JSONTransformer();
const toJSON = (node: PMNode) => transformer.encode(node);

describe('MarkdownTransformer', () => {
  const transformer = new MarkdownTransformer();

  const mediaNode = ({
    url = 'image.jpg',
    alt = undefined,
  }: { url?: string; alt?: string } = {}) =>
    mediaSingle()(media({ url, type: 'external', alt })());

  describe('media', () => {
    it('should allow for empty alt character', () => {
      const md = `![](image.jpg)`;
      expect(transformer.parse(md)).toEqualDocument(doc(mediaNode()));
    });

    it('should support alt text characters', () => {
      const md = `![Some crazy ! alt text %^&*"{}](image.jpg)`;
      expect(transformer.parse(md)).toEqualDocument(
        doc(mediaNode({ alt: 'Some crazy ! alt text %^&*"{}' })),
      );
    });

    it('should split paragraphs with images', () => {
      const md = `Hello ![image](image.jpg) **World**`;
      expect(transformer.parse(md)).toEqualDocument(
        doc(p('Hello '), mediaNode({ alt: 'image' }), p(' ', strong('World'))),
      );
    });

    it('should support multiple images', () => {
      const md = `Hello ![](image.jpg) **World** ![](image2.jpg)`;

      expect(transformer.parse(md)).toEqualDocument(
        doc(
          p('Hello '),
          mediaNode(),
          p(' ', strong('World'), ' '),
          mediaNode({ url: 'image2.jpg' }),
        ),
      );
    });

    it('should support images in lists', () => {
      const md = `* Hello ![my alt text](image.jpg)`;

      expect(transformer.parse(md)).toEqualDocument(
        doc(ul(li(p('Hello '), mediaNode({ alt: 'my alt text' })))),
      );
    });

    it('should split blockquotes with images', () => {
      const md = `> Hello ![my alt text](image.jpg) **World**`;

      expect(transformer.parse(md)).toEqualDocument(
        doc(
          blockquote(p('Hello ')),
          mediaNode({ alt: 'my alt text' }),
          blockquote(p(' ', strong('World'))),
        ),
      );
    });

    it('should support images in tables', () => {
      const md = `|One|Two|Three|
|----|----|----|
|One|Hello![](image.jpg)World|Three|`;

      expect(transformer.parse(md)).toEqualDocument(
        doc(
          table()(
            tr(th()(p('One')), th()(p('Two')), th()(p('Three'))),
            tr(
              td()(p('One')),
              td()(p('Hello'), mediaNode(), p('World')),
              td()(p('Three')),
            ),
          ),
        ),
      );
    });

    it('should not parse images in code blocks', () => {
      const CODE_FENCE = '```';
      const md = `${CODE_FENCE}
Hello
![my alt text](image.jpg)
${CODE_FENCE}`;

      expect(transformer.parse(md)).toEqualDocument(
        doc(code_block()('Hello\n![my alt text](image.jpg)')),
      );
    });
  });

  describe('Code block', () => {
    it('should trim whitespaces around language definition', () => {
      const CODE_FENCE = '```';
      const md = `${CODE_FENCE}   java
int a = 3;
${CODE_FENCE}`;

      expect(transformer.parse(md)).toEqualDocument(
        doc(code_block({ language: 'java' })('int a = 3;')),
      );
    });

    it('should work without language definition', () => {
      const CODE_FENCE = '```';
      const md = `${CODE_FENCE}
int a = 3;
${CODE_FENCE}`;

      expect(transformer.parse(md)).toEqualDocument(
        doc(code_block()('int a = 3;')),
      );
    });
  });

  describe('Link', () => {
    it('should not linkify urls and email addresses', () => {
      const md = `Does not link url https://example.com, hostname test.example.com and email address example@example.com`;

      expect(transformer.parse(md)).toEqualDocument(
        doc(
          p(
            'Does not link url https://example.com, hostname test.example.com and email address example@example.com',
          ),
        ),
      );
    });
  });

  describe('Lists', () => {
    it('should convert lists starting at 0 to an ordered list with an order attribute', () => {
      const md = `0. One\n1. Two\n2. Three`;

      expect(transformer.parse(md)).toEqualDocument(
        doc(ol({ order: 0 })(li(p('One')), li(p('Two')), li(p('Three')))),
      );
    });
    it('should convert lists starting at 1 to an ordered list with an order attribute', () => {
      const md = `1. One\n2. Two\n3. Three`;

      expect(transformer.parse(md)).toEqualDocument(
        doc(ol({ order: 1 })(li(p('One')), li(p('Two')), li(p('Three')))),
      );
    });
    it('should convert lists starting at a number > 1 to an ordered list with an order attribute', () => {
      const md = `6. One\n7. Two\n8. Three`;

      expect(transformer.parse(md)).toEqualDocument(
        doc(ol({ order: 6 })(li(p('One')), li(p('Two')), li(p('Three')))),
      );
    });
    it('should NOT convert lists starting at a decimal number (1.999) to an ordered list', () => {
      const md = `1.999 One\n2. Two\n3. Three`;

      expect(transformer.parse(md)).toEqualDocument(
        doc(p(`1.999 One\n2. Two\n3. Three`)),
      );
    });
    it('should NOT convert lists starting at a negative number to an ordered list', () => {
      const md = `-3. One\n-2. Two\n-1. Three`;

      expect(transformer.parse(md)).toEqualDocument(
        doc(p(`-3. One\n-2. Two\n-1. Three`)),
      );
    });
  });

  describe('List within a blockquote', () => {
    it('should nest an unordered list inside a blockquote', () => {
      const md = `> - item 1\n> - item 2`;

      expect(transformer.parse(md)).toEqualDocument(
        doc(blockquote(ul(li(p('item 1')), li(p('item 2'))))),
      );
    });
    it('should support complex nested unordered list inside a blockquote', () => {
      const md = `> * level 1\n>\n>     * level 1.1\n>     * level 1.2`;

      expect(transformer.parse(md)).toEqualDocument(
        doc(
          blockquote(
            ul(li(p('level 1'), ul(li(p('level 1.1')), li(p('level 1.2'))))),
          ),
        ),
      );
    });
    it('should support media inside an orderedlist within a quote', () => {
      const md = `> * ![](image.jpg)`;

      expect(transformer.parse(md)).toEqualDocument(
        doc(blockquote(ul(li(mediaNode())))),
      );
    });
    it('should nest an ordered list inside a blockquote', () => {
      const md = `> 0. item 1\n> 1. item 2`;

      expect(transformer.parse(md)).toEqualDocument(
        doc(blockquote(ol({ order: 0 })(li(p('item 1')), li(p('item 2'))))),
      );
    });
    it('should support complex nested ordered list inside a blockquote', () => {
      const md = `> 1. level 1\n>\n>     1. level 1.1\n>     2. level 1.2`;

      expect(transformer.parse(md)).toEqualDocument(
        doc(
          blockquote(
            ol({ order: 1 })(
              li(
                p('level 1'),
                ol({ order: 1 })(li(p('level 1.1')), li(p('level 1.2'))),
              ),
            ),
          ),
        ),
      );
    });
    it('should support custom ordered list inside a blockquote', () => {
      const md = `> 6. One\n> 7. Two\n> 8. Three`;

      expect(transformer.parse(md)).toEqualDocument(
        doc(
          blockquote(
            ol({ order: 6 })(li(p('One')), li(p('Two')), li(p('Three'))),
          ),
        ),
      );
    });
    it('should support media inside an orderedlist within a blockquote', () => {
      const md = `> 1. ![](image.jpg)`;

      expect(transformer.parse(md)).toEqualDocument(
        doc(blockquote(ol({ order: 1 })(li(mediaNode())))),
      );
    });
    it('should support codeblock inside an orderedlist within a blockquote', () => {
      const CODE_FENCE = '```';
      const md = `> 1. ${CODE_FENCE}`;

      expect(transformer.parse(md)).toEqualDocument(
        doc(blockquote(ol({ order: 1 })(li(code_block()())))),
      );
    });
    it('should support codeblock & media inside an orderedlist within a same blockquote', () => {
      const CODE_FENCE = '```';
      const md = `> 1. ${CODE_FENCE}\n> 2. ![](image.jpg)\n> 3. https://example.com`;

      expect(transformer.parse(md)).toEqualDocument(
        doc(
          blockquote(
            ol({ order: 1 })(
              li(code_block()()),
              li(mediaNode()),
              li(p('https://example.com')),
            ),
          ),
        ),
      );
    });
  });

  describe('Transforming', () => {
    it('should create a standard empty adf for empty Markdown', () => {
      const standardEmptyAdf: JSONDocNode = {
        type: 'doc',
        version: 1,
        content: [],
      };

      const markdownTransformer = new MarkdownTransformer();

      expect(toJSON(markdownTransformer.parse(''))).toEqual(standardEmptyAdf);
    });
  });
});
