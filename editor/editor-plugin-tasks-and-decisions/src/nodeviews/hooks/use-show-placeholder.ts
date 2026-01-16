import { useMemo } from 'react';

import { useSharedPluginState } from '@atlaskit/editor-common/hooks';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { TextSelection } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import type { TasksAndDecisionsPlugin } from '../../tasksAndDecisionsPluginType';

type Props2 = {
	api: ExtractInjectionAPI<TasksAndDecisionsPlugin> | undefined;
	editorView: EditorView;
	getPos: () => number | undefined;
	isContentNodeEmpty: boolean;
};
export const useShowPlaceholder = ({ editorView, api, isContentNodeEmpty, getPos }: Props2): boolean => {
	const { typeAheadState } = useSharedPluginState(api, ['typeAhead']);
	const isTypeAheadOpen = Boolean(typeAheadState?.isOpen);
	const isTypeAheadOpenedInsideItem = useMemo(() => {
		if (!isTypeAheadOpen) {
			return false;
		}

		const itemPosition = getPos();

		if (typeof itemPosition !== 'number') {
			return false;
		}

		const selection = editorView.state.selection;

		if (!(selection instanceof TextSelection)) {
			return false;
		}

		const maybeItemNode = editorView.state.doc.nodeAt(itemPosition);
		const maybeParentItemNode = selection.$cursor?.node();

		if (maybeItemNode && maybeParentItemNode && maybeItemNode.eq(maybeParentItemNode)) {
			return true;
		}

		return false;
	}, [isTypeAheadOpen, getPos, editorView]);

	const showPlaceholder = Boolean(!isTypeAheadOpenedInsideItem && isContentNodeEmpty);
	return showPlaceholder;
};
