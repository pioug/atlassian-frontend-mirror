import React from 'react';

import { axe } from '@af/accessibility-testing/jest-axe';
import { passGate } from '@atlassian/feature-flags-test-utils/mock-gates';
import { render } from '@atlassian/testing-library/render';
import { screen } from '@atlassian/testing-library/screen';
import { userEvent } from '@atlassian/testing-library/user-event';

import { TopNavElementContext } from '../../../page-layout/top-nav/top-nav-element-context';
import { CreateButton } from '../../create-button';
import { HasCustomThemeContext } from '../../themed/has-custom-theme-context';

describe('CreateButton', () => {
	it('should be accessible', async () => {
		const { container } = render(<CreateButton>Create</CreateButton>);

		await axe(container);
	});

	it('should be visible', () => {
		render(<CreateButton>Create</CreateButton>);

		expect(screen.getByRole('button', { name: 'Create' })).toBeVisible();
	});

	it('should trigger the `onClick` when clicked', async () => {
		const user = userEvent.setup();
		const onClick = jest.fn();

		render(<CreateButton onClick={onClick}>Create</CreateButton>);

		expect(onClick).toHaveBeenCalledTimes(0);

		await user.click(screen.getByRole('button'));
		expect(onClick).toHaveBeenCalledTimes(1);
	});
});

describe.each([false, true])('compact Create (custom theme: %s)', (hasCustomTheme) => {
	it.each(['hover', 'focus'])('should reveal the Create label on %s', async (interaction) => {
		passGate('platform-dst-chat-panel-layout');
		const user = userEvent.setup();
		render(
			<TopNavElementContext.Provider value={{ belowSm: true, hasMeasured: true }}>
				<HasCustomThemeContext.Provider value={hasCustomTheme}>
					<CreateButton>Create</CreateButton>
				</HasCustomThemeContext.Provider>
			</TopNavElementContext.Provider>,
		);
		const button = screen.getByRole('button', { name: 'Create' });
		expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
		if (interaction === 'hover') {
			await user.hover(button);
		} else {
			await user.tab();
			expect(button).toHaveFocus();
		}
		expect(await screen.findByRole('tooltip')).toHaveTextContent('Create');
		expect(screen.getAllByRole('button', { name: 'Create' })).toHaveLength(1);
	});
});
