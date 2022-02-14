import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { PluginKey, EditorState } from 'prosemirror-state';
import { getFeatureFlags } from '../../feature-flags-context';
import { browser } from '@atlaskit/editor-common/utils';

export default () =>
  new SafePlugin({
    key: new PluginKey('fixChrome96SpellChecking'),
    props: {
      attributes: (editorState: EditorState) => {
        const featureFlags = getFeatureFlags(editorState);

        if (
          browser.chrome &&
          featureFlags.maxUnsafeChromeSpellcheckingVersion &&
          browser.chrome_version >= 96 &&
          // This check is valid for any browser
          // that uses the chrome engine as base like Edge
          browser.chrome_version <=
            featureFlags.maxUnsafeChromeSpellcheckingVersion
        ) {
          return { spellcheck: 'false' };
        }

        return;
      },
    },
  });
