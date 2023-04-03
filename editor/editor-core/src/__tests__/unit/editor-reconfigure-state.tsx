import { renderWithIntl } from '@atlaskit/editor-test-helpers/rtl';
import React from 'react';
import { ReactEditorView } from '../../create-editor/ReactEditorViewInternal';
import EditorMigrationComponent from '../../editor-next/editor-migration-component';
import { EditorProps } from '../../types';
import { name as packageName } from '../../version-wrapper';

import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { EditorPlugin } from '@atlaskit/editor-common/types';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';

const featureFlagOptions = [{ useEditorNext: false }, { useEditorNext: true }];

describe.each(featureFlagOptions)(packageName, (flags) => {
  const Editor = (props: EditorProps) => {
    const newFeatureFlags = {
      featureFlags: { ...props.featureFlags, ...flags },
    };
    const mergedProps = { ...props, ...newFeatureFlags };
    return <EditorMigrationComponent {...mergedProps} />;
  };

  describe(`reconfigure state (useEditorNext: ${flags.useEditorNext})`, () => {
    let reconfigureSpy: jest.SpyInstance<void, [props: any]>;

    beforeEach(() => {
      reconfigureSpy = jest.spyOn(
        ReactEditorView.prototype,
        'reconfigureState',
      );
    });

    afterEach(() => {
      reconfigureSpy.mockReset();
    });

    it('should not reconfigure when updating the collab edit provider', () => {
      const collabEditProvider = jest.fn() as any;
      const setProviderSpy = jest.spyOn(
        ProviderFactory.prototype,
        'setProvider',
      );
      const { rerender, unmount } = renderWithIntl(
        <Editor collabEditProvider={undefined} />,
      );
      rerender(<Editor collabEditProvider={collabEditProvider} />);
      expect(reconfigureSpy).toHaveBeenCalledTimes(0);
      expect(setProviderSpy).toHaveBeenCalledWith(
        'collabEditProvider',
        collabEditProvider,
      );

      unmount();
    });

    it('should reconfigure when updating the appearance', () => {
      const { rerender, unmount } = renderWithIntl(
        <Editor appearance="full-width" />,
      );
      rerender(<Editor appearance="full-page" />);
      expect(reconfigureSpy).toHaveBeenCalledTimes(1);
      unmount();
    });

    it('should reconfigure the editor state when updating the dangerouslyAppendPlugins', () => {
      const { rerender, unmount } = renderWithIntl(<Editor />);
      rerender(
        <Editor
          dangerouslyAppendPlugins={{
            __plugins: [testPlugin],
          }}
        />,
      );
      expect(reconfigureSpy).toHaveBeenCalledTimes(1);
      unmount();
    });
  });
});

const testPlugin: EditorPlugin = {
  name: 'testPlugin',

  pmPlugins() {
    return [
      {
        name: 'testPlugin',
        plugin: () => new SafePlugin({}),
      },
    ];
  },
};
