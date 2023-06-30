import React from 'react';

import Button from '@atlaskit/button';
import { MockLinkPickerPlugin } from '@atlaskit/link-test-helpers/link-picker';
import Popup from '@atlaskit/popup';

import { PageWrapper } from '../example-helpers/common';
import { LinkPicker } from '../src';

const plugins = [new MockLinkPickerPlugin()];

export default function VrSinglePlugin() {
  return (
    <PageWrapper>
      <Popup
        isOpen={true}
        autoFocus={false}
        onClose={() => {}}
        content={() => (
          <LinkPicker
            plugins={plugins}
            onSubmit={() => {}}
            onCancel={() => {}}
          />
        )}
        placement="bottom-start"
        trigger={({ ref, ...triggerProps }) => (
          <Button {...triggerProps} ref={ref} appearance="primary" isSelected>
            Toggle
          </Button>
        )}
      />
    </PageWrapper>
  );
}
