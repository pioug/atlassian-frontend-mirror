import React from 'react';

import { Stack } from '@atlaskit/primitives';
import SectionMessage from '@atlaskit/section-message';

// This file exists to provide a consistent warning for our guideline pages.
// Also, doing it likes this gives us the opportunity to make it look nicer too.

export function GuidelinesAreOutOfDate() {
  return (
    <SectionMessage appearance="warning" title="This page is out of date">
      <Stack space="space.200">
        <div>
          We have made some recent <em>(fantastic)</em> improvements to our
          design and accessibility guidelines for drag and drop, through a
          partnership between Jira and the Design System. These new guidelines
          have been approved by senior design and accessibility leadership.
        </div>
        <div>
          This page has not yet been updated to reflect our new guidelines.
        </div>
        <div>
          You can find the latest guidelines here:{' '}
          <a
            href="https://go/pragmatic-drag-and-drop-guidelines"
            target="_blank"
          >
            go/pragmatic-drag-and-drop-guidelines
          </a>
        </div>
        <div>
          This page will be updated in early 2024 to reflect our new guidelines.
          In the meantime, please use to the page linked above as the source of
          truth.
        </div>
      </Stack>
    </SectionMessage>
  );
}
