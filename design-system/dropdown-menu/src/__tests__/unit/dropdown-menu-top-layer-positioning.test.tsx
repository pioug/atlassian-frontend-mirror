import React from 'react';

import { render } from '@testing-library/react';

import { useAnchoredPopover } from '@atlaskit/top-layer/use-anchored-popover';
import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import DropdownMenuTopLayer from '../../dropdown-menu-top-layer';
import type { DropdownMenuProps } from '../../types';

jest.mock('@atlaskit/top-layer/use-anchored-popover', () => ({
	useAnchoredPopover: jest.fn(),
}));

const getPlacement = () => jest.mocked(useAnchoredPopover).mock.lastCall?.[0].placement;

function NestedMenu({ spacing }: Pick<DropdownMenuProps, 'spacing'>) {
	return (
		<div role="menu">
			<DropdownMenuTopLayer trigger="More" placement="right-start" spacing={spacing} />
		</div>
	);
}

beforeEach(() => {
	jest.clearAllMocks();
});

it.each(['compact', 'spacious', 'cozy', undefined] as const)(
	'uses a 16px nested menu offset with spacing set to %s',
	(spacing) => {
		passGate('platform-dst-new-menu');
		render(<NestedMenu spacing={spacing} />);

		expect(getPlacement()).toMatchObject({
			axis: 'inline',
			edge: 'end',
			align: 'start',
			offset: { gap: 16, crossAxisShift: { value: 0 } },
		});
	},
);

it('leaves the root menu offset unchanged', () => {
	passGate('platform-dst-new-menu');
	render(<DropdownMenuTopLayer trigger="Options" placement="right-start" spacing="compact" />);

	expect(getPlacement()?.offset).toBeUndefined();
});

it('leaves the offset unchanged when the new menu gate is off', () => {
	failGate('platform-dst-new-menu');
	render(<NestedMenu spacing="compact" />);

	expect(getPlacement()?.offset).toBeUndefined();
});
