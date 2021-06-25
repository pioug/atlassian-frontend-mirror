import React from 'react';
import { mount } from 'enzyme';
import { act } from '@testing-library/react-hooks';
import { IntlProvider } from 'react-intl';
import { FieldDefinition } from '@atlaskit/editor-common/extensions';
import { FieldComponent, FieldComponentProps } from '../../FormContent';

describe('Expand', () => {
  const mountExpand = (field: FieldDefinition) => {
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

  const expandFieldConf: FieldDefinition = {
    name: 'expand field',
    type: 'expand',
    label: 'awesome expand field',
    fields: [
      {
        name: 'text-field',
        type: 'string',
        label: 'Free text',
        isRequired: true,
        description: 'Add some text',
        defaultValue: 'I am the default text',
      },
    ],
  };

  it('should mount expand collapsed, and click to expand', () => {
    const target = mountExpand(expandFieldConf);

    expect(target.find('Expand').length).toEqual(1);
    expect(target.find('ExpandContentContainer')).toHaveStyleRule(
      'display',
      'none',
    );

    act(() => {
      target.find('button[data-testid="form-expand-toggle"]').simulate('click');
    });

    expect(target.find('ExpandContentContainer')).toHaveStyleRule(
      'display',
      'block',
    );
  });

  it('should mount expand expanded, and click to collapse', () => {
    const target = mountExpand({
      ...expandFieldConf,
      isExpanded: true,
    });

    expect(target.find('Expand').length).toEqual(1);

    expect(target.find('ExpandContentContainer')).toHaveStyleRule(
      'display',
      'block',
    );

    act(() => {
      target.find('button[data-testid="form-expand-toggle"]').simulate('click');
    });

    expect(target.find('ExpandContentContainer')).toHaveStyleRule(
      'display',
      'none',
    );
  });
});
