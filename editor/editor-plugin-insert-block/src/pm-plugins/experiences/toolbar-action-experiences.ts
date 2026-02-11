import { bind } from 'bind-event-listener';

import { getDocument } from '@atlaskit/browser-apis';
import { type DispatchAnalyticsEvent } from '@atlaskit/editor-common/analytics';
import {
	Experience,
	EXPERIENCE_ID,
	ExperienceCheckDomMutation,
	ExperienceCheckTimeout,
	getPopupContainerFromEditorView,
} from '@atlaskit/editor-common/experiences';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { TOOLBAR_BUTTON_TEST_ID } from '@atlaskit/editor-common/toolbar';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import {
	ExperienceCheckPopupMutation,
	getParentDOMAtSelection,
	handleEditorNodeInsertDomMutation,
	handleTypeAheadOpenDomMutation,
	isToolbarButtonClick,
} from './toolbar-experience-utils';

const pluginKey = new PluginKey('toolbarActionExperiences');

const TIMEOUT_DURATION = 1000;
const PRIMARY_TOOLBAR = 'primaryToolbar';

const ABORT_REASON = {
	USER_CANCELED: 'userCanceled',
	EDITOR_DESTROYED: 'editorDestroyed',
} as const;

type ToolbarActionExperienceOptions = {
	dispatchAnalyticsEvent: DispatchAnalyticsEvent;
	refs: {
		popupsMountPoint?: HTMLElement;
	};
};

type ExperienceButtonMapping = {
	buttonTestId: string;
	experience: Experience;
};

export const getToolbarActionExperiencesPlugin = ({
	refs,
	dispatchAnalyticsEvent,
}: ToolbarActionExperienceOptions) => {
	let editorView: EditorView | undefined;
	let popupTargetEl: HTMLElement | undefined;

	const getPopupsTarget = () => {
		if (!popupTargetEl) {
			popupTargetEl = refs.popupsMountPoint || getPopupContainerFromEditorView(editorView?.dom);
		}
		return popupTargetEl;
	};

	const getEditorDom = (): HTMLElement | null => {
		if (editorView?.dom instanceof HTMLElement) {
			return editorView.dom;
		}
		return null;
	};

	const narrowParentObserveConfig = () => ({
		target: getParentDOMAtSelection(editorView) ?? getEditorDom(),
		options: { childList: true },
	});

	const rootObserveConfig = () => ({
		target: getEditorDom(),
		options: { childList: true },
	});

	const createNodeInsertExperience = (action: string) =>
		new Experience(EXPERIENCE_ID.TOOLBAR_ACTION, {
			action,
			actionSubjectId: PRIMARY_TOOLBAR,
			dispatchAnalyticsEvent,
			checks: [
				new ExperienceCheckTimeout({ durationMs: TIMEOUT_DURATION }),
				new ExperienceCheckDomMutation({
					onDomMutation: handleEditorNodeInsertDomMutation,
					observeConfig: narrowParentObserveConfig,
				}),
				new ExperienceCheckDomMutation({
					onDomMutation: handleEditorNodeInsertDomMutation,
					observeConfig: rootObserveConfig,
				}),
			],
		});

	const createPopupExperience = (action: string, popupSelector: string) =>
		new Experience(EXPERIENCE_ID.TOOLBAR_ACTION, {
			action,
			actionSubjectId: PRIMARY_TOOLBAR,
			dispatchAnalyticsEvent,
			checks: [
				new ExperienceCheckTimeout({ durationMs: TIMEOUT_DURATION }),
				new ExperienceCheckPopupMutation(popupSelector, getPopupsTarget, getEditorDom),
			],
		});

	const experienceButtonMappings: ExperienceButtonMapping[] = [
		{
			experience: createPopupExperience('emoji', '[data-emoji-picker-container]'),
			buttonTestId: TOOLBAR_BUTTON_TEST_ID.EMOJI,
		},
		{
			experience: createPopupExperience('media', '[id="local-media-upload-button"], [data-testid="media-picker-file-input"]'),
			buttonTestId: TOOLBAR_BUTTON_TEST_ID.MEDIA,
		},
		{
			experience: new Experience(EXPERIENCE_ID.TOOLBAR_ACTION, {
				action: 'mention',
				actionSubjectId: PRIMARY_TOOLBAR,
				dispatchAnalyticsEvent,
				checks: [
					new ExperienceCheckTimeout({ durationMs: TIMEOUT_DURATION }),
					new ExperienceCheckDomMutation({
						onDomMutation: handleTypeAheadOpenDomMutation,
						observeConfig: narrowParentObserveConfig,
					}),
				],
			}),
			buttonTestId: TOOLBAR_BUTTON_TEST_ID.MENTION,
		},
		{
			experience: createNodeInsertExperience('table'),
			buttonTestId: TOOLBAR_BUTTON_TEST_ID.TABLE,
		},
		{
			experience: createPopupExperience('tableSelector', '[aria-label*="table size"], [data-testid*="table-selector"]'),
			buttonTestId: TOOLBAR_BUTTON_TEST_ID.TABLE_SELECTOR,
		},
		{
			experience: createNodeInsertExperience('layout'),
			buttonTestId: TOOLBAR_BUTTON_TEST_ID.LAYOUT,
		},
		{
			experience: createPopupExperience('image', '[id="local-media-upload-button"], [data-testid="media-picker-file-input"]'),
			buttonTestId: TOOLBAR_BUTTON_TEST_ID.IMAGE,
		},
		{
			experience: createNodeInsertExperience('action'),
			buttonTestId: TOOLBAR_BUTTON_TEST_ID.TASK_LIST,
		},
	];

	const handleToolbarButtonClick = (target: HTMLElement) => {
		for (const { experience, buttonTestId } of experienceButtonMappings) {
			if (isToolbarButtonClick(target, buttonTestId)) {
				experience.start({ forceRestart: true });
				return;
			}
		}
	};

	const abortAllExperiences = (reason: string) => {
		for (const { experience } of experienceButtonMappings) {
			experience.abort({ reason });
		}
	};

	const doc = getDocument();
	if (!doc) {
		return new SafePlugin({ key: pluginKey });
	}

	const unbindClickListener = bind(doc, {
		type: 'click',
		listener: (event: MouseEvent) => {
			const target = event.target;
			if (target instanceof HTMLElement) {
				handleToolbarButtonClick(target);
			}
		},
		options: { capture: true },
	});

	const unbindKeydownListener = bind(doc, {
		type: 'keydown',
		listener: (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				abortAllExperiences(ABORT_REASON.USER_CANCELED);
			}
		},
		options: { capture: true },
	});

	return new SafePlugin({
		key: pluginKey,
		view: (view) => {
			editorView = view;

			return {
				destroy: () => {
					abortAllExperiences(ABORT_REASON.EDITOR_DESTROYED);
					editorView = undefined;
					popupTargetEl = undefined;
					unbindClickListener();
					unbindKeydownListener();
				},
			};
		},
	});
};
