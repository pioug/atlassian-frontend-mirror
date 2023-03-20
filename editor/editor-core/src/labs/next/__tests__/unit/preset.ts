/**
 * This is distinctly separate to the builder unit tests in
 * `packages/editor/editor-common/src/utils/__tests__/builder.ts`
 *
 * Here, we cover some preset
 * specific implementation behaviour surrounding `getEditorPlugins`
 */

import { NextEditorPlugin } from '@atlaskit/editor-common/types';
import { Preset } from '../../presets/preset';

type BasicPlugin = { name: string };

type BasicDogConfig = { lovesTreats?: boolean; treatsPerBite?: number };

const PluginDog: NextEditorPlugin<
  'dog',
  {
    sharedState: { something: number; goodDog: boolean };
    pluginConfiguration: BasicDogConfig | undefined;
  }
> = () => ({
  name: 'dog',
  getSharedState: () => {
    return {
      something: 1,
      goodDog: true,
    };
  },
});

type BarkState = Record<'coisa', string>;
const PluginBark: NextEditorPlugin<
  'bark',
  {
    sharedState: BarkState;
    dependencies: [typeof PluginDog];
  }
> = () => {
  return {
    name: 'bark',
    getSharedState: () => {
      return {
        coisa: 'dasdas',
      };
    },
  };
};

const PluginBarkLoud: NextEditorPlugin<
  'bark-loud',
  {
    dependencies: [typeof PluginBark];
  }
> = () => {
  return {
    name: 'bark-loud',
  };
};

describe('Preset implementation of builder', () => {
  it.skip('should disallow processing a preset with `NextEditorPlugin`', () => {
    const basePreset = new Preset<BasicPlugin>();

    const finalPreset = basePreset
      .add(PluginDog)
      .add(PluginBark)
      .add(PluginBarkLoud);
    expect(() => {
      finalPreset.getEditorPlugins();
    }).toThrow();
  });

  describe('calling getEditorPlugins after creating a preset', () => {
    it.skip('handles when a preset is re-assigned in a multi-chain of dependencies', () => {
      const basePreset = new Preset<{
        name: string;
      }>().add([PluginDog, { lovesTreats: true }]);

      const basePresetWithBark = basePreset.add(PluginBark);
      const finalPreset = basePresetWithBark.add(PluginBarkLoud);

      expect(finalPreset.data).toEqual(
        expect.arrayContaining([
          [PluginDog, { lovesTreats: true }],
          PluginBark,
          PluginBarkLoud,
        ]),
      );

      expect(() => {
        finalPreset.getEditorPlugins();
      }).toThrow();
    });

    it('errors out when adding a plugin twice without reconfiguring it', () => {
      const basePreset = new Preset<BasicPlugin>().add(PluginDog);

      const finalPreset = basePreset
        .add(PluginDog)
        .add(PluginBark)
        .add(PluginBarkLoud)
        .add(PluginBarkLoud);
      expect(() => {
        finalPreset.getEditorPlugins();
      }).toThrow();
    });

    it('processes presets with the same `NextEditorPlugin` plugin added multiple times', () => {
      const basePreset = new Preset<{
        name: string;
      }>().add([PluginDog, { lovesTreats: true }]);

      const baseWithReconfiguredDog = basePreset.add([
        PluginDog,
        { lovesTreats: false },
      ]);
      const finalPreset = baseWithReconfiguredDog.add([
        PluginDog,
        { lovesTreats: true },
      ]);

      expect(() => {
        finalPreset.getEditorPlugins();
      }).not.toThrow();
    });
  });

  describe('expects a typescript error', () => {
    it('when a plugin is missing', () => {
      expect(() => {
        const basePreset = new Preset<BasicPlugin>();

        basePreset
          // @ts-expect-error
          .add(PluginBark);
      }).not.toThrow();
    });
    it('when a plugin is missing in a multi-chain of dependencies', () => {
      expect(() => {
        const basePreset = new Preset<BasicPlugin>().add(PluginDog);

        basePreset
          // .add(PluginBark)
          // @ts-expect-error
          .add(PluginBarkLoud);
      }).not.toThrow();
    });
  });
});
