import React, { useState } from 'react';

import { IntlProvider } from 'react-intl-next';

import Button from '@atlaskit/button/standard-button';
import { LinkPicker } from '@atlaskit/link-picker';
import Popup from '@atlaskit/popup';

import { MockPluginForm } from '../example-helpers/mock-plugin-form';
import LinkCreate from '../src';
import { CreatePayload } from '../src/common/types';

const ENTITY_KEY = 'object-name';

const LinkPickerCreate = () => {
  const [link, setLink] = useState<string | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const mockPlugin = () => {
    return {
      group: {
        label: 'test',
        icon: 'test-icon',
        key: 'mock-plugin',
      },
      label: 'label',
      icon: 'icon',
      key: ENTITY_KEY,
      form: <MockPluginForm />,
    };
  };

  const createPlugins = [mockPlugin()];
  const pickerPlugins = [
    {
      resolve: () =>
        Promise.resolve({
          data: [],
        }),
      action: {
        label: 'Create New',
        callback: () => {
          setShowCreateModal(true);
        },
      },
    },
  ];

  // Event handlers
  const onCancel = () => setShowPicker(false);
  const onSubmit = (payload: { url: string }) => {
    setLink(payload.url);
    console.log(payload);
  };

  return (
    <div style={{ padding: '20px' }}>
      {link && (
        <div style={{ marginBottom: '1rem' }}>
          <a href={link} target="_blank" rel="noopener noreferrer nofollow">
            {link}
          </a>
        </div>
      )}
      <Popup
        isOpen={showPicker}
        autoFocus={false}
        content={() => (
          <LinkPicker
            plugins={pickerPlugins}
            onSubmit={onSubmit}
            onCancel={onCancel}
          />
        )}
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
      <LinkCreate
        plugins={createPlugins}
        onCancel={() => setShowCreateModal(false)}
        onCreate={(payload: CreatePayload) => {
          setLink(payload.url);
          console.log(payload.url);
          setShowCreateModal(false);
          setShowPicker(false);
        }}
        entityKey={ENTITY_KEY}
        active={showCreateModal}
      />
    </div>
  );
};

export default function Create() {
  return (
    <IntlProvider locale="en">
      <LinkPickerCreate />
    </IntlProvider>
  );
}
