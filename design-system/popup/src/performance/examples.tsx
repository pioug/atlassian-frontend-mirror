import React from 'react';

import { findByTestId, fireEvent } from '@testing-library/dom';
import {
  InteractionTaskArgs,
  PublicInteractionTask,
} from 'storybook-addon-performance';

import Button from '@atlaskit/button';

import Popup from '../index';

export function PopupStory() {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <Popup
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      content={() => <div data-testid="popup"> Test</div>}
      trigger={triggerProps => (
        //@ts-ignore https://product-fabric.atlassian.net/browse/DST-1866
        <button
          data-testid="popup-trigger"
          {...triggerProps}
          onClick={() => setIsOpen(!isOpen)}
        >
          Click to toggle
        </button>
      )}
      placement="bottom"
    />
  );
}

export function PopupStoryButton() {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <Popup
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      content={() => (
        <div data-testid="popup">
          <Button>Test</Button>
        </div>
      )}
      trigger={triggerProps => (
        <Button
          testId="popup-trigger"
          {...triggerProps}
          onClick={() => {
            setIsOpen(!isOpen);
          }}
        >
          Click to toggle
        </Button>
      )}
      placement="bottom"
    />
  );
}

export function PopupStoryButtonOpen() {
  const [isOpen, setIsOpen] = React.useState(true);
  return (
    <Popup
      isOpen={true}
      onClose={() => setIsOpen(isOpen)}
      content={() => (
        <div data-testid="popup">
          <Button>Test</Button>
        </div>
      )}
      trigger={triggerProps => (
        <Button
          testId="popup-trigger"
          {...triggerProps}
          onClick={() => setIsOpen(!isOpen)}
        >
          Click to toggle
        </Button>
      )}
      placement="bottom"
    />
  );
}

const interactionTasks: PublicInteractionTask[] = [
  {
    name: 'Click the trigger',
    description: 'Recording how long a click event take to be processed',
    run: async ({
      container,
      controls,
    }: InteractionTaskArgs): Promise<void> => {
      const popup: HTMLElement | null = container.querySelector(
        '[data-testid="popup-trigger"]',
      );
      if (popup == null) {
        throw new Error('Could not find popup element');
      }

      await controls.time(async () => {
        // fireEvent.mouseDown(popup);
        fireEvent.click(popup);
      });
    },
  },
  {
    name: 'Open Popup',
    description: 'Recording how long the popup takes to appear',
    run: async ({
      container,
      controls,
    }: InteractionTaskArgs): Promise<void> => {
      const popup: HTMLElement | null = container.querySelector(
        '[data-testid="popup-trigger"]',
      );
      if (popup == null) {
        throw new Error('Could not find popup element');
      }
      const parent: HTMLElement | null = container.parentElement;
      if (parent == null) {
        throw new Error('Could not find parent element');
      }
      const existingPopup = parent.querySelector('[data-testid="popup"]');
      if (existingPopup != null) {
        throw new Error('Unexpected popup found');
      }

      await controls.time(async () => {
        fireEvent.click(popup);

        await findByTestId(parent, 'popup');
      });
    },
  },
];

PopupStory.story = {
  name: 'Popup',
  parameters: {
    performance: {
      interactions: interactionTasks,
    },
  },
};

PopupStoryButton.story = {
  name: 'Popup @atlaskit/button',
  parameters: {
    performance: {
      interactions: interactionTasks,
    },
  },
};

PopupStoryButtonOpen.story = {
  name: 'Open Popup @atlaskit/button',
};
