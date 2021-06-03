import React from 'react';

import Button from '@atlaskit/button';

import Popup from '../src';

function PopupStoryButtonOpen() {
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
      trigger={(triggerProps) => (
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

PopupStoryButtonOpen.story = {
  name: 'Open Popup @atlaskit/button',
};

export default PopupStoryButtonOpen;
