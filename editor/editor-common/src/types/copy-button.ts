import type { IntlShape } from 'react-intl-next';

import type { MarkType, NodeType } from '@atlaskit/editor-prosemirror/model';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';

import { type Command } from './command';

export type MarkOptions = {
	formatMessage: IntlShape['formatMessage'];
	markType: MarkType;
	nodeType?: undefined;
	onBlur?: Command;
	onFocus?: Command;
	onMouseEnter?: undefined;
	onMouseLeave?: undefined;
	state: EditorState;
};

export type NodeOptions = {
	formatMessage: IntlShape['formatMessage'];
	markType?: undefined;
	nodeType: NodeType | Array<NodeType>;
	onBlur?: Command;
	onClick?: Command;
	onFocus?: Command;
	onMouseEnter?: Command;
	onMouseLeave?: Command;
	state: EditorState;
};
