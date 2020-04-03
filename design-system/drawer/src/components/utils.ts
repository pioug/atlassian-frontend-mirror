// This file is a copy paste from @atlaskit/checkbox/src/utils
// This duplicate code should be handled by the following issue
// https://ecosystem.atlassian.net/jira/servicedesk/projects/DS/issue/DS-7036
export const defaultAttributesFn = <T extends Record<string, any>>(
  p?: T,
): Record<string, any> => ({});

type OverridesFunc<
  X extends Record<string, any>,
  Y extends Record<string, any>
> = (key: string) => Record<string, any>;
export type ExtenderType = <
  D extends Record<string, any>,
  O extends Record<string, any>
>(
  d: D,
  o?: O,
) => OverridesFunc<D, O>;

export const createExtender: ExtenderType = function createExtender<
  DefaultType extends Record<string, any>,
  OverridesType extends Record<string, any>
>(
  defaults: DefaultType,
  /** We're defaulting to an Object.create call here to circumvent
   *  the fact that {} can't be reconciled
   *  with a type that extends Record<string, any>
   *
   *  By doing this, we are intentionally disallowing users
   *  from nullifying a particular component in the tree.
   *  This can be reverted with additional logic,
   *  at such a time as this nullification becomes an actual usecase.
   * */
  overrides: OverridesType = Object.create(Object.prototype),
) {
  if (!defaults) {
    throw new Error(
      'a default set of overrides *must* be passed in as the first argument',
    );
  }
  return function getOverrides(key: string) {
    const {
      cssFn: defaultCssFn,
      component: defaultComponent,
    }: DefaultType[keyof DefaultType] = defaults[key];
    if (!overrides[key]) {
      return {
        cssFn: defaultCssFn,
        component: defaultComponent,
      };
    }
    const { cssFn: customCssFn, component: customComponent } = overrides[key];
    const composedCssFn = <State>(state: State) => {
      return customCssFn(defaultCssFn(state), state);
    };
    return {
      cssFn: customCssFn ? composedCssFn : defaultCssFn,
      component: customComponent || defaultComponent,
    };
  };
};
