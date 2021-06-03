import React from 'react';

import Button from '@atlaskit/button';

import Popup from '../src';

import { interactionTasks } from './utils/interaction-tasks';

function PopupStoryButton() {
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
      trigger={(triggerProps) => (
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

PopupStoryButton.story = {
  name: 'Popup @atlaskit/button',
  parameters: {
    performance: {
      interactions: interactionTasks,
    },
  },
};

export default PopupStoryButton;
