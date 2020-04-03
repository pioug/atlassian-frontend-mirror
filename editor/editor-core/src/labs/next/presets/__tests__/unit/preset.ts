import { Preset } from '../../preset';
import { EditorPlugin } from '../../../../../types';

describe('Editor Preset', () => {
  it('should be able to override any plugin', () => {
    const plugin1 = jest.fn(() => 'plugin-1') as any;
    const plugin2 = jest.fn(() => 'plugin-2') as any;
    const plugin2Options = { hasOptions: true };

    const preset = new Preset();
    preset.add(plugin1);
    preset.add(plugin2);
    preset.add([plugin2, plugin2Options]);

    const plugins = preset.getEditorPlugins();
    expect(plugins).toEqual(['plugin-1', 'plugin-2']);
    expect(plugin1).toBeCalledTimes(1);
    expect(plugin2).toBeCalledTimes(1);
    expect(plugin2).toBeCalledWith(plugin2Options);
  });

  it('should be able to override already overridden plugin', () => {
    const plugin1 = jest.fn(() => 'plugin-1') as any;
    const plugin2 = jest.fn(() => 'plugin-2') as any;

    const plugin2Options = { hasOptions: true };
    const plugin2Options2 = { hasMoreOptions: true };

    const preset = new Preset();
    preset.add(plugin2);
    preset.add(plugin1);
    preset.add([plugin2, plugin2Options]);
    preset.add([plugin2, plugin2Options2]);

    const plugins = preset.getEditorPlugins();
    expect(plugins).toEqual(['plugin-2', 'plugin-1']);
    expect(plugin1).toBeCalledTimes(1);
    expect(plugin2).toBeCalledTimes(1);
    expect(plugin2).toBeCalledWith(plugin2Options2);
  });

  it('should throw if same plugin is used more than once without override options', () => {
    const plugin1 = jest.fn(() => 'plugin-1') as any;
    const plugin2 = jest.fn(() => 'plugin-2') as any;

    const preset = new Preset();
    preset.add(plugin1);
    preset.add(plugin2);
    preset.add(plugin1);

    expect(() => preset.getEditorPlugins()).toThrow();
  });

  it('should support different cases for providing plugin configuration in a type-safe way', () => {
    const p1 = (): EditorPlugin => ({ name: 'p1' });
    const p2 = (bool: boolean): EditorPlugin => ({ name: 'p2' });
    const p3 = (props?: { b: number }): EditorPlugin => ({ name: 'p3' });
    const p4 = (props: { a: string }): EditorPlugin => ({ name: 'p4' });

    const preset = new Preset();
    preset.add(p1);
    preset.add([p2, true]);
    preset.add([p3]);
    preset.add([p3, { b: 123 }]);
    preset.add([p4, { a: 'string' }]);

    const plugins = preset.getEditorPlugins();
    expect(plugins).toEqual([
      { name: 'p1' },
      { name: 'p2' },
      { name: 'p3' },
      { name: 'p4' },
    ]);
  });
});
