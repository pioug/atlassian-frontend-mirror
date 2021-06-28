import createAnalyticsEventMock from '@atlaskit/editor-test-helpers/create-analytics-event-mock';
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';

import {
  mention,
  em,
  strike,
  code,
  strong,
  doc,
  a as link,
  p,
  h1,
  emoji,
  code_block,
  hardBreak,
  panel,
  BuilderContent,
  DocBuilder,
} from '@atlaskit/editor-test-helpers/doc-builder';

import { insertText } from '@atlaskit/editor-test-helpers/transactions';

import {
  strongRegex1,
  strongRegex2,
  italicRegex1,
  italicRegex2,
  strikeRegex,
  codeRegex,
} from '../../../../plugins/text-formatting/pm-plugins/input-rule';
import { EditorView } from 'prosemirror-view';
import { ProviderFactory } from '@atlaskit/editor-common';
import { UIAnalyticsEvent } from '@atlaskit/analytics-next';

const createProductPayload = (product: string, originalSpelling: string) => ({
  action: 'autoSubstituted',
  actionSubject: 'text',
  actionSubjectId: 'productName',
  eventType: 'track',
  attributes: expect.objectContaining({
    product,
    originalSpelling,
  }),
});

const createPunctuationPayload = (
  punctuation: 'ellipsis' | 'emDash' | 'singleQuote' | 'doubleQuote',
) => ({
  action: 'autoSubstituted',
  actionSubject: 'text',
  actionSubjectId: 'punctuation',
  eventType: 'track',
  attributes: expect.objectContaining({
    punctuation,
  }),
});

const createFormattedPayload = (
  actionSubjectId: 'strong' | 'italic' | 'strike' | 'code',
) => ({
  action: 'formatted',
  actionSubject: 'text',
  actionSubjectId: actionSubjectId,
  eventType: 'track',
  attributes: expect.objectContaining({
    inputMethod: 'autoformatting',
  }),
});

const autoFormatPatterns = [
  {
    string: '**abc**',
    doc: strong('abc'),
    name: 'strong',
    regex: strongRegex2,
    analyticsGasV3Payload: createFormattedPayload('strong'),
  },
  {
    string: '__abc__',
    doc: strong('abc'),
    name: 'strong',
    regex: strongRegex1,
    analyticsGasV3Payload: createFormattedPayload('strong'),
  },
  {
    string: '*abc*',
    doc: em('abc'),
    name: 'em',
    regex: italicRegex2,
    analyticsGasV3Payload: createFormattedPayload('italic'),
  },
  {
    string: '_abc_',
    doc: em('abc'),
    name: 'em',
    regex: italicRegex1,
    analyticsGasV3Payload: createFormattedPayload('italic'),
  },
  {
    string: '~~abc~~',
    doc: strike('abc'),
    name: 'strike',
    regex: strikeRegex,
    analyticsGasV3Payload: createFormattedPayload('strike'),
  },
  {
    string: '`abc`',
    doc: code('abc'),
    name: 'code',
    regex: codeRegex,
    analyticsGasV3Payload: createFormattedPayload('code'),
  },
];

