import { NextEditorPlugin } from '../../types';
import { Builder } from '../../utils';

type BasicPlugin = { name: string };

type BasicDogConfig = { lovesTreats?: boolean; treatsPerBite?: number };

interface DogPlugin {
  name: 'dog';
  sharedState: { something: number; goodDog: boolean };
  pluginConfiguration: BasicDogConfig | undefined;
}

const PluginDog: NextEditorPlugin<'dog', DogPlugin> = () => ({
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
    name: 'bark';
    sharedState: BarkState;
    dependencies: [typeof PluginDog];
  }
> = (_, api) => {
  const dogState = api?.externalPlugins.dog.sharedPluginState.currentState();
  // eslint-disable-next-line no-console
  console.log(dogState?.goodDog);

  api?.externalPlugins.dog.sharedPluginState.onChange((nextDogState) => {
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

const PluginBarkWithMandatoryConfig: NextEditorPlugin<
  'barkWithMandatoryConfig',
  {
    name: 'barkWithMandatoryConfig';
    sharedState: BarkState;
    pluginConfiguration: { enabled: boolean };
    dependencies: [typeof PluginDog];
  }
> = () => {
  // mandatoryHere
  return {
    name: 'barkWithMandatoryConfig',
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
    dependencies: [typeof PluginBark, typeof PluginDog];
  }
> = (_, api) => {
  //externalPlugins.dog.sharedPluginState.currentState().coisa;
  //externalPlugins.bark.sharedPluginState.currentState().coisa;
  //externalPlugins.
  api?.externalPlugins.dog.sharedPluginState.currentState().goodDog;
  api?.externalPlugins.bark.sharedPluginState.currentState().coisa;

  return {
    name: 'bark-loud',
  };
};

const PluginRelyingOnPluginBarkWithMandatoryConfig: NextEditorPlugin<
  'pluginRelyingOnPluginBarkWithMandatoryConfig',
  {
    dependencies: [typeof PluginBarkWithMandatoryConfig];
  }
> = () => {
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
        {
          pluginConfiguration: Config;
        }
      > = (config) => ({
        name: 'pluginWithSomeMandatoryConfig',
        readProps: () => {
          expect(config.mandatoryValue).toEqual(config.mandatoryValue);

          expect(config.optionalValue).toEqual(config.optionalValue);
          expect(config.optionalValue).not.toEqual(null);

          return config;
        },
      });

      const config: Config = {
        optionalValue: { foo: true },
        mandatoryValue: { bar: false },
      };

      const plugin = PluginWithSomeMandatoryConfig(config, {
        externalPlugins: {},
      });

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
        {
          pluginConfiguration: Config;
        }
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
      const plugin = PluginWithSomeMandatoryConfig(config, {
        externalPlugins: {},
      });

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
    'pluginWithNoArgsOrConfig',
    {}
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
        PluginWithNoArgsOrConfig(undefined, { externalPlugins: {} });

        PluginWithNoArgsOrConfig(undefined, { externalPlugins: {} });
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
      {
        pluginConfiguration: ConfigProps | undefined;
      }
    > = (props?) => ({
      name: 'pluginWithOptionalConfig',
    });
    const PluginWithMandatoryConfig: NextEditorPlugin<
      'pluginWithMandatoryConfig',
      {
        pluginConfiguration: ConfigProps;
      }
    > = (props) => ({
      name: 'pluginWithMandatoryConfig',
    });
    it('should type-error when adding basic plugin non-optional config without providing them in [plugin,config]', () => {
      expect(() => {
        // @ts-expect-error
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
        new Builder<BasicPlugin>().add([PluginWithOptionalConfig]);
        new Builder<BasicPlugin>().add([PluginWithOptionalConfig, undefined]);
        new Builder<BasicPlugin>().add([
          PluginWithOptionalConfig,
          { lovesTreats: true },
        ]);
      }).not.toThrow();
    });

    it('should work when adding plugin with non-optional config', () => {
      expect(() => {
        // @ts-expect-error
        new Builder<BasicPlugin>().add(PluginWithMandatoryConfig);

        // @ts-expect-error
        new Builder<BasicPlugin>().add([PluginWithMandatoryConfig]);

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

  it('should prevent adding `NextEditorPlugin` when mandatory config exists', () => {
    expect(() => {
      new Builder<BasicPlugin>()
        .add(PluginDog)
        // @ts-expect-error
        .add([PluginBarkWithMandatoryConfig]);
    }).not.toThrow();
  });

  it('should type-error on `NextEditorPlugin` inferred config', () => {
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

  it('should correctly infer `NextEditorPlugin` config', () => {
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

  describe('when PluginDog was not add prior', () => {
    it('should type-error on PluginBark and PluginBarkLoud', () => {
      expect(() => {
        new Builder<BasicPlugin>()
          // .add(PluginDog)
          // @ts-expect-error
          .add(PluginBark)
          // @ts-expect-error
          .add(PluginBarkLoud);
      }).not.toThrow();
    });
  });

  describe('when PluginBark was not add prior', () => {
    it('should type-error PluginBarkLoud', () => {
      expect(() => {
        new Builder<BasicPlugin>()
          .add(PluginDog)
          //.add(PluginBark)
          // @ts-expect-error
          .add(PluginBarkLoud);
      }).not.toThrow();
    });
  });

  describe('when all plugins were added in the right order', () => {
    it('should work without errors', () => {
      expect(() => {
        new Builder<BasicPlugin>()
          .add(PluginDog)
          .add(PluginBark)
          .add(PluginBarkLoud);
      }).not.toThrow();
    });
  });
});
