import { bind } from 'bind-event-listener';

import { getDocument } from '@atlaskit/browser-apis';
import { type DispatchAnalyticsEvent } from '@atlaskit/editor-common/analytics';
import {
	Experience,
	EXPERIENCE_ID,
	ExperienceCheckDomMutation,
	ExperienceCheckPopupMutation,
	type ExperienceCheckPopupMutationConfig,
	ExperienceCheckTimeout,
} from '@atlaskit/editor-common/experiences';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { TOOLBAR_BUTTON_TEST_ID } from '@atlaskit/editor-common/toolbar';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import {
	getParentDOMAtSelection,
	handleEditorNodeInsertDomMutation,
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
};

type ExperienceButtonMapping = {
	buttonTestId: string;
	experience: Experience;
};

export const getToolbarActionExperiencesPlugin = ({
	dispatchAnalyticsEvent,
}: ToolbarActionExperienceOptions) => {
	let editorView: EditorView | undefined;
	let lastClickedToolbarButton: HTMLElement | undefined;

	const getEditorDom = (): HTMLElement | null => {
		if (editorView?.dom instanceof HTMLElement) {
			return editorView.dom;
		}
		return null;
	};

	const getInlinePopupTarget = (): HTMLElement | undefined => {
		if (!lastClickedToolbarButton) {
			return undefined;
		}
		return (
			lastClickedToolbarButton.closest<HTMLElement>('[data-toolbar-component="button-group"]') ??
			lastClickedToolbarButton
		);
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

	const buildPopupMutationConfig = (
		popupSelector: string,
		type: 'inline' | 'editorRoot',
		subtree?: boolean,
	): ExperienceCheckPopupMutationConfig => {
		switch (type) {
			case 'inline':
				return {
					type,
					nestedElementQuery: popupSelector,
					getTarget: getInlinePopupTarget,
					subtree,
				};
			case 'editorRoot':
				return {
					type,
					nestedElementQuery: popupSelector,
					getEditorDom,
				};
		}
	};

	const createPopupExperience = (
		action: string,
		popupSelector: string,
		type: 'inline' | 'editorRoot',
		subtree?: boolean,
	) =>
		new Experience(EXPERIENCE_ID.TOOLBAR_ACTION, {
			action,
			actionSubjectId: PRIMARY_TOOLBAR,
			dispatchAnalyticsEvent,
			checks: [
				new ExperienceCheckTimeout({ durationMs: TIMEOUT_DURATION }),
				new ExperienceCheckPopupMutation(buildPopupMutationConfig(popupSelector, type, subtree)),
			],
		});

	const experienceButtonMappings: ExperienceButtonMapping[] = [
		{
			experience: createPopupExperience('insert', '[data-testid="popup-wrapper"]', 'inline'),
			buttonTestId: TOOLBAR_BUTTON_TEST_ID.INSERT,
		},
		{
			experience: createPopupExperience(
				'emoji',
				'[data-emoji-picker-container], [data-emoji-picker-container="true"], [data-testid="popup-wrapper"]',
				'inline',
			),
			buttonTestId: TOOLBAR_BUTTON_TEST_ID.EMOJI,
		},
		{
			experience: createPopupExperience('media', '[data-testid="popup-wrapper"]', 'inline', true),
			buttonTestId: TOOLBAR_BUTTON_TEST_ID.MEDIA,
		},
		{
			experience: createPopupExperience(
				'mention',
				'[data-testid="popup-wrapper"], [data-type-ahead="typeaheadDecoration"]',
				'editorRoot',
			),
			buttonTestId: TOOLBAR_BUTTON_TEST_ID.MENTION,
		},
		{
			experience: createNodeInsertExperience('table'),
			buttonTestId: TOOLBAR_BUTTON_TEST_ID.TABLE,
		},
		{
			experience: createPopupExperience(
				'tableSelector',
				'[data-testid="popup-wrapper"]',
				'inline',
				true,
			),
			buttonTestId: TOOLBAR_BUTTON_TEST_ID.TABLE_SELECTOR,
		},
		{
			experience: createNodeInsertExperience('layout'),
			buttonTestId: TOOLBAR_BUTTON_TEST_ID.LAYOUT,
		},
		{
			experience: createPopupExperience('image', '[data-testid="popup-wrapper"]', 'inline'),
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
				// Store the clicked button so inline popup checks can find its button-group
				lastClickedToolbarButton = target;
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
					unbindClickListener();
					unbindKeydownListener();
				},
			};
		},
	});
};
