import React from 'react';

import { render } from '@testing-library/react';

import { EditorPresetBuilder } from '@atlaskit/editor-common/preset';
import { featureFlagsPlugin } from '@atlaskit/editor-plugin-feature-flags';

import createUniversalPreset from '../../../presets/universal';
import { basePlugin } from '@atlaskit/editor-plugin-base';
import { ComposableEditor } from '../../editor';

describe('ComposableEditor', () => {
  describe('render with presets passed in', () => {
    it('should render correctly with the preset prop', () => {
      const preset = createUniversalPreset('full-page', { paste: {} }, {});
      const { container } = render(<ComposableEditor preset={preset} />);
      const editorElement = container.getElementsByClassName('akEditor');
      expect(editorElement.length).toBe(1);
    });

    it('should throw if passing an empty Preset', () => {
      const consoleErrorSpy = jest.spyOn(console, 'error');
      expect(() => {
        render(<ComposableEditor preset={new EditorPresetBuilder()} />);
      }).toThrow();
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('Presets must contain the base plugin'),
      );
      consoleErrorSpy.mockRestore();
    });

    it('should not throw if passing a Preset that contains the base plugin', () => {
      const consoleErrorSpy = jest.spyOn(console, 'error');
      const preset = new EditorPresetBuilder()
        .add([featureFlagsPlugin, {}])
        .add(basePlugin);

      expect(() => {
        render(<ComposableEditor preset={preset} />);
      }).not.toThrow();
      expect(consoleErrorSpy).toHaveBeenCalledTimes(0);
      consoleErrorSpy.mockRestore();
    });
  });
});

// Check typing of `ComposableEditor` is as expected
// eslint-disable-next-line
function EditorTyping() {
  // @ts-expect-error no preset prop
  const test1 = <ComposableEditor />;

  const test2 = (
    // @ts-expect-error no allow-* props
    <ComposableEditor preset={new EditorPresetBuilder()} allowDate={true} />
  );

  const test3 = (
    <ComposableEditor
      preset={new EditorPresetBuilder()}
      // @ts-expect-error no dangerouslyAppendPlugins
      dangerouslyAppendPlugins={{ __plugins: [] }}
    />
  );

  const test4 = (
    <ComposableEditor
      preset={new EditorPresetBuilder()}
      // @ts-expect-error no allow-* props
      allowTextAlignment={true}
    />
  );

  const test5 = (
    <ComposableEditor
      preset={new EditorPresetBuilder()}
      // @ts-expect-error no allow-* props
      allowTables={true}
    />
  );

  const test6 = (
    <ComposableEditor
      preset={new EditorPresetBuilder()}
      // @ts-expect-error no allow-* props
      allowTextColor={true}
    />
  );

  const test7 = (
    <ComposableEditor
      preset={new EditorPresetBuilder()}
      // @ts-expect-error no insertMenuItems
      insertMenuItems={[]}
    />
  );

  const test8 = (
    <ComposableEditor
      preset={new EditorPresetBuilder()}
      // @ts-expect-error no UNSAFE_cards
      UNSAFE_cards={null}
    />
  );

  const test9 = (
    <ComposableEditor
      preset={new EditorPresetBuilder()}
      // @ts-expect-error no smartLinks
      smartLinks={null}
    />
  );

  const test10 = (
    <ComposableEditor
      preset={new EditorPresetBuilder()}
      // @ts-expect-error no allow-* props
      allowAnalyticsGASV3={true}
    />
  );

  const test11 = (
    <ComposableEditor
      preset={new EditorPresetBuilder()}
      // @ts-expect-error no codeBlock
      codeBlock={null}
    />
  );

  const test12 = (
    <ComposableEditor
      preset={new EditorPresetBuilder()}
      // @ts-expect-error no textFormatting
      textFormatting={null}
    />
  );

  // eslint-disable-next-line
  console.log(test1);

  // eslint-disable-next-line
  console.log(test2);

  // eslint-disable-next-line
  console.log(test3);

  // eslint-disable-next-line
  console.log(test4);

  // eslint-disable-next-line
  console.log(test5);

  // eslint-disable-next-line
  console.log(test6);

  // eslint-disable-next-line
  console.log(test7);

  // eslint-disable-next-line
  console.log(test8);

  // eslint-disable-next-line
  console.log(test9);

  // eslint-disable-next-line
  console.log(test10);

  // eslint-disable-next-line
  console.log(test11);

  // eslint-disable-next-line
  console.log(test12);
}

// eslint-disable-next-line
console.log(typeof EditorTyping);
