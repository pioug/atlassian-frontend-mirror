import React, { useState } from 'react';
import { IntlProvider } from 'react-intl-next';
import Button from '@atlaskit/button';

import { LinkPicker } from '../src';

type OnSubmitPayload = Parameters<
  Required<React.ComponentProps<typeof LinkPicker>>['onSubmit']
>[0];

export default function NoPlugins() {
  const [link, setLink] = useState<OnSubmitPayload>({
    url: '',
    displayText: null,
    title: null,
    meta: {
      inputMethod: 'manual',
    },
  });
  const [isLinkPickerVisible, setIsLinkPickerVisible] = useState(true);
  const onSubmit = (payload: OnSubmitPayload) => {
    setLink(payload);
    setIsLinkPickerVisible(false);
  };

  const onToggle = () => {
    setIsLinkPickerVisible(!isLinkPickerVisible);
  };

  const linkPicker = isLinkPickerVisible && (
    <LinkPicker onSubmit={onSubmit} onCancel={onToggle} />
  );

  return (
    <div className="example" style={{ padding: 50 }}>
      <IntlProvider locale="en">
        <Button onClick={onToggle} appearance="primary">
          Toggle
        </Button>
        <div>
          <a href={link.url} target="_blank">
            {link.displayText || link.url}
          </a>
        </div>
        {linkPicker}
      </IntlProvider>
    </div>
  );
}
