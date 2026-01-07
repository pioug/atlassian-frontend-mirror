import React from 'react';

import { render } from '@testing-library/react';

import { axe } from '@af/accessibility-testing';
import __noop from '@atlaskit/ds-lib/noop';

import ProgressIndicator from '../../progress-dots';

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('aXe audit should not fail', () => {
	it('for basic progressIndicator', async () => {
		const { container } = render(
			<ProgressIndicator selectedIndex={0} values={['one', 'two', 'three']} size="default" />,
		);
		await axe(container);
	});
	it('for selectable progressIndicator', async () => {
		const handleSelect = __noop;

		const { container } = render(
			<div>
				<div id="panel0"></div>
				<div id="panel1"></div>
				<div id="panel2"></div>
				<ProgressIndicator
					selectedIndex={0}
					values={['one', 'two', 'three']}
					size="default"
					onSelect={handleSelect}
				/>
			</div>,
		);
		await axe(container);
	});
});
