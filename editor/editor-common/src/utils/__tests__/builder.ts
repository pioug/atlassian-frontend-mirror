import {
  NextEditorPlugin,
  NextEditorPluginWithDependencies,
} from '../../types';
import { Builder } from '../../utils';

type BasicPlugin = { name: string };

type BasicDogConfig = { lovesTreats?: boolean; treatsPerBite?: number };
// type BasicDogConfigWithMandatory = BasicDogConfig & { requiresPats: boolean };

const PluginDog: NextEditorPlugin<
  'dog',
  { something: number; goodDog: boolean },
  BasicDogConfig | undefined
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
const PluginBark: NextEditorPluginWithDependencies<
  'bark',
  BarkState,
  [typeof PluginDog]
> =
  ({ externalPlugins }) =>
  () => {
    const dogState = externalPlugins.dog.sharedPluginState.currentState();
    // eslint-disable-next-line no-console
    console.log(dogState.goodDog);

    externalPlugins.dog.sharedPluginState.onChange((nextDogState) => {
      // eslint-disable-next-line no-console
      console.log(nextDogState.goodDog);
    });

    return {
      name: 'bark',
      getSharedState: () => {
        return {
          coisa: 'dasdas',
        };
      },
    };
  };

const PluginBarkWithMandatoryConfig: NextEditorPluginWithDependencies<
  'barkWithMandatoryConfig',
  BarkState,
  [typeof PluginDog],
  { enabled: boolean }
> = () => () => {
  return {
    name: 'barkWithMandatoryConfig',
    getSharedState: () => {
      return {
        coisa: 'dasdas',
      };
    },
  };
};

const PluginBarkLoud: NextEditorPluginWithDependencies<
  'bark-loud',
  never,
  [typeof PluginBark]
> =
  ({}) =>
  () => {
    return {
      name: 'bark-loud',
    };
  };

const PluginRelyingOnPluginBarkWithMandatoryConfig: NextEditorPluginWithDependencies<
  'pluginRelyingOnPluginBarkWithMandatoryConfig',
  never,
  [typeof PluginBarkWithMandatoryConfig]
> =
  ({}) =>
  () => {
    return {
      name: 'pluginRelyingOnPluginBarkWithMandatoryConfig',
    };
  };

describe('next-editor-plugin internal plugin / consumer behaviour', () => {
  it('forces config to be mandatory when supplied', () => {
    expect(() => {
      type Config = {
        optionalValue?: { foo: boolean };
        mandatoryValue: { bar: boolean };
      };
      const PluginWithSomeMandatoryConfig: NextEditorPlugin<
        'pluginWithSomeMandatoryConfig',
        never,
        Config
      > = (props) => ({
        name: 'pluginWithSomeMandatoryConfig',
        readProps: () => {
          expect(props.mandatoryValue).toEqual(props.mandatoryValue);

          expect(props.optionalValue).toEqual(props.optionalValue);
          expect(props.optionalValue).not.toEqual(null);

          return props;
        },
      });

      const config: Config = {
        optionalValue: { foo: true },
        mandatoryValue: { bar: false },
      };

      const plugin = PluginWithSomeMandatoryConfig(config);

      expect((plugin as any).readProps()).toEqual(config);
      expect((plugin as any).readProps()).not.toEqual({ nonsense: true });
    }).not.toThrow();
  });
  it('forces config to be the default value provided', () => {
    expect(() => {
      type Config = {
        optionalValue?: { foo: boolean };
        mandatoryValue: { bar: boolean };
      };
      const PluginWithSomeMandatoryConfig: NextEditorPlugin<
        'pluginWithSomeMandatoryConfig',
        never,
        Config
      > = (props = { mandatoryValue: { bar: true } }) => ({
        name: 'pluginWithSomeMandatoryConfig',
        readProps: () => {
          return props;
        },
      });

      const config: Config = {
        optionalValue: { foo: true },
        mandatoryValue: { bar: false },
      };
      const plugin = PluginWithSomeMandatoryConfig(config);

      expect((plugin as any).readProps()).toEqual(config);
      expect((plugin as any).readProps()).not.toEqual({ nonsense: true });

      // Shouldn't be able to call a plugin with undefined
      // @ts-expect-error
      PluginWithSomeMandatoryConfig(undefined);
    }).not.toThrow();
  });
});

