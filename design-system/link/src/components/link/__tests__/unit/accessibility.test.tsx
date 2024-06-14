import React from 'react';

import { render, screen } from '@testing-library/react';

import { axe } from '@af/accessibility-testing';

import Link from '../../../../index';
import variations from '../../../../utils/variations';

describe(`Accessibility:`, () => {
	variations.forEach(({ name, props }) => {
		describe(`'${name}' accessibility`, () => {
			it('should not fail an aXe audit', async () => {
				const { container } = render(<Link {...props} />);
				await axe(container);
			});
		});
	});

	const OPENS_NEW_WINDOW_LABEL = '(opens new window)';
	describe(`"${OPENS_NEW_WINDOW_LABEL}" announcements should be appended when \`target="_blank"\``, () => {
		it('to `children` as visually hidden text', () => {
			render(
				<Link href="https://www.atlassian.com" testId="link" target="_blank">
					Atlassian website
				</Link>,
			);

			const link = screen.getByTestId('link');
			expect(link).toHaveAccessibleName(`Atlassian website ${OPENS_NEW_WINDOW_LABEL}`);

			// Check for visually hidden styles
			const hiddenText = screen.getByText(OPENS_NEW_WINDOW_LABEL);
			expect(hiddenText).toHaveStyleDeclaration('width', '1px');
			expect(hiddenText).toHaveStyleDeclaration('height', '1px');
			expect(hiddenText).toHaveStyleDeclaration('position', 'absolute');
			expect(hiddenText).toHaveStyleDeclaration('clip', 'rect(1px, 1px, 1px, 1px)');
		});
		it('to `aria-label`', () => {
			render(
				<Link href="https://www.atlassian.com" testId="link" target="_blank" aria-label="Jira" />,
			);

			const link = screen.getByTestId('link');
			expect(link).toHaveAccessibleName(`Jira ${OPENS_NEW_WINDOW_LABEL}`);
		});
		it('to `aria-labelledby`', () => {
			render(
				<>
					<div id="the-label">Confluence</div>
					<Link
						href="https://www.atlassian.com"
						testId="link"
						target="_blank"
						aria-labelledby="the-label"
					/>
				</>,
			);

			const link = screen.getByTestId('link');
			expect(link).toHaveAccessibleName(`Confluence ${OPENS_NEW_WINDOW_LABEL}`);
		});
	});
});
