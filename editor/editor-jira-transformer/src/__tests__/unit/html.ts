import {
  doc,
  p,
  br,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  hr,
  em,
  code,
  strike,
  strong,
  subsup,
  underline,
} from '@atlaskit/editor-test-helpers/doc-builder';
import {
  checkParse,
  checkEncode,
  checkParseEncodeRoundTrips,
  encode,
  parseWithSchema,
} from './_test-helpers';
import { Schema } from 'prosemirror-model';
import { createJIRASchema } from '@atlaskit/adf-schema';

export const schema = createJIRASchema({ allowSubSup: true });

describe('JIRATransformer html:', () => {
  describe('paragraphs:', () => {
    checkParseEncodeRoundTrips('empty', schema, '', doc(p('')));

    checkParseEncodeRoundTrips(
      'a paragraph with text',
      schema,
      '<p>Text here.</p>',
      doc(p('Text here.')),
    );

    checkParseEncodeRoundTrips(
      'two adjacent paragraphs',
      schema,
      '<p>Text here.</p><p>And more here.</p>',
      doc(p('Text here.'), p('And more here.')),
    );

    checkParseEncodeRoundTrips(
      'a paragraph with a hard break in it',
      schema,
      '<p>Text on two<br />lines.</p>',
      doc(p('Text on two', br(), 'lines.')),
    );
  });

  describe('breaks:', () => {
    checkParseEncodeRoundTrips(
      'a hard break in a paragraph',
      schema,
      '<p>one<br />two</p>',
      doc(p('one', br(), 'two')),
    );

    checkParseEncodeRoundTrips(
      'multiple hard break in a paragraph',
      schema,
      '<p>one<br /><br />two</p>',
      doc(p('one', br(), br(), 'two')),
    );
  });

  describe('marks formatting:', () => {
    describe('checkParseEncodeRoundTrips', () => {
      let customSchema: Schema;

      beforeEach(() => {
        customSchema = createJIRASchema({
          allowAdvancedTextFormatting: true,
          allowSubSup: true,
        });
      });

      it(`parses HTML: <tt> tag`, () => {
        const node = doc(p('Text with ', code('code words'), '.'));
        const actual = parseWithSchema(
          '<p>Text with <tt>code words</tt>.</p>',
          customSchema,
        );
        expect(actual).toEqualDocument(node);
      });

      it(`encodes HTML: <tt> tag`, () => {
        const node = doc(p('Text with ', code('code words'), '.'));
        const encoded = encode(node, customSchema);
        expect('<p>Text with <tt>code words</tt>.</p>').toEqual(encoded);
      });

      it(`round-trips HTML: <tt> tag`, () => {
        const node = doc(p('Text with ', code('code words'), '.'));
        const roundTripped = parseWithSchema(
          encode(node, customSchema),
          customSchema,
        );
        expect(roundTripped).toEqualDocument(node);
      });

      it(`parses HTML: <tt> and <b>`, () => {
        const node = doc(p('Text with ', strong(code('code words')), '.'));
        const htmls = [
          '<p>Text with <tt><b>code words</b></tt>.</p>',
          '<p>Text with <b><tt>code words</tt></b>.</p>',
        ];
        for (const html of htmls) {
          const actual = parseWithSchema(html, customSchema);
          expect(actual).toEqualDocument(node);
        }
      });
    });

    checkParseEncodeRoundTrips(
      '<ins> tag',
      schema,
      '<p>Text with <ins>underline words</ins>.</p>',
      doc(p('Text with ', underline('underline words'), '.')),
    );

    checkParseEncodeRoundTrips(
      '<em> tag',
      schema,
      '<p>Text with <em>emphasised words</em>.</p>',
      doc(p('Text with ', em('emphasised words'), '.')),
    );

    checkParseEncodeRoundTrips(
      '<b> tag',
      schema,
      '<p>Text with <b>strong words</b>.</p>',
      doc(p('Text with ', strong('strong words'), '.')),
    );

    checkParse(
      '<b> and <em>',
      schema,
      [
        '<p>Text with <b><em>strong emphasised words</em></b>.</p>',
        '<p>Text with <em><b>strong emphasised words</b></em>.</p>',
      ],
      doc(p('Text with ', em(strong('strong emphasised words')), '.')),
    );

    checkEncode(
      '<b> and <em>',
      schema,
      doc(p('Text with ', em(strong('strong emphasised words')), '.')),
      '<p>Text with <em><b>strong emphasised words</b></em>.</p>',
    );

    describe('checkParseEncodeRoundTrips', () => {
      it(`parses HTML: <del> tag`, () => {
        const customSchema = createJIRASchema({
          allowAdvancedTextFormatting: true,
          allowSubSup: true,
        });
        const node = doc(p(strike('struck')));
        const actual = parseWithSchema(
          '<p><del>struck</del></p>',
          customSchema,
        );
        expect(actual).toEqualDocument(node);
      });

      it(`encodes HTML: <del> tag`, () => {
        const customSchema = createJIRASchema({
          allowAdvancedTextFormatting: true,
          allowSubSup: true,
        });
        const node = doc(p(strike('struck')));
        const encoded = encode(node, customSchema);
        expect('<p><del>struck</del></p>').toEqual(encoded);
      });

      it(`round-trips HTML: <del> tag`, () => {
        const customSchema = createJIRASchema({
          allowAdvancedTextFormatting: true,
          allowSubSup: true,
        });
        const node = doc(p(strike('struck')));
        const roundTripped = parseWithSchema(
          encode(node, customSchema),
          customSchema,
        );
        expect(roundTripped).toEqualDocument(node);
      });
    });

    checkParseEncodeRoundTrips(
      '<sub>',
      schema,
      '<p>Text with <sub>subscript emphasised words</sub>.</p>',
      doc(
        p(
          'Text with ',
          subsup({ type: 'sub' })('subscript emphasised words'),
          '.',
        ),
      ),
    );

    checkEncode(
      '<em> and <sub>',
      schema,
      doc(
        p(
          'Text with ',
          em(subsup({ type: 'sub' })('subscript emphasised words')),
          '.',
        ),
      ),
      '<p>Text with <em><sub>subscript emphasised words</sub></em>.</p>',
    );

    checkParse(
      '<em> and <sub>',
      schema,
      [
        '<p>Text with <em><sub>subscript emphasised words</sub></em>.</p>',
        '<p>Text with <sub><em>subscript emphasised words</em></sub>.</p>',
      ],
      doc(
        p(
          'Text with ',
          em(subsup({ type: 'sub' })('subscript emphasised words')),
          '.',
        ),
      ),
    );

    checkParseEncodeRoundTrips(
      '<sup>',
      schema,
      '<p>Text with <sup>subscript emphasised words</sup>.</p>',
      doc(
        p(
          'Text with ',
          subsup({ type: 'sup' })('subscript emphasised words'),
          '.',
        ),
      ),
    );

    checkEncode(
      '<em> and <sup>',
      schema,
      doc(
        p(
          'Text with ',
          em(subsup({ type: 'sup' })('subscript emphasised words')),
          '.',
        ),
      ),
      '<p>Text with <em><sup>subscript emphasised words</sup></em>.</p>',
    );

    checkParse(
      '<em> and <sup>',
      schema,
      [
        '<p>Text with <em><sup>subscript emphasised words</sup></em>.</p>',
        '<p>Text with <sup><em>subscript emphasised words</em></sup>.</p>',
      ],
      doc(
        p(
          'Text with ',
          em(subsup({ type: 'sup' })('subscript emphasised words')),
          '.',
        ),
      ),
    );
  });

  describe('heading:', () => {
    checkParseEncodeRoundTrips(
      '<h1> with anchor',
      schema,
      '<h1><a name="Readallaboutit%21"></a>Read all about it!</h1>',
      doc(h1('Read all about it!')),
    );

    checkParseEncodeRoundTrips(
      '<h2> with anchor',
      schema,
      '<h2><a name="Readallaboutit%21"></a>Read all about it!</h2>',
      doc(h2('Read all about it!')),
    );

    checkParseEncodeRoundTrips(
      '<h3> with anchor',
      schema,
      '<h3><a name="Readallaboutit%21"></a>Read all about it!</h3>',
      doc(h3('Read all about it!')),
    );

    checkParseEncodeRoundTrips(
      '<h4> with anchor',
      schema,
      '<h4><a name="Readallaboutit%21"></a>Read all about it!</h4>',
      doc(h4('Read all about it!')),
    );

    checkParseEncodeRoundTrips(
      '<h5> with anchor',
      schema,
      '<h5><a name="Readallaboutit%21"></a>Read all about it!</h5>',
      doc(h5('Read all about it!')),
    );

    describe('lossy transformation', () => {
      // @see ED-4708
      checkEncode(
        '<h6> with anchor',
        schema,
        doc(h6('Read all about it!')),
        '<h5><a name="Readallaboutit%21"></a>Read all about it!</h5>',
      );

      checkEncode(
        '<h1> with nested <b>',
        schema,
        doc(h1('Read all about it!')),
        '<h1><a name="Readallaboutit%21"></a>Read all about it!</h1>',
      );

      checkEncode(
        '<h1> with nested <b><em>',
        schema,
        doc(h1('Read all about it!')),
        '<h1><a name="Readallaboutit%21"></a>Read all about it!</h1>',
      );

      checkParse(
        '<h1> with nested <b>',
        schema,
        ['<h1><a name="Readallaboutit%21"></a>Read all <b>about</b> it!</h1>'],
        doc(h1('Read all ', strong('about'), ' it!')),
      );

      checkParse(
        '<h6> with anchor',
        schema,
        ['<h6><a name="Readallaboutit%21"></a>Read all about it!</h6>'],
        doc(h5('Read all about it!')),
      );

      checkParse(
        '<h1> with nested <b><em>',
        schema,
        [
          '<h1><a name="Readallaboutit%21"></a>Read all <b><em>about</em></b> it!</h1>',
        ],
        doc(h1('Read all ', strong(em('about')), ' it!')),
      );
    });
  });

  describe('horizontal rule', () => {
    checkParseEncodeRoundTrips('single <hr />', schema, '<hr />', doc(hr()));

    checkParseEncodeRoundTrips(
      'multiple <hr />',
      schema,
      '<hr /><hr />',
      doc(hr(), hr()),
    );
  });
});
