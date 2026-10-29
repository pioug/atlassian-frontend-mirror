import React from 'react';

import { createRoot } from 'react-dom/client';
import type { Root } from 'react-dom/client';
import { IntlProvider } from 'react-intl';

import type { AnnotationId } from '@atlaskit/adf-schema/annotation';
import { AnnotationTypes, AnnotationMarkStates } from '@atlaskit/adf-schema/annotation';
import type { GasPurePayload } from '@atlaskit/analytics-gas-types';
import AnalyticsListeners from '@atlaskit/analytics-listeners/FabricAnalyticsListeners';
import ProviderFactory from '@atlaskit/editor-common/provider-factory/provider-factory';
import { AnnotationUpdateEmitter } from '@atlaskit/editor-common/types/emitter';
import { storyContextIdentifierProviderFactory } from '@atlaskit/editor-test-helpers/context-identifier-provider';
import { extensionHandlers } from '@atlaskit/editor-test-helpers/extensions';
import { createEditorMediaMock } from '@atlaskit/editor-test-helpers/media-mock';
import { storyMediaProviderFactory } from '@atlaskit/editor-test-helpers/media-provider';
import { SmartCardProvider } from '@atlaskit/link-provider/smart-card-provider';
import { cardClient } from '@atlaskit/media-integration-test-helpers/card-client';
import { EmbedHelper } from '@atlaskit/media-integration-test-helpers/embed-helper';
import type { MentionProvider } from '@atlaskit/mention/types';
// eslint-disable-next-line no-restricted-imports -- the test harness restores URL experiment overrides inside the loaded entry before mounting the renderer
import { UNSAFE_overrideExperiment } from '@atlaskit/platform-feature-experiments/dev-override';
import { setBooleanFeatureFlagResolver } from '@atlaskit/platform-feature-flags/setBooleanFeatureFlagResolver';
import { setupEditorExperiments } from '@atlaskit/tmp-editor-statsig/setup';
import type { EditorExperimentOverrides } from '@atlaskit/tmp-editor-statsig/setup';
import { getEmojiResource } from '@atlaskit/util-data-test/get-emoji-resource';
import { getMockTaskDecisionResource } from '@atlaskit/util-data-test/task-decision-story-data';

import { default as Renderer } from '../../src/ui/Renderer';
import type { RendererProps } from '../../src/ui/renderer-props';
import { ValidationContextProvider } from '../../src/ui/Renderer/ValidationContext';
import { RendererActionsContext as RendererContext } from '../../src/ui/RendererActionsContext';
import { WithRendererActions } from '../../src/ui/RendererActionsContext/WithRendererActions';
import { ExampleSelectionInlineComponent } from './annotations/selection';
import Sidebar from './NavigationNext';
import { document as defaultDoc } from './story-data';

const rootMap = new WeakMap<Element, Root>();

const WORKBENCH_EXPERIMENT_PREFIX = 'exp--';

const isPrimitiveExperimentParameter = (value: unknown): boolean =>
	value === null ||
	typeof value === 'boolean' ||
	typeof value === 'number' ||
	typeof value === 'string';

const isExperimentParameters = (value: unknown): value is Record<string, unknown> => {
	if (typeof value !== 'object' || value === null || Array.isArray(value)) {
		return false;
	}

	return Object.values(value).every(
		(param) =>
			isPrimitiveExperimentParameter(param) ||
			(typeof param === 'object' &&
				param !== null &&
				!Array.isArray(param) &&
				Object.values(param).every(isPrimitiveExperimentParameter)),
	);
};

function readWorkbenchExperimentOverrides(): Record<string, Record<string, unknown>> {
	const overrides: Record<string, Record<string, unknown>> = {};
	const params = new URLSearchParams(window.location.search);
	const legacyOverrides = params.get('platformExperimentOverrides');
	if (legacyOverrides) {
		try {
			const parsed: unknown = JSON.parse(legacyOverrides);
			if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) {
				for (const [name, values] of Object.entries(parsed)) {
					if (isExperimentParameters(values)) {
						overrides[name] = values;
					}
				}
			}
		} catch {
			// Ignore malformed preview parameters and keep the test harness defaults.
		}
	}

	params.forEach((value, key) => {
		if (!key.startsWith(WORKBENCH_EXPERIMENT_PREFIX)) {
			return;
		}
		try {
			const parsed: unknown = JSON.parse(value);
			if (isExperimentParameters(parsed) && key.length > WORKBENCH_EXPERIMENT_PREFIX.length) {
				overrides[key.slice(WORKBENCH_EXPERIMENT_PREFIX.length)] = parsed;
			}
		} catch {
			// Ignore malformed preview parameters and keep the test harness defaults.
		}
	});

	return overrides;
}

function getOrCreateRoot(container: Element): Root {
	const existing = rootMap.get(container);
	if (existing) {
		return existing;
	}
	const root = createRoot(container);
	rootMap.set(container, root);
	return root;
}

function unmountRoot(container: Element): void {
	const root = rootMap.get(container);
	if (root) {
		root.unmount();
		rootMap.delete(container);
	}
}

const mediaMockServer = createEditorMediaMock();
const mediaProvider = storyMediaProviderFactory();
const emojiProvider = getEmojiResource();
const contextIdentifierProvider = storyContextIdentifierProviderFactory();
const mentionProvider = Promise.resolve({
	shouldHighlightMention: (mention: { id: string }) => mention.id === 'ABCDE-ABCDE-ABCDE-ABCDE',
} as MentionProvider);
const taskDecisionProvider = Promise.resolve(getMockTaskDecisionResource());

