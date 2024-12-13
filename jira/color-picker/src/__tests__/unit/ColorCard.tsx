import { fg } from '@atlaskit/platform-feature-flags';
import { render } from '@testing-library/react';
import ColorCard, { type Props } from '../../components/ColorCard';
import React from 'react';
import { COLOR_PALETTE_MENU, COLOR_PICKER } from '../../constants';

const defaultProps: Props = {
	type: COLOR_PALETTE_MENU,
	value: 'blue',
	label: 'Blue',
	selected: false,
};

jest.mock('@atlaskit/platform-feature-flags');
const mockGetBooleanFG = fg as jest.MockedFunction<typeof fg>;

describe('ColorCard', () => {
	beforeEach(() => {
		mockGetBooleanFG.mockReturnValue(true);
	});

	it('should report a11y violations when inside menu in color palette', async () => {
		const { container } = render(
			<div role="menu">
				<ColorCard {...defaultProps} selected />
			</div>,
		);

		await expect(container).toBeAccessible();
	});

	it('should report a11y violations when not inside menu in color palette', async () => {
		const { container } = render(<ColorCard {...defaultProps} isInsideMenu={false} />);

		await expect(container).toBeAccessible();
	});

	it('should report a11y violations when in color picker', async () => {
		const { container } = render(<ColorCard {...defaultProps} type={COLOR_PICKER} />);

		await expect(container).toBeAccessible();
	});
});
