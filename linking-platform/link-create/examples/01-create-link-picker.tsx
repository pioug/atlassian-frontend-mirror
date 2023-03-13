import React, { SyntheticEvent, useMemo, useState } from 'react';

import { IntlProvider } from 'react-intl-next';

import Button from '@atlaskit/button';
import { LinkPicker } from '@atlaskit/link-picker';
import { CardClient, SmartCardProvider } from '@atlaskit/link-provider';
import Popup from '@atlaskit/popup';
import { confluencePageLinkCreatePlugin } from '@atlassian/link-create-confluence';
import {
  LinkPickerCreateOnSubmitHandler,
  LinkPickerCreateOnSubmitParameter,
  useLinkPickerCreate,
} from '@atlassian/link-picker-plugins';
import { mockEndpoints } from '@atlassian/recent-work-client/mocks';

import LinkCreate from '../src';
import { LinkCreateCallbackProvider } from '../src/controllers/callback-context';

const smartCardClient = new CardClient('staging');

mockEndpoints();

function LinkPickerCreate() {
  const [showPicker, setShowPicker] = useState(true);
  const [link, setLink] = useState<LinkPickerCreateOnSubmitParameter>({
    url: '',
    displayText: null,
    title: null,
    meta: {
      inputMethod: 'manual',
    },
  });

  const linkPickerCreateconfigs = useMemo(
    () => [
      {
        product: 'confluence',
        activityClientEndpoint:
          'https://start.stg.atlassian.com/gateway/api/graphql',
        aggregatorUrl:
          'https://pug.jira-dev.com/gateway/api/xpsearch-aggregator',
        cloudId: 'DUMMY-a5a01d21-1cc3-4f29-9565-f2bb8cd969f5',
        create: confluencePageLinkCreatePlugin,
      },
    ],
    [],
  );

  const handleToggle = () => setShowPicker(!showPicker);
  const handleClick = (e: SyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowPicker(true);
  };

  const onCancel = () => setShowPicker(false);
  const onSubmit: LinkPickerCreateOnSubmitHandler = payload => {
    setLink(payload);
    setShowPicker(false);
  };

  const { createProps, pickerProps } = useLinkPickerCreate(
    onSubmit,
    onCancel,
    linkPickerCreateconfigs,
  );

  return (
    <div className="example" style={{ padding: 50 }}>
      <div style={{ paddingBottom: 20 }}>
        <a id="test-link" href={link.url} target="_blank" onClick={handleClick}>
          {link.displayText || link.url}
        </a>
      </div>
      <Popup
        isOpen={showPicker && !createProps.active}
        autoFocus={false}
        onClose={onCancel}
        content={({ update }) => (
          //....
          <LinkPicker
            {...pickerProps}
            url={link.url}
            displayText={link.displayText}
            onContentResize={update}
          />
        )}
        placement="right-start"
        trigger={props => (
          <Button
            {...props}
            testId="trigger"
            appearance="primary"
            isSelected={showPicker}
            onClick={handleToggle}
          >
            toggle
          </Button>
        )}
      />
      <LinkCreate {...createProps} />
    </div>
  );
}

export default function Create() {
  return (
    <SmartCardProvider client={smartCardClient}>
      <LinkCreateCallbackProvider>
        <IntlProvider locale="en">
          <LinkPickerCreate />
        </IntlProvider>
      </LinkCreateCallbackProvider>
    </SmartCardProvider>
  );
}
