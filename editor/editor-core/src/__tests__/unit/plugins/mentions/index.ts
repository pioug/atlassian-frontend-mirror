import {
  createEditorFactory,
  TypeAheadTool,
} from '@atlaskit/editor-test-helpers/create-editor';
import { SelectItemMode } from '@atlaskit/editor-common/type-ahead';
import { doc, p, mention, a } from '@atlaskit/editor-test-helpers/doc-builder';
import {
  MockMentionResource,
  MockMentionConfig,
} from '@atlaskit/util-data-test/mock-mention-resource';
import { ProviderFactory } from '@atlaskit/editor-common';
import {
  MentionProvider,
  MentionDescription,
  MentionNameResolver,
} from '@atlaskit/mention/resource';
import { EditorView } from 'prosemirror-view';
import {
  CreateUIAnalyticsEvent,
  UIAnalyticsEvent,
} from '@atlaskit/analytics-next';
import { INVITE_ITEM_DESCRIPTION } from '../../../../plugins/mentions/ui/InviteItem';
import {
  isInviteItem,
  shouldKeepInviteItem,
} from '../../../../plugins/mentions/utils';
import { EditorProps } from '../../../../types';

let mockRegisterTeamMention = jest.fn();

jest.mock('@atlaskit/mention/spotlight', () => ({
  __esModule: true,
  TeamMentionHighlightController: {
    registerTeamMention: () => mockRegisterTeamMention(),
  },
}));
jest.useFakeTimers();
beforeAll(() => {
  window.queueMicrotask = (cb: Function) => {};
});

