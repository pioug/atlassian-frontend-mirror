import React from 'react';

import { render } from '@testing-library/react';

import { axe } from '@af/accessibility-testing';

import TagGroupAlignStart from '../../../../examples/constellation/tag-group-alignment-start';
import TagGroup from '../../../../examples/constellation/tag-group-default';

it('TagGroup should pass axe audit', async () => {
	const { container } = render(<TagGroup />);
	await axe(container);
});

it('TagGroupAlignStart should pass axe audit', async () => {
	const { container } = render(<TagGroupAlignStart />);
	await axe(container);
});
