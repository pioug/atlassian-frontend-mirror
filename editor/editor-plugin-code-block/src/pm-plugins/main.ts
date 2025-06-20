/* eslint-disable @atlaskit/platform/ensure-feature-flag-prefix */
import type { IntlShape } from 'react-intl-next';

import { browser } from '@atlaskit/editor-common/browser';
import { updateCodeBlockWrappedStateNodeKeys } from '@atlaskit/editor-common/code-block';
import { blockTypeMessages } from '@atlaskit/editor-common/messages';
import type { getPosHandler } from '@atlaskit/editor-common/react-node-view';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { createSelectionClickHandler } from '@atlaskit/editor-common/selection';
import { findCodeBlock } from '@atlaskit/editor-common/transforms';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { NodeSelection } from '@atlaskit/editor-prosemirror/state';
import {
	type Decoration,
	DecorationSet,
	type EditorView,
	type EditorProps as PMEditorProps,
} from '@atlaskit/editor-prosemirror/view';
import { fg } from '@atlaskit/platform-feature-flags';

import { ignoreFollowingMutations, resetShouldIgnoreFollowingMutations } from '../editor-commands';
import type { CodeBlockPlugin } from '../index';
import { codeBlockNodeView } from '../nodeviews/code-block';
import { codeBlockClassNames } from '../ui/class-names';

import { ACTIONS } from './actions';
import {
	generateInitialDecorations,
	updateCodeBlockDecorations,
	updateDecorationSetWithWordWrappedDecorator,
} from './decorators';
import { type CodeBlockState } from './main-state';
import { pluginKey } from './plugin-key';
import { getAllChangedCodeBlocksInTransaction, getAllCodeBlockNodesInDoc } from './utils';

