import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { matchers } from '@emotion/jest';
import { render, screen, fireEvent } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';
import { FieldDefinition } from '@atlaskit/editor-common/extensions';
import { FieldComponent } from '../../FormContent';
import { FieldComponentProps } from '../../types';

expect.extend(matchers);

describe('Expand', () => {
  const contentContainerId = 'expand-content-container';
  const mountExpand = (field: FieldDefinition) => {
    const props: FieldComponentProps = {
      field,
      parameters: {},
      extensionManifest: {} as any,
      onFieldChange: () => {},
    };

    return render(
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
    mountExpand(expandFieldConf);

    expect(screen.queryByTestId('expand-config-field')).not.toBeNull();

    expect(screen.queryByTestId(contentContainerId)).toHaveStyleRule(
      'display',
      'none',
    );

    fireEvent.click(screen.getByTestId('form-expand-toggle'));

    expect(screen.queryByTestId(contentContainerId)).toHaveStyleRule(
      'display',
      'block',
    );
  });

  it('should mount expand expanded, and click to collapse', () => {
    mountExpand({
      ...expandFieldConf,
      isExpanded: true,
    });

    expect(screen.queryByTestId('expand-config-field')).not.toBeNull();

    expect(screen.queryByTestId(contentContainerId)).toHaveStyleRule(
      'display',
      'block',
    );

    fireEvent.click(screen.getByTestId('form-expand-toggle'));

    expect(screen.queryByTestId(contentContainerId)).toHaveStyleRule(
      'display',
      'none',
    );
  });
});
