import createAnalyticsEventMock from '@atlaskit/editor-test-helpers/create-analytics-event-mock';
import createEditorFactory from '@atlaskit/editor-test-helpers/create-editor';

import {
  a,
  blockquote,
  bodiedExtension,
  cleanOne,
  decisionItem,
  decisionList,
  doc,
  inlineCard,
  li,
  p,
  panel,
  table,
  taskItem,
  taskList,
  td,
  text,
  th,
  tr,
  ul,
} from '@atlaskit/editor-test-helpers/schema-builder';

import defaultSchema from '@atlaskit/editor-test-helpers/schema';
import { insertText } from '@atlaskit/editor-test-helpers/transactions';
import { EditorView } from 'prosemirror-view';
import { Fragment, Node, Slice } from 'prosemirror-model';

import { pluginKey } from '../../main';
import { CardPluginState } from '../../../types';
import { queueCards, setProvider } from '../../actions';

import { setTextSelection } from '../../../../../utils';
import {
  insertCard,
  queueCardsFromChangedTr,
  shouldReplace,
  updateCard,
} from '../../doc';
import { INPUT_METHOD } from '../../../../analytics';
import { UIAnalyticsEvent } from '@atlaskit/analytics-next';
import {
  createCardRequest,
  ProviderWrapper,
  setupProvider,
} from '../../../../../__tests__/unit/plugins/card/_helpers';
import { CardProvider } from '@atlaskit/editor-common/provider-factory';

const inlineCardAdf = {
  type: 'inlineCard',
  attrs: {
    url: '',
    data: {
      '@context': 'https://www.w3.org/ns/activitystreams',
      '@type': 'Document',
      name: 'Welcome to Atlassian!',
      url: 'http://www.atlassian.com',
    },
  },
};

const atlassianUrl = 'http://www.atlassian.com/';
const googleUrl = 'http://www.google.com/';

