import React from 'react';

import { IntlProvider } from 'react-intl-next';

import { MockPluginForm } from '../../example-helpers/mock-plugin-form';
import LinkCreate, { LinkCreateWithModalProps } from '../../src';

const createExample = (
  props: Partial<LinkCreateWithModalProps> = {},
): React.ComponentType => {
  return function Example() {
    const ENTITY_KEY = 'object-name';

    const mockPlugins = [
      {
        group: {
          label: 'test',
          icon: 'test-icon',
          key: 'mock-plugin',
        },
        label: 'label',
        icon: 'icon',
        key: ENTITY_KEY,
        form: <MockPluginForm />,
      },
    ];

    return (
      <IntlProvider locale="en">
        <LinkCreate
          {...props}
          active={true}
          entityKey={ENTITY_KEY}
          plugins={mockPlugins}
        />
      </IntlProvider>
    );
  };
};

export const DefaultCreateWithModal = createExample();
export const DefaultCreateWithModalTitle = createExample({
  modalTitle: 'Create custom title',
});

export default DefaultCreateWithModal;
