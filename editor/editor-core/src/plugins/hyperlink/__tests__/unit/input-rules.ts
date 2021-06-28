import {
  createProsemirrorEditorFactory,
  Preset,
  LightEditorPlugin,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import dispatchPasteEvent from '@atlaskit/editor-test-helpers/dispatch-paste-event';
import {
  doc,
  br,
  p,
  a as link,
  strong,
  code_block,
  DocBuilder,
} from '@atlaskit/editor-test-helpers/doc-builder';
import sendKeyToPm from '@atlaskit/editor-test-helpers/send-key-to-pm';
import { insertText } from '@atlaskit/editor-test-helpers/transactions';
import { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';
import analyticsPlugin from '../../../analytics';
import hyperlinkPlugin from '../../index';
import codeBlockPlugin from '../../../code-block';
import textFormattingPlugin from '../../../text-formatting';
import blockTypePlugin from '../../../block-type';

describe('hyperlink', () => {
  const createEditor = createProsemirrorEditorFactory();
  describe.each([true, false])(
    'when useUnpredictableInputRule is %s',
    (useUnpredictableInputRule) => {
      let createAnalyticsEvent: CreateUIAnalyticsEvent;

      const editor = (doc: DocBuilder) => {
        createAnalyticsEvent = jest.fn().mockReturnValue({ fire() {} });
        return createEditor({
          featureFlags: {
            useUnpredictableInputRule,
          },
          doc,
          preset: new Preset<LightEditorPlugin>()
            .add([analyticsPlugin, { createAnalyticsEvent }])
            .add(hyperlinkPlugin)
            .add(blockTypePlugin)
            .add(textFormattingPlugin)
            .add(codeBlockPlugin),
        });
      };

      describe('input rules', () => {
        describe('when there is no link before the space', () => {
          it('should not convert "gnu.org" to hyperlink', () => {
            const { editorView, sel } = editor(
              doc(p('loko gnu.org not-a-link{<>}')),
            );
            insertText(editorView, ' ', sel, sel);

            expect(editorView.state.doc).toEqualDocument(
              doc(p('loko gnu.org not-a-link ')),
            );
          });
        });

        describe('when there is space before the selection', () => {
          it('should not convert "gnu.org" to hyperlink', () => {
            const { editorView, sel } = editor(doc(p('loko gnu.org {<>}')));
            insertText(editorView, ' ', sel, sel);

            expect(editorView.state.doc).toEqualDocument(
              doc(p('loko gnu.org  ')),
            );
          });
        });

        describe('when there are multiple spaces before the selection', () => {
          it('should not convert "gnu.org" to hyperlink', () => {
            const { editorView, sel } = editor(doc(p('loko gnu.org     {<>}')));
            insertText(editorView, ' ', sel, sel);

            expect(editorView.state.doc).toEqualDocument(
              doc(p('loko gnu.org      ')),
            );
          });
        });

        describe('when there is a link before', () => {
          it('should convert the last link only "gnu.org" to hyperlink', () => {
            const { editorView, sel } = editor(doc(p('gnu1.org {<>}')));
            insertText(editorView, 'gnu.org ', sel, sel);

            const a = link({ href: 'http://gnu.org' })('gnu.org');
            expect(editorView.state.doc).toEqualDocument(
              doc(p('gnu1.org ', a, ' ')),
            );
          });
        });

        describe('when there is content before', () => {
          describe('and when there is a link before', () => {
            it('should convert the last link only "gnu.org" to hyperlink', () => {
              const { editorView, sel } = editor(doc(p('loko gnu1.org {<>}')));
              insertText(editorView, 'gnu.org ', sel, sel);

              const a = link({ href: 'http://gnu.org' })('gnu.org');
              expect(editorView.state.doc).toEqualDocument(
                doc(p('loko gnu1.org ', a, ' ')),
              );
            });
          });

          it('should convert "gnu.org" to hyperlink', () => {
            const { editorView, sel } = editor(doc(p('loko {<>}')));
            insertText(editorView, 'gnu.org ', sel, sel);

            const a = link({ href: 'http://gnu.org' })('gnu.org');
            expect(editorView.state.doc).toEqualDocument(
              doc(p('loko ', a, ' ')),
            );
          });

          it('should convert "gnu.org" to hyperlink when there is a special char before', () => {
            const { editorView, sel } = editor(doc(p('loko ?{<>}')));
            insertText(editorView, 'gnu.org ', sel, sel);

            const a = link({ href: 'http://gnu.org' })('gnu.org');
            expect(editorView.state.doc).toEqualDocument(
              doc(p('loko ?', a, ' ')),
            );
          });
        });

        it('should convert "www.atlassian.com" to hyperlink', () => {
          const { editorView, sel } = editor(doc(p('{<>}')));
          insertText(editorView, 'www.atlassian.com ', sel, sel);

          const a = link({ href: 'http://www.atlassian.com' })(
            'www.atlassian.com',
          );
          expect(editorView.state.doc).toEqualDocument(doc(p(a, ' ')));
        });

        it('should not convert a hash text to hyperlink', () => {
          const { editorView, sel } = editor(doc(p('{<>}')));
          insertText(editorView, '#test ', sel, sel);
          expect(editorView.state.doc).toEqualDocument(doc(p('#test ')));
        });

        it('should not convert "www.atlassian.com" to a hyperlink when we haven not hit space afterward', () => {
          const { editorView, sel } = editor(doc(p('{<>}')));
          insertText(editorView, 'www.atlassian.com', sel, sel);

          expect(editorView.state.doc).toEqualDocument(
            doc(p('www.atlassian.com')),
          );
        });

        it('should convert "www.atlassian.com/" to hyperlink', () => {
          const { editorView, sel } = editor(doc(p('{<>}')));
          insertText(editorView, 'www.atlassian.com/ ', sel, sel);

          const a = link({ href: 'http://www.atlassian.com/' })(
            'www.atlassian.com/',
          );
          expect(editorView.state.doc).toEqualDocument(doc(p(a, ' ')));
        });

        it('should convert "http://www.atlassian.com/" to hyperlink', () => {
          const { editorView, sel } = editor(doc(p('{<>}')));
          insertText(editorView, 'http://www.atlassian.com/ ', sel, sel);

          const a = link({ href: 'http://www.atlassian.com/' })(
            'http://www.atlassian.com/',
          );
          expect(editorView.state.doc).toEqualDocument(doc(p(a, ' ')));
        });

        it('should convert "http://www.atlassian.com" to hyperlink', () => {
          const { editorView, sel } = editor(doc(p('{<>}')));
          insertText(editorView, 'http://www.atlassian.com ', sel, sel);

          const a = link({ href: 'http://www.atlassian.com' })(
            'http://www.atlassian.com',
          );
          expect(editorView.state.doc).toEqualDocument(doc(p(a, ' ')));
        });

        it('should convert "https://www.atlassian.com/" to hyperlink', () => {
          const { editorView, sel } = editor(doc(p('{<>}')));
          insertText(editorView, 'https://www.atlassian.com/ ', sel, sel);

          const a = link({ href: 'https://www.atlassian.com/' })(
            'https://www.atlassian.com/',
          );
          expect(editorView.state.doc).toEqualDocument(doc(p(a, ' ')));
        });

        ['?', '!', ')', '(', '[', ']', ';', '{', '}', ',', '.'].forEach(
          (punctuation) => {
            it(`should not convert trailing '${punctuation}' in "https://www.atlassian.com${punctuation}" to hyperlink`, () => {
              const { editorView, sel } = editor(doc(p('{<>}')));
              insertText(
                editorView,
                `https://www.atlassian.com${punctuation} `,
                sel,
                sel,
              );

              const a = link({ href: 'https://www.atlassian.com' })(
                'https://www.atlassian.com',
              );
              expect(editorView.state.doc).toEqualDocument(
                doc(p(a, `${punctuation} `)),
              );
            });
          },
        );

        ['?', '!', ')', '(', '[', ']', '{', '}', ',', '.'].forEach(
          (punctuation) => {
            it(`should not convert trailing '${punctuation}' in "https://www.atlassian.com/${punctuation}" to hyperlink`, () => {
              const { editorView, sel } = editor(doc(p('{<>}')));
              insertText(
                editorView,
                `https://www.atlassian.com/${punctuation} `,
                sel,
                sel,
              );

              const a = link({ href: 'https://www.atlassian.com/' })(
                'https://www.atlassian.com/',
              );
              expect(editorView.state.doc).toEqualDocument(
                doc(p(a, `${punctuation} `)),
              );
            });
          },
        );

        it('should convert only the link in "?https://www.atlassian.com?" to hyperlink', () => {
          const { editorView, sel } = editor(doc(p('{<>}')));
          insertText(editorView, '?https://www.atlassian.com? ', sel, sel);

          const a = link({ href: 'https://www.atlassian.com' })(
            'https://www.atlassian.com',
          );
          expect(editorView.state.doc).toEqualDocument(doc(p('?', a, '? ')));
        });

        it('should convert only the link in "?https://www.atlassian.com" to hyperlink', () => {
          const { editorView, sel } = editor(doc(p('{<>}')));
          insertText(editorView, '?https://www.atlassian.com ', sel, sel);

          const a = link({ href: 'https://www.atlassian.com' })(
            'https://www.atlassian.com',
          );
          expect(editorView.state.doc).toEqualDocument(doc(p('?', a, ' ')));
        });

        it('should not convert "https://www.atlassian.com" to hyperlink inside a code_block', () => {
          const { editorView, sel } = editor(doc(code_block()('{<>}')));
          insertText(editorView, 'https://www.atlassian.com ', sel, sel);

          expect(editorView.state.doc).toEqualDocument(
            doc(code_block()('https://www.atlassian.com ')),
          );
        });

        it('should not convert "javascript://alert(1) " to hyperlink', () => {
          const { editorView, sel } = editor(doc(p('{<>}')));
          insertText(editorView, 'javascript://alert(1); ', sel, sel);

          expect(editorView.state.doc).toEqualDocument(
            doc(p('javascript://alert(1); ')),
          );
        });

        it('should convert prettyandsimple@example.com to a link', () => {
          const { editorView, sel } = editor(doc(p('{<>}')));
          insertText(editorView, 'prettyandsimple@example.com ', sel, sel);
          expect(editorView.state.doc).toEqualDocument(
            doc(
              p(
                link({ href: 'mailto:prettyandsimple@example.com' })(
                  'prettyandsimple@example.com',
                ),
                ' ',
              ),
            ),
          );
        });

        it('should not convert mention like string to a mailto link', () => {
          const { editorView, sel } = editor(doc(p('{<>}')));
          insertText(editorView, '@example ', sel, sel);
          expect(editorView.state.doc).toEqualDocument(doc(p('@example ')));
        });

        it('should not convert invalid emails like to a mailto link (double dot)', () => {
          const { editorView, sel } = editor(doc(p('{<>}')));
          insertText(editorView, 'john.doe@example..com ', sel, sel);
          expect(editorView.state.doc).toEqualDocument(
            doc(p('john.doe@example..com ')),
          );
        });

        it('should convert "[text](http://foo)" to hyperlink', () => {
          const { editorView, sel } = editor(doc(p('{<>}')));
          insertText(editorView, '[text](http://foo)', sel, sel);

          expect(editorView.state.doc).toEqualDocument(
            doc(p(link({ href: 'http://foo' })('text'))),
          );
        });

        it('should convert text with spaces "[text text](http://foo)" to hyperlink', () => {
          const { editorView, sel } = editor(doc(p('{<>}')));
          insertText(editorView, '[text text](http://foo)', sel, sel);

          expect(editorView.state.doc).toEqualDocument(
            doc(p(link({ href: 'http://foo' })('text text'))),
          );
        });

        it('should convert "[text](http://foo)" to hyperlink inside a code_block', () => {
          const { editorView, sel } = editor(doc(code_block()('{<>}')));
          insertText(editorView, '[text](http://foo)', sel, sel);

          expect(editorView.state.doc).toEqualDocument(
            doc(code_block()('[text](http://foo)')),
          );
        });

        it('is not part of hyperlink after if I have close my link markdown', () => {
          const { editorView, sel } = editor(doc(p('{<>}')));
          const linkedText = 'http://foo.com';
          insertText(editorView, `[${linkedText}](http://foo.com)`, sel, sel);
          insertText(
            editorView,
            'hello',
            sel + linkedText.length,
            sel + linkedText.length,
          );

          expect(editorView.state.doc).toEqualDocument(
            doc(p(link({ href: 'http://foo.com' })(`${linkedText}`), 'hello')),
          );
        });

        it('does not convert to hyperlink if the previous part already contains a hyperlink', () => {
          const { editorView, sel } = editor(doc(p('{<>}')));
          const linkedText = 'http://foo.com';
          insertText(editorView, `[${linkedText}](http://foo.com)`, sel, sel);
          insertText(
            editorView,
            '. ',
            sel + linkedText.length,
            sel + linkedText.length,
          );

          expect(editorView.state.doc).toEqualDocument(
            doc(p(link({ href: 'http://foo.com' })(`${linkedText}`), '. ')),
          );
        });

        it('does convert to hyperlink if the previous link part is already linkified', () => {
          const { editorView, sel } = editor(
            doc(
              p(
                '[test](',
                link({ href: 'http://www.atlassian.com' })(
                  'http://www.atlassian.com{<>}',
                ),
              ),
            ),
          );
          insertText(editorView, ')', sel);

          expect(editorView.state.doc).toEqualDocument(
            doc(p(link({ href: 'http://www.atlassian.com' })('test'))),
          );
        });

        it('Does not nest hyperlinks when a html hyperlink is pasted', () => {
          const { editorView } = editor(doc(p('')));
          /** Taken from copying a link in JIRA */
          const htmlInput = `<meta charset='utf-8'><a href=\"https://atlassian.com/\" target=\"_blank\" title=\"https://atlassian.com\" rel=\"noreferrer noopener\" class=\"josSif\" style=\"color: rgb(0, 82, 204); text-decoration: none; cursor: pointer; font-family: -apple-system, system-ui, &quot;Segoe UI&quot;, Roboto, Oxygen, Ubuntu, &quot;Fira Sans&quot;, &quot;Droid Sans&quot;, &quot;Helvetica Neue&quot;, sans-serif; font-size: 14px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; white-space: pre-wrap; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; background-color: rgb(255, 255, 255);\">https://atlassian.com</a>`;

          dispatchPasteEvent(editorView, { html: htmlInput });

          expect(editorView.state.doc).toEqualDocument(
            doc(
              p(
                link({ href: 'https://atlassian.com/' })(
                  'https://atlassian.com',
                ),
              ),
            ),
          );
        });

        it('does convert to hyperlink if markdown formatting is used with link pasting', () => {
          const { editorView, sel } = editor(doc(p('[test]({<>}')));
          dispatchPasteEvent(editorView, { plain: 'http://www.atlassian.com' });
          insertText(editorView, ')', sel + 'http://www.atlassian.com'.length);

          expect(editorView.state.doc).toEqualDocument(
            doc(p(link({ href: 'http://www.atlassian.com' })('test'))),
          );
        });

        it('does convert to hyperlink if markdown formatting is used with pasting of link with spaces', () => {
          const { editorView, sel } = editor(doc(p('[test]({<>}')));
          dispatchPasteEvent(editorView, {
            plain: 'http://www.atla%20ssian.com',
          });
          insertText(
            editorView,
            ')',
            sel + 'http://www.atla%20ssian.com'.length,
          );

          expect(editorView.state.doc).toEqualDocument(
            doc(p(link({ href: 'http://www.atla%20ssian.com' })('test'))),
          );
        });

        it('does not remove existsing other mark', () => {
          const { editorView, sel } = editor(doc(p(strong('www.{<>}'))));
          insertText(editorView, 'google.com ', sel, sel);

          expect(editorView.state.doc).toEqualDocument(
            doc(
              p(
                link({ href: 'http://www.google.com' })(
                  strong('www.google.com'),
                ),
                strong(' '),
              ),
            ),
          );
        });

        it('converts to hyperlink if possible hyperink text is after a new line and previous line has an hyperlink', () => {
          const firstLink = link({ href: 'http://www.google.com' })(
            'www.google.com',
          );
          const secondLink = link({ href: 'http://www.baidu.com' })(
            'www.baidu.com',
          );
          const { editorView, sel } = editor(
            doc(p(firstLink, br()), p('{<>}')),
          );
          insertText(editorView, 'www.baidu.com ', sel, sel);

          expect(editorView.state.doc).toEqualDocument(
            doc(p(firstLink, br()), p(secondLink, ' ')),
          );
        });

        it('should be able to remove hyperlink when its the first node of the paragraph', () => {
          const { editorView } = editor(
            doc(
              p(
                link({ href: 'http://www.google.com' })('{<}www.google.com{>}'),
              ),
            ),
          );

          sendKeyToPm(editorView, 'Backspace');
          insertText(editorView, 'text', editorView.state.selection.from);
          expect(editorView.state.doc).toEqualDocument(doc(p('text')));
        });
      });

      describe('should send analytics v3 events', () => {
        it('for autoDetect', () => {
          const { editorView, sel } = editor(doc(p('{<>}')));
          insertText(editorView, 'www.atlassian.com ', sel, sel);
          expect(createAnalyticsEvent).toBeCalledWith({
            action: 'inserted',
            actionSubject: 'document',
            actionSubjectId: 'link',
            attributes: expect.objectContaining({
              inputMethod: 'autoDetect',
              fromCurrentDomain: false,
            }),
            eventType: 'track',
            nonPrivacySafeAttributes: { linkDomain: 'atlassian.com' },
          });
        });

        it('for autoformatting', () => {
          const { editorView, sel } = editor(doc(p('{<>}')));
          insertText(editorView, '[text](http://foo)', sel, sel);
          expect(createAnalyticsEvent).toBeCalledWith({
            action: 'inserted',
            actionSubject: 'document',
            actionSubjectId: 'link',
            attributes: expect.objectContaining({
              inputMethod: 'autoformatting',
              fromCurrentDomain: false,
            }),
            eventType: 'track',
            nonPrivacySafeAttributes: { linkDomain: 'foo' },
          });
        });

        it('with only the domain', () => {
          const { editorView, sel } = editor(doc(p('{<>}')));
          insertText(editorView, 'http://foo.org/sensitive/data ', sel, sel);
          expect(createAnalyticsEvent).toBeCalledWith({
            action: 'inserted',
            actionSubject: 'document',
            actionSubjectId: 'link',
            attributes: expect.objectContaining({
              inputMethod: 'autoDetect',
              fromCurrentDomain: false,
            }),
            eventType: 'track',
            nonPrivacySafeAttributes: { linkDomain: 'foo.org' },
          });
        });
      });
    },
  );
});
