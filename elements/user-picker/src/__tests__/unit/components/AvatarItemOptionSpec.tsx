import ChevronRightIcon from '@atlaskit/icon/core/chevron-right';
import { render, screen } from '@testing-library/react';
import React, { type ReactNode } from 'react';
import { type LozengeProps } from '../../../types';
import { AvatarItemOption } from '../../../components/AvatarItemOption';

describe('AvatarItemOption', () => {
	describe('option content', () => {
		const primaryText = 'PrimaryText';
		const secondaryText = 'SecondaryText';
		const lozenge: LozengeProps = {
			text: 'in progress',
			appearance: 'inprogress',
		};
		const lozengeHtml: ReactNode = (
			<ChevronRightIcon
				color="currentColor"
				testId="lozenge-chevron-right-icon"
				label="chevron-right"
				size="small"
			/>
		);

		it('renders primary and secondary text', async () => {
			render(
				<AvatarItemOption
					primaryText={primaryText}
					secondaryText={secondaryText}
					avatar={<span>Avatar</span>}
				/>,
			);

			expect(screen.getByText('Avatar')).toBeInTheDocument();
			expect(screen.getByText(primaryText)).toBeInTheDocument();
			expect(screen.getByText(secondaryText)).toBeInTheDocument();
			expect(screen.queryByText(lozenge.text)).not.toBeInTheDocument();
			await expect(document.body).toBeAccessible();
		});

		it('renders a text lozenge when one is supplied', () => {
			render(
				<AvatarItemOption
					primaryText={primaryText}
					secondaryText={secondaryText}
					lozenge={lozenge}
					avatar={<span>Avatar</span>}
				/>,
			);

			expect(screen.getByText(lozenge.text)).toBeInTheDocument();
		});

		it('renders a React node lozenge when one is supplied', () => {
			render(
				<AvatarItemOption
					primaryText={primaryText}
					secondaryText={secondaryText}
					lozenge={lozengeHtml}
					avatar={<span>Avatar</span>}
				/>,
			);

			expect(screen.getByTestId('lozenge-chevron-right-icon')).toBeInTheDocument();
		});
	});
});
