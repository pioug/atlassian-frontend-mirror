const mockStopMeasureDuration = 1234;
jest.mock('@atlaskit/editor-common', () => ({
  ...jest.requireActual<Object>('@atlaskit/editor-common'),
  startMeasure: jest.fn(),
  stopMeasure: jest.fn(
    (
      measureName: string,
      onMeasureComplete?: (duration: number, startTime: number) => void,
    ) => {
      onMeasureComplete && onMeasureComplete(mockStopMeasureDuration, 1);
    },
  ),
}));

import { name } from '../../version.json';
import { mount, shallow } from 'enzyme';
import React from 'react';
import Editor from '../../editor';
import { EditorView } from 'prosemirror-view';
import Button from '@atlaskit/button/custom-theme-button';
import sendKeyToPm from '@atlaskit/editor-test-helpers/send-key-to-pm';
import { analyticsClient } from '@atlaskit/editor-test-helpers/analytics-client-mock';
import { insertText } from '@atlaskit/editor-test-helpers/transactions';
import { createFakeExtensionProvider } from '@atlaskit/editor-test-helpers/extensions';
import FabricAnalyticsListeners, {
  AnalyticsWebClient,
} from '@atlaskit/analytics-listeners';
import {
  GasPurePayload,
  GasPureScreenEventPayload,
} from '@atlaskit/analytics-gas-types';
import { EDITOR_APPEARANCE_CONTEXT } from '@atlaskit/analytics-namespaced-context';
import {
  AutoformattingProvider,
  ProviderFactory,
  QuickInsertProvider,
} from '@atlaskit/editor-common/provider-factory';
import { ExtensionProvider } from '@atlaskit/editor-common';
import { EditorAppearance, EditorProps } from '../../types';
import * as extensionUtils from '../../utils/extensions';

import {
  name as packageName,
  version as packageVersion,
} from '../../version-wrapper';
import ReactEditorView, {
  EditorViewProps,
} from '../../create-editor/ReactEditorView';
import { EditorActions, EditorContext, MediaOptions } from '../..';
import { CardOptions } from '@atlaskit/editor-common';
import { asMock } from '@atlaskit/media-test-helpers';

import * as ActivityProviderModule from '@atlaskit/activity-provider';
const { ActivityResource } = jest.genMockFromModule<
  typeof ActivityProviderModule
>('@atlaskit/activity-provider');

import * as EmojiModule from '@atlaskit/emoji';
import { QuickInsertOptions } from '../../plugins/quick-insert/types';
const { EmojiResource } = jest.genMockFromModule<typeof EmojiModule>(
  '@atlaskit/emoji',
);

