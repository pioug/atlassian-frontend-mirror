import React from 'react';

import { render } from '@testing-library/react';

import { token } from '@atlaskit/tokens';

import Button from '../../../new-button/variants/default/button';
import IconButton from '../../../new-button/variants/icon/button';

const getOvershoot = (): jest.Mock => jest.fn(() => null);

const expected = (spaceToken: 'space.100' | 'space.050') =>
	`calc(${token(spaceToken)} - ${token('border.width')})`;

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('icon overshoot', () => {
	describe.each([
		['default', 'space.100'],
		['compact', 'space.050'],
	] as const)('with %s spacing', (spacing, spaceToken) => {
		it('passes it to an icon render prop of Button', () => {
			const icon = getOvershoot();

			render(
				<Button spacing={spacing} iconBefore={icon}>
					Label
				</Button>,
			);

			expect(icon).toHaveBeenCalledWith(
				expect.objectContaining({ motionOvershoot: expected(spaceToken) }),
			);
		});

		it('passes it to an icon render prop of IconButton', () => {
			const icon = getOvershoot();

			render(<IconButton spacing={spacing} icon={icon} label="Label" />);

			expect(icon).toHaveBeenCalledWith(
				expect.objectContaining({ motionOvershoot: expected(spaceToken) }),
			);
		});
	});

	it('passes the default spacing overshoot when spacing is not set', () => {
		const icon = getOvershoot();

		render(<IconButton icon={icon} label="Label" />);

		expect(icon).toHaveBeenCalledWith(
			expect.objectContaining({ motionOvershoot: expected('space.100') }),
		);
	});

	it('does not pass it to an icon component', () => {
		const Icon = Object.assign(
			jest.fn(() => null),
			{ displayName: 'Icon' },
		);

		render(<IconButton icon={Icon} label="Label" />);

		expect(Icon).toHaveBeenCalledWith(
			expect.not.objectContaining({ motionOvershoot: expect.anything() }),
			expect.anything(),
		);
	});
});
