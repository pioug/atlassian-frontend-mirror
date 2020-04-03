import { getItemsFromModule } from '../../menu-helpers';
import {
  createFakeExtensionManifest,
  createFakeModule,
} from '@atlaskit/editor-test-helpers/extensions';

describe('menu-helpers', () => {
  describe('getItemsFromCapability', () => {
    const confluenceAwesomeMacro = createFakeExtensionManifest({
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

    const forgeAmazingMacro = createFakeExtensionManifest({
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

    const bodiedExtension = {
      type: 'bodiedExtension',
      attrs: {
        extensionType: 'forge.extension',
        extensionKey: 'amazing:async-node',
        parameters: {},
      },
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text:
                'Duis accumsan hendrerit quam quis aliquam. Nunc posuere purus non massa pretium porta. Aliquam sollicitudin vitae tortor eget euismod. Curabitur feugiat, purus nec congue gravida, elit tellus consectetur mauris, sit amet commodo odio diam eu magna. Ut maximus consequat nisi eget pretium. Phasellus et sapien vestibulum, egestas est vel, auctor libero. Quisque efficitur elementum nisi, in posuere sapien hendrerit a. Morbi auctor velit at nunc gravida, et varius quam mollis. Morbi auctor justo risus, id ultrices lectus ultrices at.',
            },
          ],
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text:
                'Nulla et tristique mi, nec laoreet dui. In hac habitasse platea dictumst. Donec sed nulla sit amet nibh cursus bibendum vel gravida nulla. Cras non egestas metus. Aenean vitae dolor et quam tempus dignissim sit amet dapibus ligula. Fusce vestibulum pellentesque ipsum, vel egestas leo gravida ut. Nullam porta accumsan fringilla. Proin eu tincidunt lacus. Nunc sapien augue, feugiat quis faucibus sit amet, egestas eget velit.',
            },
          ],
        },
      ],
    };

    forgeAmazingMacro.modules.quickInsert!.find(
      item => item.key === 'async-node',
    )!.action = createFakeModule(bodiedExtension);

    test('should return all the extensions from a given capability', async () => {
      const quickInsertItems = getItemsFromModule(
        [confluenceAwesomeMacro, forgeAmazingMacro],
        'quickInsert',
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
      const quickInsertItems = getItemsFromModule(
        [confluenceAwesomeMacro, forgeAmazingMacro],
        'quickInsert',
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
          default: bodiedExtension,
        });
      }
    });
  });
});
