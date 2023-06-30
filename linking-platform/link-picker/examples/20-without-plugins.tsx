import React, { Fragment, SyntheticEvent, useState } from 'react';

import Button from '@atlaskit/button';
import Popup from '@atlaskit/popup';
import { token } from '@atlaskit/tokens';

import { PageHeader, PageWrapper } from '../example-helpers/common';
import { LinkPicker } from '../src';

type OnSubmitPayload = Parameters<
  Required<React.ComponentProps<typeof LinkPicker>>['onSubmit']
>[0];

function WithoutPlugins() {
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

  const linkPickerInPopup = (
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
      placement="right-start"
      trigger={({ ref, ...triggerProps }) => (
        <Button
          {...triggerProps}
          ref={ref}
          appearance="primary"
          isSelected={isOpen}
          onClick={handleToggle}
        >
          {isOpen ? '-' : '+'}
        </Button>
      )}
    />
  );

  return (
    <Fragment>
      <PageHeader>
        <p>
          <b>LinkPicker</b> without search, used as an interface to submit a
          valid link with custom display text.
        </p>
      </PageHeader>
      <div style={{ paddingBottom: token('space.250', '20px') }}>
        <a id="test-link" href={link.url} target="_blank" onClick={handleClick}>
          {link.displayText || link.url}
        </a>
      </div>
      {linkPickerInPopup}
    </Fragment>
  );
}

export default function WithoutPluginsWrapper() {
  return (
    <PageWrapper>
      <WithoutPlugins />
    </PageWrapper>
  );
}
