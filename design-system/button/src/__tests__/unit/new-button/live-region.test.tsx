import React from 'react';

import { render, screen } from '@testing-library/react';

import SettingsIcon from '@atlaskit/icon/core/settings';
import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import Button from '../../../new-button/variants/default/button';
import IconButton from '../../../new-button/variants/icon/button';

describe('button live-region ownership', () => {
	it('preserves polite live announcements when the gate is disabled', () => {
		failGate('rovo_chat_accessible_responses');
		render(<Button aria-live="off">Save</Button>);
		expect(screen.getByRole('button')).toHaveAttribute('aria-live', 'polite');
	});

	it.each(['off', 'assertive'] as const)(
		'honors an explicit %s live-region value',
		async (live) => {
			passGate('rovo_chat_accessible_responses');
			const { container } = render(<Button aria-live={live}>Save</Button>);
			expect(screen.getByRole('button', { name: 'Save' })).toHaveAttribute('aria-live', live);
			await expect(container).toBeAccessible();
		},
	);

	it('preserves the default loading announcement behavior', () => {
		passGate('rovo_chat_accessible_responses');
		const { rerender } = render(<Button>Save</Button>);
		expect(screen.getByRole('button')).toHaveAttribute('aria-live', 'polite');
		rerender(<Button isLoading>Save</Button>);
		expect(screen.getByRole('button')).toHaveAttribute('aria-live', 'polite');
		expect(screen.getByRole('button')).toHaveAttribute('aria-disabled', 'true');
	});

	it('keeps an icon button silent while its accessible name and availability change', () => {
		passGate('rovo_chat_accessible_responses');
		const { rerender } = render(
			<IconButton aria-live="off" icon={SettingsIcon} label="Unavailable" isDisabled />,
		);
		expect(screen.getByRole('button', { name: 'Unavailable' })).toBeDisabled();
		rerender(<IconButton aria-live="off" icon={SettingsIcon} label="Settings" />);
		const button = screen.getByRole('button', { name: 'Settings' });
		expect(button).toBeEnabled();
		expect(button).toHaveAttribute('aria-live', 'off');
	});
});
