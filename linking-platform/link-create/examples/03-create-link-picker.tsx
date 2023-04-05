import React, { useMemo, useState } from 'react';

import { IntlProvider } from 'react-intl-next';

import Button from '@atlaskit/button/standard-button';
import LinkCreate from '@atlaskit/link-create';
import { LinkPicker } from '@atlaskit/link-picker';
import Popup from '@atlaskit/popup';
import { confluencePageLinkCreatePlugin } from '@atlassian/link-create-confluence';
import {
  LinkPickerCreateOnSubmitHandler,
  useLinkPickerCreate,
} from '@atlassian/link-picker-plugins';

const LinkPickerCreate = () => {
  const [showPicker, setShowPicker] = useState(true);

  // Plugin configuration
  const linkPickerCreateconfigs = useMemo(
    () => [
      {
        product: 'confluence',
        cloudId: 'DUMMY-a5a01d21-1cc3-4f29-9565-f2bb8cd969f5',
        create: confluencePageLinkCreatePlugin,
      },
    ],
    [],
  );

  // Event handlers
  const onCancel = () => setShowPicker(false);
  const onSubmit: LinkPickerCreateOnSubmitHandler = payload =>
    console.log(payload);

  // Hook
  const { createProps, pickerProps } = useLinkPickerCreate(
    onSubmit,
    onCancel,
    linkPickerCreateconfigs,
  );

  return (
    <>
      <Popup
        isOpen={showPicker}
        autoFocus={false}
        onClose={onCancel}
        content={() => <LinkPicker {...pickerProps} />}
        trigger={props => (
          <Button
            {...props}
            appearance="primary"
            onClick={() => setShowPicker(!showPicker)}
          >
            Toggle
          </Button>
        )}
      />
      <LinkCreate {...createProps} />
    </>
  );
};

export default function Create() {
  return (
    <IntlProvider locale="en">
      <LinkPickerCreate />
    </IntlProvider>
  );
}
