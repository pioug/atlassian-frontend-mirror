import React from 'react';
import { mount } from 'enzyme';
import { IntlProvider } from 'react-intl';
import FormContent from '../../FormContent';
import { createFakeExtensionManifest } from '@atlaskit/editor-test-helpers/extensions';
import { FieldDefinition } from '@atlaskit/editor-common/extensions';
import { act } from '@testing-library/react-hooks';

describe('<FormContent />', () => {
  const extensionManifest = createFakeExtensionManifest({
    title: 'Awesome macro',
    type: 'confluence.macro',
    extensionKey: 'awesome',
    nodes: [
      {
        key: 'table',
        featured: true,
      },
    ],
  });

  const mountFormContent = (fields: FieldDefinition[]) => {
    return mount(
      <IntlProvider locale="en">
        <FormContent
          fields={fields}
          extensionManifest={extensionManifest}
          onFieldBlur={() => {}}
        />
      </IntlProvider>,
    );
  };

  describe('Expand', () => {
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
      const target = mountFormContent([expandFieldConf]);

      expect(target.find('Expand').length).toEqual(1);
      expect(target.find('ExpandContentContainer')).toHaveStyleRule(
        'display',
        'none',
      );

      act(() => {
        target
          .find('button[data-testid="form-expand-toggle"]')
          .simulate('click');
      });

      expect(target.find('ExpandContentContainer')).toHaveStyleRule(
        'display',
        'block',
      );
    });

    it('should mount expand expanded, and click to collapse', () => {
      const target = mountFormContent([
        {
          ...expandFieldConf,
          isExpanded: true,
        },
      ]);

      expect(target.find('Expand').length).toEqual(1);

      expect(target.find('ExpandContentContainer')).toHaveStyleRule(
        'display',
        'block',
      );

      act(() => {
        target
          .find('button[data-testid="form-expand-toggle"]')
          .simulate('click');
      });

      expect(target.find('ExpandContentContainer')).toHaveStyleRule(
        'display',
        'none',
      );
    });
  });
});
