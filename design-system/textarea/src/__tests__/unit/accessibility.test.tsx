import React from 'react';

import { render } from '@testing-library/react';

import { axe } from '@af/accessibility-testing';

import Basic from '../../../examples/0-basic';
import Appearance from '../../../examples/1-appearance';
import TextAreaForm from '../../../examples/constellation/text-area-form';
import TextAreaValidation from '../../../examples/constellation/text-area-validation';

it('Basic text area should pass aXe audit', async () => {
  const { container } = render(<Basic />);
  await axe(container);
});

it('Appearance text area should pass aXe audit', async () => {
  const { container } = render(<Appearance />);
  await axe(container);
});

it('TextAreaForm should pass aXe audit', async () => {
  const { container } = render(<TextAreaForm />);
  await axe(container);
});

it('TextAreaValidation should pass aXe audit', async () => {
  const { container } = render(<TextAreaValidation />);
  await axe(container);
});
