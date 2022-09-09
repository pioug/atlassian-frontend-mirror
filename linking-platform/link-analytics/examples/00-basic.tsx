import React, { SyntheticEvent, useState } from 'react';
import { IntlProvider } from 'react-intl-next';
import Button from '@atlaskit/button';
import Popup from '@atlaskit/popup';
import { useSmartLinkLifecycleAnalytics } from '@atlaskit/link-analytics';
import { LinkPicker, LinkPickerProps } from '@atlaskit/link-picker';

type OnSubmitPayload = Parameters<LinkPickerProps['onSubmit']>[0];

export default function LifecycleAnalytics() {
  const [isOpen, setIsOpen] = useState(true);
  const [link, setLink] = useState<OnSubmitPayload>({
    url: '',
    displayText: null,
    title: null,
    meta: {
      inputMethod: 'manual',
    },
  });

  const { linkCreated } = useSmartLinkLifecycleAnalytics();

  const handleToggle = () => setIsOpen(!isOpen);

  const handleSubmit: LinkPickerProps['onSubmit'] = (payload, analytic) => {
    linkCreated(payload, analytic);
    setLink(payload);
    setIsOpen(false);
  };

  const handleClick = (e: SyntheticEvent) => {
    e.preventDefault();
    setIsOpen(true);
  };

  return (
    <div className="example" style={{ padding: 50 }}>
      <IntlProvider locale="en">
        <Popup
          isOpen={isOpen}
          autoFocus={false}
          onClose={handleToggle}
          content={({ update }) => (
            <LinkPicker
              url={link.url}
              displayText={link.displayText}
              onSubmit={handleSubmit}
              onCancel={handleToggle}
              onContentResize={update}
            />
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
        <a onClick={handleClick} href={link.url} target="_blank">
          {link.displayText || link.url}
        </a>
      </IntlProvider>
    </div>
  );
}
