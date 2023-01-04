import { MarkdownTransformer } from '../index';

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

describe('MarkdownTransformer', () => {
  const transformer = new MarkdownTransformer();

  const mediaNode = (url: string = 'image.jpg') =>
    mediaSingle()(media({ url, type: 'external' })());

  describe('media', () => {
    it('should split paragraphs with images', () => {
      const md = `Hello ![image](image.jpg) **World**`;

      expect(transformer.parse(md)).toEqualDocument(
        doc(p('Hello '), mediaNode(), p(' ', strong('World'))),
      );
    });

    it('should support multiple images', () => {
      const md = `Hello ![](image.jpg) **World** ![](image2.jpg)`;

      expect(transformer.parse(md)).toEqualDocument(
        doc(
          p('Hello '),
          mediaNode(),
          p(' ', strong('World'), ' '),
          mediaNode('image2.jpg'),
        ),
      );
    });

    it('should support images in lists', () => {
      const md = `* Hello ![image](image.jpg)`;

      expect(transformer.parse(md)).toEqualDocument(
        doc(ul(li(p('Hello '), mediaNode()))),
      );
    });

    it('should split blockquotes with images', () => {
      const md = `> Hello ![image](image.jpg) **World**`;

      expect(transformer.parse(md)).toEqualDocument(
        doc(
          blockquote(p('Hello ')),
          mediaNode(),
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
![image](image.jpg)
${CODE_FENCE}`;

      expect(transformer.parse(md)).toEqualDocument(
        doc(code_block()('Hello\n![image](image.jpg)')),
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
});
