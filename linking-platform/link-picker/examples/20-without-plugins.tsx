import React, { SyntheticEvent, useState } from 'react';
import { IntlProvider } from 'react-intl-next';
import Button from '@atlaskit/button';
import Popup from '@atlaskit/popup';

import { LinkPicker } from '../src';

type OnSubmitPayload = Parameters<
  Required<React.ComponentProps<typeof LinkPicker>>['onSubmit']
>[0];

export default function InPopup() {
  const [isOpen, setIsOpen] = useState(true);
  const [link, setLink] = useState<OnSubmitPayload>({
    url: '',
    displayText: null,
    title: null,
    meta: {
      inputMethod: 'manual',
    },
  });

  const handleToggle = () => setIsOpen(!isOpen);

  const handleSubmit = (payload: OnSubmitPayload) => {
    setLink(payload);
    setIsOpen(false);
  };

  const handleClick = (e: SyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(true);
  };

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
                url={link.url}
                displayText={link.displayText}
                onSubmit={handleSubmit}
                onCancel={handleToggle}
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
        <div onClick={handleClick}>
          <a href={link.url} target="_blank">
            {link.displayText || link.url}
          </a>
        </div>
      </IntlProvider>
    </div>
  );
}
