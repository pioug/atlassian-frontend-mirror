import React from 'react';

import { render } from '@testing-library/react';

import { axe } from '@af/accessibility-testing';

import DefaultInlineEditableTextField from '../../../../examples/04-inline-editable-textfield';

it('Inline editable textfield should pass axe audit', async () => {
	const { container } = render(<DefaultInlineEditableTextField />);

	await axe(container);
});
