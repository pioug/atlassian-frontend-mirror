const mockStopMeasureDuration = 1234;

jest.mock('@atlaskit/editor-common/performance-measures', () => ({
	...jest.requireActual<Object>('@atlaskit/editor-common/performance-measures'),
	startMeasure: jest.fn(),
	stopMeasure: jest.fn(
		(measureName: string, onMeasureComplete?: (duration: number, startTime: number) => void) => {
			onMeasureComplete && onMeasureComplete(mockStopMeasureDuration, 1);
		},
	),
}));

// Ignored via go/ees005
// eslint-disable-next-line no-var
var mockUuid = '12345abcdef';
jest.mock('uuid/v4', () => ({
	__esModule: true,
	default: jest.fn(() => mockUuid),
}));

jest.mock('@atlaskit/editor-common/provider-factory');

// Use fake timers otherwise `setInterval` called from ComposableEditor is an open handle that prevents
// the test from closing.
// Invoked here: packages/editor/editor-common/src/utils/browser-extensions.ts
jest.useFakeTimers();

const { ActivityResource } = jest.genMockFromModule<typeof ActivityProviderModule>(
	'@atlaskit/activity-provider',
);

import React from 'react';

import { matchers } from '@emotion/jest';
import { fireEvent, render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';

import type * as ActivityProviderModule from '@atlaskit/activity-provider';
import type { GasPurePayload, GasPureScreenEventPayload } from '@atlaskit/analytics-gas-types';
import type { AnalyticsWebClient } from '@atlaskit/analytics-listeners';
import FabricAnalyticsListeners from '@atlaskit/analytics-listeners';
import { EDITOR_APPEARANCE_CONTEXT } from '@atlaskit/analytics-namespaced-context';
import type { ExtensionProvider } from '@atlaskit/editor-common/extensions';
import * as measure from '@atlaskit/editor-common/performance-measures';
import type { QuickInsertProvider } from '@atlaskit/editor-common/provider-factory';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import type { EditorAppearance, QuickInsertOptions } from '@atlaskit/editor-common/types';
import type { MediaOptions } from '@atlaskit/editor-plugins/media/types';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { analyticsClient } from '@atlaskit/editor-test-helpers/analytics-client-mock';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import sendKeyToPm from '@atlaskit/editor-test-helpers/send-key-to-pm';

import Editor from '../../editor';
import { EditorActions } from '../../index';
import * as featureFlagsFromProps from '../../utils/feature-flags-from-props';
import measurements from '../../utils/performance/measure-enum';
import { name as packageName, version as packageVersion } from '../../version-wrapper';

expect.extend(matchers);

describe(`Editor`, () => {
	describe('errors', () => {
		it('should not have any unknown console errors on mount', () => {
			const knownErrors = [
				'The pseudo class ":first-child" is potentially',
				'The pseudo class ":' + 'nth-child" is potentially',
				'Could not parse CSS stylesheet', // JSDOM version (22) doesn't support the new @container CSS rule
			];
			jest.clearAllMocks();
			const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
			const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
			render(<Editor allowAnalyticsGASV3 />);
			const calls = consoleErrorSpy.mock.calls
				.map((call) => call[0])
				.filter((call) => {
					const callMessage = typeof call === 'string' ? call : call.message;
					return !knownErrors.some((error) => callMessage.startsWith(error));
				});
			expect(calls.length).toBe(0);
			consoleErrorSpy.mockRestore();
			consoleWarnSpy.mockRestore();
		});
	});

	describe('callbacks', () => {
		beforeEach(() => {
			jest.spyOn(global.console, 'error').mockImplementation();
			jest.spyOn(global.console, 'warn').mockImplementation();
		});
		afterEach(() => {
			(global.console.error as jest.Mock).mockRestore();
			(global.console.warn as jest.Mock).mockRestore();
		});
		it('should fire onChange when text is inserted', async () => {
			let instance: EditorActions | undefined;
			const handleChange = jest.fn();

			const getEditorInstance = (editorInstance: EditorActions) => {
				instance = editorInstance;
			};

			render(<Editor onChange={handleChange} onEditorReady={getEditorInstance} />);

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
				const { container } = render(<Editor appearance="comment" minHeight={250} />);

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
				const consoleErrorSpy = global.console.error as jest.Mock;
				render(<Editor appearance="full-page" minHeight={250} />);

				expect(consoleErrorSpy.mock.calls.length).toBeGreaterThan(0);
				const consoleErrorMessages = consoleErrorSpy.mock.calls.map((call) => call.join(' '));

				expect(consoleErrorMessages).toEqual(
					expect.arrayContaining([
						expect.stringContaining(
							'minHeight only supports editor appearance chromeless and comment for Editor',
						),
					]),
				);
			});

			it('should fire onCancel when Cancel is clicked', () => {
				const cancelled = jest.fn();
				render(<Editor onCancel={cancelled} appearance="comment" />);

				const cancelButton = screen.getByRole('button', { name: 'Cancel' });
				fireEvent.click(cancelButton);
				expect(cancelled).toHaveBeenCalled();
			});

			// When maxHeight is set, content area should have overflow-y as auto
			// So when content exceeds maxHeight, content area should show vertical scroll
			it('content area should have overflow-y as auto when maxHeight is set', () => {
				const { container } = render(<Editor appearance="comment" maxHeight={500} />);

				const editorElement = container.getElementsByClassName('ak-editor-content-area');

				expect(editorElement.length).toBe(1);
				expect(editorElement[0]).toHaveStyleRule('overflow-y', 'auto');
			});
		});

		it('should fire onEditorReady when ready', () => {
			const onEditorReady = jest.fn();
			render(<Editor onEditorReady={onEditorReady} />);

			expect(onEditorReady).toHaveBeenCalled();
		});
	});

	describe('react-intl-next', () => {
		beforeEach(() => {
			jest.spyOn(global.console, 'error').mockImplementation();
			jest.spyOn(global.console, 'warn').mockImplementation();
		});
		afterEach(() => {
			(global.console.error as jest.Mock).mockRestore();
			(global.console.warn as jest.Mock).mockRestore();
		});
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
					<IntlProvider locale="es" messages={{ 'fabric.editor.saveButton': 'Guardar' }}>
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
		beforeEach(() => {
			jest.spyOn(global.console, 'error').mockImplementation();
			jest.spyOn(global.console, 'warn').mockImplementation();
		});
		afterEach(() => {
			(global.console.error as jest.Mock).mockRestore();
			(global.console.warn as jest.Mock).mockRestore();
		});
		it('should fire onSave when user presses Enter', () => {
			let instance: EditorActions | undefined;
			const handleSave = jest.fn();

			const getEditorInstance = (editorInstance: EditorActions) => {
				instance = editorInstance;
			};

			render(<Editor onSave={handleSave} saveOnEnter onEditorReady={getEditorInstance} />);

			const view = instance?._privateGetEditorView();

			if (view) {
				sendKeyToPm(view, 'Enter');
			}
			expect(handleSave).toHaveBeenCalled();
		});
	});

	describe('submit-editor (save on mod-enter)', () => {
		beforeEach(() => {
			jest.spyOn(global.console, 'error').mockImplementation();
			jest.spyOn(global.console, 'warn').mockImplementation();
		});
		afterEach(() => {
			(global.console.error as jest.Mock).mockRestore();
			(global.console.warn as jest.Mock).mockRestore();
		});
		it('should fire onSave when user presses Enter', () => {
			let instance: EditorActions | undefined;
			const handleSave = jest.fn();

			const getEditorInstance = (editorInstance: EditorActions) => {
				instance = editorInstance;
			};

			render(<Editor onSave={handleSave} saveOnEnter onEditorReady={getEditorInstance} />);

			const view = instance?._privateGetEditorView();

			if (view) {
				sendKeyToPm(view, 'Mod-Enter');
			}
			expect(handleSave).toHaveBeenCalled();
		});
	});

	describe('analytics', () => {
		beforeEach(() => {
			jest.spyOn(global.console, 'error').mockImplementation();
			jest.spyOn(global.console, 'warn').mockImplementation();
		});
		afterEach(() => {
			(global.console.error as jest.Mock).mockRestore();
			(global.console.warn as jest.Mock).mockRestore();
		});
		const mockAnalyticsClient = (
			analyticsAppearance: EDITOR_APPEARANCE_CONTEXT,
		): AnalyticsWebClient => {
			const analyticsEventHandler = (event: GasPurePayload | GasPureScreenEventPayload) => {
				expect(event.attributes).toMatchObject({
					appearance: analyticsAppearance,
					packageName,
					packageVersion,
					componentName: 'editorCore',
				});
			};

			return analyticsClient(analyticsEventHandler);
		};

		const appearances: {
			analyticsAppearance: EDITOR_APPEARANCE_CONTEXT;
			appearance: EditorAppearance;
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
			it(`adds appearance analytics context to all editor events for ${appearance.appearance} editor`, () => {
				// editor fires an editor started event that should trigger the listener from
				// just mount the component
				render(
					<FabricAnalyticsListeners client={mockAnalyticsClient(appearance.analyticsAppearance)}>
						<Editor appearance={appearance.appearance} allowAnalyticsGASV3 />
					</FabricAnalyticsListeners>,
				);
			});
		});

		// Ignored via go/ees007
		// eslint-disable-next-line @atlaskit/editor/enforce-todo-comment-format
		// FIXME: Jest upgrade raises this issue
		// Expected done to be called once, but it was called multiple times
		it.skip('should update appearance used in events when change appearance prop', (done) => {
			// We don't care about the client on the first render, that's tested above, only that the re-render causes
			// a new analytics event with the correct appearance
			const { rerender } = render(
				<FabricAnalyticsListeners client={undefined}>
					<Editor appearance="full-page" allowAnalyticsGASV3 />
				</FabricAnalyticsListeners>,
			);

			rerender(
				<FabricAnalyticsListeners
					client={mockAnalyticsClient(EDITOR_APPEARANCE_CONTEXT.FULL_WIDTH)}
				>
					<Editor appearance="full-width" allowAnalyticsGASV3 />
				</FabricAnalyticsListeners>,
			);
		});

		describe('onEditorReady prop', () => {
			it('should dispatch an onEditorReadyCallback event after the editor has called the onEditorReady callback', (done) => {
				const mockAnalyticsClient = (done: jest.DoneCallback): AnalyticsWebClient => {
					const analyticsEventHandler = (event: GasPurePayload | GasPureScreenEventPayload) => {
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
						/>
					</FabricAnalyticsListeners>,
				);
			});
		});

		describe('running the constructor once', () => {
			it('should start measure', () => {
				const startMeasureSpy = jest.spyOn(measure, 'startMeasure');
				render(<Editor />);

				expect(startMeasureSpy).toHaveBeenCalledWith(measurements.EDITOR_MOUNTED);
				startMeasureSpy.mockRestore();
			});
		});
	});

	describe('providerFactory passed to ReactEditorView', () => {
		beforeEach(() => {
			jest.spyOn(global.console, 'error').mockImplementation();
			jest.spyOn(global.console, 'warn').mockImplementation();
		});
		afterEach(() => {
			(global.console.error as jest.Mock).mockRestore();
			(global.console.warn as jest.Mock).mockRestore();
		});

		it('should call setProvider with providers', () => {
			const setProviderSpy = jest.spyOn(ProviderFactory.prototype, 'setProvider');
			setProviderSpy.mockClear();
			// These `any` is not a problem. We later assert by using `toBe` method
			const activityProvider = new ActivityResource('some-url', 'some-cloud-id');
			const mentionProvider = {} as any;
			const contextIdentifierProvider = {} as any;
			const collabEditProvider = {} as any;
			const presenceProvider = {} as any;
			const macroProvider = {} as any;
			const legacyImageUploadProvider = {} as any;
			const mediaProvider = {} as any;
			const mediaOptions: MediaOptions = {
				provider: Promise.resolve(mediaProvider),
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

			render(
				<Editor
					activityProvider={Promise.resolve(activityProvider)}
					mentionProvider={Promise.resolve(mentionProvider)}
					contextIdentifierProvider={Promise.resolve(contextIdentifierProvider)}
					collabEditProvider={Promise.resolve(collabEditProvider)}
					presenceProvider={Promise.resolve(presenceProvider)}
					macroProvider={Promise.resolve(macroProvider)}
					legacyImageUploadProvider={Promise.resolve(legacyImageUploadProvider)}
					media={mediaOptions}
					quickInsert={quickInsert}
					extensionProviders={[extensionProviderProps]}
				/>,
			);

			expect(setProviderSpy).toHaveBeenCalledTimes(10);
			expect(setProviderSpy).toHaveBeenNthCalledWith(
				1,
				'mentionProvider',
				Promise.resolve(mentionProvider),
			);
			expect(setProviderSpy).toHaveBeenNthCalledWith(
				2,
				'contextIdentifierProvider',
				Promise.resolve(contextIdentifierProvider),
			);
			expect(setProviderSpy).toHaveBeenNthCalledWith(
				3,
				'imageUploadProvider',
				Promise.resolve(legacyImageUploadProvider),
			);
			expect(setProviderSpy).toHaveBeenNthCalledWith(
				4,
				'collabEditProvider',
				Promise.resolve(collabEditProvider),
			);
			expect(setProviderSpy).toHaveBeenNthCalledWith(
				5,
				'activityProvider',
				Promise.resolve(activityProvider),
			);
			expect(setProviderSpy).toHaveBeenNthCalledWith(
				7,
				'presenceProvider',
				Promise.resolve(presenceProvider),
			);
			expect(setProviderSpy).toHaveBeenNthCalledWith(
				8,
				'macroProvider',
				Promise.resolve(macroProvider),
			);

			// extensionProvider is going to be a generated in packages/editor/editor-common/src/extensions/combine-extension-providers.ts
			// and there is nothing to compare it with
			expect(setProviderSpy).toHaveBeenNthCalledWith(9, 'extensionProvider', expect.any(Object));
			expect(setProviderSpy).toHaveBeenNthCalledWith(
				10,
				'quickInsertProvider',
				Promise.resolve(quickInsertProvider),
			);

			setProviderSpy.mockRestore();
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
			const unregisterSpy = jest.spyOn(EditorActions.prototype, '_privateUnregisterEditor');
			const { unmount } = render(<Editor />);
			unmount();
			expect(unregisterSpy).toHaveBeenCalled();
			unregisterSpy.mockRestore();
		});

		it('should not unregister editor actions if not unmounting', () => {
			const unregisterSpy = jest.spyOn(EditorActions.prototype, '_privateUnregisterEditor');
			render(<Editor />);
			expect(unregisterSpy).toHaveBeenCalledTimes(0);
			unregisterSpy.mockRestore();
		});
	});
});

describe('setting default props as expected', () => {
	beforeEach(() => {
		jest.spyOn(global.console, 'error').mockImplementation();
		jest.spyOn(global.console, 'warn').mockImplementation();
	});
	afterEach(() => {
		(global.console.error as jest.Mock).mockRestore();
		(global.console.warn as jest.Mock).mockRestore();
	});
	it('should have default undefined feature flag object', () => {
		const componentSpy = jest.spyOn(featureFlagsFromProps, 'createFeatureFlagsFromProps');
		render(<Editor />);

		// If it's the default behaviour when we check the featureFlags
		// in the Editor this should be true.
		expect(componentSpy).toHaveBeenLastCalledWith(undefined);
	});

	it('should receive feature flags if passed', () => {
		const componentSpy = jest.spyOn(featureFlagsFromProps, 'createFeatureFlagsFromProps');
		render(<Editor featureFlags={{ errorBoundaryDocStructure: true }} />);

		expect(componentSpy).toHaveBeenLastCalledWith(
			expect.objectContaining({ errorBoundaryDocStructure: true }),
		);
	});
});