describe('card', () => {
  const createEditor = createEditorFactory();
  let createAnalyticsEvent: jest.MockInstance<UIAnalyticsEvent, any>;
  const editor = (doc: any) => {
    createAnalyticsEvent = createAnalyticsEventMock();
    const editorWrapper = createEditor({
      doc,
      editorProps: {
        allowTables: {
          advanced: true,
        },
        allowAnalyticsGASV3: true,
        allowExtension: true,
        allowPanel: true,
        allowTasksAndDecisions: true,
        UNSAFE_cards: {},
      },
      createAnalyticsEvent: createAnalyticsEvent as any,
      pluginKey,
    });

    createAnalyticsEvent.mockClear();

    return editorWrapper;
  };

  describe('doc', () => {
    describe('#state.update', () => {
      it('keeps positions the same for typing after the link', () => {
        const { editorView, refs } = editor(
          doc(
            p(
              'hello have a link {<>}',
              a({ href: atlassianUrl })(atlassianUrl),
            ),
          ),
        );

        const { state, dispatch } = editorView;
        dispatch(
          queueCards([createCardRequest(atlassianUrl, refs['<>'])])(state.tr),
        );

        // should be at initial pos
        const initialState = {
          cards: [],
          requests: [
            expect.objectContaining({
              url: atlassianUrl,
              pos: refs['<>'],
            }),
          ],
          provider: null,
          showLinkingToolbar: false,
        } as CardPluginState;
        expect(pluginKey.getState(editorView.state)).toEqual(initialState);

        // type something at end
        setTextSelection(editorView, editorView.state.doc.nodeSize - 2);
        insertText(editorView, 'more text', editorView.state.selection.from);

        // nothing should have changed
        expect(pluginKey.getState(editorView.state)).toEqual(initialState);
      });

      it('queues the link in a slice as the only node', () => {
        const linkDoc = p(
          a({
            href: atlassianUrl,
          })(atlassianUrl),
        );

        const { editorView } = editor(doc(p('blah')));

        const from = 0;
        const to = editorView.state.doc.nodeSize - 2;
        const tr = editorView.state.tr.replaceRange(
          from,
          to,
          new Slice(Fragment.from(linkDoc(editorView.state.schema)), 1, 1),
        );

        editorView.dispatch(
          queueCardsFromChangedTr(editorView.state, tr, INPUT_METHOD.CLIPBOARD),
        );

        expect(pluginKey.getState(editorView.state)).toEqual({
          cards: [],
          requests: [
            {
              url: 'http://www.atlassian.com/',
              pos: 1,
              appearance: 'inline',
              compareLinkText: true,
              source: 'clipboard',
            },
          ],
          provider: null,
          showLinkingToolbar: false,
        } as CardPluginState);
      });

      it('remaps positions for typing before the link', () => {
        const { editorView, refs } = editor(
          doc(
            p(
              '{<>}hello have a link',
              a({ href: atlassianUrl })('{link}' + atlassianUrl),
            ),
          ),
        );

        const { state, dispatch } = editorView;
        dispatch(
          queueCards([createCardRequest(atlassianUrl, refs['link'])])(state.tr),
        );

        // type something at start
        const typedText = 'before everything';
        insertText(editorView, typedText, refs['<>']);

        // nothing should have changed
        expect(pluginKey.getState(editorView.state)).toEqual({
          cards: [],
          requests: [
            expect.objectContaining({
              url: atlassianUrl,
              pos: refs['link'] + typedText.length,
            }),
          ],
          provider: null,
          showLinkingToolbar: false,
        } as CardPluginState);
      });

      it('only remaps the relevant link based on position', () => {
        const hrefs = {
          A: atlassianUrl,
          B: googleUrl,
        };

        // create a doc with 2 links
        const { editorView, refs } = editor(
          doc(
            p(
              'hello have a link {<>}',
              a({ href: hrefs.A })('{A}' + hrefs.B),
              ' and {middle} another ',
              a({ href: hrefs.B })('{B}' + hrefs.B),
            ),
          ),
        );

        const { dispatch } = editorView;

        // queue both links
        (Object.keys(hrefs) as Array<keyof typeof hrefs>).map(key => {
          dispatch(
            queueCards([createCardRequest(hrefs[key], refs[key])])(
              editorView.state.tr,
            ),
          );
        });

        // everything should be at initial pos
        expect(pluginKey.getState(editorView.state)).toEqual({
          cards: [],
          requests: [
            expect.objectContaining({
              url: hrefs['A'],
              pos: refs['A'],
            }),
            expect.objectContaining({
              url: hrefs['B'],
              pos: refs['B'],
            }),
          ],
          provider: null,
          showLinkingToolbar: false,
        } as CardPluginState);

        // type something in between the links
        insertText(editorView, 'ok', refs['middle']);

        // only B should have moved 2 to the right
        expect(pluginKey.getState(editorView.state)).toEqual({
          cards: [],
          requests: [
            expect.objectContaining({
              url: hrefs['A'],
              pos: refs['A'],
            }),
            expect.objectContaining({
              url: hrefs['B'],
              pos: refs['B'] + 2,
            }),
          ],
          provider: null,
          showLinkingToolbar: false,
        } as CardPluginState);
      });
    });

    describe('does not replace if provider', () => {
      const initialDoc = doc(
        p(
          'hello have a link ',
          a({ href: atlassianUrl })('{<>}' + atlassianUrl),
        ),
      );

      let view: EditorView;
      let provider: CardProvider;

      beforeEach(() => {
        const { editorView } = editor(initialDoc);
        view = editorView;
      });

      afterEach(async () => {
        // queue should now be empty, and document should remain the same
        expect(pluginKey.getState(view.state)).toEqual({
          cards: [],
          requests: [],
          provider: provider,
          showLinkingToolbar: false,
        } as CardPluginState);

        expect(view.state.doc).toEqualDocument(initialDoc);
      });

      test('returns invalid ADF', async () => {
        const { dispatch } = view;
        const invalidADF = {
          type: 'panel',
          content: [
            {
              type: 'panel',
              content: [
                {
                  text: 'hello world',
                  type: 'text',
                },
              ],
            },
          ],
        };
        const providerWrapper = setupProvider(invalidADF);
        providerWrapper.addProvider(view);
        ({ provider } = providerWrapper);

        // try to replace the link using bad provider
        dispatch(
          queueCards([
            createCardRequest(atlassianUrl, view.state.selection.from),
          ])(view.state.tr),
        );
      });

      test('rejects', async () => {
        const { dispatch } = view;
        provider = new (class implements CardProvider {
          resolve(): Promise<any> {
            return Promise.reject('error').catch(() => {});
          }
        })();

        dispatch(setProvider(provider)(view.state.tr));

        // try to replace the link using bad provider
        dispatch(
          queueCards([
            createCardRequest(atlassianUrl, view.state.selection.from),
          ])(view.state.tr),
        );
      });
    });

    describe('changed document', () => {
      let providerWrapper: ProviderWrapper;

      beforeEach(() => {
        providerWrapper = setupProvider();
      });

      it('does not replace if link text changes', async () => {
        const href = 'http://www.sick.com/';
        const { editorView } = editor(
          doc(p('hello have a link ', a({ href })('{<>}' + href))),
        );

        const { dispatch } = editorView;
        providerWrapper.addProvider(editorView);

        // queue it
        dispatch(
          queueCards([
            createCardRequest(href, editorView.state.selection.from),
          ])(editorView.state.tr),
        );

        // now, change the link text (+1 so we change inside the text node with the mark, otherwise
        // we prefer to change on the other side of the boundary)
        insertText(editorView, 'change', editorView.state.selection.from + 1);

        await providerWrapper.waitForRequests();

        // link should not have been replaced, but text will have changed
        expect(editorView.state.doc).toEqualDocument(
          doc(
            p(
              'hello have a link ',
              a({ href })(href[0] + 'change{<>}' + href.slice(1)),
            ),
          ),
        );

        // queue should be empty
        expect(pluginKey.getState(editorView.state)).toEqual({
          cards: [],
          requests: [],
          provider: providerWrapper.provider,
          showLinkingToolbar: false,
        } as CardPluginState);
      });

      it('replaces anyway if compareLinkText is false', async () => {
        const { editorView } = editor(
          doc(
            p(
              'hello have a link ',
              a({
                href: atlassianUrl,
              })('{<>}renamed link'),
            ),
          ),
        );

        const { dispatch } = editorView;
        providerWrapper.addProvider(editorView);

        // queue it
        dispatch(
          queueCards([
            createCardRequest(atlassianUrl, editorView.state.selection.from, {
              compareLinkText: false,
            }),
          ])(editorView.state.tr),
        );

        // the test cardProvider stores the promise for each card it's converting
        // resolve all the promises to allow the card plugin to convert the cards to links
        await providerWrapper.waitForRequests();

        // this test provider replaces links with the ADF of: p('hello world')
        expect(editorView.state.doc).toEqualDocument(
          doc(p('hello have a link '), p('hello world'), p()),
        );
      });

      it('replaces a link encoded with spaces', async () => {
        const { editorView } = editor(
          doc(
            p(
              'hello have a link ',
              a({
                href:
                  'https://www.atlassian.com/s/7xr7xdqto7trhvr/Media%20picker.sketch?dl=0',
              })(
                '{<>}https://www.atlassian.com/s/7xr7xdqto7trhvr/Media%20picker.sketch?dl=0',
              ),
            ),
          ),
        );

        const { dispatch } = editorView;
        providerWrapper.addProvider(editorView);

        // queue it
        dispatch(
          queueCards([
            createCardRequest(
              'https://www.atlassian.com/s/7xr7xdqto7trhvr/Media%20picker.sketch?dl=0',
              editorView.state.selection.from,
            ),
          ])(editorView.state.tr),
        );

        await providerWrapper.waitForRequests();

        expect(editorView.state.doc).toEqualDocument(
          doc(p('hello have a link '), p('hello world'), p()),
        );
      });

      it('replaces when link text is unencoded', async () => {
        const { editorView } = editor(
          doc(
            p(
              'hello have a link ',
              a({
                href:
                  'https://www.atlassian.com/s/7xr7xdqto7trhvr/Media%20picker.sketch?dl=0',
              })(
                '{<>}https://www.atlassian.com/s/7xr7xdqto7trhvr/Media picker.sketch?dl=0',
              ),
            ),
          ),
        );

        const { dispatch } = editorView;
        providerWrapper.addProvider(editorView);

        // queue it
        dispatch(
          queueCards([
            createCardRequest(
              'https://www.atlassian.com/s/7xr7xdqto7trhvr/Media%20picker.sketch?dl=0',
              editorView.state.selection.from,
            ),
          ])(editorView.state.tr),
        );

        await providerWrapper.waitForRequests();

        expect(editorView.state.doc).toEqualDocument(
          doc(p('hello have a link '), p('hello world'), p()),
        );
      });

      it('does not replace if position is some other content', async () => {
        const initialDoc = doc(
          p('hello have a link '),
          p('{<>}' + atlassianUrl),
        );

        const { editorView } = editor(initialDoc);

        const { dispatch } = editorView;
        providerWrapper.addProvider(editorView);

        // queue a non-link node
        dispatch(
          queueCards([
            createCardRequest(atlassianUrl, editorView.state.selection.from),
          ])(editorView.state.tr),
        );

        // resolve the provider
        await providerWrapper.waitForRequests();

        // nothing should change
        expect(editorView.state.doc).toEqualDocument(initialDoc);
      });
    });

    describe('analytics GAS V3', () => {
      const providerWrapper = setupProvider(inlineCardAdf);

      it('should create analytics GAS V3 event if insert card', async () => {
        const { editorView } = editor(
          doc(
            p(
              'hello have a link ',
              a({
                href: atlassianUrl,
              })(`{<>}${atlassianUrl}`),
            ),
          ),
        );

        providerWrapper.addProvider(editorView);

        // queue it
        editorView.dispatch(
          queueCards([
            createCardRequest(atlassianUrl, editorView.state.selection.from),
          ])(editorView.state.tr),
        );

        await providerWrapper.waitForRequests();

        expect(createAnalyticsEvent).toBeCalledWith(
          expect.objectContaining({
            action: 'inserted',
            actionSubject: 'document',
            actionSubjectId: 'smartLink',
            eventType: 'track',
            attributes: expect.objectContaining({
              domainName: 'www.atlassian.com',
              nodeType: 'inlineCard',
            }),
          }),
        );
      });

      function testWithContext(initialDoc: object, expectedContext: string) {
        test(`should create analytics GAS V3 with node context ${expectedContext}`, async () => {
          const { editorView } = editor(initialDoc);

          providerWrapper.addProvider(editorView);

          // queue it
          editorView.dispatch(
            queueCards([
              createCardRequest(atlassianUrl, editorView.state.selection.from),
            ])(editorView.state.tr),
          );

          await providerWrapper.waitForRequests();

          expect(createAnalyticsEvent).toBeCalledWith(
            expect.objectContaining({
              action: 'inserted',
              actionSubject: 'document',
              actionSubjectId: 'smartLink',
              eventType: 'track',
              attributes: expect.objectContaining({
                nodeContext: expectedContext,
              }),
            }),
          );
        });
      }

      // Test analytics with right context
      [
        {
          initialDoc: doc(
            blockquote(
              p(
                'hello have a link ',
                a({
                  href: atlassianUrl,
                })(`{<>}${atlassianUrl}`),
              ),
            ),
          ),
          expectedContext: 'blockquote',
        },
        {
          initialDoc: doc(
            table()(
              tr(
                th({ colwidth: [100] })(p('1')),
                th({ colwidth: [100] })(p('2')),
                th({ colwidth: [480] })(p('3')),
              ),
              tr(
                td({ colwidth: [100] })(
                  p(
                    'hello have a link ',
                    a({
                      href: atlassianUrl,
                    })(`{<>}${atlassianUrl}`),
                  ),
                ),
                td({ colwidth: [100] })(p('5')),
                td({ colwidth: [480] })(p('6')),
              ),
            ),
          ),
          expectedContext: 'tableCell',
        },
        {
          initialDoc: doc(
            table()(
              tr(
                th({ colwidth: [100] })(
                  p(
                    'hello have a link ',
                    a({
                      href: atlassianUrl,
                    })(`{<>}${atlassianUrl}`),
                  ),
                ),
                th({ colwidth: [100] })(p('2')),
                th({ colwidth: [480] })(p('3')),
              ),
              tr(
                td({ colwidth: [100] })(p('4')),
                td({ colwidth: [100] })(p('5')),
                td({ colwidth: [480] })(p('6')),
              ),
            ),
          ),
          expectedContext: 'tableHeader',
        },
        {
          initialDoc: doc(
            ul(
              li(
                p(
                  'hello have a link ',
                  a({
                    href: atlassianUrl,
                  })(`{<>}${atlassianUrl}`),
                ),
              ),
            ),
          ),
          expectedContext: 'listItem',
        },
        {
          initialDoc: doc(
            decisionList()(
              decisionItem({ localId: 'local-decision' })(
                'hello have a link ',
                a({
                  href: atlassianUrl,
                })(`{<>}${atlassianUrl}`),
              ),
            ),
          ),
          expectedContext: 'decisionList',
        },
        {
          initialDoc: doc(
            taskList()(
              taskItem({ localId: 'local-task' })(
                'hello have a link ',
                a({
                  href: atlassianUrl,
                })(`{<>}${atlassianUrl}`),
              ),
            ),
          ),
          expectedContext: 'taskList',
        },
        {
          initialDoc: doc(
            panel()(
              p(
                'hello have a link ',
                a({
                  href: atlassianUrl,
                })(`{<>}${atlassianUrl}`),
              ),
            ),
          ),
          expectedContext: 'panel',
        },
        {
          initialDoc: doc(
            bodiedExtension({
              extensionType: 'com.atlassian.confluence.macro.core',
              extensionKey: 'expand',
            })(
              p(
                'hello have a link ',
                a({
                  href: atlassianUrl,
                })(`{<>}${atlassianUrl}`),
              ),
            ),
          ),
          expectedContext: 'bodiedExtension',
        },
      ].forEach(({ initialDoc, expectedContext }) =>
        testWithContext(initialDoc, expectedContext),
      );
    });

    describe('shouldReplace', () => {
      it('returns true for regular link, same href and text', () => {
        const link = cleanOne(
          a({ href: 'https://invis.io/P8OKINLRQEH' })(
            'https://invis.io/P8OKINLRQEH',
          ),
        )(defaultSchema);

        expect(shouldReplace(link)).toBe(true);
      });

      it('returns false for regular link, differing href and text', () => {
        const link = cleanOne(
          a({ href: 'https://invis.io/P8OKINLRQEH' })(
            'https://invis.io/P8OKINLRQE',
          ),
        )(defaultSchema);

        expect(shouldReplace(link)).toBe(false);
      });

      it('returns true for differing href and text if compare is skipped', () => {
        const link = cleanOne(
          a({ href: 'https://invis.io/P8OKINLRQEH' })(
            'https://www.atlassian.com/',
          ),
        )(defaultSchema);

        expect(shouldReplace(link, false)).toBe(true);
      });

      it('returns false for same href and text if compare url differs', () => {
        const link = cleanOne(
          a({
            href: 'https://invis.io/P8OKINLRQEH',
          })('https://invis.io/P8OKINLRQEH'),
        )(defaultSchema);

        expect(shouldReplace(link, true, 'http://www.atlassian.com/')).toBe(
          false,
        );
      });

      it('returns true for same href and text if compare url matches', () => {
        const link = cleanOne(
          a({
            href: 'https://invis.io/P8OKINLRQEH',
          })('https://invis.io/P8OKINLRQEH'),
        )(defaultSchema);

        expect(shouldReplace(link, true, 'https://invis.io/P8OKINLRQEH')).toBe(
          true,
        );
      });

      it('returns true for link with encoded spaces in url and text', () => {
        const link = cleanOne(
          a({
            href:
              'https://www.dropbox.com/s/2mh79iuglsnmbwf/Get%20Started%20with%20Dropbox.pdf?dl=0',
          })(
            'https://www.dropbox.com/s/2mh79iuglsnmbwf/Get%20Started%20with%20Dropbox.pdf?dl=0',
          ),
        )(defaultSchema);

        expect(shouldReplace(link)).toBe(true);
      });

      it('returns true for link with url encoded spaces, text unencoded', () => {
        const link = cleanOne(
          a({
            href:
              'https://www.dropbox.com/s/2mh79iuglsnmbwf/Get%20Started%20with%20Dropbox.pdf?dl=0',
          })(
            'https://www.dropbox.com/s/2mh79iuglsnmbwf/Get Started with Dropbox.pdf?dl=0',
          ),
        )(defaultSchema);

        expect(shouldReplace(link)).toBe(true);
      });

      it('returns true for link with text encoded spaces, url unencoded', () => {
        const link = cleanOne(
          a({
            href:
              'https://www.dropbox.com/s/2mh79iuglsnmbwf/Get Started with Dropbox.pdf?dl=0',
          })(
            'https://www.dropbox.com/s/2mh79iuglsnmbwf/Get%20Started%20with%20Dropbox.pdf?dl=0',
          ),
        )(defaultSchema);

        expect(shouldReplace(link)).toBe(true);
      });

      it('returns true for link with slash', () => {
        const link = cleanOne(
          a({
            href: 'https://invis.io/P8OKINLRQEH/',
          })('https://invis.io/P8OKINLRQEH/'),
        )(defaultSchema);

        expect(shouldReplace(link, true, 'https://invis.io/P8OKINLRQEH/')).toBe(
          true,
        );
      });

      it('returns true for link which ends with a full stop', () => {
        const link = cleanOne(
          a({
            href:
              'https://pug.jira-dev.com/wiki/spaces/~896045072/pages/4554883643/title.',
          })(
            'https://pug.jira-dev.com/wiki/spaces/~896045072/pages/4554883643/title.',
          ),
        )(defaultSchema);
        expect(
          shouldReplace(
            link,
            true,
            'https://pug.jira-dev.com/wiki/spaces/~896045072/pages/4554883643/title.',
          ),
        ).toBe(true);
      });

      it('returns false for text node', () => {
        const textRefNode = text('https://invis.io/P8OKINLRQEH', defaultSchema);
        const textNode = Node.fromJSON(
          defaultSchema,
          (textRefNode as Node).toJSON(),
        );

        expect(shouldReplace(textNode)).toBe(false);
      });
    });

    describe('#insertCard', () => {
      const getInlineCardNode = (editorView: EditorView): Node =>
        inlineCard(inlineCardAdf.attrs)()(editorView.state.schema);
      it('should insert adf node and add a white space', function() {
        const { editorView } = editor(doc(p('hello{<>}')));

        const { state, dispatch } = editorView;
        const inlineCardNode = getInlineCardNode(editorView);
        dispatch(insertCard(state.tr, inlineCardNode, editorView.state.schema));

        expect(editorView.state.doc).toEqualDocument(
          doc(p('hello', inlineCard(inlineCardAdf.attrs)(), ' ')),
        );
      });
      it('should replace selection with inline card and add a white space', function() {
        const { editorView } = editor(doc(p('{<}hello{>}')));

        const { state, dispatch } = editorView;
        const inlineCardNode = getInlineCardNode(editorView);
        dispatch(insertCard(state.tr, inlineCardNode, editorView.state.schema));

        expect(editorView.state.doc).toEqualDocument(
          doc(p(inlineCard(inlineCardAdf.attrs)(), ' ')),
        );
      });
    });

    describe('#updateCard', () => {
      it('should replace selection with new url', function() {
        const { editorView } = editor(
          doc(p('hello', '{<node>}', inlineCard(inlineCardAdf.attrs)())),
        );

        const { state, dispatch } = editorView;

        expect(editorView.state.doc).toEqualDocument(
          doc(p('hello', inlineCard(inlineCardAdf.attrs)())),
        );

        updateCard(atlassianUrl)(state, dispatch);

        expect(editorView.state.doc).toEqualDocument(
          doc(p('hello', inlineCard({ url: atlassianUrl })())),
        );
      });
    });
  });
});
