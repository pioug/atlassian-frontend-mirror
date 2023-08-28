import type { NextEditorPlugin, OptionalPlugin } from '../../types';
import { EditorPresetBuilder } from '../builder';

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
> = ({ api }) => {
  const dogState = api?.dog.sharedState.currentState();
  // eslint-disable-next-line no-console
  console.log(dogState?.goodDog);

  api?.dog.sharedState.onChange(({ nextSharedState }) => {
    // eslint-disable-next-line no-console
    console.log(nextSharedState.goodDog);
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
> = ({ api }) => {
  api?.dog.sharedState.currentState()?.goodDog;
  api?.bark.sharedState.currentState()?.coisa;

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
      > = ({ config }) => ({
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

      const plugin = PluginWithSomeMandatoryConfig({ config });

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
      > = ({ config: props = { mandatoryValue: { bar: true } } }) => ({
        name: 'pluginWithSomeMandatoryConfig',
        readProps: () => {
          return props;
        },
      });

      const config: Config = {
        optionalValue: { foo: true },
        mandatoryValue: { bar: false },
      };
      const plugin = PluginWithSomeMandatoryConfig({ config });

      expect((plugin as any).readProps()).toEqual(config);
      expect((plugin as any).readProps()).not.toEqual({ nonsense: true });

      // Shouldn't be able to call a plugin with undefined
      // @ts-expect-error
      PluginWithSomeMandatoryConfig({ config: undefined });
    }).not.toThrow();
  });
});

