import React from 'react';

import { render } from '@testing-library/react';

import ShowcaseExample from '../../examples/01-showcase';

it('should be accessible', async () => {
	const { container } = render(<ShowcaseExample />);

	await expect(container).toBeAccessible();
});
