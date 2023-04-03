import React from 'react';
// import { mount } from 'enzyme';
import { render as mount, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';
import { FieldComponent } from '../../FormContent';
import { FieldDefinition } from '@atlaskit/editor-common/extensions';
import { FieldComponentProps } from '../../types';

describe('Tabs', () => {
  const mountField = (field: FieldDefinition) => {
    const props: FieldComponentProps = {
      field,
      parameters: {},
      extensionManifest: {} as any,
      onFieldChange: () => {},
    };

    return mount(
      <IntlProvider locale="en">
        <FieldComponent {...props} />
      </IntlProvider>,
    );
  };

  const getTabs = (defaultTab?: string) => {
    return {
      type: 'tab-group',
      label: 'tabs field',
      name: 'tabGroup',
      defaultTab,
      fields: [
        {
          type: 'tab',
          name: 'tabA',
          label: 'Tab A',
          fields: [
            {
              type: 'string',
              name: 'textfield',
              label: 'Enter name',
            },
          ],
        },
        {
          type: 'tab',
          name: 'tabB',
          label: 'Tab B',
          fields: [
            {
              type: 'boolean',
              name: 'checkbox',
              label: 'Yes or no b',
            },
          ],
        },
        {
          type: 'tab',
          name: 'tabC',
          label: 'Tab C',
          fields: [
            {
              type: 'boolean',
              name: 'checkbox',
              label: 'Yes or no',
            },
          ],
        },
      ],
    } as FieldDefinition;
  };

  it('should mount tabs and default to first tab', () => {
    mountField(getTabs());

    const tabGroup = screen.getByRole('tabpanel');
    expect(tabGroup).not.toBeNull();
    expect(tabGroup.textContent).toContain('Enter name');
    expect(tabGroup.textContent).not.toContain('Yes or no b');
  });

  it('should mount tabs and show correct tab when defaultTab is set', () => {
    mountField(getTabs('tabB'));

    const tabGroup = screen.getByRole('tabpanel');
    expect(tabGroup).not.toBeNull();
    expect(tabGroup.textContent).toContain('Yes or no b');
    expect(tabGroup.textContent).not.toContain('Enter name');
  });
});
