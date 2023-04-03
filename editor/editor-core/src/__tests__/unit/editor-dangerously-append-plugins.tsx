import { EditorPlugin } from '@atlaskit/editor-common/types';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { render } from '@testing-library/react';
import React from 'react';
import EditorMigrationComponent from '../../editor-next/editor-migration-component';
import { EditorProps } from '../../types';
import { PluginKey } from 'prosemirror-state';
import { name as packageName } from '../../version-wrapper';

const featureFlagOptions = [{ useEditorNext: true }, { useEditorNext: false }];

describe.each(featureFlagOptions)(packageName, (flags) => {
  const Editor = (props: EditorProps) => {
    const newFeatureFlags = {
      featureFlags: { ...props.featureFlags, ...flags },
    };
    const mergedProps = { ...props, ...newFeatureFlags };
    return <EditorMigrationComponent {...mergedProps} />;
  };

  describe('dangerouslyAppendPlugins', () => {
    it('should add functionality to the editor', () => {
      const testPluginKey = new PluginKey('plugin');
      const { container } = render(
        <Editor
          dangerouslyAppendPlugins={{
            __plugins: [createTestPlugin('Hello world', testPluginKey)],
          }}
        />,
      );
      const editorElement = container.getElementsByClassName('akEditor');
      expect(editorElement[0].textContent).toBe('Hello world');
    });
  });
});

const createTestPlugin = (
  text: string,
  pluginKey: PluginKey,
): EditorPlugin => ({
  name: 'testPlugin',

  pmPlugins() {
    return [
      {
        name: 'testPlugin',
        plugin: () =>
          new SafePlugin({
            key: pluginKey,
            view() {
              return {
                update: (editorView) => {
                  const {
                    dispatch,
                    state: { tr },
                  } = editorView;
                  if (editorView.state.doc.content.size === 2) {
                    dispatch(tr.insertText(text));
                  }
                },
              };
            },
          }),
      },
    ];
  },
});
