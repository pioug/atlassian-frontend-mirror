import type { IntlShape } from 'react-intl-next';
import EditorActions from '../../actions';

import { EditorProps } from '../../types/editor-props';

export type Context = {
  editorActions?: EditorActions;
  intl: IntlShape;
};

/**
 *
 * Logic for Editor prop types (ie. `static propTypes = propTypes(message)`)
 * for use with 'prop-types' library
 *
 * @param errorMessage
 * @returns Editor prop-types
 */
export function propTypes(errorMessage: string) {
  return {
    minHeight: ({ appearance, minHeight }: EditorProps) => {
      if (
        minHeight &&
        appearance &&
        !['comment', 'chromeless'].includes(appearance)
      ) {
        return new Error(errorMessage);
      }
      return null;
    },
  };
}

export const defaultProps: EditorProps = {
  appearance: 'comment',
  disabled: false,
  extensionHandlers: {},
  allowHelpDialog: true,
  allowNewInsertionBehaviour: true,
  quickInsert: true,
};
