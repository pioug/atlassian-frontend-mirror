import React, { Ref, useLayoutEffect, useRef, useState } from 'react';

import { fireEvent } from '@testing-library/dom';
import {
  InteractionTaskArgs,
  PublicInteractionTask,
} from 'storybook-addon-performance';

import ButtonItem from '../../src/components/item/button-item';
import CustomItem from '../../src/components/item/custom-item';
import LinkItem from '../../src/components/item/link-item';
import {
  CustomItemComponentProps,
  CustomItemProps,
} from '../../src/components/types';

export default {
  title: 'Menu',
};

type ItemComponentProps =
  | React.ComponentType<React.AllHTMLAttributes<HTMLElement>>
  | React.ElementType;

function Example({
  Component,
  displayName,
}: {
  Component: ItemComponentProps;
  displayName: string;
}) {
  const [isSelected, setIsSelected] = useState<boolean>(false);
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const ref = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    function toggleSelect() {
      setIsSelected(value => !value);
    }
    function toggleDisabled() {
      setIsDisabled(value => !value);
    }

    const el: HTMLElement | null = ref.current;
    if (!el) {
      throw new Error('Could not find button ref');
    }

    el.addEventListener('toggle-select', toggleSelect);
    el.addEventListener('toggle-disabled', toggleDisabled);

    return () => {
      el.removeEventListener('toggle-select', toggleSelect);
      el.removeEventListener('toggle-disabled', toggleDisabled);
    };
  }, []);

  return (
    <Component
      ref={ref}
      testId="menu-item"
      isSelected={isSelected}
      isDisabled={isDisabled}
    >
      {displayName}
    </Component>
  );
}

const interactionTasks: PublicInteractionTask[] = [
  {
    name: 'Click a menu item',
    description:
      'Recording how long a mousedown + click event take to be processed',
    run: async ({ container }: InteractionTaskArgs): Promise<void> => {
      const menuItem: HTMLElement | null = container.querySelector(
        '[data-testid="menu-item"]',
      );
      if (menuItem == null) {
        throw new Error('Could not find a menu item element');
      }

      fireEvent.mouseDown(menuItem);
      fireEvent.click(menuItem);
    },
  },
  {
    name: 'Focus on a menu item',
    description: 'Focus on a menu item and wait for layout and paint to finish',
    run: async ({
      container,
      controls,
    }: InteractionTaskArgs): Promise<void> => {
      const menuItem: HTMLElement | null = container.querySelector(
        '[data-testid="menu-item"]',
      );
      if (menuItem == null) {
        throw new Error('Could not find a menu item element');
      }

      await controls.time(async () => {
        fireEvent.focus(menuItem);
        fireEvent.blur(menuItem);
      });
    },
  },
  {
    name: 'Select a menu item',
    description: 'Trigger the selection of a menu item',
    run: async ({
      container,
      controls,
    }: InteractionTaskArgs): Promise<void> => {
      const menuItem: HTMLElement | null = container.querySelector(
        '[data-testid="menu-item"]',
      );

      if (menuItem == null) {
        throw new Error('Could not find a menu item element');
      }

      await controls.time(async () => {
        fireEvent(menuItem, new Event('toggle-select'));
      });
    },
  },
  {
    name: 'Disable a menu item',
    description: 'Trigger the disabling of a menu item',
    run: async ({
      container,
      controls,
    }: InteractionTaskArgs): Promise<void> => {
      const menuItem: HTMLElement | null = container.querySelector(
        '[data-testid="menu-item"]',
      );
      if (menuItem == null) {
        throw new Error('Could not find a menu item element');
      }

      const beforeState =
        menuItem.getAttribute('aria-disabled') ||
        menuItem.getAttribute('disabled');

      if (beforeState === 'true') {
        throw new Error('Should not be disabled before the test begins');
      }

      await controls.time(async () => {
        fireEvent(menuItem!, new Event('toggle-disabled'));
      });

      const afterState =
        menuItem.getAttribute('aria-disabled') ||
        menuItem.getAttribute('disabled');

      if (afterState === 'false') {
        throw new Error('Should be disabled after the test finished');
      }
    },
  },
];

export const buttonItem = () => (
  <Example Component={ButtonItem} displayName="Button item" />
);

buttonItem.story = {
  name: 'Button item',
  parameters: {
    performance: {
      interactions: interactionTasks,
    },
  },
};

export const linkItem = () => (
  <Example Component={LinkItem} displayName="Link item" />
);

linkItem.story = {
  name: 'Link item',
  parameters: {
    performance: {
      interactions: interactionTasks,
    },
  },
};

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

export const customItem = () => (
  <Example Component={CustomItemEmphasis} displayName="Custom item" />
);

customItem.story = {
  name: 'Custom item',
  parameters: {
    performance: {
      interactions: interactionTasks,
    },
  },
};