describe('text-formatting input rules', () => {
  const createEditor = createEditorFactory();
  let createAnalyticsEvent: jest.MockInstance<UIAnalyticsEvent, any>;

  describe.each([true, false])(
    'when useUnpredictableInputRule is %s',
    (useUnpredictableInputRule) => {
      const editor = (doc: DocBuilder, disableCode = false) => {
        createAnalyticsEvent = createAnalyticsEventMock();
        const editorWrapper = createEditor({
          doc,
          editorProps: {
            allowAnalyticsGASV3: true,
            textFormatting: { disableCode },
            emojiProvider: new Promise(() => {}),
            mentionProvider: new Promise(() => {}),
            allowPanel: true,
            featureFlags: {
              useUnpredictableInputRule,
            },
          },
          createAnalyticsEvent: createAnalyticsEvent as any,
          providerFactory: ProviderFactory.create({
            emojiProvider: new Promise(() => {}),
          }),
        });
        createAnalyticsEvent.mockClear();
        return editorWrapper;
      };

      const autoformats = (
        string: string,
        editorContent: BuilderContent,
        analyticsV3Payload?: object,
        contentNode = p,
      ) => {
        describe(`typing ${string}`, () => {
          let editorView: EditorView;
          let sel: number;
          beforeEach(() => {
            ({ editorView, sel } = editor(doc(contentNode('{<>}'))));
            insertText(editorView, string, sel);
          });

          it(`should autoformat`, () => {
            expect(editorView.state.doc).toEqualDocument(doc(editorContent));
          });

          if (analyticsV3Payload) {
            it('should create analytics GAS V3 event', () => {
              expect(createAnalyticsEvent).toHaveBeenCalledWith(
                analyticsV3Payload,
              );
            });
          }
        });
      };

      const checkInvalidStrings = (
        regex: RegExp,
        string: string,
        formatting: string,
      ) => {
        it(`should return null for incorrect markdown style: ${formatting}, regex: ${regex}, string: ${string}`, () => {
          expect(regex.exec(string)).toEqual(null);
        });
      };

      const notautoformats = (string: string) => {
        it(`should not autoformat: ${string}`, () => {
          const { editorView, sel } = editor(doc(p('{<>}')));
          insertText(editorView, string, sel);
          expect(editorView.state.doc).toEqualDocument(doc(p(string)));
        });
      };

      function typeText(view: EditorView, text: string) {
        const { $from, $to } = view.state.selection;
        if (
          !view.someProp('handleTextInput', (f) =>
            f(view, $from.pos, $to.pos, text),
          )
        ) {
          view.dispatch(view.state.tr.insertText(text, $from.pos, $to.pos));
        }
      }

      const autoformatCombinations = (
        strings: Array<string>,
        editorContent: BuilderContent,
      ) => {
        it(`should autoformat combinations: ${strings}`, () => {
          const { editorView } = editor(doc(p('{<>}')));
          strings.forEach((str) => {
            insertText(editorView, str, editorView.state.selection.$from.pos);
          });
          expect(editorView.state.doc).toEqualDocument(doc(p(editorContent)));
        });
      };

      describe('atlassian product rule', () => {
        autoformats(
          'atlassian ',
          p('Atlassian '),
          createProductPayload('Atlassian', 'atlassian'),
        );
        notautoformats('something-atlassian');
        notautoformats('atlassian');
        notautoformats('atlassian.com');

        autoformats(
          'jira and JIRA ',
          p('Jira and Jira '),
          createProductPayload('Jira', 'jira'),
        );
        notautoformats('.jira');
        notautoformats('jira.atlassian.com');

        autoformats(
          'bitbucket ',
          p('Bitbucket '),
          createProductPayload('Bitbucket', 'bitbucket'),
        );
        notautoformats('.bitbucket');
        notautoformats('bitbucket.atlassian.com');

        autoformats(
          'hipchat and HipChat ',
          p('Hipchat and Hipchat '),
          createProductPayload('Hipchat', 'hipchat'),
        );
        notautoformats('.hipchat');
        notautoformats('hipchat.atlassian.com');

        autoformats(
          'trello ',
          p('Trello '),
          createProductPayload('Trello', 'trello'),
        );
        notautoformats('.trello');

        autoformats(
          '  \t    atlassian   ',
          p('  \t    Atlassian   '),
          createProductPayload('Atlassian', 'atlassian'),
        );
      });

      describe('smart quotes rule', () => {
        autoformats(
          "'nice'",
          p('‘nice’'),
          createPunctuationPayload('singleQuote'),
        );
        autoformats(
          "'hello' 'world'",
          p('‘hello’ ‘world’'),
          createPunctuationPayload('singleQuote'),
        );

        autoformats(
          "don't hate, can't wait",
          p('don’t hate, can’t wait'),
          createPunctuationPayload('singleQuote'),
        );
        autoformats(
          "don't hate, can't 'wait'",
          p('don’t hate, can’t ‘wait’'),
          createPunctuationPayload('singleQuote'),
        );

        notautoformats("':)");
        notautoformats("'t hate");
        notautoformats("let'. it");
        notautoformats("let' it 'be");
        notautoformats("' test'");
        notautoformats("'test '");

        autoformats(
          '"hello" "world"',
          p('“hello” “world”'),
          createPunctuationPayload('doubleQuote'),
        );
        autoformats(
          'let " it\'d close"',
          p('let “ it’d close”'),
          createPunctuationPayload('doubleQuote'),
        );
        autoformats(
          'let " it\'d close" \'hey',
          p("let “ it’d close” 'hey"),
          createPunctuationPayload('doubleQuote'),
        );

        describe('supports composed autoformatting for quotation', () => {
          const { editorView } = editor(doc(p('{<>}')));
          typeText(editorView, 'it');
          expect(editorView.state.doc).toEqualDocument(doc(p('it{<>}')));

          typeText(editorView, "'s");
          expect(editorView.state.doc).toEqualDocument(doc(p('it’s{<>}')));
        });

        describe('should not break other inline marks', () => {
          const { editorView } = editor(doc(p(strong('it{<>} test'))));
          typeText(editorView, "'s");
          expect(editorView.state.doc).toEqualDocument(
            doc(p(strong('it’s test'))),
          );
        });

        describe('should not break other inline marks', () => {
          const { editorView } = editor(doc(p(strong(em('it{<>}')))));
          typeText(editorView, "'s");
          expect(editorView.state.doc).toEqualDocument(
            doc(p(strong(em('it’s')))),
          );
        });

        it('should only trigger on text selections #1', () => {
          const { editorView } = editor(
            doc(
              code_block()(`'str'`),
              '{<node>}',
              panel({ type: 'info' })(p('something else')),
            ),
          );
          typeText(editorView, 's');
          expect(editorView.state.doc).toEqualDocument(
            doc(code_block()(`'str'`), p('s')),
          );
        });

        it('should only trigger on text selections #2', () => {
          const { editorView } = editor(
            doc(
              code_block()(`'str'`),
              '{<node>}',
              code_block()('something else'),
            ),
          );
          typeText(editorView, 's');
          expect(editorView.state.doc).toEqualDocument(
            doc(code_block()(`'str'`), p('s')),
          );
        });

        // test spacing
        autoformats(
          '  \t   "hello" \'world\'   ',
          p('  \t   “hello” ‘world’   '),
          createPunctuationPayload('doubleQuote'),
        );

        describe('cursor movement', () => {
          const { editorView } = editor(doc(p('hel{<}lo{>}o')));
          typeText(editorView, '"');
          expect(editorView.state.doc).toEqualDocument(doc(p('hel”{<>}o')));

          const { empty } = editorView.state.selection;
          expect(empty).toBe(true);
        });
      });

      describe('arrow rule', () => {
        const createSymbolPayload = (
          symbol: 'leftArrow' | 'rightArrow' | 'doubleArrow',
        ) => ({
          action: 'autoSubstituted',
          actionSubject: 'text',
          actionSubjectId: 'symbol',
          eventType: 'track',
          attributes: expect.objectContaining({
            symbol,
          }),
        });

        notautoformats('->');
        notautoformats('-->');
        notautoformats('<-');
        notautoformats('<->');
        notautoformats('<--');
        notautoformats('>');
        notautoformats('-!>');

        notautoformats('-->>');
        notautoformats('-->> ');
        notautoformats('->> ');

        // autoformat only after space
        autoformats('-> ', p('→ '), createSymbolPayload('rightArrow'));
        autoformats('--> ', p('→ '), createSymbolPayload('rightArrow'));
        autoformats('<- ', p('← '), createSymbolPayload('leftArrow'));
        autoformats('<-- ', p('← '), createSymbolPayload('leftArrow'));
        autoformats('<-> ', p('↔︎ '), createSymbolPayload('doubleArrow'));

        // test spacing
        autoformatCombinations(
          [' \t   -> ', ' \t  --> ', ' '],
          ' \t   →  \t  →  ',
        );

        describe('cursor movement', () => {
          const { editorView } = editor(doc(p('hel{<}lo{>}o')));
          typeText(editorView, ' -> ');
          expect(editorView.state.doc).toEqualDocument(doc(p('hel → {<>}o')));

          const { empty } = editorView.state.selection;
          expect(empty).toBe(true);
        });
      });

      describe('typography rule', () => {
        notautoformats('.. .');

        autoformats(
          '...',
          p('…'),

          createPunctuationPayload('ellipsis'),
        );
        autoformatCombinations(['...', '.'], '….');
        autoformatCombinations(['...', '...'], '……');
        autoformatCombinations(['...', '\t...'], '…\t…');
        autoformatCombinations(['\t ...', '  \t text'], '\t …  \t text');

        notautoformats('--');
        notautoformats('    --.');

        autoformats(
          '-- ',
          p('– '),

          createPunctuationPayload('emDash'),
        );
        autoformats(
          '--\t',
          p('–\t'),

          createPunctuationPayload('emDash'),
        );

        autoformatCombinations(['\t -- ', '  \t text'], '\t –   \t text');

        describe('cursor movement', () => {
          const { editorView } = editor(doc(p('hel{<}lo{>}o')));
          typeText(editorView, '...');
          expect(editorView.state.doc).toEqualDocument(doc(p('hel…{<>}o')));

          const { empty } = editorView.state.selection;
          expect(empty).toBe(true);
        });
      });

      describe('strong rule', () => {
        it('should call analytics events', () => {
          const { editorView, sel } = editor(doc(p('hello {<>} there')));

          insertText(editorView, '**text**', sel);
          expect(createAnalyticsEvent).toHaveBeenCalledWith(
            createFormattedPayload('strong'),
          );
        });

        it('should convert text to strong for link also', () => {
          const { editorView, sel } = editor(
            doc(
              p(
                '**',
                link({ href: 'http://www.atlassian.com' })('Atlassian'),
                '{<>}',
              ),
            ),
          );

          insertText(editorView, '**', sel);

          expect(editorView.state.doc).toEqualDocument(
            doc(
              p(
                strong(link({ href: 'http://www.atlassian.com' })('Atlassian')),
              ),
            ),
          );
        });

        it('should not convert the surrounding text to strong', () => {
          const { editorView, sel } = editor(doc(p('hello {<>} there')));

          insertText(editorView, '**text**', sel);

          expect(editorView.state.doc).toEqualDocument(
            doc(p('hello ', strong('text'), ' there')),
          );
        });

        it('should not apply strong to ** prefixed words when later ** pair found', () => {
          const { editorView, sel } = editor(
            doc(p('using **prefixed words along with **strong{<>}')),
          );

          insertText(editorView, '**', sel);

          expect(editorView.state.doc).toEqualDocument(
            doc(p('using **prefixed words along with ', strong('strong'))),
          );
        });

        it('should not apply strong to __ prefixed words when later __ pair found', () => {
          const { editorView, sel } = editor(
            doc(p('using __prefixed words along with __strong{<>}')),
          );

          insertText(editorView, '__', sel);

          expect(editorView.state.doc).toEqualDocument(
            doc(p('using __prefixed words along with ', strong('strong'))),
          );
        });
      });

      describe('em rule', () => {
        it('should call analytics events', () => {
          const { editorView, sel } = editor(doc(p('hello {<>} there')));

          insertText(editorView, '*text*', sel);

          expect(createAnalyticsEvent).toHaveBeenCalledWith(
            createFormattedPayload('italic'),
          );
        });

        it('should keep current marks when converting from markdown', () => {
          const { editorView, sel } = editor(
            doc(p(strong('This is bold {<>}'))),
          );

          insertText(editorView, '*italic*', sel);
          expect(editorView.state.doc).toEqualDocument(
            doc(p(strong('This is bold '), em(strong('italic')))),
          );
        });

        it('should not apply em to _ prefixed words when later _ pair found', () => {
          const { editorView, sel } = editor(
            doc(p('using _prefixed words along with _italics{<>}')),
          );

          insertText(editorView, '_', sel);

          expect(editorView.state.doc).toEqualDocument(
            doc(p('using _prefixed words along with ', em('italics'))),
          );
        });

        it('should not apply em to * prefixed words when later * pair found', () => {
          const { editorView, sel } = editor(
            doc(p('using *prefixed words along with *italics{<>}')),
          );

          insertText(editorView, '*', sel);

          expect(editorView.state.doc).toEqualDocument(
            doc(p('using *prefixed words along with ', em('italics'))),
          );
        });

        it('should allow single _ in strong', () => {
          const { editorView, sel } = editor(
            doc(p('plain text __this_is_strong{<>}')),
          );

          insertText(editorView, '__', sel);

          expect(editorView.state.doc).toEqualDocument(
            doc(p('plain text ', strong('this_is_strong'))),
          );
        });
      });

      describe('strike rule', () => {
        it('should call analytics events', () => {
          const { editorView, sel } = editor(doc(p('hello {<>} there')));

          insertText(editorView, '~~text~~', sel);

          expect(createAnalyticsEvent).toHaveBeenCalledWith(
            createFormattedPayload('strike'),
          );
        });

        it('should not apply strike to ~~ prefixed words when later ~~ pair found', () => {
          const { editorView, sel } = editor(
            doc(p('using ~~prefixed words along with ~~strike{<>}')),
          );

          insertText(editorView, '~~', sel);

          expect(editorView.state.doc).toEqualDocument(
            doc(p('using ~~prefixed words along with ', strike('strike'))),
          );
        });
      });

      describe('code rule', () => {
        it('should call analytics events', () => {
          const { editorView, sel } = editor(doc(p('hello {<>} there')));

          insertText(editorView, '`text`', sel);

          expect(createAnalyticsEvent).toHaveBeenCalledWith(
            createFormattedPayload('code'),
          );
        });

        it('should convert mention to plain text', () => {
          const mentionNode = mention({ id: '1234', text: '@helga' })();
          const { editorView, sel } = editor(
            doc(p('hey! `hello, ', mentionNode, ' there{<>}?')),
          );
          insertText(editorView, '`', sel);

          expect(editorView.state.doc).toEqualDocument(
            doc(p('hey! ', code('hello, @helga there'), '?')),
          );
        });

        it('should convert emoji to plain text', () => {
          const emojiNode = emoji({ shortName: ':smile:', text: '🙂' })();
          const { editorView, sel } = editor(
            doc(p('hey! `', emojiNode, ' there{<>}')),
          );
          insertText(editorView, '`', sel);

          expect(editorView.state.doc).toEqualDocument(
            doc(p('hey! ', code('🙂 there'))),
          );
        });

        it('should cleanup other formatting', () => {
          const mentionNode = mention({ id: '1234', text: '@helga' })();
          const { editorView, sel } = editor(
            doc(
              p(
                '`',
                strong('hello '),
                mentionNode,
                em(', '),
                strike('there?{<>}'),
              ),
            ),
          );
          insertText(editorView, '`', sel);

          expect(editorView.state.doc).toEqualDocument(
            doc(p(code('hello @helga, there?'))),
          );
        });

        it('should not cleanup other formatting in line before code mark', () => {
          const { editorView, sel } = editor(
            doc(p('testing – testing → testing ', '`', strong('code{<>}'))),
          );
          insertText(editorView, '`', sel);

          expect(editorView.state.doc).toEqualDocument(
            doc(p('testing – testing → testing ', code('code'))),
          );
        });

        it('should not apply when prefixed by text', () => {
          const { editorView, sel } = editor(doc(p('words`code{<>}')));
          insertText(editorView, '`', sel);

          expect(editorView.state.doc).toEqualDocument(
            doc(p('words`code`{<>}')),
          );
        });

        it('should not apply when prefixed by text and parentheses', () => {
          const { editorView, sel } = editor(doc(p('words(`code{<>}')));
          insertText(editorView, '`', sel);

          expect(editorView.state.doc).toEqualDocument(
            doc(p('words(`code`{<>}')),
          );
        });

        it('should apply when prefixed by a space and parentheses', () => {
          const { editorView, sel } = editor(doc(p('words (`code{<>}')));
          insertText(editorView, '`', sel);

          expect(editorView.state.doc).toEqualDocument(
            doc(p('words (', code('code'), '{<>}')),
          );
        });

        it('should delete an existing selection and apply', () => {
          const { editorView } = editor(doc(p('here `some{<} words{>}')));
          typeText(editorView, '`');

          expect(editorView.state.doc).toEqualDocument(
            doc(p('here ', code('some{<>}'))),
          );
        });

        it('should not apply code to non text nodes', () => {
          const { editorView } = editor(
            doc(p('`here', hardBreak(), 'lies{<>}')),
          );
          typeText(editorView, '`');

          expect(editorView.state.doc).toEqualDocument(
            doc(p('`here', hardBreak(), 'lies`')),
          );
        });
      });

      describe('nested rules', () => {
        it('should not convert " __world__" to strong if I insert a space afterwards', () => {
          const { editorView, sel } = editor(doc(p(' __world__{<>}')));

          insertText(editorView, ' ', sel);

          expect(editorView.state.doc).toEqualDocument(doc(p(' __world__ ')));
        });

        it('should convert "~~**text**~~" to strike strong', () => {
          const { editorView, sel } = editor(doc(p('{<>}')));

          insertText(editorView, '~~**text**', sel);
          expect(editorView.state.doc).toEqualDocument(
            doc(p('~~', strong('text'))),
          );
          insertText(editorView, '~~', editorView.state.selection.from);
          expect(editorView.state.doc).toEqualDocument(
            doc(p(strike(strong('text')))),
          );
        });
      });

      describe('autoformatting is not right inclusive', () => {
        const autoformatsNotRightInclusive = (
          string: string,
          content: BuilderContent,
        ) => {
          it(`should not be right inclusive: ${string}`, () => {
            const { editorView, sel } = editor(doc(p('{<>}')));
            insertText(editorView, string, sel);
            insertText(
              editorView,
              'text',
              editorView.state.selection.$from.pos,
            );
            expect(editorView.state.doc).toEqualDocument(
              doc(p(content, 'text')),
            );
          });
        };
        autoFormatPatterns.forEach((pattern) => {
          autoformatsNotRightInclusive(pattern.string, pattern.doc);
        });
      });

      describe('valid autoformatting', () => {
        describe('simple single word', () => {
          autoFormatPatterns.forEach((pattern) => {
            autoformats(pattern.string, p(pattern.doc));
          });
        });

        describe('simple single word in heading', () => {
          autoFormatPatterns.forEach((pattern) => {
            autoformats(
              pattern.string,
              h1(pattern.doc),
              pattern.analyticsGasV3Payload,
              h1,
            );
          });
        });

        describe('multiple word should autoformat', () => {
          autoformats('__test test__', p(strong('test test')));
          autoformats('**test test**', p(strong('test test')));
          autoformats('_test test_', p(em('test test')));
          autoformats('*test test*', p(em('test test')));
          autoformats('~~test test~~', p(strike('test test')));
          autoformats('`test test`', p(code('test test')));
        });

        describe('single word with special characters', () => {
          autoformats('__^hello__', p(strong('^hello')));
          autoformats('**^hello**', p(strong('^hello')));
          autoformats('_^hello_', p(em('^hello')));
          autoformats('*^hello*', p(em('^hello')));
          autoformats('~~^hello~~', p(strike('^hello')));
          autoformats('`^hello`', p(code('^hello')));
          autoformats('__`test`__', p(strong('`test`')));
          autoformats('**`test`**', p(strong('`test`')));
          autoformats('_`test`_', p(em('`test`')));
          autoformats('*`test`*', p(em('`test`')));
          autoformats('~~`test`~~', p(strike('`test`')));
        });

        describe('single character', () => {
          autoformats('__a__', p(strong('a')));
          autoformats('**a**', p(strong('a')));
          autoformats('_a_', p(em('a')));
          autoformats('*a*', p(em('a')));
          autoformats('~~a~~', p(strike('a')));
          autoformats('`a`', p(code('a')));
        });

        describe('2 characters', () => {
          autoformats('__ab__', p(strong('ab')));
          autoformats('**ab**', p(strong('ab')));
          autoformats('_ab_', p(em('ab')));
          autoformats('*ab*', p(em('ab')));
          autoformats('~~ab~~', p(strike('ab')));
          autoformats('`ab`', p(code('ab')));
        });

        describe('after other works', () => {
          autoFormatPatterns.forEach((pattern) => {
            autoformats(
              `abc abc abc ${pattern.string}`,
              p('abc abc abc ', pattern.doc),
            );
          });
        });

        describe('` not in beginning of the word', () => {
          autoFormatPatterns.forEach((pattern) => {
            if (pattern.name !== 'code') {
              autoformats(`\`test ${pattern.string}`, p('`test ', pattern.doc));
              autoformats(`\` ${pattern.string}`, p('` ', pattern.doc));
            }
          });
        });

        describe('when inside code block', () => {
          const notautoformatsAfterInCodeBlock = (string: string) => {
            it(`should not autoformat: ${string}`, () => {
              const { editorView, sel } = editor(doc(code_block()('{<>}')));
              insertText(editorView, string, sel);
              expect(editorView.state.doc).toEqualDocument(
                doc(code_block()(string)),
              );
            });
          };
          autoFormatPatterns.forEach((pattern) => {
            notautoformatsAfterInCodeBlock(pattern.string);
          });
        });

        describe('when there is code mark in the line', () => {
          const autoformatsAfterCodeMark = (
            string: string,
            content: BuilderContent,
          ) => {
            it(`should autoformat: ${string}`, () => {
              const { editorView, sel } = editor(doc(p(code('abc'), ' {<>}')));
              insertText(editorView, string, sel);
              expect(editorView.state.doc).toEqualDocument(
                doc(p(code('abc'), ' ', content)),
              );
            });
          };
          autoFormatPatterns.forEach((pattern) => {
            autoformatsAfterCodeMark(pattern.string, pattern.doc);
          });
        });

        describe('combination of regex should autoformat', () => {
          // conbining autoformatting
          autoformatCombinations(['~~__test__', '~~'], strike(strong('test')));
          autoformatCombinations(['*__test__', '*'], em(strong('test')));
          autoformatCombinations(['~~**test**', '~~'], strike(strong('test')));
          autoformatCombinations(['_**test**', '_'], em(strong('test')));
          autoformatCombinations(['~~_test_', '~~'], strike(em('test')));
          autoformatCombinations(['**_test_', '**'], strong(em('test')));
          autoformatCombinations(['~~*test*', '~~'], strike(em('test')));
          autoformatCombinations(['__*test*', '__'], strong(em('test')));
          autoformatCombinations(['__~~test~~', '__'], strong(strike('test')));
          autoformatCombinations(['**~~test~~', '**'], strong(strike('test')));
          autoformatCombinations(['_~~test~~', '_'], em(strike('test')));
          autoformatCombinations(['*~~test~~', '*'], em(strike('test')));
          autoformatCombinations(
            ['*~~__test__', '~~', '*'],
            em(strike(strong('test'))),
          );
          autoformatCombinations(
            ['~~*__test__', '*', '~~'],
            strike(em(strong('test'))),
          );
          autoformatCombinations(
            ['_~~**test**', '~~', '_'],
            em(strike(strong('test'))),
          );
        });
      });

      describe('code mark autoformatting using ` with space or other regex characters', () => {
        notautoformats('` test`');
        autoformats('`test test`', p(code('test test')));
      });

      describe('invalid autoformatting', () => {
        describe('space or text after autoformatting character', () => {
          // these strings can not ne testes using notautoformats function
          // as they autoformat as soon as '__test__' is entered and does not waits for following space
          // space after
          autoFormatPatterns.forEach((pattern) => {
            checkInvalidStrings(
              pattern.regex,
              `${pattern.string} `,
              pattern.name,
            );
            checkInvalidStrings(
              pattern.regex,
              `${pattern.string} abc`,
              pattern.name,
            );
          });
        });

        describe('text before', () => {
          autoFormatPatterns.forEach((pattern) => {
            notautoformats(`abc${pattern.string}`);
          });
        });

        describe('single space character', () => {
          notautoformats('__ __');
          notautoformats('** **');
          notautoformats('_ _');
          notautoformats('~~ ~~');
        });

        describe('single character same as autoformatting character', () => {
          notautoformats('_____');
          notautoformats('*****');
          notautoformats('___');
          notautoformats('***');
          notautoformats('~~~~~');
        });

        describe('multiple characters same as autoformatting character', () => {
          notautoformats('_______');
          notautoformats('*******');
          notautoformats('_____');
          notautoformats('*****');
          notautoformats('~~~~~~~');
        });

        describe('space after formatting character', () => {
          notautoformats('__ test__');
          notautoformats('** test**');
          notautoformats('_ test_');
          notautoformats('~~ test~~');
        });

        describe('backtick before', () => {
          autoFormatPatterns.forEach((pattern) => {
            notautoformats(`\`${pattern.string}`);
          });
        });

        describe('wrong combinations', () => {
          notautoformats('___test__');
          notautoformats('___test_');
          notautoformats('***test**');
          notautoformats('***test*');
        });

        describe('across hardbreak', () => {
          it(`should not autoformat:`, () => {
            const { editorView, sel } = editor(
              doc(p('**start', hardBreak(), 'end*{<>}')),
            );
            insertText(editorView, '*', sel);
            expect(editorView.state.doc).toEqualDocument(
              doc(p('**start', hardBreak(), 'end**')),
            );
          });
        });

        describe('after hardbreak', () => {
          it('should autoformat strong:', () => {
            const { editorView, sel } = editor(
              doc(p('test', hardBreak(), '**strong{<>}')),
            );
            insertText(editorView, '**', sel);
            expect(editorView.state.doc).toEqualDocument(
              doc(p('test', hardBreak(), strong('strong'))),
            );
          });

          it('should autoformat italic:', () => {
            const { editorView, sel } = editor(
              doc(p('test', hardBreak(), '*italic{<>}')),
            );
            insertText(editorView, '*', sel);
            expect(editorView.state.doc).toEqualDocument(
              doc(p('test', hardBreak(), em('italic'))),
            );
          });

          it('should autoformat inline code:', () => {
            const { editorView, sel } = editor(
              doc(p('test', hardBreak(), '`code{<>}')),
            );
            insertText(editorView, '`', sel);
            expect(editorView.state.doc).toEqualDocument(
              doc(p('test', hardBreak(), code('code'))),
            );
          });

          it('should autoformat inside heading:', () => {
            const { editorView, sel } = editor(
              doc(h1('test', hardBreak(), '*italic{<>}')),
            );
            insertText(editorView, '*', sel);
            expect(editorView.state.doc).toEqualDocument(
              doc(h1('test', hardBreak(), em('italic'))),
            );
          });
        });

        describe('containing inline node', () => {
          it(`should autoformat:`, () => {
            const mentioned = mention({ id: '1234', text: '@helga' })();
            const { editorView, sel } = editor(
              doc(p('**start', mentioned, 'end*{<>}')),
            );
            insertText(editorView, '*', sel);
            expect(editorView.state.doc).toEqualDocument(
              doc(p(strong('start'), strong(mentioned), strong('end'))),
            );
          });
        });
      });
    },
  );
});
