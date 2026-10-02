import React from 'react';

import { render, screen, waitFor } from '@testing-library/react';

import { axe } from '@af/accessibility-testing';
import Button from '@atlaskit/button/default/button';
import { Pressable } from '@atlaskit/primitives/compiled/pressable';
import { passGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import InlineDialog from '../../inline-dialog';

it('Inline Dialog should pass aXe accessibility audit', async () => {
	passGate('platform-dst-top-layer');
	const { container } = render(
		<InlineDialog content={<p>Hello!</p>} isOpen={true}>
			<Button>Click me!</Button>
		</InlineDialog>,
	);

	await axe(container);
});

it('applies popup ARIA to the only button in a trigger wrapper', async () => {
	passGate('platform-dst-top-layer');
	const { container } = render(
		<InlineDialog content={<p>Hello!</p>} isOpen={true}>
			<div data-testid="trigger-wrapper">
				<Button>Click me!</Button>
			</div>
		</InlineDialog>,
	);

	const trigger = screen.getByRole('button', { name: 'Click me!' });
	const dialog = screen.getByRole('dialog');
	await waitFor(() => expect(trigger).toHaveAttribute('aria-expanded', 'true'));
	expect(trigger).toHaveAttribute('aria-haspopup', 'dialog');
	expect(trigger).toHaveAttribute('aria-controls', dialog.id);
	await axe(container);
});

it('applies popup ARIA to the first button when a trigger wrapper contains multiple buttons', async () => {
	passGate('platform-dst-top-layer');
	const { container } = render(
		<InlineDialog content={<p>Hello!</p>} isOpen={true}>
			<div data-testid="trigger-wrapper">
				<Button>First button</Button>
				<Button>Second button</Button>
			</div>
		</InlineDialog>,
	);

	const firstButton = screen.getByRole('button', { name: 'First button' });
	const secondButton = screen.getByRole('button', { name: 'Second button' });
	const dialog = screen.getByRole('dialog');
	await waitFor(() => expect(firstButton).toHaveAttribute('aria-expanded', 'true'));
	expect(firstButton).toHaveAttribute('aria-haspopup', 'dialog');
	expect(firstButton).toHaveAttribute('aria-controls', dialog.id);
	for (const element of [screen.getByTestId('trigger-wrapper'), secondButton]) {
		expect(element).not.toHaveAttribute('aria-expanded');
		expect(element).not.toHaveAttribute('aria-haspopup');
		expect(element).not.toHaveAttribute('aria-controls');
	}
	await axe(container);
});

it('does not apply popup ARIA when there is no interactive descendant', () => {
	passGate('platform-dst-top-layer');
	render(
		<InlineDialog content={<p>Hello!</p>} isOpen={true}>
			<div data-testid="trigger-wrapper">
				<span data-testid="trigger-content">Informational text</span>
			</div>
		</InlineDialog>,
	);

	const wrapper = screen.getByTestId('trigger-wrapper');
	const content = screen.getByTestId('trigger-content');
	for (const element of [wrapper, content]) {
		expect(element).not.toHaveAttribute('aria-expanded');
		expect(element).not.toHaveAttribute('aria-haspopup');
		expect(element).not.toHaveAttribute('aria-controls');
	}
});

// This is a pragmatic decision that we can revisit.
it('does not apply popup ARIA to an interactive non-button descendant', () => {
	passGate('platform-dst-top-layer');
	render(
		<InlineDialog content={<p>Hello!</p>} isOpen={true}>
			<div data-testid="trigger-wrapper">
				<a data-testid="trigger-link" href="https://example.com">
					Open link
				</a>
			</div>
		</InlineDialog>,
	);

	const wrapper = screen.getByTestId('trigger-wrapper');
	const link = screen.getByTestId('trigger-link');
	for (const element of [wrapper, link]) {
		expect(element).not.toHaveAttribute('aria-expanded');
		expect(element).not.toHaveAttribute('aria-haspopup');
		expect(element).not.toHaveAttribute('aria-controls');
	}
});

it('applies popup ARIA to a button trigger', async () => {
	passGate('platform-dst-top-layer');
	render(
		<InlineDialog content={<p>Hello!</p>} isOpen={true}>
			<Button>Click me!</Button>
		</InlineDialog>,
	);

	const trigger = screen.getByRole('button', { name: 'Click me!' });
	const dialog = screen.getByRole('dialog');
	await waitFor(() => expect(trigger).toHaveAttribute('aria-expanded', 'true'));
	expect(trigger).toHaveAttribute('aria-haspopup', 'dialog');
	expect(trigger).toHaveAttribute('aria-controls', dialog.id);
});

it('applies popup ARIA when a style element precedes the button trigger', async () => {
	passGate('platform-dst-top-layer');
	render(
		<InlineDialog content={<p>Hello!</p>} isOpen={true}>
			<>
				{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-global-styles -- Simulates a style tag injected by CSS-in-JS. */}
				<style>{'.inline-dialog-test { color: red; }'}</style>
				<Button>Click me!</Button>
			</>
		</InlineDialog>,
	);

	const trigger = screen.getByRole('button', { name: 'Click me!' });
	const dialog = screen.getByRole('dialog');
	await waitFor(() => expect(trigger).toHaveAttribute('aria-expanded', 'true'));
	expect(trigger).toHaveAttribute('aria-haspopup', 'dialog');
	expect(trigger).toHaveAttribute('aria-controls', dialog.id);
});

it('applies popup ARIA to a direct Pressable child', async () => {
	passGate('platform-dst-top-layer');
	render(
		<InlineDialog content={<p>Hello!</p>} isOpen={true}>
			<Pressable>Click me!</Pressable>
		</InlineDialog>,
	);

	const trigger = screen.getByRole('button', { name: 'Click me!' });
	const dialog = screen.getByRole('dialog');
	await waitFor(() => expect(trigger).toHaveAttribute('aria-expanded', 'true'));
	expect(trigger).toHaveAttribute('aria-haspopup', 'dialog');
	expect(trigger).toHaveAttribute('aria-controls', dialog.id);
});
