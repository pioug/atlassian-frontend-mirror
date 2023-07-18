import React from 'react';

import { render } from '@testing-library/react';

import { axe } from '@af/accessibility-testing';
import Image from '@atlaskit/image';

import Cat from '../../examples/images/cat.png';

it('Basic Image should not fail aXe audit', async () => {
  const { container } = render(<Image src={Cat} alt="Simple example" />);
  await axe(container);
});
