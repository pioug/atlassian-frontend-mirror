import React from 'react';

import { render } from '@testing-library/react';

import { axe } from '@af/accessibility-testing';

import DefaultInlineEdit from '../../../examples/constellation/inline-edit-default';
import DefaultInlineEditIsEditing from '../../../examples/constellation/inline-edit-stateless';

describe('Inline edit should pass axe audit', () => {
  it('isEditing', async () => {
    const { container } = render(<DefaultInlineEditIsEditing />);

    await axe(container);
  });
  it('!isEditing', async () => {
    const { container } = render(<DefaultInlineEdit />);

    await axe(container);
  });
});
