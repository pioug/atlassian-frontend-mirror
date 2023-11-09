const mockStopMeasureDuration = 1234;
const tti = 1000;
const ttiFromInvocation = 500;

jest.mock('@atlaskit/editor-common/utils', () => ({
  ...jest.requireActual<Object>('@atlaskit/editor-common/utils'),
  startMeasure: jest.fn(),
  stopMeasure: jest.fn(
    (
      measureName: string,
      onMeasureComplete?: (duration: number, startTime: number) => void,
    ) => {
      onMeasureComplete && onMeasureComplete(mockStopMeasureDuration, 1);
    },
  ),
  measureTTI: jest.fn(),
}));

const mockStore = {
  get: jest.fn(),
  getAll: jest.fn(),
  start: jest.fn(),
  addMetadata: jest.fn(),
  mark: jest.fn(),
  success: jest.fn(),
  fail: jest.fn(),
  abort: jest.fn(),
  failAll: jest.fn(),
  abortAll: jest.fn(),
};
let mockStoreInstance: jest.Mock;
jest.mock('@atlaskit/editor-common/ufo', () => ({
  ...jest.requireActual<Object>('@atlaskit/editor-common/ufo'),
  ExperienceStore: {
    getInstance: (mockStoreInstance = jest.fn(() => mockStore)),
  },
}));

let mockUuid = '12345abcdef';
jest.mock('uuid/v4', () => ({
  __esModule: true,
  default: jest.fn(() => mockUuid),
}));

jest.mock('@atlaskit/editor-common/provider-factory');

import type { RenderResult } from '@testing-library/react';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import Editor from '../../editor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import sendKeyToPm from '@atlaskit/editor-test-helpers/send-key-to-pm';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { analyticsClient } from '@atlaskit/editor-test-helpers/analytics-client-mock';
import type { AnalyticsWebClient } from '@atlaskit/analytics-listeners';
import FabricAnalyticsListeners from '@atlaskit/analytics-listeners';
// eslint-disable-next-line import/no-extraneous-dependencies
import type {
  GasPurePayload,
  GasPureScreenEventPayload,
} from '@atlaskit/analytics-gas-types';
import { EDITOR_APPEARANCE_CONTEXT } from '@atlaskit/analytics-namespaced-context';
import type {
  AutoformattingProvider,
  QuickInsertProvider,
} from '@atlaskit/editor-common/provider-factory';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import type { EditorAppearance, EditorProps } from '../../types';

import {
  name as packageName,
  version as packageVersion,
} from '../../version-wrapper';
import type { MediaOptions } from '@atlaskit/editor-plugin-media/types';
import { EditorActions, EditorContext } from '../..';
import { asMock } from '@atlaskit/media-test-helpers';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { flushPromises } from '@atlaskit/editor-test-helpers/e2e-helpers';
import { EditorExperience } from '@atlaskit/editor-common/ufo';

import type * as ActivityProviderModule from '@atlaskit/activity-provider';
const { ActivityResource } = jest.genMockFromModule<
  typeof ActivityProviderModule
>('@atlaskit/activity-provider');

import type * as EmojiModule from '@atlaskit/emoji';
import type { QuickInsertOptions } from '@atlaskit/editor-common/types';
import { IntlProvider } from 'react-intl-next';
const { EmojiResource } =
  jest.genMockFromModule<typeof EmojiModule>('@atlaskit/emoji');

import type { ExtensionProvider } from '@atlaskit/editor-common/extensions';
import { measureTTI as mockMeasureTTI } from '@atlaskit/editor-common/utils';
import type { CardOptions } from '@atlaskit/editor-common/card';
import { matchers } from '@emotion/jest';
import * as utils from '@atlaskit/editor-common/utils';
import measurements from '../../utils/performance/measure-enum';
import * as featureFlagsFromProps from '../../create-editor/feature-flags-from-props';

const measureTTI: any = mockMeasureTTI;

expect.extend(matchers);

