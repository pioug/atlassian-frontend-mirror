import React, { useEffect } from 'react';
import { ComposableEditor } from '../../composable-editor';
import { render } from '@testing-library/react';
import { basePlugin } from '@atlaskit/editor-plugin-base';
import { featureFlagsPlugin } from '@atlaskit/editor-plugin-feature-flags';
import { EditorPresetBuilder } from '@atlaskit/editor-common/preset';
import type {
  NextEditorPlugin,
  EditorAppearance,
} from '@atlaskit/editor-common/types';

const allAppearances: EditorAppearance[] = [
  'comment',
  'chromeless',
  'mobile',
  'full-page',
  'full-width',
];

describe('ComposableEditor', () => {
  describe('renders plugin hooks on all appearances', () => {
    it.each(allAppearances)(
      'should render plugin hooks for %s',
      (appearance) => {
        const testFunc = jest.fn();
        const preset = new EditorPresetBuilder()
          .add([featureFlagsPlugin, {}])
          .add(basePlugin)
          .add([testPlugin, testFunc]);

        render(<ComposableEditor appearance={appearance} preset={preset} />);

        expect(testFunc).toHaveBeenCalledTimes(1);
      },
    );
  });
});

const testPlugin: NextEditorPlugin<'test', { pluginConfiguration: any }> = ({
  config: testFunc,
}) => ({
  name: 'test',

  usePluginHook() {
    useEffect(() => {
      testFunc();
    }, []);
  },
});
