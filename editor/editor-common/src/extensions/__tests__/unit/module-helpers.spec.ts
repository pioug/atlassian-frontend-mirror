import {
  createFakeAutoConvertModule,
  createFakeExtensionManifest,
  createFakeModule,
} from '@atlaskit/editor-test-helpers/extensions';
import {
  bodiedExtension,
  p as paragraph,
} from '@atlaskit/editor-test-helpers/schema-builder';

import {
  buildMenuItem,
  createAutoConverterRunner,
  getAutoConvertPatternsFromModule,
  getQuickInsertItemsFromModule,
} from '../../module-helpers';
import { ExtensionManifest, MenuItem } from '../../types';

describe('module-helpers', () => {
  let confluenceAwesomeMacro: ExtensionManifest;
  let forgeAmazingMacro: ExtensionManifest;

  const extension = bodiedExtension({
    extensionType: 'forge.extension',
    extensionKey: 'amazing:async-node',
    parameters: {},
  })(
    paragraph(
      'Duis accumsan hendrerit quam quis aliquam. Nunc posuere purus non massa pretium porta. Aliquam sollicitudin vitae tortor eget euismod. Curabitur feugiat, purus nec congue gravida, elit tellus consectetur mauris, sit amet commodo odio diam eu magna. Ut maximus consequat nisi eget pretium. Phasellus et sapien vestibulum, egestas est vel, auctor libero. Quisque efficitur elementum nisi, in posuere sapien hendrerit a. Morbi auctor velit at nunc gravida, et varius quam mollis. Morbi auctor justo risus, id ultrices lectus ultrices at.',
    ),
    paragraph(
      'Nulla et tristique mi, nec laoreet dui. In hac habitasse platea dictumst. Donec sed nulla sit amet nibh cursus bibendum vel gravida nulla. Cras non egestas metus. Aenean vitae dolor et quam tempus dignissim sit amet dapibus ligula. Fusce vestibulum pellentesque ipsum, vel egestas leo gravida ut. Nullam porta accumsan fringilla. Proin eu tincidunt lacus. Nunc sapien augue, feugiat quis faucibus sit amet, egestas eget velit.',
    ),
  );

  beforeEach(() => {
    confluenceAwesomeMacro = createFakeExtensionManifest({
      title: 'Awesome macro',
      type: 'confluence.macro',
      extensionKey: 'awesome',
      nodes: [
        {
          key: 'list',
        },
        {
          key: 'item',
          parameters: {
            word: 'awesome',
          },
        },
      ],
    });

    forgeAmazingMacro = createFakeExtensionManifest({
      title: 'Amazing extension',
      type: 'forge.extension',
      extensionKey: 'amazing',
      nodes: [
        {
          key: 'list',
          parameters: {
            word: 'amazing',
            items: 10,
          },
        },
        {
          key: 'item',
        },
        {
          key: 'async-node',
        },
      ],
    });
  });

  describe('getQuickInsertItemsFromModule', () => {
    test('should return all quick insert items', async () => {
      const quickInsertItems = getQuickInsertItemsFromModule(
        [confluenceAwesomeMacro, forgeAmazingMacro],
        item => item.key,
      );

      expect(quickInsertItems).toEqual([
        'awesome:list',
        'awesome:item',
        'amazing:list',
        'amazing:item',
        'amazing:async-node',
      ]);
    });

    test('should build an ADF node based on actions that point to nodes', async () => {
      forgeAmazingMacro.modules.quickInsert!.find(
        item => item.key === 'async-node',
      )!.action = createFakeModule(extension);

      const quickInsertItems = getQuickInsertItemsFromModule(
        [confluenceAwesomeMacro, forgeAmazingMacro],
        item => item,
      );

      expect(await quickInsertItems[0].node).toEqual({
        type: 'extension',
        attrs: {
          extensionType: 'confluence.macro',
          extensionKey: 'awesome:list',
          parameters: {},
        },
      });

      expect(await quickInsertItems[1].node).toEqual({
        type: 'extension',
        attrs: {
          extensionType: 'confluence.macro',
          extensionKey: 'awesome:item',
          parameters: {
            word: 'awesome',
          },
        },
      });

      expect(await quickInsertItems[2].node).toEqual({
        type: 'extension',
        attrs: {
          extensionType: 'forge.extension',
          extensionKey: 'amazing:list',
          parameters: {
            word: 'amazing',
            items: 10,
          },
        },
      });

      expect(await quickInsertItems[3].node).toEqual({
        type: 'extension',
        attrs: {
          extensionType: 'forge.extension',
          extensionKey: 'amazing:item',
          parameters: {},
        },
      });

      expect(quickInsertItems[4].node).toBeInstanceOf(Function);
      // TODO: Use assertion type once we upgrade to TypeScript 3.7
      if (typeof quickInsertItems[4].node === 'function') {
        expect(await quickInsertItems[4].node()).toEqual({
          __esModule: true,
          default: extension,
        });
      }
    });
  });

  describe('buildMenuItem', () => {
    let menuItem: MenuItem;
    let myMacro: ExtensionManifest;

    beforeEach(() => {
      myMacro = createFakeExtensionManifest({
        title: 'Awesome macro',
        type: 'confluence.macro',
        extensionKey: 'awesome',
        nodes: [
          {
            key: 'list',
          },
          {
            key: 'item',
            parameters: {
              word: 'awesome',
            },
          },
        ],
      });

      myMacro.keywords = ['manifest a', 'manifest b'];
      myMacro.categories = ['formatting'];
    });

    describe('should use data from the quickInsert module', () => {
      beforeEach(() => {
        myMacro.modules.quickInsert![0] = {
          ...myMacro.modules.quickInsert![0],
          description: 'quickinsert item description',
          keywords: ['a', 'b', 'c'],
          categories: ['vizualization'],
        };

        menuItem = buildMenuItem(myMacro, myMacro.modules.quickInsert![0]);
      });

      test('keywords', () => {
        expect(menuItem.keywords).toEqual(['a', 'b', 'c']);
      });

      test('categories', () => {
        expect(menuItem.categories).toEqual(['vizualization']);
      });

      test('description', () => {
        expect(menuItem.description).toEqual('quickinsert item description');
      });
    });

    describe('should fallback to manifeest data if not provided in the quickInsert module', () => {
      beforeEach(() => {
        menuItem = buildMenuItem(myMacro, myMacro.modules.quickInsert![0]);
      });

      test('keywords', () => {
        expect(menuItem.keywords).toEqual(['manifest a', 'manifest b']);
      });

      test('categories', () => {
        expect(menuItem.categories).toEqual(['formatting']);
      });

      test('description', () => {
        expect(menuItem.description).toEqual('Awesome macro extension');
      });
    });
  });

  describe('autoConvert', () => {
    let confluenceWithAutoConvert: ExtensionManifest;
    let forgeWithAutoConvert: ExtensionManifest;

    beforeEach(() => {
      confluenceWithAutoConvert = createFakeAutoConvertModule(
        confluenceAwesomeMacro,
        'url',
        ['foo', 'bar'],
      );

      forgeWithAutoConvert = createFakeAutoConvertModule(
        forgeAmazingMacro,
        'url',
        ['baz'],
      );
    });

    describe('getAutoConvertPatternsFromModule', () => {
      test('should return a list of auto convert handlers', async () => {
        const autoConvertHandlers = await getAutoConvertPatternsFromModule([
          confluenceWithAutoConvert,
          forgeWithAutoConvert,
        ]);

        [
          'http://awesome-foo/test',
          'http://awesome-bar/bear',
          'http://amazing-baz/app',
        ].forEach(url =>
          expect(
            autoConvertHandlers.some(handler => handler(url)),
          ).toBeTruthy(),
        );

        expect(
          autoConvertHandlers.some(handler => handler('unknown')),
        ).toBeFalsy();
      });
    });

    describe('createAutoConverterRunner', () => {
      test('should create a runner for auto convert that returns a node when there is a match', async () => {
        const autoConvertHandlers = await getAutoConvertPatternsFromModule([
          confluenceWithAutoConvert,
          forgeWithAutoConvert,
        ]);

        const runner = createAutoConverterRunner(autoConvertHandlers);

        [
          'http://awesome-foo/test',
          'http://awesome-bar/bear',
          'http://amazing-baz/app',
        ].forEach(url => {
          const result = runner(url);
          expect(result).toMatchObject({
            type: 'extension',
            attrs: {
              parameters: {
                url,
              },
            },
          });
        });

        expect(runner('unknown')).toStrictEqual(undefined);
      });

      test('should not break if auto conver patterns are not there', async () => {
        const autoConvertHandlers = await getAutoConvertPatternsFromModule([
          confluenceAwesomeMacro,
          forgeAmazingMacro,
        ]);

        const runner = createAutoConverterRunner(autoConvertHandlers);

        expect(runner('http://amazing-async-node/ox')).toBe(undefined);
      });
    });
  });
});
