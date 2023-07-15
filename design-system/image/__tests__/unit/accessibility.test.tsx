import React from 'react';

import { render } from '@testing-library/react';

import { axe, toHaveNoViolations } from '@af/accessibility-testing';
import Image from '@atlaskit/image';

import Cat from '../../examples/images/cat.png';

expect.extend(toHaveNoViolations);

it('Basic Image should not fail aXe audit', async () => {
  const { container } = render(<Image src={Cat} alt="Simple example" />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});

it('Should fail without alt attribute aXe audit', async () => {
  // eslint-disable-next-line jsx-a11y/alt-text
  const { container } = render(<Image src={Cat} alt={undefined} />);
  const results = await axe(container);
  expect(() => expect(results).toHaveNoViolations()).toThrow(
    'Images must have alternate text (image-alt)',
  );
});
