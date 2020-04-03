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
} from '@atlaskit/editor-test-helpers';

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

    it('should support iamges in tables', () => {
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
});
