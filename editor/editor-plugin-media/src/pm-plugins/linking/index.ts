import type { LinkAttributes } from '@atlaskit/adf-schema';
import type { Dispatch } from '@atlaskit/editor-common/event-dispatcher';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { Command } from '@atlaskit/editor-common/types';
import { pluginFactory } from '@atlaskit/editor-common/utils';
import type { Mark } from '@atlaskit/editor-prosemirror/model';
import type {
	EditorState,
	ReadonlyTransaction,
	Transaction,
} from '@atlaskit/editor-prosemirror/state';
import { NodeSelection, PluginKey } from '@atlaskit/editor-prosemirror/state';

import type { MediaLinkingActions } from './actions';
import reducer from './reducer';
import type { InitialState, MediaLinkingState } from './types';

export const mediaLinkingPluginKey: PluginKey<MediaLinkingState> = new PluginKey<MediaLinkingState>(
	'mediaLinking',
);

const initialState: InitialState = {
	visible: false,
	editable: false,
	mediaPos: null,
	link: '',
};

function mapping(tr: ReadonlyTransaction, pluginState: MediaLinkingState): MediaLinkingState {
	if (pluginState && pluginState.mediaPos !== null) {
		return {
			...pluginState,
			mediaPos: tr.mapping.map(pluginState.mediaPos),
		};
	}
	return pluginState;
}

function onSelectionChanged(tr: ReadonlyTransaction): MediaLinkingState {
	const isNodeSelection = tr.selection instanceof NodeSelection;
	if (!isNodeSelection) {
		return initialState;
	}

	const pos = tr.selection.$from.pos;
	const mediaPos = tr.selection.node.type.name === 'mediaInline' ? pos : pos + 1;

	const node = tr.doc.nodeAt(mediaPos);

	if (!node || !['media', 'mediaInline'].includes(node.type.name)) {
		return initialState;
	}

	const mark = node.marks.find((mark: Mark) => mark.type.name === 'link');
	if (mark) {
		return {
			...initialState,
			mediaPos,
			editable: true,
			link: (mark.attrs as LinkAttributes).href,
		};
	}

	return {
		...initialState,
		mediaPos,
	};
}

const mediaLinkingPluginFactory = pluginFactory<
	MediaLinkingState,
	MediaLinkingActions,
	InitialState
>(mediaLinkingPluginKey, reducer, {
	mapping,
	onSelectionChanged,
});

export const createMediaLinkingCommand: <A = MediaLinkingActions>(
	action: A | ((state: Readonly<EditorState>) => false | A),
	transform?: (tr: Transaction, state: EditorState) => Transaction,
) => Command = mediaLinkingPluginFactory.createCommand;
export const getMediaLinkingState: (state: EditorState) => MediaLinkingState =
	mediaLinkingPluginFactory.getPluginState;

export default (dispatch: Dispatch): SafePlugin<MediaLinkingState> =>
	new SafePlugin({
		key: mediaLinkingPluginKey,
		state: mediaLinkingPluginFactory.createPluginState(dispatch, initialState),
	});
