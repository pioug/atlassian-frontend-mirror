import React from 'react';

import Popup from '../src';

import { interactionTasks } from './utils/interaction-tasks';

function PopupStory() {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <Popup
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      content={() => <div data-testid="popup"> Test</div>}
      trigger={(triggerProps) => (
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

PopupStory.story = {
  name: 'Popup',
  parameters: {
    performance: {
      interactions: interactionTasks,
    },
  },
};

export default PopupStory;