describe(name, () => {
  describe('Editor', () => {
    describe('callbacks', () => {
      it('should fire onChange when text is inserted', () => {
        const handleChange = jest.fn();

        const wrapper = mount(<Editor onChange={handleChange} />);

        const editorView: EditorView = (wrapper.instance() as any).editorActions
          .editorView;

        insertText(editorView, 'hello', 0);
        expect(handleChange).toHaveBeenCalled();
      });

      describe('Comment appearance', () => {
        it('should fire onSave when Save is clicked', () => {
          const handleSave = jest.fn();
          const wrapper = mount(
            <Editor onSave={handleSave} appearance="comment" />,
          );

          const saveButton = wrapper.find(Button).findWhere((node) => {
            return node.type() !== undefined && node.text() === 'Save';
          });

          saveButton.first().simulate('click');
          expect(handleSave).toHaveBeenCalled();
        });

        it('should fire onCancel when Cancel is clicked', () => {
          const cancelled = jest.fn();
          const wrapper = mount(
            <Editor onCancel={cancelled} appearance="comment" />,
          );

          const cancelButton = wrapper.find(Button).findWhere((node) => {
            return node.type() !== undefined && node.text() === 'Cancel';
          });

          cancelButton.first().simulate('click');
          expect(cancelled).toHaveBeenCalled();
        });
      });

      it('should fire onEditorReady when ready', () => {
        const onEditorReady = jest.fn();
        mount(<Editor onEditorReady={onEditorReady} />);

        expect(onEditorReady).toHaveBeenCalled();
      });
    });

    describe('save on enter', () => {
      it('should fire onSave when user presses Enter', () => {
        const handleSave = jest.fn();
        const wrapper = mount(
          <Editor onSave={handleSave} saveOnEnter={true} />,
        );

        const editorView: EditorView = (wrapper.instance() as any).editorActions
          .editorView;

        sendKeyToPm(editorView, 'Enter');
        expect(handleSave).toHaveBeenCalled();
      });
    });

    describe('submit-editor (save on mod-enter)', () => {
      it('should fire onSave when user presses Enter', () => {
        const handleSave = jest.fn();
        const wrapper = mount(<Editor onSave={handleSave} />);

        const editorView: EditorView = (wrapper.instance() as any).editorActions
          .editorView;

        sendKeyToPm(editorView, 'Mod-Enter');
        expect(handleSave).toHaveBeenCalled();
      });
    });

    describe('analytics', () => {
      const mockAnalyticsClient = (
        analyticsAppearance: EDITOR_APPEARANCE_CONTEXT,
        done: jest.DoneCallback,
      ): AnalyticsWebClient => {
        const analyticsEventHandler = (
          event: GasPurePayload | GasPureScreenEventPayload,
        ) => {
          expect(event.attributes).toMatchObject({
            appearance: analyticsAppearance,
            packageName,
            packageVersion,
            componentName: 'editorCore',
          });
          done();
        };

        return analyticsClient(analyticsEventHandler);
      };

      const setupMockPerformanceObserver = (
        performanceNowFixedTime: number,
      ) => {
        let prevPerformanceObserver = window.PerformanceObserver;
        let prevPerformanceNow = window.performance.now;
        class MockPerformanceObserver extends PerformanceObserver {
          static supportedEntryTypes = ['longtask'];
          constructor(cb: PerformanceObserverCallback) {
            super(cb);
          }
          disconnect() {}
          observe() {}
          takeRecords() {
            return [];
          }
        }
        window.PerformanceObserver = MockPerformanceObserver;
        window.performance.now = () => performanceNowFixedTime;
        const cleanup = () => {
          window.PerformanceObserver = prevPerformanceObserver;
          window.performance.now = prevPerformanceNow;
        };
        return { cleanup };
      };

      const appearances: {
        appearance: EditorAppearance;
        analyticsAppearance: EDITOR_APPEARANCE_CONTEXT;
      }[] = [
        {
          appearance: 'full-page',
          analyticsAppearance: EDITOR_APPEARANCE_CONTEXT.FIXED_WIDTH,
        },
        {
          appearance: 'comment',
          analyticsAppearance: EDITOR_APPEARANCE_CONTEXT.COMMENT,
        },
        {
          appearance: 'full-width',
          analyticsAppearance: EDITOR_APPEARANCE_CONTEXT.FULL_WIDTH,
        },
      ];
      appearances.forEach((appearance) => {
        it(`adds appearance analytics context to all editor events for ${appearance.appearance} editor`, (done) => {
          // editor fires an editor started event that should trigger the listener from
          // just mounting the component
          mount(
            <FabricAnalyticsListeners
              client={mockAnalyticsClient(appearance.analyticsAppearance, done)}
            >
              <Editor appearance={appearance.appearance} allowAnalyticsGASV3 />
            </FabricAnalyticsListeners>,
          );
        });
      });

      it('should update appearance used in events when change appearance prop', (done) => {
        const wrapper = mount(
          <FabricAnalyticsListeners
            client={mockAnalyticsClient(
              EDITOR_APPEARANCE_CONTEXT.FULL_WIDTH,
              done,
            )}
          >
            <Editor appearance="full-page" allowAnalyticsGASV3 />
          </FabricAnalyticsListeners>,
        );

        // toggling full-width mode triggers a changedFullWidthMode analytics event
        // which should have the new appearance
        wrapper.setProps({
          children: <Editor appearance="full-width" allowAnalyticsGASV3 />,
        });
      });

      it('should dispatch an tti (time-to-interactive) editor event after the editor has mounted', (done) => {
        const nowTime = 100;
        const { cleanup } = setupMockPerformanceObserver(nowTime);
        const mockAnalyticsClient = (
          done: jest.DoneCallback,
        ): AnalyticsWebClient => {
          const analyticsEventHandler = (
            event: GasPurePayload | GasPureScreenEventPayload,
          ) => {
            expect(event).toEqual(
              expect.objectContaining({
                action: 'tti',
                actionSubject: 'editor',
                attributes: expect.objectContaining({
                  tti: nowTime,
                  ttiFromInvocation: 0,
                  canceled: false,
                  ttiSeverity: 'normal',
                  ttiFromInvocationSeverity: 'normal',
                }),
              }),
            );
            done();
          };

          return analyticsClient(analyticsEventHandler);
        };

        mount(
          <FabricAnalyticsListeners client={mockAnalyticsClient(done)}>
            <Editor
              allowAnalyticsGASV3
              performanceTracking={{
                ttiTracking: { enabled: true, trackSeverity: true },
              }}
            />
          </FabricAnalyticsListeners>,
        );
        cleanup();
      });

      describe('contentRetrievalPerformed events', () => {
        const setup = async ({
          editorProps,
          editorActions,
          useOnReadyEditorActions,
        }: {
          editorProps: EditorProps;
          editorActions?: EditorActions;
          useOnReadyEditorActions?: boolean;
        }) => {
          let onReadyEditorActions: EditorActions;
          const wrapper = mount<Editor>(
            <EditorContext editorActions={editorActions}>
              <Editor
                onEditorReady={(localEditorActions) =>
                  (onReadyEditorActions = localEditorActions)
                }
                {...editorProps}
              />
            </EditorContext>,
          );
          const editorWrapper = wrapper.find(Editor);
          const instance = editorWrapper.instance() as Editor;
          instance.handleAnalyticsEvent = jest.fn();
          try {
            await (useOnReadyEditorActions
              ? onReadyEditorActions!.getValue()
              : editorActions?.getValue());
          } catch (err) {
          } finally {
            // eslint-disable-next-line no-unsafe-finally
            return { handleAnalyticsEventMock: instance.handleAnalyticsEvent };
          }
        };
        it('should not dispatch a contentRetrievalPerformed event with success=true if contentRetrievalTracking prop is not set', async () => {
          const { handleAnalyticsEventMock } = await setup({
            editorProps: {},
            editorActions: undefined,
            useOnReadyEditorActions: true,
          });
          expect(handleAnalyticsEventMock).not.toHaveBeenCalledWith({
            payload: {
              action: 'contentRetrievalPerformed',
              actionSubject: 'editor',
              attributes: { success: true },
              eventType: 'operational',
            },
          });
        });
        it('should not dispatch a contentRetrievalPerformed event success=false if contentRetrievalTracking prop is not set and an exception is thrown', async () => {
          const badEditorActions = new EditorActions();
          badEditorActions.getValue = async () => {
            throw new Error('a bad error');
          };
          const { handleAnalyticsEventMock } = await setup({
            editorProps: {
              performanceTracking: {},
            },
            editorActions: badEditorActions,
            useOnReadyEditorActions: true,
          });
          expect(handleAnalyticsEventMock).not.toHaveBeenCalledWith({
            payload: {
              action: 'contentRetrievalPerformed',
              actionSubject: 'editor',
              attributes: {
                success: false,
                errorInfo: 'Error: a bad error',
                errorStack: undefined,
              },
              eventType: 'operational',
            },
          });
        });
        it('should not dispatch a contentRetrievalPerformed event with success=true if contentRetrievalTracking prop is enabled=false', async () => {
          const { handleAnalyticsEventMock } = await setup({
            editorProps: {
              performanceTracking: {
                contentRetrievalTracking: {
                  enabled: false,
                  successSamplingRate: 1,
                },
              },
            },
            editorActions: undefined,
            useOnReadyEditorActions: true,
          });
          expect(handleAnalyticsEventMock).not.toHaveBeenCalledWith({
            payload: {
              action: 'contentRetrievalPerformed',
              actionSubject: 'editor',
              attributes: { success: true },
              eventType: 'operational',
            },
          });
        });
        it('should dispatch a contentRetrievalPerformed event with success=true if contentRetrievalTracking prop is set', async () => {
          const { handleAnalyticsEventMock } = await setup({
            editorProps: {
              performanceTracking: {
                contentRetrievalTracking: {
                  enabled: true,
                  successSamplingRate: 1,
                },
              },
            },
            editorActions: undefined,
            useOnReadyEditorActions: true,
          });
          expect(handleAnalyticsEventMock).toHaveBeenCalledWith({
            payload: {
              action: 'contentRetrievalPerformed',
              actionSubject: 'editor',
              attributes: { success: true },
              eventType: 'operational',
            },
          });
        });
        it('should dispatch a contentRetrievalPerformed event success=false if contentRetrievalTracking prop is set and an exception is thrown', async () => {
          const badEditorActions = new EditorActions();
          badEditorActions.getValue = async () => {
            throw new Error('a bad error');
          };
          const { handleAnalyticsEventMock } = await setup({
            editorProps: {
              performanceTracking: {
                contentRetrievalTracking: {
                  enabled: true,
                  failureSamplingRate: 1,
                },
              },
            },
            editorActions: badEditorActions,
            useOnReadyEditorActions: true,
          });
          expect(handleAnalyticsEventMock).toHaveBeenCalledWith({
            payload: {
              action: 'contentRetrievalPerformed',
              actionSubject: 'editor',
              attributes: {
                success: false,
                errorInfo: 'Error: a bad error',
                errorStack: undefined,
              },
              eventType: 'operational',
            },
          });
        });
        it('should dispatch a contentRetrievalPerformed event success=false with error stack trace if contentRetrievalTracking prop is set with reportErrorStack=true and an exception is thrown', async () => {
          const badEditorActions = new EditorActions();
          badEditorActions.getValue = async () => {
            throw new Error('a bad error');
          };
          const { handleAnalyticsEventMock } = await setup({
            editorProps: {
              performanceTracking: {
                contentRetrievalTracking: {
                  enabled: true,
                  failureSamplingRate: 1,
                  reportErrorStack: true,
                },
              },
            },
            editorActions: badEditorActions,
            useOnReadyEditorActions: true,
          });
          expect(handleAnalyticsEventMock).toHaveBeenCalledWith({
            payload: {
              action: 'contentRetrievalPerformed',
              actionSubject: 'editor',
              attributes: {
                success: false,
                errorInfo: 'Error: a bad error',
                errorStack: expect.any(String),
              },
              eventType: 'operational',
            },
          });
        });
      });
      describe('onEditorReady prop', () => {
        it('should dispatch an onEditorReadyCallback event after the editor has called the onEditorReady callback', (done) => {
          const mockAnalyticsClient = (
            done: jest.DoneCallback,
          ): AnalyticsWebClient => {
            const analyticsEventHandler = (
              event: GasPurePayload | GasPureScreenEventPayload,
            ) => {
              expect(event).toEqual(
                expect.objectContaining({
                  action: 'onEditorReadyCallback',
                  actionSubject: 'editor',
                  attributes: expect.objectContaining({
                    // Check the duration (in this case supplied by the mock) is sent correctly
                    duration: mockStopMeasureDuration,
                  }),
                }),
              );
              done();
            };
            return analyticsClient(analyticsEventHandler);
          };

          mount(
            <FabricAnalyticsListeners client={mockAnalyticsClient(done)}>
              <Editor
                allowAnalyticsGASV3={true}
                // If no onEditorReady callback is given, the analytics event is not sent.
                onEditorReady={() => {}}
                performanceTracking={{
                  onEditorReadyCallbackTracking: { enabled: true },
                }}
              />
            </FabricAnalyticsListeners>,
          );
        });

        it('should not dispatch an onEditorReadyCallback event if disabled', (done) => {
          const mockAnalyticsClient = (
            done: jest.DoneCallback,
          ): AnalyticsWebClient => {
            const analyticsEventHandler = (
              event: GasPurePayload | GasPureScreenEventPayload,
            ) => {
              expect(event).not.toEqual(
                expect.objectContaining({
                  action: 'onEditorReadyCallback',
                  actionSubject: 'editor',
                  attributes: expect.objectContaining({
                    // Check the duration (in this case supplied by the mock) is sent correctly
                    duration: mockStopMeasureDuration,
                  }),
                }),
              );
              done();
            };
            return analyticsClient(analyticsEventHandler);
          };

          mount(
            <FabricAnalyticsListeners client={mockAnalyticsClient(done)}>
              <Editor
                allowAnalyticsGASV3={true}
                // If no onEditorReady callback is given, the analytics event is not sent.
                onEditorReady={() => {}}
                performanceTracking={{
                  onEditorReadyCallbackTracking: { enabled: false },
                }}
              />
            </FabricAnalyticsListeners>,
          );
        });
      });
    });

    describe('providerFactory passed to ReactEditorView', () => {
      const setup = (
        useCollabEditObject: boolean = false,
        defineExtensionsProvider: boolean = true,
      ) => {
        // These `any` is not a problem. We later assert by using `toBe` method
        const activityProvider = new ActivityResource(
          'some-url',
          'some-cloud-id',
        );
        const emojiProvider = new EmojiResource({} as any);
        const mentionProvider = {} as any;
        const taskDecisionProvider = {} as any;
        const contextIdentifierProvider = {} as any;

        let collabEditProvider = {} as any;
        const collabEditDotProvider = {} as any;
        let collabEdit;
        if (useCollabEditObject) {
          collabEdit = {
            provider: Promise.resolve(collabEditDotProvider),
          };
          collabEditProvider = undefined;
        }
        const presenceProvider = {} as any;
        const macroProvider = {} as any;
        const legacyImageUploadProvider = {} as any;
        const autoformattingProvider: AutoformattingProvider = {
          getRules: () => Promise.resolve({}),
        };
        const mediaProvider = {} as any;
        const mediaOptions: MediaOptions = {
          provider: Promise.resolve(mediaProvider),
        };
        const cardProvider = {} as any;
        const cardOptions: CardOptions = {
          provider: Promise.resolve(cardProvider),
        };
        const quickInsertProvider: QuickInsertProvider = {
          getItems: () => Promise.resolve([]),
        };
        const quickInsert: QuickInsertOptions = {
          provider: Promise.resolve(quickInsertProvider),
        };

        const extensionProviderProps: ExtensionProvider = {
          getAutoConverter: () => Promise.resolve([]),
          getExtension: () => Promise.resolve(undefined),
          getExtensions: () => Promise.resolve([]),
          search: () => Promise.resolve([]),
        };

        asMock(emojiProvider.getAsciiMap).mockResolvedValue({});

        const component = mount(
          <Editor
            activityProvider={Promise.resolve(activityProvider)}
            emojiProvider={Promise.resolve(emojiProvider)}
            mentionProvider={Promise.resolve(mentionProvider)}
            taskDecisionProvider={Promise.resolve(taskDecisionProvider)}
            contextIdentifierProvider={Promise.resolve(
              contextIdentifierProvider,
            )}
            collabEdit={collabEdit}
            collabEditProvider={Promise.resolve(collabEditProvider)}
            presenceProvider={Promise.resolve(presenceProvider)}
            macroProvider={Promise.resolve(macroProvider)}
            legacyImageUploadProvider={Promise.resolve(
              legacyImageUploadProvider,
            )}
            autoformattingProvider={Promise.resolve(autoformattingProvider)}
            media={mediaOptions}
            smartLinks={cardOptions}
            quickInsert={quickInsert}
            extensionProviders={
              defineExtensionsProvider ? [extensionProviderProps] : undefined
            }
          />,
        );
        const providerFactory = component
          .find<EditorViewProps>(ReactEditorView)
          .props().providerFactory;
        return {
          component,
          activityProvider,
          emojiProvider,
          mentionProvider,
          taskDecisionProvider,
          contextIdentifierProvider,
          collabEditProvider,
          collabEditDotProvider,
          presenceProvider,
          macroProvider,
          legacyImageUploadProvider,
          autoformattingProvider,
          providerFactory,
          mediaProvider,
          cardProvider,
          quickInsertProvider,
        };
      };

      const assertProvider = (
        providerFactory: ProviderFactory,
        providerName: string,
        expectedProvider: any, // Providers don't have common interface
        done: () => {},
      ) => {
        expect(providerFactory.hasProvider(providerName)).toBe(true);
        providerFactory.subscribe(providerName, async (name, provider) => {
          expect(await provider).toBe(expectedProvider);
          done();
        });
      };

      it('should be populated with activityProvider', (done) => {
        const { providerFactory, activityProvider } = setup();
        assertProvider(
          providerFactory,
          'activityProvider',
          activityProvider,
          done,
        );
      });

      it('should be populated with emojiProvider', (done) => {
        const { providerFactory, emojiProvider } = setup();
        assertProvider(providerFactory, 'emojiProvider', emojiProvider, done);
      });

      it('should be populated with mentionProvider', (done) => {
        const { providerFactory, mentionProvider } = setup();
        assertProvider(
          providerFactory,
          'mentionProvider',
          mentionProvider,
          done,
        );
      });

      it('should be populated with taskDecisionProvider', (done) => {
        const { providerFactory, taskDecisionProvider } = setup();
        assertProvider(
          providerFactory,
          'taskDecisionProvider',
          taskDecisionProvider,
          done,
        );
      });

      it('should be populated with contextIdentifierProvider', (done) => {
        const { providerFactory, contextIdentifierProvider } = setup();
        assertProvider(
          providerFactory,
          'contextIdentifierProvider',
          contextIdentifierProvider,
          done,
        );
      });

      it('should be populated with collabEditProvider', (done) => {
        const { providerFactory, collabEditProvider } = setup();
        assertProvider(
          providerFactory,
          'collabEditProvider',
          collabEditProvider,
          done,
        );
      });

      it('should be populated with collabEditProvider via collabEdit object', (done) => {
        const { providerFactory, collabEditDotProvider } = setup(true);
        assertProvider(
          providerFactory,
          'collabEditProvider',
          collabEditDotProvider,
          done,
        );
      });

      it('should be populated with presenceProvider', (done) => {
        const { providerFactory, presenceProvider } = setup();
        assertProvider(
          providerFactory,
          'presenceProvider',
          presenceProvider,
          done,
        );
      });

      it('should be populated with macroProvider', (done) => {
        const { providerFactory, macroProvider } = setup();
        assertProvider(providerFactory, 'macroProvider', macroProvider, done);
      });

      it('should be populated with legacyImageUploadProvider', (done) => {
        const { providerFactory, legacyImageUploadProvider } = setup();
        assertProvider(
          providerFactory,
          'imageUploadProvider',
          legacyImageUploadProvider,
          done,
        );
      });

      it('should be populated with autoformattingProvider', (done) => {
        const { providerFactory, autoformattingProvider } = setup();
        assertProvider(
          providerFactory,
          'autoformattingProvider',
          autoformattingProvider,
          done,
        );
      });

      it('should be populated with mediaProvider', (done) => {
        const { providerFactory, mediaProvider } = setup();
        assertProvider(providerFactory, 'mediaProvider', mediaProvider, done);
      });

      it('should be populated with cardProvider', (done) => {
        const { providerFactory, cardProvider } = setup();
        assertProvider(providerFactory, 'cardProvider', cardProvider, done);
      });

      it('should be populated with cardProvider on deprecated UNSAFE_cards', (done) => {
        const cardProvider = {} as any;
        const cardOptions: CardOptions = {
          provider: Promise.resolve(cardProvider),
        };

        const component = mount(<Editor UNSAFE_cards={cardOptions} />);
        const providerFactory = component
          .find<EditorViewProps>(ReactEditorView)
          .props().providerFactory;

        assertProvider(providerFactory, 'cardProvider', cardProvider, done);
      });

      it('should be populated with quickInsertProvider', (done) => {
        const { providerFactory, quickInsertProvider } = setup(false, false);
        assertProvider(
          providerFactory,
          'quickInsertProvider',
          quickInsertProvider,
          done,
        );
      });

      it('should be populated with extensionProvider', () => {
        const { providerFactory } = setup();
        // extensionProvider is going to be a generated in packages/editor/editor-common/src/extensions/combine-extension-providers.ts
        // and there is nothing to compare it with
        expect(providerFactory.hasProvider('extensionProvider')).toBe(true);
      });
    });

    describe('providers', () => {
      const quickInsertProvider = Promise.resolve({} as QuickInsertProvider);

      const extensionProvider = createFakeExtensionProvider(
        'fake.confluence',
        'extension',
        () => <div>Fake extension</div>,
      );

      it('should set extensionProvider quickInsert provider even when quickInsertProvider is not provided', () => {
        const wrapper = shallow(
          <Editor extensionProviders={[extensionProvider]} />,
        );

        expect(wrapper.state('quickInsertProvider')).toBeDefined();
      });

      it('should just set quickInsertProvider if there is no extensionProvider', () => {
        const wrapper = shallow(
          <Editor quickInsert={{ provider: quickInsertProvider }} />,
        );

        expect(wrapper.state('quickInsertProvider')).toBe(quickInsertProvider);
      });

      it('should combine them if both quickInsertProvider and extensionProvider are provided', () => {
        const combineQuickInsertProvidersSpy = jest.spyOn(
          extensionUtils,
          'combineQuickInsertProviders',
        );

        const wrapper = shallow(
          <Editor
            extensionProviders={[extensionProvider]}
            quickInsert={{ provider: quickInsertProvider }}
          />,
        );

        expect(wrapper.state('quickInsertProvider')).toBeDefined();
        expect(combineQuickInsertProvidersSpy).toHaveBeenCalledTimes(1);
        // Call 0, Argument 0, Array item 0
        expect(combineQuickInsertProvidersSpy.mock.calls[0][0][0]).toBe(
          quickInsertProvider,
        );

        combineQuickInsertProvidersSpy.mockReset();
        combineQuickInsertProvidersSpy.mockRestore();
      });

      it('should not set quickInsertProvider if neither quickInsertProvider or extensionProvider provided', () => {
        const wrapper = shallow(<Editor />);

        expect(wrapper.state('quickInsertProvider')).toBeUndefined();
      });
    });
  });
});
