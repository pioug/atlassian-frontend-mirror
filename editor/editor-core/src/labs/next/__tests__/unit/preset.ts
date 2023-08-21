/**
 * This is distinctly separate to the builder unit tests in
 * `packages/editor/editor-common/src/utils/__tests__/builder.ts`
 *
 * Here, we cover some preset
 * specific implementation behaviour surrounding `build`
 */

import type { NextEditorPlugin } from '@atlaskit/editor-common/types';
import { EditorPresetBuilder } from '@atlaskit/editor-common/preset';

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
  describe('calling build after creating a preset', () => {
    it('errors out when adding a plugin twice', () => {
      const basePreset = new EditorPresetBuilder().add(PluginDog);

      const finalPreset = basePreset
        .add(PluginDog)
        .add(PluginBark)
        .add(PluginBarkLoud)
        .add(PluginBarkLoud);
      expect(() => {
        finalPreset.build();
      }).toThrow();
    });
    describe('when is the same plugin with multiple configurations', () => {
      it('errors out when adding a plugin twice', () => {
        const basePreset = new EditorPresetBuilder().add(PluginDog);

        const finalPreset = basePreset
          .add(PluginDog)
          .add([PluginDog, { lovesTreats: true }]);
        expect(() => {
          finalPreset.build();
        }).toThrow();
      });
    });
  });

  describe('expects a typescript error', () => {
    it('when a plugin is missing', () => {
      expect(() => {
        const basePreset = new EditorPresetBuilder();

        basePreset
          // @ts-expect-error
          .add(PluginBark);
      }).not.toThrow();
    });
    it('when a plugin is missing in a multi-chain of dependencies', () => {
      expect(() => {
        const basePreset = new EditorPresetBuilder().add(PluginDog);

        basePreset
          // .add(PluginBark)
          // @ts-expect-error
          .add(PluginBarkLoud);
      }).not.toThrow();
    });
  });
});
