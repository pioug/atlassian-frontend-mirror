import type { NextEditorPlugin } from '@atlaskit/editor-common/types';

import { EditorPresetBuilder } from '../builder';

describe('Editor EditorPresetBuilder', () => {
  it('should not be able to override any plugin using the same editor plugin instance', () => {
    const plugin1 = jest.fn(() => 'plugin-1') as any;
    const plugin2 = jest.fn(() => 'plugin-2') as any;
    const plugin2Options = { hasOptions: true };

    const preset = new EditorPresetBuilder()
      .add(plugin1)
      .add(plugin2)
      .add([plugin2, plugin2Options]);

    expect(() => {
      preset.build();
    }).toThrow();
  });

  it('should throw if same plugin is used more than once without override options', () => {
    const plugin1 = jest.fn(() => 'plugin-1') as any;
    const plugin2 = jest.fn(() => 'plugin-2') as any;

    const preset = new EditorPresetBuilder()
      .add(plugin1)
      .add(plugin2)
      .add(plugin1);

    expect(() => preset.build()).toThrow();
  });

  it('should not support different cases for providing plugin configuration in a type-safe way', () => {
    const p1: NextEditorPlugin<'p1'> = () => ({ name: 'p1' });
    const p2: NextEditorPlugin<'p2', { pluginConfiguration: boolean }> = ({
      config: bool,
    }) => ({
      name: 'p2',
    });
    type P3Props = { b: number };
    const p3: NextEditorPlugin<
      'p3',
      { pluginConfiguration: P3Props | undefined }
    > = ({ config: props }) => ({ name: 'p3' });
    const p4: NextEditorPlugin<
      'p4',
      { pluginConfiguration: { a: string } }
    > = ({ config: { a } }) => ({ name: 'p4' });

    const preset = new EditorPresetBuilder()
      .add(p1)
      .add([p2, true])
      .add(p3)
      .add([p3, { b: 123 }])
      .add([p4, { a: 'string' }]);

    expect(() => {
      preset.build();
    }).toThrow();
  });
});
