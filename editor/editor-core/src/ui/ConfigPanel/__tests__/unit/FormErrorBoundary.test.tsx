import React from 'react';
import { mount } from 'enzyme';
import { IntlProvider } from 'react-intl';
import FormContent from '../../FormContent';
import { createFakeExtensionManifest } from '@atlaskit/editor-test-helpers/extensions';
import { FieldDefinition } from '@atlaskit/editor-common/extensions';

import { messages } from '../../messages';

describe('FormErrorBoundary', () => {
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
          onFieldChange={() => {}}
        />
      </IntlProvider>,
    );
  };

  // This is deliberately missing 'field.options' to trigger a field error
  const brokenFieldDefinition: FieldDefinition[] = [
    {
      name: 'badUser',
      type: 'user',
      label: 'Select a user',
    } as any,
  ];

  it('should show error boundary if FormContent crashes unexpectedly', () => {
    const wrapper = mountFormContent(brokenFieldDefinition);

    expect(wrapper.find('FormContent').exists()).toBeTruthy();
    expect(wrapper.find('FormErrorBoundary').exists()).toBeTruthy();
    expect(wrapper.find('SectionMessage').exists()).toBeTruthy();

    const heading = wrapper.find('h1');
    expect(heading.exists()).toBeTruthy();
    expect(heading.text()).toEqual(messages.errorBoundaryTitle.defaultMessage);

    expect(
      wrapper
        .findWhere(
          (el) =>
            el.name() === 'p' &&
            el.text() === messages.errorBoundaryNote.defaultMessage,
        )
        .exists(),
    ).toBeTruthy();

    expect(
      wrapper
        .findWhere(
          (el) =>
            el.name() === 'i' &&
            el.text() === `Cannot read property 'provider' of undefined`,
        )
        .exists(),
    ).toBeTruthy();
  });
});
