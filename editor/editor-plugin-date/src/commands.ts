import type { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import type {
  EditorCommand,
  TOOLBAR_MENU_TYPE,
} from '@atlaskit/editor-common/types';

import type { DateType } from './types';

export type DeleteDate = EditorCommand;

export type InsertDate = (props: {
  date?: DateType;
  inputMethod?: TOOLBAR_MENU_TYPE;
  commitMethod?: INPUT_METHOD.PICKER | INPUT_METHOD.KEYBOARD;
  enterPressed?: boolean;
}) => EditorCommand;