describe('next-editor-plugin types', () => {
  const PluginWithNoArgsOrConfig: NextEditorPlugin<
    'pluginWithNoArgsOrConfig'
  > = () => ({
    name: 'pluginWithNoArgsOrConfig',
  });
  it('builds basic plugins', () => {
    expect(() => {
      new Builder<BasicPlugin>().add(PluginDog);
    }).not.toThrow();
  });

  describe('when adding a plugin without arguments/configuration', () => {
    it('should not type-error', () => {
      expect(() => {
        new Builder<BasicPlugin>().add(PluginWithNoArgsOrConfig);
      }).not.toThrow();
    });
    /**
     * This one is needed as a compromise to be explicit about what the builder
     * or preset actually does (calls a plugin with `undefined`) even if it's
     * a plugin that doesn't ask for it
     */
    it('expects a value for its first argument', () => {
      expect(() => {
        PluginWithNoArgsOrConfig(undefined);

        PluginWithNoArgsOrConfig();
      }).not.toThrow();
    });
  });

  it('builds using plugins with dependencies', () => {
    expect(() => {
      new Builder<BasicPlugin>().add(PluginDog).add(PluginBark);
    }).not.toThrow();
  });

  it('builds when calling `add` with plugin inside an array', () => {
    expect(() => {
      new Builder<BasicPlugin>()
        .add(PluginDog)
        .add(PluginBark)
        .add(PluginBarkLoud);
    }).not.toThrow();
  });

  it('should infer types from basic plugins', () => {
    expect(() => {
      new Builder<BasicPlugin>().add([
        PluginDog,
        {
          lovesTreats: true,
          treatsPerBite: 3,
        },
      ]);
    }).not.toThrow();
  });

  describe('next-editor-plugin types', () => {
    type ConfigProps = {
      lovesTreats?: boolean;
      treatsPerBite?: number;
      requiresPats?: boolean;
    };
    const PluginWithOptionalConfig: NextEditorPlugin<
      'pluginWithOptionalConfig',
      never,
      ConfigProps | undefined
    > = (props?) => ({
      name: 'pluginWithOptionalConfig',
    });
    const PluginWithMandatoryConfig: NextEditorPlugin<
      'pluginWithMandatoryConfig',
      never,
      ConfigProps
    > = (props) => ({
      name: 'pluginWithMandatoryConfig',
    });
    it('should type-error when adding basic plugin non-optional config without providing them in [plugin,config]', () => {
      expect(() => {
        new Builder<BasicPlugin>().add(PluginWithMandatoryConfig);
      }).not.toThrow();
    });

    it('should type-error when adding plugin with non-optional config', () => {
      expect(() => {
        // @ts-expect-error
        new Builder<BasicPlugin>().add([PluginWithMandatoryConfig]);
      }).not.toThrow();
    });

    it('should work when adding plugin with optional config', () => {
      expect(() => {
        new Builder<BasicPlugin>().add(PluginWithOptionalConfig);
        new Builder<BasicPlugin>().add([PluginWithOptionalConfig, undefined]);
        new Builder<BasicPlugin>().add([
          PluginWithOptionalConfig,
          { lovesTreats: true },
        ]);
      }).not.toThrow();
    });
    it('should work when adding plugin with non-optional config', () => {
      expect(() => {
        // TODO: why is this not type-erroring?
        new Builder<BasicPlugin>().add(PluginWithMandatoryConfig);
        new Builder<BasicPlugin>().add([
          PluginWithMandatoryConfig,
          { treatsPerBite: 5, requiresPats: true },
        ]);
      }).not.toThrow();
    });
  });

  it('should type-error on basic plugin inferred config', () => {
    expect(() => {
      new Builder<BasicPlugin>().add([
        PluginDog,
        {
          // @ts-expect-error
          nonExistentProperty: true,
        },
      ]);
    }).not.toThrow();
  });

  it('should prevent adding `NextEditorPluginWithDependencies` when mandatory config exists', () => {
    expect(() => {
      new Builder<BasicPlugin>()
        .add(PluginDog)
        // @ts-expect-error
        .add([PluginBarkWithMandatoryConfig]);
    }).not.toThrow();
  });

  it('should type-error on `NextEditorPluginWithDependencies` inferred config', () => {
    expect(() => {
      new Builder<BasicPlugin>().add(PluginDog).add([
        PluginBarkWithMandatoryConfig,
        {
          // @ts-expect-error
          nonExistentProperty: true,
        },
      ]);
      new Builder<BasicPlugin>().add(PluginDog).add([
        PluginBarkWithMandatoryConfig,
        {
          // @ts-expect-error
          enabled: { incorrectTypeOfValue: true },
        },
      ]);
    }).not.toThrow();
  });
  it('should correctly infer `NextEditorPluginWithDependencies` config', () => {
    expect(() => {
      new Builder<BasicPlugin>().add(PluginDog).add([
        PluginBarkWithMandatoryConfig,
        {
          enabled: true,
        },
      ]);
    }).not.toThrow();
  });

  it('builds when calling `add` with plugin inside an array', () => {
    expect(() => {
      new Builder<BasicPlugin>()
        .add(PluginDog)
        .add([PluginBarkWithMandatoryConfig, { enabled: false }])
        .add(PluginRelyingOnPluginBarkWithMandatoryConfig);
    }).not.toThrow();
  });

  it('errors with plugins', () => {
    expect(() => {
      new Builder<BasicPlugin>()
        // .add(PluginDog)
        // @ts-expect-error
        .add(PluginBark)
        .add(PluginBarkLoud);
    }).not.toThrow();
  });

  it('type-errors when a plugin is missing in a multi-chain of dependencies', () => {
    expect(() => {
      new Builder<BasicPlugin>()
        .add(PluginDog)
        // .add(PluginBark)
        // @ts-expect-error
        .add(PluginBarkLoud);
    }).not.toThrow();
  });
});