describe(`Editor`, () => {
  describe('errors', () => {
    it('should not have any unknown console errors on mount', () => {
      const knownErrors = ['The pseudo class ":first-child" is potentially'];
      jest.clearAllMocks();
      const consoleErrorSpy = jest.spyOn(console, 'error');
      render(<Editor allowAnalyticsGASV3 />);
      const calls = consoleErrorSpy.mock.calls
        .map((call) => call[0])
        .filter((call) => !knownErrors.some((error) => call.startsWith(error)));
      expect(calls.length).toBe(0);
      consoleErrorSpy.mockRestore();
    });
  });

  describe('callbacks', () => {
    it('should fire onChange when text is inserted', async () => {
      let instance: EditorActions | undefined;
      const handleChange = jest.fn();

      const getEditorInstance = (editorInstance: EditorActions) => {
        instance = editorInstance;
      };

      render(
        <Editor onChange={handleChange} onEditorReady={getEditorInstance} />,
      );

      instance?.appendText('hello');
      expect(handleChange).toHaveBeenCalled();
    });

    describe('Comment appearance', () => {
      it('should fire onSave when Save is clicked', () => {
        const handleSave = jest.fn();
        render(<Editor onSave={handleSave} appearance="comment" />);

        const saveButton = screen.getByRole('button', { name: 'Save' });
        fireEvent.click(saveButton);
        expect(handleSave).toHaveBeenCalled();
      });

      it('should minHeight default 150px', () => {
        const { container } = render(<Editor appearance="comment" />);

        const editorElement = container.getElementsByClassName('akEditor');

        expect(editorElement.length).toBe(1);
        expect(editorElement[0]).toHaveStyleRule('min-height', '150px');
      });

      it('should set minHeight', () => {
        const { container } = render(
          <Editor appearance="comment" minHeight={250} />,
        );

        const editorElement = container.getElementsByClassName('akEditor');

        expect(editorElement.length).toBe(1);
        expect(editorElement[0]).toHaveStyleRule('min-height', '250px');
      });

      it('should set minHeight for chromeless', () => {
        render(<Editor appearance="chromeless" minHeight={250} />);

        const editorElement = screen.getByTestId('chromeless-editor');

        expect(editorElement).toHaveStyleRule('min-height', '250px');
      });

      // Testing prop-types has some issues due to `loggedTypeFailures` preventing multiple errors of the same code being logged
      // github.com/facebook/react/issues/7047
      // https://github.com/facebook/prop-types/blob/be165febc8133dfbe2c45133db6d25664dd68ad8/checkPropTypes.js#L47-L50
      it('should minHeight prop error for full-page', () => {
        const consoleErrorSpy = jest.spyOn(console, 'error');
        render(<Editor appearance="full-page" minHeight={250} />);

        expect(consoleErrorSpy).toHaveBeenCalledWith(
          expect.stringContaining(
            'minHeight only supports editor appearance chromeless and comment',
          ),
        );
      });

      it('should fire onCancel when Cancel is clicked', () => {
        const cancelled = jest.fn();
        render(<Editor onCancel={cancelled} appearance="comment" />);

        const cancelButton = screen.getByRole('button', { name: 'Cancel' });
        fireEvent.click(cancelButton);
        expect(cancelled).toHaveBeenCalled();
      });
    });

    it('should fire onEditorReady when ready', () => {
      const onEditorReady = jest.fn();
      render(<Editor onEditorReady={onEditorReady} />);

      expect(onEditorReady).toHaveBeenCalled();
    });
  });

  describe('react-intl-next', () => {
    describe('when IntlProvider is not in component ancestry', () => {
      const renderEditor = () => render(<Editor onSave={() => {}} />);
      it('should not throw an error', () => {
        expect(() => renderEditor()).not.toThrow();
      });
      it('should setup a default IntlProvider with locale "en"', () => {
        renderEditor();
        const saveButton = screen.getByTestId('comment-save-button');
        expect(saveButton.textContent).toBe('Save');
      });
    });
    describe('when IntlProvider is in component ancestry', () => {
      const renderEditorWithIntl = () =>
        render(
          <IntlProvider
            locale="es"
            messages={{ 'fabric.editor.saveButton': 'Guardar' }}
          >
            <Editor onSave={() => {}} />
          </IntlProvider>,
        );
      it('should not throw an error', () => {
        expect(() => renderEditorWithIntl()).not.toThrow();
      });
      it('should use the provided IntlProvider, and not setup a default IntlProvider', () => {
        renderEditorWithIntl();
        const saveButton = screen.getByTestId('comment-save-button');
        expect(saveButton.textContent).toBe('Guardar');
      });
    });
  });

  describe('save on enter', () => {
    it('should fire onSave when user presses Enter', () => {
      let instance: EditorActions | undefined;
      const handleSave = jest.fn();

      const getEditorInstance = (editorInstance: EditorActions) => {
        instance = editorInstance;
      };

      render(
        <Editor
          onSave={handleSave}
          saveOnEnter
          onEditorReady={getEditorInstance}
        />,
      );

      const view = instance?._privateGetEditorView();

      if (view) {
        sendKeyToPm(view, 'Enter');
      }
      expect(handleSave).toHaveBeenCalled();
    });
  });

  describe('submit-editor (save on mod-enter)', () => {
    it('should fire onSave when user presses Enter', () => {
      let instance: EditorActions | undefined;
      const handleSave = jest.fn();

      const getEditorInstance = (editorInstance: EditorActions) => {
        instance = editorInstance;
      };

      render(
        <Editor
          onSave={handleSave}
          saveOnEnter
          onEditorReady={getEditorInstance}
        />,
      );

      const view = instance?._privateGetEditorView();

      if (view) {
        sendKeyToPm(view, 'Mod-Enter');
      }
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
        // just mount the component
        render(
          <FabricAnalyticsListeners
            client={mockAnalyticsClient(appearance.analyticsAppearance, done)}
          >
            <Editor appearance={appearance.appearance} allowAnalyticsGASV3 />
          </FabricAnalyticsListeners>,
        );
      });
    });

    it('should update appearance used in events when change appearance prop', (done) => {
      // We don't care about the client on the first render, that's tested above, only that the re-render causes
      // a new analytics event with the correct appearance
      const { rerender } = render(
        <FabricAnalyticsListeners client={undefined}>
          <Editor appearance="full-page" allowAnalyticsGASV3 />
        </FabricAnalyticsListeners>,
      );

      rerender(
        <FabricAnalyticsListeners
          client={mockAnalyticsClient(
            EDITOR_APPEARANCE_CONTEXT.FULL_WIDTH,
            done,
          )}
        >
          <Editor appearance="full-width" allowAnalyticsGASV3 />
        </FabricAnalyticsListeners>,
      );
    });

    it('should dispatch an tti (time-to-interactive) editor event after the editor has mounted', async (done) => {
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
                tti,
                ttiFromInvocation,
                canceled: false,
                ttiSeverity: 'normal',
                ttiFromInvocationSeverity: 'normal',
              }),
            }),
          );

          measureTTI.mockClear();
          done();
        };
        return analyticsClient(analyticsEventHandler);
      };

      render(
        <FabricAnalyticsListeners client={mockAnalyticsClient(done)}>
          <Editor
            allowAnalyticsGASV3
            performanceTracking={{
              ttiTracking: { enabled: true, trackSeverity: true },
            }}
          />
        </FabricAnalyticsListeners>,
      );
      await flushPromises();
      const [ttiCallback] = measureTTI.mock.calls[0];
      ttiCallback(tti, ttiFromInvocation, false);
    });

    describe('contentRetrievalPerformed events', () => {
      function testContentRetrievalPerformedAnalytics({
        editorProps,
        editorActions,
        useOnReadyEditorActions,
        analyticsEventHandler,
      }: {
        editorProps: EditorProps;
        editorActions?: EditorActions;
        useOnReadyEditorActions?: boolean;
        analyticsEventHandler: (
          event: GasPurePayload | GasPureScreenEventPayload,
        ) => void;
      }) {
        let onReadyEditorActions: EditorActions;

        render(
          <FabricAnalyticsListeners
            client={analyticsClient(analyticsEventHandler)}
          >
            <EditorContext editorActions={editorActions}>
              <Editor
                onEditorReady={(localEditorActions) =>
                  (onReadyEditorActions = localEditorActions)
                }
                {...editorProps}
              />
            </EditorContext>
          </FabricAnalyticsListeners>,
        );

        const editorActionsFinal = useOnReadyEditorActions
          ? onReadyEditorActions!
          : editorActions;
        editorActionsFinal?.getValue().catch(() => {});
      }
      it('should not dispatch a contentRetrievalPerformed event with success=true if contentRetrievalTracking prop is not set', (done) => {
        testContentRetrievalPerformedAnalytics({
          editorProps: {},
          editorActions: undefined,
          useOnReadyEditorActions: true,
          analyticsEventHandler: (event) => {
            expect(event).not.toEqual(
              expect.objectContaining({
                action: 'contentRetrievalPerformed',
                actionSubject: 'editor',
                attributes: expect.objectContaining({
                  success: true,
                }),
              }),
            );
            done();
          },
        });
      });
      it('should not dispatch a contentRetrievalPerformed event success=false if contentRetrievalTracking prop is not set and an exception is thrown', (done) => {
        const badEditorActions = new EditorActions();
        badEditorActions.getValue = async () => {
          throw new Error('a bad error');
        };
        testContentRetrievalPerformedAnalytics({
          editorProps: {
            performanceTracking: {},
          },
          editorActions: badEditorActions,
          useOnReadyEditorActions: true,
          analyticsEventHandler: (event) => {
            expect(event).not.toEqual(
              expect.objectContaining({
                action: 'contentRetrievalPerformed',
                actionSubject: 'editor',
                attributes: expect.objectContaining({
                  success: false,
                  errorInfo: 'Error: a bad error',
                  errorStack: undefined,
                }),
              }),
            );
            done();
          },
        });
      });
      it('should not dispatch a contentRetrievalPerformed event with success=true if contentRetrievalTracking prop is enabled=false', (done) => {
        const badEditorActions = new EditorActions();
        badEditorActions.getValue = async () => {
          throw new Error('a bad error');
        };
        testContentRetrievalPerformedAnalytics({
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
          analyticsEventHandler: (event) => {
            expect(event).not.toEqual(
              expect.objectContaining({
                action: 'contentRetrievalPerformed',
                actionSubject: 'editor',
                attributes: expect.objectContaining({ success: true }),
              }),
            );
            done();
          },
        });
      });
      it('should dispatch a contentRetrievalPerformed event with success=true if contentRetrievalTracking prop is set', (done) => {
        testContentRetrievalPerformedAnalytics({
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
          analyticsEventHandler: (event) => {
            expect(event).toEqual(
              expect.objectContaining({
                action: 'contentRetrievalPerformed',
                actionSubject: 'editor',
                attributes: expect.objectContaining({
                  success: true,
                }),
              }),
            );
            done();
          },
        });
      });
      it('should dispatch a contentRetrievalPerformed event success=false if contentRetrievalTracking prop is set and an exception is thrown', (done) => {
        const badEditorActions = new EditorActions();
        badEditorActions.getValue = async () => {
          throw new Error('a bad error');
        };
        testContentRetrievalPerformedAnalytics({
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
          analyticsEventHandler: (event) => {
            expect(event).toEqual(
              expect.objectContaining({
                action: 'contentRetrievalPerformed',
                actionSubject: 'editor',
                attributes: expect.objectContaining({
                  success: false,
                  errorInfo: 'Error: a bad error',
                  errorStack: undefined,
                }),
              }),
            );
            done();
          },
        });
      });
      it('should dispatch a contentRetrievalPerformed event success=false with error stack trace if contentRetrievalTracking prop is set with reportErrorStack=true and an exception is thrown', (done) => {
        const badEditorActions = new EditorActions();
        badEditorActions.getValue = async () => {
          throw new Error('a bad error');
        };
        testContentRetrievalPerformedAnalytics({
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
          analyticsEventHandler: (event) => {
            expect(event).toEqual(
              expect.objectContaining({
                action: 'contentRetrievalPerformed',
                actionSubject: 'editor',
                attributes: expect.objectContaining({
                  success: false,
                  errorInfo: 'Error: a bad error',
                  errorStack: expect.any(String),
                }),
              }),
            );
            done();
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
        render(
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
        const mockAnalyticsClient = (): AnalyticsWebClient => {
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
        render(
          <FabricAnalyticsListeners client={mockAnalyticsClient()}>
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

    describe('running the constructor once', () => {
      it('should start measure', () => {
        const startMeasureSpy = jest.spyOn(utils, 'startMeasure');
        render(<Editor />);

        expect(startMeasureSpy).toHaveBeenCalledWith(
          measurements.EDITOR_MOUNTED,
        );
        startMeasureSpy.mockRestore();
      });

      it('should call the editorMeasureTTICallback once', () => {
        const measureTTICallback = jest.spyOn(utils, 'measureTTI');
        const { rerender } = render(
          <Editor
            performanceTracking={{
              ttiTracking: { enabled: true },
            }}
          />,
        );
        rerender(
          <Editor
            performanceTracking={{
              ttiTracking: { enabled: true },
            }}
          />,
        );

        expect(measureTTICallback).toHaveBeenCalledTimes(1);
        measureTTICallback.mockRestore();
      });
    });
  });

  describe('ufo', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    describe('when feature flag enabled', () => {
      let editor: RenderResult;

      beforeEach(async () => {
        editor = render(<Editor featureFlags={{ ufo: true }} />);
        await flushPromises();
      });

      it('starts editor load experience', () => {
        expect(mockStore.start).toHaveBeenCalledWith(
          EditorExperience.loadEditor,
          expect.any(Number),
        );
      });

      it('marks onEditorReady on editor load experience if provided', async () => {
        editor = render(
          <Editor featureFlags={{ ufo: true }} onEditorReady={() => {}} />,
        );
        await flushPromises();
        expect(mockStore.mark).toHaveBeenCalledWith(
          EditorExperience.loadEditor,
          'onEditorReadyCallback',
          mockStopMeasureDuration + 1,
        );
      });

      it("doesn't mark onEditorReady on editor load experience if not provided", async () => {
        expect(mockStore.mark).not.toHaveBeenCalledWith(
          EditorExperience.loadEditor,
          'onEditorReadyCallback',
          mockStopMeasureDuration + 1,
        );
      });

      it('marks editor mounted on editor load experience', () => {
        expect(mockStore.mark).toHaveBeenCalledWith(
          EditorExperience.loadEditor,
          'mounted',
          mockStopMeasureDuration + 1,
        );
      });

      it('marks editor tti on editor load experience', () => {
        const [ttiCallback] = measureTTI.mock.calls[0];
        ttiCallback(tti, ttiFromInvocation, false);
        expect(mockStore.mark).toHaveBeenCalledWith(
          EditorExperience.loadEditor,
          'tti',
          tti,
        );
      });

      it('succeeds editor load experience on tti', () => {
        expect(mockStore.success).not.toHaveBeenCalled();
        const [ttiCallback] = measureTTI.mock.calls[0];
        ttiCallback(tti, ttiFromInvocation, false);
        expect(mockStore.success).toHaveBeenCalled();
      });

      it('adds objectId as metadata to editor load experience', async () => {
        editor = render(
          <Editor
            featureFlags={{ ufo: true }}
            contextIdentifierProvider={Promise.resolve({
              objectId: 'abc',
              containerId: 'def',
            })}
          />,
        );
        await flushPromises();
        expect(mockStore.addMetadata).toHaveBeenCalledWith(
          EditorExperience.loadEditor,
          {
            objectId: 'abc',
          },
        );
      });

      it('aborts editor load experience if component unmounts before tti', () => {
        editor.unmount();
        expect(mockStore.abortAll).toHaveBeenCalled();
      });
    });

    describe('when feature flag not enabled', () => {
      it("doesn't initialise store", () => {
        expect(mockStoreInstance).not.toHaveBeenCalled();
      });

      it("doesn't start editor load experience", () => {
        render(<Editor />);
        expect(mockStore.start).not.toHaveBeenCalled();
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

      const setProviderSpy = jest.spyOn(
        ProviderFactory.prototype,
        'setProvider',
      );

      render(
        <Editor
          activityProvider={Promise.resolve(activityProvider)}
          emojiProvider={Promise.resolve(emojiProvider)}
          mentionProvider={Promise.resolve(mentionProvider)}
          taskDecisionProvider={Promise.resolve(taskDecisionProvider)}
          contextIdentifierProvider={Promise.resolve(contextIdentifierProvider)}
          collabEdit={collabEdit}
          collabEditProvider={Promise.resolve(collabEditProvider)}
          presenceProvider={Promise.resolve(presenceProvider)}
          macroProvider={Promise.resolve(macroProvider)}
          legacyImageUploadProvider={Promise.resolve(legacyImageUploadProvider)}
          autoformattingProvider={Promise.resolve(autoformattingProvider)}
          media={mediaOptions}
          smartLinks={cardOptions}
          quickInsert={quickInsert}
          extensionProviders={
            defineExtensionsProvider ? [extensionProviderProps] : undefined
          }
        />,
      );
      return {
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
        setProviderSpy,
        mediaProvider,
        cardProvider,
        quickInsertProvider,
      };
    };

    it('should be populated with activityProvider', () => {
      const { setProviderSpy, activityProvider } = setup();
      expect(setProviderSpy).toHaveBeenNthCalledWith(
        8,
        'activityProvider',
        Promise.resolve(activityProvider),
      );
    });

    it('should be populated with emojiProvider', () => {
      const { setProviderSpy, emojiProvider } = setup();
      expect(setProviderSpy).toHaveBeenNthCalledWith(
        1,
        'emojiProvider',
        Promise.resolve(emojiProvider),
      );
    });

    it('should be populated with mentionProvider', () => {
      const { setProviderSpy, mentionProvider } = setup();
      expect(setProviderSpy).toHaveBeenNthCalledWith(
        2,
        'mentionProvider',
        Promise.resolve(mentionProvider),
      );
    });

    it('should be populated with taskDecisionProvider', () => {
      const { setProviderSpy, taskDecisionProvider } = setup();
      expect(setProviderSpy).toHaveBeenNthCalledWith(
        3,
        'taskDecisionProvider',
        Promise.resolve(taskDecisionProvider),
      );
    });

    it('should be populated with contextIdentifierProvider', () => {
      const { setProviderSpy, contextIdentifierProvider } = setup();
      expect(setProviderSpy).toHaveBeenNthCalledWith(
        4,
        'contextIdentifierProvider',
        Promise.resolve(contextIdentifierProvider),
      );
    });

    it('should be populated with collabEditProvider', () => {
      const { setProviderSpy, collabEditProvider } = setup();
      expect(setProviderSpy).toHaveBeenNthCalledWith(
        7,
        'collabEditProvider',
        Promise.resolve(collabEditProvider),
      );
    });

    it('should be populated with collabEditProvider via collabEdit object', () => {
      const { setProviderSpy, collabEditDotProvider } = setup();
      expect(setProviderSpy).toHaveBeenNthCalledWith(
        7,
        'collabEditProvider',
        Promise.resolve(collabEditDotProvider),
      );
    });

    it('should be populated with presenceProvider', () => {
      const { setProviderSpy, presenceProvider } = setup();
      expect(setProviderSpy).toHaveBeenNthCalledWith(
        10,
        'presenceProvider',
        Promise.resolve(presenceProvider),
      );
    });

    it('should be populated with macroProvider', () => {
      const { setProviderSpy, macroProvider } = setup();
      expect(setProviderSpy).toHaveBeenNthCalledWith(
        11,
        'macroProvider',
        Promise.resolve(macroProvider),
      );
    });

    it('should be populated with legacyImageUploadProvider', () => {
      const { setProviderSpy, legacyImageUploadProvider } = setup();
      expect(setProviderSpy).toHaveBeenNthCalledWith(
        6,
        'imageUploadProvider',
        Promise.resolve(legacyImageUploadProvider),
      );
    });

    it('should be populated with autoformattingProvider', () => {
      const { setProviderSpy, autoformattingProvider } = setup();
      expect(setProviderSpy).toHaveBeenNthCalledWith(
        13,
        'autoformattingProvider',
        Promise.resolve(autoformattingProvider),
      );
    });

    it('should be populated with mediaProvider', () => {
      const { setProviderSpy, mediaProvider } = setup();
      expect(setProviderSpy).toHaveBeenNthCalledWith(
        5,
        'mediaProvider',
        Promise.resolve(mediaProvider),
      );
    });

    it('should be populated with cardProvider from `linking.smartLinks` (prefer over `smartLinks`)', () => {
      const linkingCardProvider = {} as any;
      const smartLinksCardProvider = {} as any;
      const linkingCardOptions: CardOptions = {
        provider: Promise.resolve(linkingCardProvider),
      };
      const smartLinksCardOptions: CardOptions = {
        provider: Promise.resolve(smartLinksCardProvider),
      };

      const setProviderSpy = jest.spyOn(
        ProviderFactory.prototype,
        'setProvider',
      );

      render(
        <Editor
          linking={{ smartLinks: linkingCardOptions }}
          smartLinks={smartLinksCardOptions}
        />,
      );

      expect(setProviderSpy).toHaveBeenNthCalledWith(
        12,
        'cardProvider',
        Promise.resolve(linkingCardProvider),
      );
    });

    it('should be populated with cardProvider', () => {
      const { setProviderSpy, cardProvider } = setup();
      expect(setProviderSpy).toHaveBeenNthCalledWith(
        12,
        'cardProvider',
        Promise.resolve(cardProvider),
      );
    });

    it('should be populated with cardProvider on deprecated UNSAFE_cards', () => {
      const cardProvider = {} as any;
      const cardOptions: CardOptions = {
        provider: Promise.resolve(cardProvider),
      };

      const setProviderSpy = jest.spyOn(
        ProviderFactory.prototype,
        'setProvider',
      );

      render(<Editor UNSAFE_cards={cardOptions} />);

      expect(setProviderSpy).toHaveBeenNthCalledWith(
        12,
        'cardProvider',
        Promise.resolve(cardProvider),
      );
    });

    it('should be populated with quickInsertProvider', () => {
      const { setProviderSpy, quickInsertProvider } = setup();
      expect(setProviderSpy).toHaveBeenNthCalledWith(
        15,
        'quickInsertProvider',
        Promise.resolve(quickInsertProvider),
      );
    });

    it('should be populated with extensionProvider', () => {
      const { setProviderSpy } = setup();
      // extensionProvider is going to be a generated in packages/editor/editor-common/src/extensions/combine-extension-providers.ts
      // and there is nothing to compare it with

      expect(setProviderSpy).toHaveBeenNthCalledWith(
        14,
        'extensionProvider',
        expect.any(Object),
      );
    });

    describe('destroy the provider factory', () => {
      beforeEach(() => {
        jest.clearAllMocks();
      });

      it('should destroy if unmounting', () => {
        const destroySpy = jest.spyOn(ProviderFactory.prototype, 'destroy');
        const { unmount } = render(<Editor />);
        unmount();
        expect(destroySpy).toHaveBeenCalledTimes(1);
        destroySpy.mockRestore();
      });

      it('should not destroy the provider if not unmounting', () => {
        const destroySpy = jest.spyOn(ProviderFactory.prototype, 'destroy');
        const { rerender } = render(<Editor />);
        rerender(<Editor placeholder="different" />);
        expect(destroySpy).toHaveBeenCalledTimes(0);
        destroySpy.mockRestore();
      });
    });

    it('should unregister editor actions if unmounting', () => {
      const unregisterSpy = jest.spyOn(
        EditorActions.prototype,
        '_privateUnregisterEditor',
      );
      const { unmount } = render(<Editor />);
      unmount();
      expect(unregisterSpy).toHaveBeenCalled();
      unregisterSpy.mockRestore();
    });

    it('should not unregister editor actions if not unmounting', () => {
      const unregisterSpy = jest.spyOn(
        EditorActions.prototype,
        '_privateUnregisterEditor',
      );
      render(<Editor />);
      expect(unregisterSpy).toHaveBeenCalledTimes(0);
      unregisterSpy.mockRestore();
    });
  });
});

describe('setting default props as expected', () => {
  it('should set default behaviour for ', () => {
    const componentSpy = jest.spyOn(
      featureFlagsFromProps,
      'createFeatureFlagsFromProps',
    );
    render(<Editor />);

    // If it's the default behaviour when we check the featureFlags
    // in the Editor this should be true.
    expect(componentSpy).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        appearance: 'comment',
        allowNewInsertionBehaviour: true,
        disabled: false,
        extensionHandlers: {},
        allowHelpDialog: true,
        quickInsert: true,
      }),
    );
  });
});
