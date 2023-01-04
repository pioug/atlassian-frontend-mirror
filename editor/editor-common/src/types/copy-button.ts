import { MarkType, NodeType } from 'prosemirror-model';
import { EditorState } from 'prosemirror-state';
import { IntlShape } from 'react-intl-next';

import { Command } from './command';

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
