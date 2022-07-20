import React, { useState } from 'react';
import { IntlProvider } from 'react-intl-next';
import Button from '@atlaskit/button';
import Popup from '@atlaskit/popup';

import { LinkPicker } from '../src';

export default function RootErrorBoundary() {
  const [isOpen, setIsOpen] = useState(true);

  const handleToggle = () => setIsOpen(!isOpen);

  return (
    <div className="example" style={{ padding: 50 }}>
      <IntlProvider locale="en">
        <Popup
          isOpen={isOpen}
          autoFocus={false}
          onClose={handleToggle}
          content={props => (
            <div>
              <LinkPicker
                {...props}
                // commit a crime to reap our punishment
                url={new URL('https://atlassian.com') as any}
                onSubmit={() => {}}
                onCancel={() => {}}
              />
            </div>
          )}
          placement="bottom-start"
          trigger={({ ref, ...triggerProps }) => (
            <Button
              {...triggerProps}
              ref={ref}
              appearance="primary"
              isSelected={isOpen}
              onClick={handleToggle}
            >
              Toggle
            </Button>
          )}
        />
      </IntlProvider>
    </div>
  );
}
