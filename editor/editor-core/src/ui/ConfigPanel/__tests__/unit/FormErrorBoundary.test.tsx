import React from 'react';
import { screen } from '@testing-library/react';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { renderWithIntl } from '@atlaskit/editor-test-helpers/rtl';
import FormContent from '../../FormContent';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { createFakeExtensionManifest } from '@atlaskit/editor-test-helpers/extensions';
import type { FieldDefinition } from '@atlaskit/editor-common/extensions';

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

  const renderFormContent = (fields: FieldDefinition[]) => {
    return renderWithIntl(
      <FormContent
        fields={fields}
        extensionManifest={extensionManifest}
        onFieldChange={() => {}}
      />,
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
    renderFormContent(brokenFieldDefinition);

    expect(
      screen
        .getByText(messages.errorBoundaryTitle.defaultMessage)
        .closest('h2'),
    ).toBeInTheDocument();
    expect(
      screen.getByText(messages.errorBoundaryNote.defaultMessage).closest('p'),
    ).toBeInTheDocument();
    expect(
      screen
        .getByText(`Cannot read properties of undefined (reading 'provider')`)
        .closest('i'),
    ).toBeInTheDocument();
  });
});
