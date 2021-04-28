import {
  UpdateContextActions,
  TransformBefore,
  TransformAfter,
} from '@atlaskit/editor-common/extensions';
import { ADFEntity } from '@atlaskit/adf-utils';
import { insertMacroFromMacroBrowser, MacroProvider } from '../macro';
import { EditorState } from 'prosemirror-state';
import { CommandDispatch } from '../../types/command';
import type { EditorView } from 'prosemirror-view';
import { setEditingContextToContextPanel } from './commands';
import { ContentNodeWithPos } from 'prosemirror-utils';

interface EditInLegacyMacroBrowserArgs {
  view?: EditorView;
  macroProvider?: MacroProvider;
  nodeWithPos: ContentNodeWithPos;
}
export const getEditInLegacyMacroBrowser = ({
  view,
  macroProvider,
  nodeWithPos,
}: EditInLegacyMacroBrowserArgs) => {
  return () => {
    if (!view) {
      throw new Error(`Missing view. Can't update without EditorView`);
    }
    if (!macroProvider) {
      throw new Error(
        `Missing macroProvider. Can't use the macro browser for updates`,
      );
    }

    insertMacroFromMacroBrowser(macroProvider, nodeWithPos.node, true)(view);
  };
};

interface CreateUpdateContextActionOptions {
  editInLegacyMacroBrowser: () => void;
}

export const createUpdateContextActions = (
  options: CreateUpdateContextActionOptions,
) => (
  state: EditorState,
  dispatch?: CommandDispatch,
  view?: EditorView,
): UpdateContextActions => {
  const { editInLegacyMacroBrowser } = options;
  return {
    editInContextPanel: (
      transformBefore: TransformBefore,
      transformAfter: TransformAfter,
    ) => {
      setEditingContextToContextPanel(transformBefore, transformAfter)(
        state,
        dispatch,
        view,
      );
    },
    editInLegacyMacroBrowser,

    // TODO: make it work
    insertAfter: (adf: ADFEntity) => {},
  };
};