export const createPlugin = ({
	useLongPressSelection = false,
	getIntl,
	allowCompositionInputOverride = false,
	api,
}: {
	useLongPressSelection?: boolean;
	getIntl: () => IntlShape;
	// We only want this DOM event on mobile as composition only happens on mobile
	// Don't want to add an uneccessary listener to web
	allowCompositionInputOverride?: boolean;
	api?: ExtractInjectionAPI<CodeBlockPlugin>;
	decorations?: DecorationSet;
}) => {
	const handleDOMEvents: PMEditorProps['handleDOMEvents'] = {
		click: () => {
			// Set hasHadInteraction to true on any click of code blocks, as clicks
			// on code blocks to not propagate to editor-level click handlers
			api?.core?.actions.execute(api?.interaction?.commands.handleInteraction);
		},
	};

	// ME-1599: Composition on mobile was causing the DOM observer to mutate the code block
	// incorrecly and lose content when pressing enter in the middle of a code block line.
	if (allowCompositionInputOverride) {
		handleDOMEvents.beforeinput = (view: EditorView, event: Event) => {
			const keyEvent = event as InputEvent;
			const eventInputType = keyEvent.inputType;
			const eventText = keyEvent.data as string;

			if (
				browser.ios &&
				event.composed &&
				// insertParagraph will be the input type when the enter key is pressed.
				eventInputType === 'insertParagraph' &&
				findCodeBlock(view.state, view.state.selection)
			) {
				event.preventDefault();
				return true;
			} else if (
				browser.android &&
				event.composed &&
				eventInputType === 'insertCompositionText' &&
				eventText[eventText?.length - 1] === '\n' &&
				findCodeBlock(view.state, view.state.selection)
			) {
				// Ignored via go/ees005
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				const resultingText = (event.target as any).outerText + '\n';

				if (resultingText.endsWith(eventText)) {
					// End of paragraph
					setTimeout(() => {
						view.someProp('handleKeyDown', (f) =>
							f(
								view,
								new KeyboardEvent('keydown', {
									bubbles: true,
									cancelable: true,
									key: 'Enter',
									code: 'Enter',
								}),
							),
						);
					}, 0);
				} else {
					// Middle of paragraph, end of line
					ignoreFollowingMutations(view.state, view.dispatch);
				}

				return true;
			}

			if (browser.android) {
				resetShouldIgnoreFollowingMutations(view.state, view.dispatch);
			}

			return false;
		};
	}

	return new SafePlugin({
		state: {
			init(_, state): CodeBlockState {
				const node = findCodeBlock(state, state.selection);

				const initialDecorations: Decoration[] = generateInitialDecorations(state);

				return {
					pos: node ? node.pos : null,
					contentCopied: false,
					isNodeSelected: false,
					shouldIgnoreFollowingMutations: false,
					decorations: DecorationSet.create(state.doc, initialDecorations),
				};
			},
			apply(tr, pluginState: CodeBlockState, _oldState, newState): CodeBlockState {
				const meta = tr.getMeta(pluginKey);

				if (meta?.type === ACTIONS.SET_IS_WRAPPED) {
					const node = findCodeBlock(newState, tr.selection);
					return {
						...pluginState,
						decorations: updateDecorationSetWithWordWrappedDecorator(
							pluginState.decorations,
							tr,
							node,
						),
					};
				}

				if (tr.docChanged) {
					const node = findCodeBlock(newState, tr.selection);

					// Updates mapping position of all existing decorations to new positions
					// specifically used for updating word wrap node decorators (does not cover drag & drop, validateWordWrappedDecorators does).
					let updatedDecorationSet = pluginState.decorations.map(tr.mapping, tr.doc);

					const codeBlockNodes = fg('editor_code_wrapping_perf_improvement_ed-25141')
						? getAllChangedCodeBlocksInTransaction(tr)
						: getAllCodeBlockNodesInDoc(newState);

					if (codeBlockNodes) {
						updateCodeBlockWrappedStateNodeKeys(codeBlockNodes, _oldState);
						// Disabled when using advanced code block for performance reasons
						// @ts-expect-error Code block advanced cannot depend on code block
						if (api?.codeBlockAdvanced === undefined) {
							updatedDecorationSet = updateCodeBlockDecorations(
								tr,
								codeBlockNodes,
								updatedDecorationSet,
							);
						}
					}

					const newPluginState: CodeBlockState = {
						...pluginState,
						pos: node ? node.pos : null,
						isNodeSelected: tr.selection instanceof NodeSelection,
						decorations: updatedDecorationSet,
					};
					return newPluginState;
				}

				if (tr.selectionSet) {
					const node = findCodeBlock(newState, tr.selection);
					const newPluginState: CodeBlockState = {
						...pluginState,
						pos: node ? node.pos : null,
						isNodeSelected: tr.selection instanceof NodeSelection,
					};
					return newPluginState;
				}

				if (meta?.type === ACTIONS.SET_COPIED_TO_CLIPBOARD) {
					return {
						...pluginState,
						contentCopied: meta.data,
					};
				} else if (meta?.type === ACTIONS.SET_SHOULD_IGNORE_FOLLOWING_MUTATIONS) {
					return {
						...pluginState,
						shouldIgnoreFollowingMutations: meta.data,
					};
				}
				return pluginState;
			},
		},
		key: pluginKey,
		props: {
			decorations(state) {
				return pluginKey.getState(state).decorations || DecorationSet.empty;
			},
			nodeViews: {
				codeBlock: (node: PMNode, view: EditorView, getPos: getPosHandler) => {
					const { formatMessage } = getIntl();
					const formattedAriaLabel = formatMessage(blockTypeMessages.codeblock);
					return codeBlockNodeView(node, view, getPos, formattedAriaLabel, api);
				},
			},
			handleClickOn: createSelectionClickHandler(
				['codeBlock'],
				(target) =>
					!!(
						target.classList.contains(codeBlockClassNames.lineNumberWidget) ||
						target.classList.contains(codeBlockClassNames.gutter)
					),
				{ useLongPressSelection },
			),
			handleDOMEvents,
		},
	});
};
