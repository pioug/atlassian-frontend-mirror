import { Plugin } from 'prosemirror-state';
import { codeBidiWarningMessages } from '@atlaskit/editor-common/messages';

import { PMPluginFactoryParams } from '../../../types';

import { codeBidiWarningPluginKey } from '../plugin-key';

import {
  createBidiWarningsDecorationSetFromDoc,
  createPluginState,
  getPluginState,
} from './plugin-factory';

export const createPlugin = ({
  dispatch,
  reactContext,
}: PMPluginFactoryParams) => {
  const intl = reactContext().intl;

  const codeBidiWarningLabel = intl.formatMessage(
    codeBidiWarningMessages.label,
  );

  return new Plugin({
    key: codeBidiWarningPluginKey,
    state: createPluginState(dispatch, (state) => {
      return {
        decorationSet: createBidiWarningsDecorationSetFromDoc({
          doc: state.doc,
          codeBidiWarningLabel,
        }),
        codeBidiWarningLabel,
      };
    }),
    props: {
      decorations: (state) => {
        const { decorationSet } = getPluginState(state);

        return decorationSet;
      },
    },
  });
};
