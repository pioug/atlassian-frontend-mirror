import { type IntlShape } from 'react-intl-next';

import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import type { TasksAndDecisionsPlugin } from '../tasksAndDecisionsPluginType';

import { TaskItemNodeView } from './TaskItemNodeView';

export const taskView = (
	api: ExtractInjectionAPI<TasksAndDecisionsPlugin> | undefined,
	intl: IntlShape,
	placeholder?: string,
) => {
	return (node: PMNode, view: EditorView, getPos: () => number | undefined) => {
		return new TaskItemNodeView(node, view, getPos, {
			placeholder,
			api,
			intl,
		});
	};
};
