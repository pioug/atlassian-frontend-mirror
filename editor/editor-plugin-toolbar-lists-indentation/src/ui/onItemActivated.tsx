import type { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import type { ToolbarListsIndentationPlugin } from '../index';
import type { IndentationButtonNode } from '../pm-plugins/indentation-buttons';
import type { ButtonName } from '../types';

import { isMarkdownCompatibleToolbarEnabled } from './utils/markdown-compatible-toolbar';

export const onItemActivated =
	(
		pluginInjectionApi: ExtractInjectionAPI<ToolbarListsIndentationPlugin> | undefined,
		indentationStateNode: IndentationButtonNode | undefined,
		inputMethod: INPUT_METHOD.TOOLBAR | INPUT_METHOD.FLOATING_TB,
	) =>
	({ buttonName, editorView }: { buttonName: ButtonName; editorView: EditorView }): void => {
		const isInSourceView =
			isMarkdownCompatibleToolbarEnabled() &&
			pluginInjectionApi?.markdownMode?.sharedState.currentState()?.view === 'syntax';

		switch (buttonName) {
			case 'bullet_list':
				if (isInSourceView) {
					pluginInjectionApi?.markdownMode?.actions.toggleSourceBulletList();
					break;
				}
				pluginInjectionApi?.core?.actions.execute(
					pluginInjectionApi?.list?.commands.toggleBulletList(inputMethod),
				);
				break;
			case 'ordered_list':
				if (isInSourceView) {
					pluginInjectionApi?.markdownMode?.actions.toggleSourceOrderedList();
					break;
				}
				pluginInjectionApi?.core?.actions.execute(
					pluginInjectionApi?.list?.commands.toggleOrderedList(inputMethod),
				);
				break;

			case 'indent': {
				const node = indentationStateNode;
				if (node === 'paragraph_heading') {
					pluginInjectionApi?.indentation?.actions.indentParagraphOrHeading(inputMethod)(
						editorView.state,
						editorView.dispatch,
					);
				}
				if (node === 'list') {
					pluginInjectionApi?.core?.actions.execute(
						pluginInjectionApi?.list?.commands.indentList(inputMethod),
					);
				}
				if (node === 'taskList') {
					pluginInjectionApi?.taskDecision?.actions.indentTaskList(inputMethod)(
						editorView.state,
						editorView.dispatch,
					);
				}

				break;
			}
			case 'outdent': {
				const node = indentationStateNode;
				if (node === 'paragraph_heading') {
					pluginInjectionApi?.indentation?.actions.outdentParagraphOrHeading(inputMethod)(
						editorView.state,
						editorView.dispatch,
					);
				}
				if (node === 'list') {
					pluginInjectionApi?.core?.actions.execute(
						pluginInjectionApi?.list?.commands.outdentList(inputMethod),
					);
				}
				if (node === 'taskList') {
					pluginInjectionApi?.taskDecision?.actions.outdentTaskList(inputMethod)(
						editorView.state,
						editorView.dispatch,
					);
				}
				break;
			}
		}
	};
