import { createAddingPropFor } from '../utils';

export const addingDefaultCheckedToStateful = createAddingPropFor(
  '@atlaskit/toggle',
  {
    prop: 'defaultChecked',
    defaultValue: false,
  },
);