type MountProps = { [T in keyof RendererProps]?: RendererProps[T] } & {
	allowNestedTables?: boolean;
	enableClickToEdit?: boolean;
	mockInlineComments?: boolean;
	showSidebar?: boolean;
	withRendererActions?: boolean;
};

const providerFactory = ProviderFactory.create({
	mediaProvider,
	mentionProvider,
	emojiProvider,
	contextIdentifierProvider,
	taskDecisionProvider,
});

function renderRenderer({
	adf,
	props,
	setMode,
}: {
	adf: any;
	editorExperiments?: EditorExperimentOverrides;
	platformFeatureFlags?: Record<string, boolean>;
	props: MountProps;
	setMode?: (mode: boolean) => void;
}) {
	const { allowNestedTables, showSidebar, ...reactProps } = props;
	return (
		<IntlProvider locale="en">
			<AnalyticsListeners client={(window as any).__analytics}>
				<SmartCardProvider client={cardClient}>
					<ValidationContextProvider
						value={allowNestedTables !== undefined ? { allowNestedTables } : null}
					>
						<Sidebar showSidebar={!!showSidebar}>
							{(additionalRendererProps: any) => (
								<Renderer
									dataProviders={providerFactory}
									document={adf}
									extensionHandlers={extensionHandlers}
									{...reactProps}
									{...additionalRendererProps}
									eventHandlers={
										setMode
											? {
													onUnhandledClick: (e) => setMode(true),
												}
											: undefined
									}
								/>
							)}
						</Sidebar>
					</ValidationContextProvider>
					<EmbedHelper />
				</SmartCardProvider>
			</AnalyticsListeners>
		</IntlProvider>
	);
}

const editorPlaceholderClassname = 'editor-vr-test-placeholder';

/**
 * Create a function on the window object that mounts the renderer when called.
 * If enableClickToEdit is true, swap out the renderer for a dummy editor when the
 * onUnhandledClick eventHandler is called by the renderer. An example of this behaviour is when
 * clicking in the Jira description, the renderer transitions to the editor.
 * @param win Window objest
 * @param enableClickToEdit Swap out renderer for dummy editor on onUnhandledClick
 */
export function createRendererWindowBindings(win: Window, enableClickToEdit?: boolean): void {
	if ((win as any).__mountRenderer) {
		return;
	}

	mediaMockServer.enable();

	const events: GasPurePayload[] = [];
	const send = (e: any) => {
		events.push(e);
	};

	(window as any)['__analytics'] = {
		sendUIEvent: send,
		sendOperationalEvent: send,
		sendTrackEvent: send,
		sendScreenEvent: send,
		events,
	};

	(window as any)['__mountRenderer'] = (
		props: MountProps,
		adf: any = defaultDoc,
		platformFeatureFlags?: Record<string, boolean>,
		editorExperiments?: EditorExperimentOverrides,
	) => {
		const target = document.getElementById('renderer-container');

		if (!target) {
			return;
		}

		if (platformFeatureFlags) {
			setBooleanFeatureFlagResolver((ffName) => {
				return platformFeatureFlags[ffName] ?? false;
			});
		}

		setupEditorExperiments('test', editorExperiments || {});
		// AP's viewer and loaded renderer entry have separate experiment stores.
		// Restore explicit URL overrides in this entry without clearing other values.
		for (const [name, params] of Object.entries(readWorkbenchExperimentOverrides())) {
			UNSAFE_overrideExperiment(name, params);
		}

		if (props && props.mockInlineComments) {
			mockAnnotationProps(props);
		}

		/**
		 * Callback given to the editor on what to do when onUnhandledClick is called.
		 * Swap out the renderer for a dummy editor (which will be clearly identifiable in VR tests)
		 */
		const onUnhandledClickEnabled = enableClickToEdit || props.enableClickToEdit;
		const setMode = onUnhandledClickEnabled
			? (mode: boolean) => {
					const rendererContainer = document.getElementById('renderer-container');
					if (!rendererContainer) {
						return;
					}
					const editorPlaceholder = (
						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
						<h1 className={editorPlaceholderClassname}>Editor placeholder</h1>
					);

					unmountRoot(rendererContainer);
					getOrCreateRoot(rendererContainer).render(editorPlaceholder);
				}
			: undefined;

		const render = renderRenderer({ adf, props, setMode });
		let content;
		if (props.withRendererActions) {
			content = (
				<RendererContext>
					<WithRendererActions
						render={(actions) => {
							(win as any).__rendererActions = actions;
							return render;
						}}
					/>
				</RendererContext>
			);
		}

		unmountRoot(target);
		getOrCreateRoot(target).render(content || render);
	};
}

// helper function to add dummy inline comments related props
function mockAnnotationProps(props: MountProps) {
	const annotationInlineCommentProvider = {
		getState: async (annotationIds: AnnotationId[]) => {
			return annotationIds.map((id) => ({
				id,
				annotationType: AnnotationTypes.INLINE_COMMENT,
				state: AnnotationMarkStates.ACTIVE,
			}));
		},
		allowDraftMode: true,
		selectionComponent: ExampleSelectionInlineComponent(() => {}),
		updateSubscriber: new AnnotationUpdateEmitter(),
	};
	// extend annotationProvider with dummy inline comment provier settings for testing
	props.annotationProvider = {
		...props.annotationProvider,
		[AnnotationTypes.INLINE_COMMENT]: {
			...(props.annotationProvider && props.annotationProvider[AnnotationTypes.INLINE_COMMENT]),
			...annotationInlineCommentProvider,
		},
	};

	return props;
}
