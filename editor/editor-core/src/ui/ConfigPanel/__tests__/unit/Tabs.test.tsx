import React from 'react';
import { mount } from 'enzyme';
import { IntlProvider } from 'react-intl';
import { FieldComponent, FieldComponentProps } from '../../FormContent';
import { FieldDefinition } from '@atlaskit/editor-common/extensions';

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
              label: 'Yes or no',
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
    const target = mountField(getTabs());

    expect(target.find('TabGroup').length).toEqual(1);
    expect(target.find('TabGroup Tabs').prop('selected')).toEqual(0);
  });

  it('should mount tabs and show correct tab when defaultTab is set', () => {
    const target = mountField(getTabs('tabB'));

    expect(target.find('TabGroup').length).toEqual(1);
    expect(target.find('TabGroup Tabs').prop('selected')).toEqual(1);
  });
});
