import React from 'react';

import { render } from '@atlassian/testing-library';
import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';
import { axe } from '@af/accessibility-testing';
import Button from '@atlaskit/button/default/button';

import { Popup } from '../../popup';

const topLayerGate = 'platform-dst-top-layer';

const gateVariants = [
	{
		name: 'top layer enabled',
		setGate: () => passGate(topLayerGate),
	},
	{
		name: 'top layer disabled',
		setGate: () => failGate(topLayerGate),
	},
] as const;

describe.each(gateVariants)('$name', ({ setGate }) => {
	beforeEach(() => {
		setGate();
	});

	it('Popup should not fail an aXe audit', async () => {
		const { container } = render(
			<Popup
				isOpen={true}
				content={() => <div>Content</div>}
				trigger={(triggerProps) => (
					<Button {...triggerProps} appearance="primary">
						Close
					</Button>
				)}
			/>,
		);
		await axe(container);
	});
});
