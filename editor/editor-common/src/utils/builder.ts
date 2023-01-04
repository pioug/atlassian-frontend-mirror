import type { AllBuilderPlugins, SafePresetCheck } from '../types';

export class Builder<
  T extends { name: string },
  StackPlugins extends AllBuilderPlugins[] = [],
> {
  public readonly data: [...StackPlugins];
  constructor(...more: [...StackPlugins]) {
    this.data = [...more] || [];
  }
  add<NewPlugin extends AllBuilderPlugins>(
    nextOrTuple: SafePresetCheck<NewPlugin, StackPlugins>,
  ): Builder<T, [...[NewPlugin], ...StackPlugins]> {
    return new Builder<T, [...[NewPlugin], ...StackPlugins]>(
      /**
       * re-cast this to NewPlugin as we've done all the type
       * safety, dependency checking, narrowing, during
       * `SafePresetCheck & VerifyPluginDependencies`
       */
      nextOrTuple as NewPlugin,
      ...this.data,
    );
  }
}
