import React from 'react';

import { render } from '@testing-library/react';

import { axe } from '@af/accessibility-testing';
import Image from '@atlaskit/image';

import ExampleImage from '../../examples/images/Celebration.png';

it('Basic Image should not fail aXe audit', async () => {
	const { container } = render(<Image src={ExampleImage} alt="Simple example" />);
	await axe(container);
});
