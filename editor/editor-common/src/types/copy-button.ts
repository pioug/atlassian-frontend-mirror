import type { IntlShape } from 'react-intl-next';

import type { MarkType, NodeType } from '@atlaskit/editor-prosemirror/model';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';

import { type Command } from './command';

export type MarkOptions = {
	state: EditorState;
	formatMessage: IntlShape['formatMessage'];
	nodeType?: undefined;
	markType: MarkType;
	onMouseEnter?: undefined;
	onMouseLeave?: undefined;
	onFocus?: Command;
	onBlur?: Command;
};

export type NodeOptions = {
	state: EditorState;
	formatMessage: IntlShape['formatMessage'];
	nodeType: NodeType | Array<NodeType>;
	markType?: undefined;
	onMouseEnter?: Command;
	onMouseLeave?: Command;
	onFocus?: Command;
	onBlur?: Command;
};
