import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react';
import user from '@testing-library/user-event';

import { axe } from '@af/accessibility-testing';
import Button from '@atlaskit/button/new';

import InlineMessage from '../../inline-message';

it('Basic InlineMessage should not fail aXe audit', async () => {
	const { container } = render(
		<InlineMessage title="Inline Message Title Example" secondaryText="Secondary Text">
			<p>Primary and secondary text dialog</p>
		</InlineMessage>,
	);
	await axe(container);
});

it('Expanded and collapsed states should be communicated programmatically', async () => {
	render(
		<InlineMessage
			title="Inline Message Title Example"
			secondaryText="Secondary Text"
			testId="inline-message"
		>
			<p>Primary and secondary text dialog</p>
		</InlineMessage>,
	);

	const element = screen.getByTestId('inline-message--button');
	expect(element).toHaveAttribute('aria-expanded', 'false');

	fireEvent.click(element);
	expect(element).toHaveAttribute('aria-expanded', 'true');

	fireEvent.click(element);
	expect(element).toHaveAttribute('aria-expanded', 'false');
});

it('Content inside popup should be tab accessible when opened', async () => {
	const userActions = user.setup();

	render(
		<InlineMessage title="Test Message" testId="inline-message">
			<Button testId="popup-button">Focusable Button</Button>
			<input data-testid="popup-input" placeholder="Focusable Input" />
			<a href="#test" data-testid="popup-link">
				Focusable Link
			</a>
		</InlineMessage>,
	);

	// Initially popup should be closed and content not visible
	expect(screen.queryByTestId('popup-button')).not.toBeInTheDocument();

	// Open the popup by clicking the trigger
	const trigger = screen.getByTestId('inline-message--button');
	await userActions.click(trigger);

	// Popup content should now be visible
	expect(screen.getByTestId('popup-button')).toBeInTheDocument();
	expect(screen.getByTestId('popup-input')).toBeInTheDocument();
	expect(screen.getByTestId('popup-link')).toBeInTheDocument();

	// Tab navigation should work within the popup content
	await userActions.tab();
	await userActions.tab();
	expect(screen.getByTestId('popup-button')).toHaveFocus();

	await userActions.tab();
	expect(screen.getByTestId('popup-input')).toHaveFocus();

	await userActions.tab();
	expect(screen.getByTestId('popup-link')).toHaveFocus();
});

it('Focus should return to trigger when popup is closed via Escape key', async () => {
	const userActions = user.setup();

	render(
		<InlineMessage title="Test Message" testId="inline-message">
			<Button testId="popup-button">Focusable Button</Button>
		</InlineMessage>,
	);

	const trigger = screen.getByTestId('inline-message--button');

	// Open popup and focus content
	await userActions.click(trigger);
	await userActions.tab();
	await userActions.tab();
	expect(screen.getByTestId('popup-button')).toHaveFocus();

	// Close popup with Escape key
	await userActions.keyboard('{Escape}');

	// Focus should return to body
	expect(document.body).toHaveFocus();

	// Popup content should be hidden
	expect(screen.queryByTestId('popup-button')).not.toBeInTheDocument();
});
