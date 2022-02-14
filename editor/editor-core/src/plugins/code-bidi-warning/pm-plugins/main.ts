import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { codeBidiWarningMessages } from '@atlaskit/editor-common/messages';

import type { EditorProps, PMPluginFactoryParams } from '../../../types';

import { codeBidiWarningPluginKey } from '../plugin-key';

import {
  createBidiWarningsDecorationSetFromDoc,
  createPluginState,
  getPluginState,
} from './plugin-factory';

export const createPlugin = (
  { dispatch, getIntl }: PMPluginFactoryParams,
  { appearance }: { appearance: EditorProps['appearance'] },
) => {
  const intl = getIntl();

  const codeBidiWarningLabel = intl.formatMessage(
    codeBidiWarningMessages.label,
  );

  return new SafePlugin({
    key: codeBidiWarningPluginKey,
    state: createPluginState(dispatch, (state) => {
      // The appearance being mobile indicates we are in an editor being
      // rendered by mobile bridge in a web view.
      // The tooltip is likely to have unexpected behaviour there, with being cut
      // off, so we disable it. This is also to keep the behaviour consistent with
      // the rendering in the mobile Native Renderer.
      const tooltipEnabled = appearance !== 'mobile';

      return {
        decorationSet: createBidiWarningsDecorationSetFromDoc({
          doc: state.doc,
          codeBidiWarningLabel,
          tooltipEnabled,
        }),
        codeBidiWarningLabel,
        tooltipEnabled,
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