describe('mentionTypeahead', () => {
  const createEditor = createEditorFactory();
  const sessionIdRegex = /^[0-9a-f]{8}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{12}$/i;
  const expectedActionSubject = 'mentionTypeahead';
  const contextIdentifiers = {
    containerId: 'container-id',
    objectId: 'object-id',
    childObjectId: 'child-object-id',
  };

  // all team ids in `packages/elements/util-data-test/json-data/mention-data.json`
  const allTeamIds = ['team-1', 'team-2', 'team-3', 'team-4'];

  type TestDependencies = {
    editorView: EditorView;
    sel: number;
    mentionProvider: MentionProvider;
    createAnalyticsEvent: CreateUIAnalyticsEvent;
    event: any;
    mockMentionNameResolver?: MentionNameResolver;
    mentionData: MentionDescription[];
    typeAheadTool: TypeAheadTool;
    query: string;
  };
  type TestExecutor = (
    deps: TestDependencies,
    ...args: any[]
  ) => void | Promise<void>;

  const initializeCollab = (view: EditorView) =>
    view.dispatch(view.state.tr.setMeta('collabInitialised', true));

  /**
   * Higher order function automatically creating the editor and triggering the
   * mention typeahead with the provided query.
   *
   * @param query The mention query to insert in the editor.
   * @param test Test case function to be passed to Jest
   * @return Promise resolving with the return value of the test.
   */
  const withMentionQuery = (
    query: string,
    test: TestExecutor,
    options?: any,
  ) => async (...args: any[]) => {
    const { event, createAnalyticsEvent } = analyticsMocks();
    const mentionNameResolver: MentionNameResolver = {
      cacheName: jest.fn(),
      lookupName: jest.fn(),
    };
    let editorProps: EditorProps = {
      quickInsert: true,
    };
    let mentionProviderConfig: MockMentionConfig = {};
    if (options && options.sanitizePrivateContent) {
      editorProps = {
        ...editorProps,
        collabEdit: {},
        sanitizePrivateContent: true,
        mention: {
          insertDisplayName:
            options.mention?.insertDisplayName ??
            options.mentionInsertDisplayName,
        },
      };
      mentionProviderConfig = {
        mentionNameResolver,
      };
    }

    if (options && options.mentionConfig) {
      mentionProviderConfig = {
        ...mentionProviderConfig,
        ...options.mentionConfig,
      };
    }

    if (
      options &&
      (options.mentionInsertDisplayName || options.mention?.insertDisplayName)
    ) {
      editorProps = {
        ...editorProps,
        mention: {
          insertDisplayName:
            options.mention?.insertDisplayName ??
            options.mentionInsertDisplayName,
        },
      };
    }

    if (options && options.mention?.HighlightComponent) {
      editorProps = {
        ...editorProps,
        mention: {
          HighlightComponent: options.mention.HighlightComponent,
        },
      };
    }

    const { editorView, sel, mentionProvider, typeAheadTool } = await editor(
      {
        createAnalyticsEvent,
      },
      editorProps,
      mentionProviderConfig,
    );

    initializeCollab(editorView);

    return await Promise.resolve(
      test(
        {
          editorView,
          sel,
          mentionProvider,
          createAnalyticsEvent,
          event,
          mockMentionNameResolver: mentionNameResolver,
          mentionData: [],
          typeAheadTool,
          query,
        },
        ...args,
      ),
    );
  };

  const searchResultTypeAhead = (typeAheadTool: TypeAheadTool) => (
    query: string,
  ) => {
    const searching = typeAheadTool.searchMention(query);
    jest.runAllTimers();
    return searching;
  };
  /**
   * Sets the editor up to be used in the test suite, using default options
   * relevant to all tests.
   *
   * @param options List of options to add or override when creating the editor.
   * @return Object containing `editorView`, `sel` and `mentionProvider`.
   */
  const editor = async (
    options?: any,
    editorProps?: any,
    mentionProviderConfig?: MockMentionConfig,
  ) => {
    const mentionProvider = Promise.resolve(
      new MockMentionResource(mentionProviderConfig || {}),
    );
    const contextIdentifierProvider = Promise.resolve(contextIdentifiers);
    const { editorView, typeAheadTool, sel } = createEditor({
      doc: doc(p('{<>}')),
      editorProps: {
        mentionProvider,
        contextIdentifierProvider,
        allowAnalyticsGASV3: true,
        quickInsert: true,
        ...editorProps,
      },
      providerFactory: ProviderFactory.create({
        mentionProvider,
        contextIdentifierProvider,
      }),
      ...options,
    });

    return {
      editorView,
      typeAheadTool,
      sel,
      // Ensures providers are resolved before using the editor
      mentionProvider: await mentionProvider,
      contextIdentifierProvider: await contextIdentifierProvider,
    };
  };

  /**
   * Creates and return mocks for analytics to be passed to the editor.
   *
   * @return Object containing the mocks `event` and `createAnalyticsEvent`.
   */
  const analyticsMocks = () => {
    const event = {
      fire: jest.fn().mockName('event.fire') as any,
    } as UIAnalyticsEvent;
    const createAnalyticsEvent = jest
      .fn((payload) =>
        // We're only interested in recording events for 'mentionTypeahead'
        // ignoring all others
        payload.actionSubject === expectedActionSubject
          ? event
          : ({
              fire: jest.fn() as any,
            } as UIAnalyticsEvent),
      )
      .mockName('createAnalyticsEvent');

    return {
      createAnalyticsEvent,
      event,
    };
  };

  describe('fabric-elements analytics', () => {
    it(
      'should fire typeahead cancelled event',
      withMentionQuery(
        'all',
        ({ editorView, event, createAnalyticsEvent, typeAheadTool, query }) => {
          jest.clearAllMocks();
          searchResultTypeAhead(typeAheadTool)(query).close();

          expect(createAnalyticsEvent).toHaveBeenCalledWith(
            expect.objectContaining({
              action: 'cancelled',
              actionSubject: expectedActionSubject,
              eventType: 'ui',
              attributes: expect.objectContaining({
                packageName: '@atlaskit/editor-core',
                packageVersion: expect.any(String),
                sessionId: expect.stringMatching(sessionIdRegex),
                spaceInQuery: false,
                queryLength: 3,
                duration: expect.any(Number),
              }),
            }),
          );
          expect(event.fire).toHaveBeenCalled();
          expect(event.fire).toHaveBeenCalledWith('fabric-elements');
        },
      ),
    );

    it.each([
      ['pressed', 'enter'],
      ['clicked', undefined],
    ])(
      'should fire typeahead %s event',
      withMentionQuery(
        'here',
        async (
          { editorView, event, createAnalyticsEvent, typeAheadTool, query },
          expectedActionName,
          keyboardKey,
        ) => {
          jest.clearAllMocks();

          const mode = keyboardKey
            ? SelectItemMode.ENTER
            : SelectItemMode.SELECTED;

          await searchResultTypeAhead(typeAheadTool)(query).insert({
            index: 0,
            mode,
          });

          expect(createAnalyticsEvent).toHaveBeenCalledWith(
            expect.objectContaining({
              action: expectedActionName,
              actionSubject: expectedActionSubject,
              eventType: 'ui',
              attributes: expect.objectContaining({
                packageName: '@atlaskit/editor-core',
                packageVersion: expect.any(String),
                duration: expect.any(Number),
                position: 0,
                keyboardKey: keyboardKey,
                queryLength: 4,
                spaceInQuery: false,
                accessLevel: 'CONTAINER',
                userType: 'SPECIAL',
                userId: 'here',
                memberCount: null,
                includesYou: null,
              }),
            }),
          );
          expect(event.fire).toHaveBeenCalledWith('fabric-elements');
        },
      ),
    );

    it.each([
      ['pressed', 'enter'],
      ['clicked', undefined],
    ])(
      'should fire typeahead %s event for teams',
      withMentionQuery(
        'Team Alpha',
        async (
          { editorView, event, createAnalyticsEvent, typeAheadTool, query },
          expectedActionName,
          keyboardKey,
        ) => {
          jest.clearAllMocks();

          const mode = keyboardKey
            ? SelectItemMode.ENTER
            : SelectItemMode.SELECTED;

          await searchResultTypeAhead(typeAheadTool)(query).insert({
            index: 0,
            mode,
          });

          expect(createAnalyticsEvent).toHaveBeenCalledWith(
            expect.objectContaining({
              action: expectedActionName,
              actionSubject: expectedActionSubject,
              eventType: 'ui',
              attributes: expect.objectContaining({
                packageName: '@atlaskit/editor-core',
                packageVersion: expect.any(String),
                duration: expect.any(Number),
                position: 0,
                keyboardKey: keyboardKey,
                queryLength: 10,
                spaceInQuery: true,
                accessLevel: 'CONTAINER',
                userType: 'TEAM',
                userId: 'team-1',
                memberCount: 5,
                includesYou: true,
              }),
            }),
          );
          expect(event.fire).toHaveBeenCalledWith('fabric-elements');
        },
      ),
    );

    it(
      'should fire typeahead rendered event on bootstrap',
      withMentionQuery(
        '',
        async ({ event, createAnalyticsEvent, typeAheadTool, query }) => {
          await searchResultTypeAhead(typeAheadTool)(query);

          expect(createAnalyticsEvent).toHaveBeenCalledWith(
            expect.objectContaining({
              action: 'rendered',
              actionSubject: expectedActionSubject,
              eventType: 'operational',
              attributes: expect.objectContaining({
                packageName: '@atlaskit/editor-core',
                packageVersion: expect.any(String),
                duration: expect.any(Number),
                queryLength: 0,
                spaceInQuery: false,
                userIds: expect.any(Array),
                sessionId: expect.stringMatching(sessionIdRegex),
              }),
            }),
          );
          expect(event.fire).toHaveBeenCalled();
          expect(event.fire).toHaveBeenCalledWith('fabric-elements');

          // check there is no team id in attributes.userIds
          // note that `expect.not.arrayContaining` is not supported in current Jest version yet.
          // @ts-ignore
          const renderedCall = createAnalyticsEvent.mock.calls.find(
            (
              call: any, // tslint:disable-line no-any
            ) =>
              call[0] &&
              call[0].action === 'rendered' &&
              call[0].actionSubject === 'mentionTypeahead',
          );
          renderedCall[0].attributes.userIds.forEach((userId: string) => {
            expect(allTeamIds.includes(userId)).toEqual(false);
          });
        },
      ),
    );

    it(
      'should fire typeahead rendered event',
      withMentionQuery(
        'all',
        async ({ event, createAnalyticsEvent, typeAheadTool, query }) => {
          await searchResultTypeAhead(typeAheadTool)(query);
          expect(createAnalyticsEvent).toHaveBeenCalledWith(
            expect.objectContaining({
              action: 'rendered',
              actionSubject: expectedActionSubject,
              eventType: 'operational',
              attributes: expect.objectContaining({
                packageName: '@atlaskit/editor-core',
                packageVersion: expect.any(String),
                duration: expect.any(Number),
                queryLength: 3,
                spaceInQuery: false,
                // assert this attribute below
                userIds: expect.any(Array),
                sessionId: expect.stringMatching(sessionIdRegex),
              }),
            }),
          );
          expect(event.fire).toHaveBeenCalledWith('fabric-elements');

          // check there is no team id in attributes.userIds
          // note that `expect.not.arrayContaining` is not supported in current Jest version yet.
          // @ts-ignore
          const renderedCall = createAnalyticsEvent.mock.calls.find(
            (
              call: any, // tslint:disable-line no-any
            ) =>
              call[0] &&
              call[0].action === 'rendered' &&
              call[0].actionSubject === 'mentionTypeahead',
          );
          renderedCall[0].attributes.userIds.forEach((userId: string) => {
            expect(allTeamIds.includes(userId)).toEqual(false);
          });
        },
      ),
    );
  });

  describe('editor analytics', () => {
    let createAnalyticsEvent: any;

    beforeEach(async () => {
      jest.clearAllMocks();
      ({ createAnalyticsEvent } = analyticsMocks());
    });

    it('should trigger mention typeahead invoked event when invoked via quick insert', async () => {
      const { typeAheadTool } = await editor({
        createAnalyticsEvent,
      });
      await typeAheadTool.searchQuickInsert('Mention')?.insert({ index: 0 });

      expect(createAnalyticsEvent).toHaveBeenCalledWith({
        action: 'invoked',
        actionSubject: 'typeAhead',
        actionSubjectId: 'mentionTypeAhead',
        attributes: expect.objectContaining({
          inputMethod: 'quickInsert',
        }),
        eventType: 'ui',
      });
    });

    it(
      'should trigger `teamMentionTypeahead` analytics event',
      withMentionQuery(
        'team',
        async ({ createAnalyticsEvent, typeAheadTool, query }) => {
          await searchResultTypeAhead(typeAheadTool)(query).result();

          const commonAttrsTypeAhead = {
            componentName: 'mention',
            packageName: '@atlaskit/editor-core',
            packageVersion: expect.any(String),
            queryLength: expect.any(Number),
            spaceInQuery: false,
            sessionId: expect.stringMatching(sessionIdRegex),
          };

          expect(createAnalyticsEvent).toHaveBeenCalledWith(
            expect.objectContaining({
              action: 'rendered',
              actionSubject: 'teamMentionTypeahead',
              eventType: 'operational',
              attributes: expect.objectContaining({
                ...commonAttrsTypeAhead,
                duration: 200,
                userIds: null,
                teams: expect.arrayContaining(
                  allTeamIds.map((teamId) => ({
                    teamId,
                    includesYou: expect.anything(),
                    memberCount: expect.anything(),
                  })),
                ),
              }),
            }),
          );
        },
      ),
    );

    it(
      'should `mentionTypeahead` analytics event',
      withMentionQuery(
        '',
        async ({ createAnalyticsEvent, typeAheadTool, query }) => {
          await searchResultTypeAhead(typeAheadTool)(query).result();

          const commonAttrsTypeAhead = {
            componentName: 'mention',
            packageName: '@atlaskit/editor-core',
            packageVersion: expect.any(String),
            queryLength: expect.any(Number),
            spaceInQuery: false,
            sessionId: expect.stringMatching(sessionIdRegex),
          };

          expect(createAnalyticsEvent).toHaveBeenCalledWith(
            expect.objectContaining({
              action: 'rendered',
              actionSubject: 'mentionTypeahead',
              eventType: 'operational',
              attributes: expect.objectContaining({
                ...commonAttrsTypeAhead,
                duration: 100,
                userIds: expect.any(Array),
                teams: null,
              }),
            }),
          );

          // check there is no team id in attributes.userIds
          // note that `expect.not.arrayContaining` is not supported in current Jest version yet.
          // @ts-ignore
          const renderedCall = createAnalyticsEvent.mock.calls.find(
            (
              call: any, // tslint:disable-line no-any
            ) =>
              call[0] &&
              call[0].action === 'rendered' &&
              call[0].actionSubject === 'mentionTypeahead',
          );
          renderedCall[0].attributes.userIds.forEach((userId: string) => {
            expect(allTeamIds.includes(userId)).toEqual(false);
          });
        },
      ),
    );

    it(
      'should trigger feature exposed analytics event when the invite from mention feature is off',
      withMentionQuery(
        'doesNotExist',
        async ({ createAnalyticsEvent, query, typeAheadTool }) => {
          expect(createAnalyticsEvent).not.toHaveBeenCalledWith(
            expect.objectContaining({
              action: 'exposed',
              actionSubject: 'feature',
              eventType: 'operational',
              attributes: expect.objectContaining({
                flagKey: 'confluence.frontend.invite.from.mention',
                value: 'control',
              }),
            }),
          );

          searchResultTypeAhead(typeAheadTool)('doesNotExist');
          await searchResultTypeAhead(typeAheadTool)(query).result();

          expect(createAnalyticsEvent).toHaveBeenCalledWith(
            expect.objectContaining({
              action: 'exposed',
              actionSubject: 'feature',
              eventType: 'operational',
              attributes: expect.objectContaining({
                flagKey: 'confluence.frontend.invite.from.mention',
                value: 'control',
              }),
            }),
          );
        },
        {
          mentionConfig: {
            inviteExperimentCohort: 'control',
            shouldEnableInvite: false,
          },
        },
      ),
    );

    describe('inviteFromMentionExperiment On', () => {
      it(
        'should trigger feature exposed analytics event only when 2 or less results are returned',
        withMentionQuery(
          '',
          async ({ createAnalyticsEvent, typeAheadTool, query }) => {
            expect(createAnalyticsEvent).not.toHaveBeenCalledWith(
              expect.objectContaining({
                action: 'exposed',
                actionSubject: 'feature',
                eventType: 'operational',
                attributes: expect.objectContaining({
                  flagKey: 'confluence.frontend.invite.from.mention',
                  value: 'variation',
                }),
              }),
            );

            searchResultTypeAhead(typeAheadTool)('doesNotExist');
            await searchResultTypeAhead(typeAheadTool)(query).result();

            expect(createAnalyticsEvent).toHaveBeenCalledWith(
              expect.objectContaining({
                action: 'exposed',
                actionSubject: 'feature',
                eventType: 'operational',
                attributes: expect.objectContaining({
                  flagKey: 'confluence.frontend.invite.from.mention',
                  value: 'variation',
                }),
              }),
            );
          },
          {
            mentionConfig: {
              inviteExperimentCohort: 'variation',
              shouldEnableInvite: true,
            },
          },
        ),
      );
    });
  });

  describe('mentionProvider', () => {
    describe('when entering a query', () => {
      it(
        'should filter results',
        withMentionQuery(
          '',
          ({ mentionProvider, editorView, sel, typeAheadTool }) => {
            const filterSpy = jest.spyOn(mentionProvider, 'filter');

            const searching = searchResultTypeAhead(typeAheadTool)('');
            searching.type('a');
            searching.type('l');
            searching.type('l');

            expect(typeAheadTool.currentQuery()).toEqual('all');
            expect(filterSpy).toHaveBeenCalledWith(
              'a',
              expect.objectContaining({
                sessionId: expect.stringMatching(sessionIdRegex),
                ...contextIdentifiers,
              }),
            );
            expect(filterSpy).toHaveBeenCalledWith(
              'al',
              expect.objectContaining({
                sessionId: expect.stringMatching(sessionIdRegex),
                ...contextIdentifiers,
              }),
            );
            expect(filterSpy).toHaveBeenLastCalledWith(
              'all',
              expect.objectContaining({
                sessionId: expect.stringMatching(sessionIdRegex),
                ...contextIdentifiers,
              }),
            );
          },
        ),
      );
    });

    describe('when selecting a user', () => {
      it(
        'should record the selection',
        withMentionQuery(
          'here',
          async ({ editorView, mentionProvider, query, typeAheadTool }) => {
            const recordMentionSelectionSpy = jest.spyOn(
              mentionProvider,
              'recordMentionSelection',
            );

            await searchResultTypeAhead(typeAheadTool)(query).insert({
              index: 0,
            });

            expect(recordMentionSelectionSpy).toHaveBeenCalledTimes(1);
            expect(recordMentionSelectionSpy).toHaveBeenCalledWith(
              expect.objectContaining({
                id: 'here',
              }),
              expect.objectContaining({
                sessionId: expect.stringMatching(sessionIdRegex),
                ...contextIdentifiers,
              }),
            );
          },
        ),
      );

      it(
        'should not register a team mention while selecting a user',
        withMentionQuery(
          'here',
          async ({ editorView, mentionProvider, query, typeAheadTool }) => {
            // select a user
            await searchResultTypeAhead(typeAheadTool)(query).insert({
              index: 0,
            });
            expect(mockRegisterTeamMention).not.toHaveBeenCalled();
          },
        ),
      );

      it(
        'should not insert mention name when collabEdit.sanitizePrivateContent is true and mentionInsertDisplayName is true',
        withMentionQuery(
          'april',
          async ({
            editorView,
            mockMentionNameResolver,
            query,
            typeAheadTool,
          }) => {
            await searchResultTypeAhead(typeAheadTool)(query).insert({
              index: 0,
            });

            expect(mockMentionNameResolver!.lookupName).toHaveBeenCalledTimes(
              1,
            );
            expect(mockMentionNameResolver!.cacheName).toHaveBeenCalledTimes(1);
            expect(mockMentionNameResolver!.cacheName).toHaveBeenCalledWith(
              '6',
              'Dorene Rieger',
            );

            // expect text in mention to be empty due to sanitization
            expect(editorView.state.doc).toEqualDocument(
              doc(
                p(
                  mention({
                    id: '6',
                    text: '',
                  })(),
                  ' ',
                ),
              ),
            );
          },
          {
            //{ sanitizePrivateContent: true, mentionInsertDisplayName: true },
            sanitizePrivateContent: true,
            mention: { insertDisplayName: true },
          },
        ),
      );

      it(
        'should not insert mention name when collabEdit.sanitizePrivateContent is true and @depreciated mentionInsertDisplayName is true',
        withMentionQuery(
          'april',
          async ({
            editorView,
            mockMentionNameResolver,
            query,
            typeAheadTool,
          }) => {
            await searchResultTypeAhead(typeAheadTool)(query).insert({
              index: 0,
            });

            expect(mockMentionNameResolver!.lookupName).toHaveBeenCalledTimes(
              1,
            );
            expect(mockMentionNameResolver!.cacheName).toHaveBeenCalledTimes(1);
            expect(mockMentionNameResolver!.cacheName).toHaveBeenCalledWith(
              '6',
              'Dorene Rieger',
            );

            // expect text in mention to be empty due to sanitization
            expect(editorView.state.doc).toEqualDocument(
              doc(
                p(
                  mention({
                    id: '6',
                    text: '',
                  })(),
                  ' ',
                ),
              ),
            );
          },
          { sanitizePrivateContent: true, mentionInsertDisplayName: true },
        ),
      );

      it(
        'should not insert mention name when collabEdit.sanitizePrivateContent is true and mentionInsertDisplayName is falsy',
        withMentionQuery(
          'april',
          async ({
            editorView,
            mockMentionNameResolver,
            query,
            typeAheadTool,
          }) => {
            await searchResultTypeAhead(typeAheadTool)(query).insert({
              index: 0,
            });

            expect(mockMentionNameResolver!.lookupName).toHaveBeenCalledTimes(
              1,
            );
            expect(mockMentionNameResolver!.cacheName).toHaveBeenCalledTimes(1);
            expect(mockMentionNameResolver!.cacheName).toHaveBeenCalledWith(
              '6',
              'April',
            );

            // expect text in mention to be empty due to sanitization
            expect(editorView.state.doc).toEqualDocument(
              doc(
                p(
                  mention({
                    id: '6',
                    text: '',
                  })(),
                  ' ',
                ),
              ),
            );
          },
          { sanitizePrivateContent: true },
        ),
      );

      it(
        'should insert mention name when collabEdit.sanitizePrivateContent is falsy and mentionInsertDisplayName true',
        withMentionQuery(
          'april',
          async ({ editorView, query, typeAheadTool }) => {
            await searchResultTypeAhead(typeAheadTool)(query).insert({
              index: 0,
            });

            // expect text in mention to be empty due to sanitization
            expect(editorView.state.doc).toEqualDocument(
              doc(
                p(
                  mention({
                    id: '6',
                    text: '@Dorene Rieger',
                  })(),
                  ' ',
                ),
              ),
            );
          },
          { mention: { insertDisplayName: true } },
        ),
      );

      it(
        'should insert mention name when collabEdit.sanitizePrivateContent is falsy and @depreciated mentionInsertDisplayName true',
        withMentionQuery(
          'april',
          async ({ editorView, query, typeAheadTool }) => {
            await searchResultTypeAhead(typeAheadTool)(query).insert({
              index: 0,
            });

            // expect text in mention to be empty due to sanitization
            expect(editorView.state.doc).toEqualDocument(
              doc(
                p(
                  mention({
                    id: '6',
                    text: '@Dorene Rieger',
                  })(),
                  ' ',
                ),
              ),
            );
          },
          { mentionInsertDisplayName: true },
        ),
      );

      it(
        'should insert nickname when collabEdit.sanitizePrivateContent is falsy and mentionInsertDisplayName falsy',
        withMentionQuery(
          'april',
          async ({ editorView, query, typeAheadTool }) => {
            await searchResultTypeAhead(typeAheadTool)(query).insert({
              index: 0,
            });

            // expect text in mention to be empty due to sanitization
            expect(editorView.state.doc).toEqualDocument(
              doc(
                p(
                  mention({
                    id: '6',
                    text: '@April',
                  })(),
                  ' ',
                ),
              ),
            );
          },
          {},
        ),
      );
    });

    describe('when selecting a team', () => {
      it(
        'should expand members when selecting a team mention ',
        withMentionQuery(
          'Team Beta',
          async ({ editorView, query, typeAheadTool }) => {
            // select Team Beta team
            await searchResultTypeAhead(typeAheadTool)(query).insert({
              index: 0,
            });
            // should expand 2 members
            expect(editorView.state.doc).toEqualDocument(
              doc(
                p(
                  '',
                  a({ href: 'http://localhost/people/team/team-2' })(
                    'Team Beta',
                  ),
                  ' (',
                  mention({
                    id: 'member-1',
                    text: '@Tung Dang',
                    userType: 'DEFAULT',
                    accessLevel: 'CONTAINER',
                  })(),
                  ' ',
                  mention({
                    id: 'member-2',
                    text: '@Ishan Somasiri',
                    userType: 'DEFAULT',
                    accessLevel: 'CONTAINER',
                  })(),
                  ')',
                ),
              ),
            );
          },
        ),
      );

      it(
        'should register a team mention ',
        withMentionQuery(
          'Team Beta',
          async ({ editorView, query, typeAheadTool }) => {
            // select Team Beta team
            await searchResultTypeAhead(typeAheadTool)(query).insert({
              index: 0,
            });
            expect(mockRegisterTeamMention).toHaveBeenCalled();
          },
        ),
      );

      it(
        'should not insert mention name when collabEdit.sanitizePrivateContent is true',
        withMentionQuery(
          'Team Beta',
          async ({
            editorView,
            query,
            typeAheadTool,
            mockMentionNameResolver,
          }) => {
            // select Team Beta team
            await searchResultTypeAhead(typeAheadTool)(query).insert({
              index: 0,
            });

            expect(mockMentionNameResolver!.lookupName).toHaveBeenCalledTimes(
              2,
            );
            expect(mockMentionNameResolver!.cacheName).toHaveBeenCalledTimes(2);
            expect(mockMentionNameResolver!.cacheName).toHaveBeenNthCalledWith(
              1,
              'member-1',
              'Tung Dang',
            );
            expect(mockMentionNameResolver!.cacheName).toHaveBeenNthCalledWith(
              2,
              'member-2',
              'Ishan Somasiri',
            );

            // should expand 2 members
            expect(editorView.state.doc).toEqualDocument(
              doc(
                p(
                  '',
                  a({ href: 'http://localhost/people/team/team-2' })(
                    'Team Beta',
                  ),
                  ' (',
                  mention({
                    id: 'member-1',
                    text: '',
                    userType: 'DEFAULT',
                    accessLevel: 'CONTAINER',
                  })(),
                  ' ',
                  mention({
                    id: 'member-2',
                    text: '',
                    userType: 'DEFAULT',
                    accessLevel: 'CONTAINER',
                  })(),
                  ')',
                ),
              ),
            );
          },
          { sanitizePrivateContent: true },
        ),
      );

      describe('inviteFromMentionExperiment', () => {
        let mockOnInviteItemClick: any = jest.fn();

        beforeEach(() => {
          jest.clearAllMocks();
        });

        it(
          'should not show invite item if there is more than 2 users/teams returned',
          withMentionQuery(
            'A',
            async ({ editorView, typeAheadTool, query }) => {
              const result = await searchResultTypeAhead(typeAheadTool)(
                query,
              ).result();
              const inviteItems = (result || []).filter((item) =>
                isInviteItem(item.mention),
              );
              expect(inviteItems).toHaveLength(0);
            },
            {
              mentionConfig: {
                shouldEnableInvite: true,
                onInviteItemClick: mockOnInviteItemClick,
              },
            },
          ),
        );

        it(
          'should not show invite item if the query detected a space after no mentionable items returned',
          withMentionQuery(
            'Alica DoesNotExist',
            async ({ editorView, typeAheadTool, query }) => {
              const searching = await searchResultTypeAhead(typeAheadTool)(
                'Alica ',
              );
              let result: unknown[] | undefined = await searching.result();
              expect(result).toHaveLength(3);

              searching.type('D');
              jest.runAllTimers();
              result = await searching.result();
              expect(result).toHaveLength(1);

              searching.type('oesNotExist');
              jest.runAllTimers();
              result = await searching.result();
              expect(result).toHaveLength(1);

              searching.type(' ');
              jest.runAllTimers();
              result = await searching.result();
              expect(result).toHaveLength(0);

              searching.type('SeachFurther');
              jest.runAllTimers();
              result = await searching.result();
              expect(result).toHaveLength(0);
            },
            {
              mentionConfig: {
                shouldEnableInvite: true,
              },
            },
          ),
        );

        it.each([2, 1, 0])(
          'should show invite item if there is %i mentionable users/teams returned',
          (noOfResults) => {
            let query: string = 'doesNotExist';

            switch (noOfResults) {
              case 2:
                query = 'Alica';
                break;

              case 1:
                query = 'Alica W';
                break;
            }

            return withMentionQuery(
              query,
              async ({ typeAheadTool }) => {
                const items = await searchResultTypeAhead(typeAheadTool)(
                  query,
                ).result();

                expect(items![items!.length - 1]).toEqual(
                  expect.objectContaining({
                    title: INVITE_ITEM_DESCRIPTION.id,
                    render: expect.any(Function),
                    mention: { id: INVITE_ITEM_DESCRIPTION.id },
                  }),
                );
              },
              {
                mentionConfig: {
                  shouldEnableInvite: true,
                  onInviteItemClick: mockOnInviteItemClick,
                },
              },
            )();
          },
        );

        it(
          'should not record the selection',
          withMentionQuery(
            'doesNotExist',
            async ({ mentionProvider, query, typeAheadTool }) => {
              const recordMentionSelectionSpy = jest.spyOn(
                mentionProvider,
                'recordMentionSelection',
              );
              await searchResultTypeAhead(typeAheadTool)(query).insert({
                index: 0,
              });
              expect(recordMentionSelectionSpy).not.toHaveBeenCalled();
            },
            {
              mentionConfig: {
                shouldEnableInvite: true,
                onInviteItemClick: mockOnInviteItemClick,
              },
            },
          ),
        );

        it(
          'should fire inviteItem clicked event and not fire mentionTypeahead clicked',
          withMentionQuery(
            'doesNotExist',
            async ({ createAnalyticsEvent, query, typeAheadTool }) => {
              await searchResultTypeAhead(typeAheadTool)(query).insert({
                index: 0,
              });
              expect(createAnalyticsEvent).not.toHaveBeenCalledWith(
                expect.objectContaining({
                  action: 'clicked',
                  actionSubject: 'mentionTypeahead',
                  eventType: 'ui',
                }),
              );
              expect(createAnalyticsEvent).toHaveBeenCalledWith(
                expect.objectContaining({
                  action: 'clicked',
                  actionSubject: 'inviteItem',
                  eventType: 'ui',
                  attributes: expect.objectContaining({
                    componentName: 'mention',
                  }),
                }),
              );
            },
            {
              mentionConfig: {
                shouldEnableInvite: true,
                onInviteItemClick: mockOnInviteItemClick,
              },
            },
          ),
        );

        it(
          'should call mentionProvider.onInviteItemClick',
          withMentionQuery(
            'doesNotExist',
            async ({ query, typeAheadTool }) => {
              await searchResultTypeAhead(typeAheadTool)(query).insert({
                index: 0,
              });
              expect(mockOnInviteItemClick).toHaveBeenCalledTimes(1);
              expect(mockOnInviteItemClick).toHaveBeenCalledWith('mention');
            },
            {
              mentionConfig: {
                shouldEnableInvite: true,
                onInviteItemClick: mockOnInviteItemClick,
              },
            },
          ),
        );

        describe('shouldKeepInviteItem', () => {
          it('should show invite item only if a full word was entered with zero results', () => {
            expect(shouldKeepInviteItem('alica', '')).toBe(true);
            expect(shouldKeepInviteItem('alica woods ', '')).toBe(true);
            expect(shouldKeepInviteItem('alica zzz ', 'alica z')).toBe(false);
            expect(
              shouldKeepInviteItem('alica woods zzz', 'alica woods z'),
            ).toBe(true);
            expect(
              shouldKeepInviteItem('alica woods zzz ', 'alica woods z'),
            ).toBe(false);
          });
        });
      });
    });
  });
});
