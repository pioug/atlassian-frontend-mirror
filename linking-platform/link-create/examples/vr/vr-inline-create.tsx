import React from 'react';

import { IntlProvider } from 'react-intl-next';

import { Box, xcss } from '@atlaskit/primitives';


import { MockPluginForm } from '../../example-helpers/mock-plugin-form';
import type { EditViewProps, LinkCreateProps } from '../../src';
import { InlineCreate } from '../../src/ui';

const containerStyles = xcss({
  width: '320px',
  border: '1px solid',
  padding: 'space.100',
});

const createExample = (
  props: Partial<LinkCreateProps> = {},
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
        <Box xcss={containerStyles}>
          <InlineCreate
            {...props}
            active={true}
            entityKey={ENTITY_KEY}
            plugins={mockPlugins}
          />
        </Box>
      </IntlProvider>
    );
  };
};

const createExampleWithEdit = (
  props: Partial<LinkCreateProps> = {},
): React.ComponentType => {
  return function EditExample() {
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
        editView: ({ payload, onClose }: EditViewProps) => {
          return <h1>this is an edit view</h1>;
        },
      },
    ];

    return (
      <IntlProvider locale="en">
        <Box xcss={containerStyles}>
          <InlineCreate
            active={true}
            entityKey={ENTITY_KEY}
            plugins={mockPlugins}
            onComplete={() => {
              console.log('onCompleteFunction');
            }}
            {...props}
          />
        </Box>
      </IntlProvider>
    );
  };
};

export const DefaultInlineCreate = createExample();
export const DefaultInlineCreateWithEditButton = createExampleWithEdit({});

export default DefaultInlineCreate;
