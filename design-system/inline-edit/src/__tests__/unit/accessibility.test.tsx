import React from 'react';

import { render } from '@testing-library/react';

import { axe } from '@af/accessibility-testing';
import Textfield from '@atlaskit/textfield';

import InlineEdit, { InlineEditableTextfield } from '../../index';

it('Inline Edit should pass basic aXe audit', async () => {
  const { container } = render(
    <InlineEdit
      defaultValue="Default value"
      label="Inline edit"
      editView={({ errorMessage, ...fieldProps }) => (
        <Textfield {...fieldProps} />
      )}
      readView={() => <div>Click to enter a value</div>}
      onConfirm={() => {}}
    />,
  );
  await axe(container);
});

it('Inline Edit should pass basic aXe audit', async () => {
  const { container } = render(
    <InlineEditableTextfield
      defaultValue="Default value"
      label="Inline editable textfield"
      onConfirm={() => {}}
      placeholder="Don't use placeholders!"
    />,
  );
  await axe(container);
});