describe('EditorEditorPresetBuilder', () => {
  const PluginWithNoArgsOrConfig: NextEditorPlugin<
    'pluginWithNoArgsOrConfig',
    {}
  > = () => ({
    name: 'pluginWithNoArgsOrConfig',
  });
  it('builds basic plugins', () => {
    expect(() => {
      new EditorPresetBuilder().add(PluginDog);
    }).not.toThrow();
  });

  describe('when adding a plugin without arguments/configuration', () => {
    it('should not type-error', () => {
      expect(() => {
        new EditorPresetBuilder().add(PluginWithNoArgsOrConfig);
      }).not.toThrow();
    });
    /**
     * This one is needed as a compromise to be explicit about what the builder
     * or preset actually does (calls a plugin with `undefined`) even if it's
     * a plugin that doesn't ask for it
     */
    it('expects a value for its first argument', () => {
      expect(() => {
        PluginWithNoArgsOrConfig({ config: undefined });

        PluginWithNoArgsOrConfig({ config: undefined });
      }).not.toThrow();
    });
  });

  it('builds using plugins with dependencies', () => {
    expect(() => {
      new EditorPresetBuilder().add(PluginDog).add(PluginBark);
    }).not.toThrow();
  });

  it('builds when calling `add` with plugin inside an array', () => {
    expect(() => {
      new EditorPresetBuilder()
        .add(PluginDog)
        .add(PluginBark)
        .add(PluginBarkLoud);
    }).not.toThrow();
  });

  it('should infer types from basic plugins', () => {
    expect(() => {
      new EditorPresetBuilder().add([
        PluginDog,
        {
          lovesTreats: true,
          treatsPerBite: 3,
        },
      ]);
    }).not.toThrow();
  });

  describe('next-editor-plugin configurations', () => {
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
        new EditorPresetBuilder().add(PluginWithMandatoryConfig);
      }).not.toThrow();
    });

    it('should type-error when adding plugin with non-optional config', () => {
      expect(() => {
        // @ts-expect-error
        new EditorPresetBuilder().add([PluginWithMandatoryConfig]);
      }).not.toThrow();
    });

    it('should work when adding plugin with optional config', () => {
      expect(() => {
        new EditorPresetBuilder().add(PluginWithOptionalConfig);
        new EditorPresetBuilder().add([PluginWithOptionalConfig]);
        new EditorPresetBuilder().add([PluginWithOptionalConfig, undefined]);
        new EditorPresetBuilder().add([
          PluginWithOptionalConfig,
          { lovesTreats: true },
        ]);
      }).not.toThrow();
    });

    it('should work when adding plugin with non-optional config', () => {
      expect(() => {
        // @ts-expect-error
        new EditorPresetBuilder().add(PluginWithMandatoryConfig);

        // @ts-expect-error
        new EditorPresetBuilder().add([PluginWithMandatoryConfig]);

        new EditorPresetBuilder().add([
          PluginWithMandatoryConfig,
          { treatsPerBite: 5, requiresPats: true },
        ]);
      }).not.toThrow();
    });
  });

  it('should type-error on basic plugin inferred config', () => {
    expect(() => {
      new EditorPresetBuilder().add([
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
      new EditorPresetBuilder()
        .add(PluginDog)
        // @ts-expect-error
        .add([PluginBarkWithMandatoryConfig]);
    }).not.toThrow();
  });

  it('should type-error on `NextEditorPlugin` inferred config', () => {
    expect(() => {
      new EditorPresetBuilder().add(PluginDog).add([
        PluginBarkWithMandatoryConfig,
        {
          // @ts-expect-error
          nonExistentProperty: true,
        },
      ]);
      new EditorPresetBuilder().add(PluginDog).add([
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
      new EditorPresetBuilder().add(PluginDog).add([
        PluginBarkWithMandatoryConfig,
        {
          enabled: true,
        },
      ]);
    }).not.toThrow();
  });

  it('builds when calling `add` with plugin inside an array', () => {
    expect(() => {
      new EditorPresetBuilder()
        .add(PluginDog)
        .add([PluginBarkWithMandatoryConfig, { enabled: false }])
        .add(PluginRelyingOnPluginBarkWithMandatoryConfig);
    }).not.toThrow();
  });

  describe('when PluginDog was not add prior', () => {
    it('should type-error on PluginBark and PluginBarkLoud', () => {
      expect(() => {
        new EditorPresetBuilder()
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
        new EditorPresetBuilder()
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
        new EditorPresetBuilder()
          .add(PluginDog)
          .add(PluginBark)
          .add(PluginBarkLoud);
      }).not.toThrow();
    });
  });
});

describe('building a builder', () => {
  const plugin1: NextEditorPlugin<
    'one',
    { sharedState: number; pluginConfiguration: number }
  > = ({ api }) => {
    return {
      name: 'one',
      getSharedState(editorState) {
        return 99;
      },
    };
  };
  const plugin2: NextEditorPlugin<
    'two',
    {
      dependencies: [typeof plugin1];
    }
  > = ({ api }) => {
    // eslint-disable-next-line no-console
    console.log('two', api);
    api?.one.sharedState.currentState();
    return {
      name: 'two',
    };
  };

  const plugin3: NextEditorPlugin<
    'three',
    {
      dependencies: [typeof plugin2];
    }
  > = ({ api }) => {
    // eslint-disable-next-line no-console
    console.log('three', api);
    api?.two.sharedState.currentState();
    return {
      name: 'three',
    };
  };

  const plugin4: NextEditorPlugin<
    'four',
    {
      dependencies: [typeof plugin3];
    }
  > = ({ api }) => {
    return {
      name: 'four',
    };
  };

  const plugin5: NextEditorPlugin<
    'five',
    {
      dependencies: [typeof plugin4];
      pluginConfiguration: 5;
    }
  > = ({ api }) => {
    return {
      name: 'five',
    };
  };

  describe('when adding all dependents plugins using the same instance chain', () => {
    it('should not throw an error', () => {
      expect(() => {
        new EditorPresetBuilder()
          .add([plugin1, 111])
          .add(plugin2)
          .add(plugin3)
          .add(plugin4)
          .add([plugin5, 5]);
      }).not.toThrow();
    });
  });

  describe('when trying to add all required plugins using next building instances', () => {
    it('should work normally', () => {
      expect(() => {
        const b = new EditorPresetBuilder();
        const b1 = b.add([plugin1, 111]);

        const b2 = b1.add(plugin2);
        const b3 = b2.add(plugin3);
        const b4 = b3.add(plugin4);
        b4.add([plugin5, 5]);
      }).not.toThrow();
    });
  });

  describe('EditorEditorPresetBuilder.maybeAdd', () => {
    describe('when a builder was created conditionally', () => {
      it.todo(
        'TODO: ED-17023 - should throw should type-error when try to add a dependency plugin',
      );
      it.skip('should throw should type-error when try to add a dependency plugin', () => {
        const randomNumber = 99;

        expect(() => {
          const maybeEditorPresetBuilderWithPlugin3 = new EditorPresetBuilder()
            .add([plugin1, 111])
            .add(plugin2)
            .maybeAdd(plugin3, (pluginToAdd, builder) => {
              if (randomNumber % 2 === 0) {
                return builder.add(plugin3);
              }

              return builder;
            });

          // maybeEditorPresetBuilderWithPlugin3 can or can not have the plugin3
          // So, you can't add it directly
          // TODO: ED-17023 - Bring back type safety to the EditorPresetBuilder.add preset
          // ts-expect-error
          maybeEditorPresetBuilderWithPlugin3.add(plugin4);
        }).not.toThrow();
      });
    });

    describe('when there is no valid type in the builder type union', () => {
      it('should force the callback builder parameter type to be never ', () => {
        expect(() => {
          new EditorPresetBuilder()
            .add([plugin1, 111])
            .add(plugin2)
            .maybeAdd(plugin4, (plugin, builder) => {
              // plugin4 depends on plugin3
              // but it wasn't part of the builder type union
              // TODO: ED-17023 - Bring back type safety to the EditorPresetBuilder.add preset
              // ts-expect-error
              builder.add(plugin);

              return builder;
            });
        }).not.toThrow();
      });
    });

    describe('when there a valid type in the builder type union', () => {
      it('should cast the callback builder to a valid combination ', () => {
        expect(() => {
          new EditorPresetBuilder()
            .add([plugin1, 111])
            .add(plugin2)

            .maybeAdd(plugin3, (pluginToAdd, builder) => {
              return builder.add(pluginToAdd);
            })
            .maybeAdd(plugin4, (plugin, builder) => {
              // plugin4 depends on plugin3
              // The current EditorPresetBuilder instance should have at least a valid type combination,
              // something like this below:
              // builder instance:
              //  | EditorPresetBuilder<['one', 'two'], [/* ... */]>
              //  | EditorPresetBuilder<['one', 'two', 'three'], [/* ... */]>
              builder.add(plugin);

              return builder;
            });
        }).not.toThrow();
      });
    });
  });

  describe('Plugin with optional dependencies', () => {
    const pluginWithoutDependencies: NextEditorPlugin<
      'withoutDependencies'
    > = ({ api }) => {
      return {
        name: 'withoutDependencies',
      };
    };

    const pluginWithOptionalDependencies: NextEditorPlugin<
      'withOptionalDeps',
      {
        dependencies: [
          typeof plugin1,
          OptionalPlugin<typeof plugin2>,
          typeof pluginWithoutDependencies,
        ];
      }
    > = ({ api }) => {
      api?.one.sharedState.currentState();

      // @ts-expect-error Two is optional so should be unwrapped to access
      api?.two.sharedState.currentState();

      api?.two?.sharedState.currentState();

      api?.withoutDependencies.sharedState.currentState();

      // @ts-expect-error We shouldn't be able to access anything that doesn't exist as a dependency
      api?.five.sharedState.currentState();

      // @ts-expect-error Should still fail if optional
      api?.five?.sharedState.currentState();
      return {
        name: 'withOptionalDeps',
      };
    };

    const pluginWithOptionalDependenciesComplex: NextEditorPlugin<
      'withOptionalDepsComplex',
      {
        dependencies: [
          typeof plugin1,
          OptionalPlugin<typeof plugin2>,
          typeof pluginWithoutDependencies,
          OptionalPlugin<typeof plugin3>,
        ];
      }
    > = ({ api }) => {
      api?.one.sharedState.currentState();

      // @ts-expect-error Three is optional so should be unwrapped to access
      api?.three.sharedState.currentState();

      api?.three?.sharedState.currentState();
      return {
        name: 'withOptionalDepsComplex',
      };
    };

    const pluginDependingOn: NextEditorPlugin<
      'dependingOnOptional',
      {
        dependencies: [
          typeof plugin1,
          OptionalPlugin<typeof pluginWithOptionalDependenciesComplex>,
        ];
        actions: {
          doesSomething: () => void;
        };
      }
    > = ({ api }) => {
      api?.one.sharedState.currentState();

      // @ts-expect-error Three is optional so should be unwrapped to access
      api?.withOptionalDepsComplex.sharedState.currentState();

      api?.withOptionalDepsComplex?.sharedState.currentState();

      // Actions should be typed appropriately
      api?.dependingOnOptional.actions.doesSomething();

      // @ts-expect-error
      api?.dependingOnOptional.actions.doesNothing();

      return {
        name: 'dependingOnOptional',
        actions: {
          doesSomething: () => {},
        },
      };
    };

    it('should be able to add if the optional dependency is not available', () => {
      expect(() => {
        new EditorPresetBuilder()
          .add([plugin1, 111])
          // .add(plugin2)
          .add(pluginWithoutDependencies)
          .add(pluginWithOptionalDependencies);
      }).not.toThrow();
    });

    it('should be able to add if the optional dependency is not available ', () => {
      expect(() => {
        new EditorPresetBuilder()
          .add([plugin1, 111])
          // .add(plugin2)
          // .add(plugin3)
          .add(pluginWithoutDependencies)
          .add(pluginWithOptionalDependenciesComplex);
      }).not.toThrow();
    });

    it('should be able to add if the optional dependency is not available', () => {
      expect(() => {
        new EditorPresetBuilder()
          .add([plugin1, 111])
          // .add(plugin2)
          // @ts-expect-error This should require plugin 2
          .add(plugin3)
          .add(pluginWithoutDependencies)
          .add(pluginWithOptionalDependenciesComplex);
      }).not.toThrow();
    });

    it('should be able to ignore required dependencies of optional plugins', () => {
      expect(() => {
        new EditorPresetBuilder().add([plugin1, 111]).add(pluginDependingOn);
      }).not.toThrow();
    });

    it('should be able to add if the optional dependency is available', () => {
      expect(() => {
        new EditorPresetBuilder()
          .add([plugin1, 111])
          .add(plugin2)
          .add(pluginWithoutDependencies)
          .add(pluginWithOptionalDependencies);
      }).not.toThrow();
    });

    it('should not be able to add if required depedencies are not available', () => {
      expect(() => {
        new EditorPresetBuilder()
          .add([plugin1, 111])
          .add(plugin2)
          // @ts-expect-error It's missing pluginWithoutDependencies
          .add(pluginWithOptionalDependencies);
      }).not.toThrow();
    });

    it('should not be able to add if required depedencies are not available', () => {
      expect(() => {
        new EditorPresetBuilder()
          // .add([plugin1, 111])
          // @ts-expect-error It's missing plugin1 dependency
          .add(plugin2)
          .add(pluginWithoutDependencies)
          // @ts-expect-error It's missing pluginWithoutDependencies
          .add(pluginWithOptionalDependencies);
      }).not.toThrow();
    });
  });
});
