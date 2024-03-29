export const restrictedPaths = [
  {
    path: '@atlaskit/button/unsafe',
    message: `The '@atlaskit/button/unsafe' export is for internal usage and testing of new button features and should not be consumed directly.`,
  },
  {
    path: '@atlaskit/ds-lib',
    message: `The '@atlaskit/ds-lib' library has been designed as a utility library for internal usage and should not be consumed directly.`,
  },
  {
    path: '@atlaskit/ds-explorations',
    message: `The @atlaskit/ds-explorations package is used for experiments and should not be consumed directly.`,
  },
  {
    path: '@atlaskit/primitives/pressable',
    message: `The @atlaskit/primitives/pressable export is currently under development and should not be consumed directly.`,
  },
];
