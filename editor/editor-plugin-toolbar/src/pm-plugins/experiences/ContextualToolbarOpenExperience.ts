import {
	Experience,
	ExperienceCheckDomMutation,
	ExperienceCheckTimeout,
} from '@atlaskit/editor-common/experiences';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { PluginKey, TextSelection } from '@atlaskit/editor-prosemirror/state';

type ExperiencesState = {
	shouldShowContextualToolbar: boolean;
};

const pluginKey = new PluginKey<ExperiencesState>('contextualToolbarOpenExperience');

export default () => {
	const contextualToolbarOpenExperience = new Experience(
		'platform-editor-contextual-toolbar-open-experience',
		{
			checks: [
				new ExperienceCheckTimeout(500),
				new ExperienceCheckDomMutation({
					onDomMutation: ({ mutations }) => {
						if (mutations.some(isMutationAddingContextualToolbar)) {
							return { status: 'success' };
						}
					},
					observeConfig: () => ({
						target: document.body,
						options: {
							childList: true,
							subtree: true,
						},
					}),
				}),
			],
		},
	);

	return new SafePlugin({
		key: pluginKey,
		state: {
			init: () => ({
				shouldShowContextualToolbar: false,
			}),
			apply: (_tr, pluginState, _, newState) => {
				const isTextSelection = newState.selection instanceof TextSelection;
				const isNotEmptySelection = !newState.selection.empty;
				const shouldShowContextualToolbar = isTextSelection && isNotEmptySelection;

				if (shouldShowContextualToolbar && !pluginState.shouldShowContextualToolbar) {
					contextualToolbarOpenExperience.start();
				} else if (!shouldShowContextualToolbar && pluginState.shouldShowContextualToolbar) {
					contextualToolbarOpenExperience.abort();
				}

				return {
					...pluginState,
					shouldShowContextualToolbar,
				};
			},
		},
		view: () => {
			return {
				destroy: () => {
					contextualToolbarOpenExperience.abort();
				},
			};
		},
	});
};

const isMutationAddingContextualToolbar = (mutation: MutationRecord) => {
	return (
		mutation.type === 'childList' &&
		Array.from(mutation.addedNodes).some(nodeIncludesContextualToolbar)
	);
};

const nodeIncludesContextualToolbar = (node: Node) => {
	return (
		node instanceof HTMLElement &&
		node.getAttribute('data-testid') === 'popup-wrapper' &&
		node.querySelector('[data-testid="text-section"]')
	);
};
