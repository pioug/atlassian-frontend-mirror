import React, { Ref } from 'react';

import CustomItem from '../src/menu-item/custom-item';
import type { CustomItemComponentProps, CustomItemProps } from '../src/types';

import Example from './utils/example-runner';
import { interactionTasks } from './utils/interaction-tasks';

const Emphasis = React.forwardRef(
  (props: CustomItemComponentProps, ref: Ref<HTMLElement>) => (
    <em {...props} ref={ref} />
  ),
);

const CustomItemEmphasis = React.forwardRef(
  (props: CustomItemProps, ref: Ref<HTMLElement | null>) => {
    return <CustomItem component={Emphasis} {...props} ref={ref} />;
  },
);

const customItem = () => (
  <Example Component={CustomItemEmphasis} displayName="Custom item" />
);

customItem.story = {
  name: 'Custom Item',
  parameters: {
    performance: {
      interactions: interactionTasks,
    },
  },
};

export default customItem;
