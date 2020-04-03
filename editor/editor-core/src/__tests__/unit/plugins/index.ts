import * as plugins from '../../../plugins';

test('Plugins have unique EditorPlugin names', () => {
  const names = Object.keys(plugins)
    .filter(key => key.endsWith('Plugin'))
    .map(pluginKey => {
      // @ts-ignore
      const p = plugins[pluginKey]({});
      return p.name;
    });

  expect(names.length).toEqual(new Set(names).size);
});
