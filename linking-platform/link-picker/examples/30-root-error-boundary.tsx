import React, { useState } from 'react';

import Button from '@atlaskit/button';
import Popup from '@atlaskit/popup';

import { LinkPicker } from '../src';
import { PageHeader, PageWrapper } from '../example-helpers/common';

export default function RootErrorBoundary() {
  const [isOpen, setIsOpen] = useState(true);

  const handleToggle = () => setIsOpen(!isOpen);

  return (
    <PageWrapper>
      <PageHeader>
        <p>
          <b>Root Error boundary</b>, displayed when the component throws
          internally.
        </p>
      </PageHeader>
      <Popup
        isOpen={isOpen}
        autoFocus={false}
        onClose={handleToggle}
        content={({ update }) => (
          <LinkPicker
            // commit a crime to reap our punishment
            url={new URL('https://atlassian.com') as any}
            onSubmit={() => {}}
            onCancel={() => {}}
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
    </PageWrapper>
  );
}
