import React from 'react';

import { render, screen } from '@testing-library/react';

import { axe } from '@af/accessibility-testing/jest-axe';
import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import ButtonItem from '../../button-item';

const hovered =
	'var(--ds-listitem-hovered,background-color border-color color text-decoration-color 50ms cubic-bezier(.4,1,.6,1))';
const pressed =
	'var(--ds-listitem-pressed,background-color border-color color text-decoration-color .1s cubic-bezier(.4,1,.6,1))';
const selected =
	'var(--ds-listitem-selected,background-color border-color color text-decoration-color .1s cubic-bezier(.4,1,.6,1))';

it('should pass an aXe audit', async () => {
	const { container } = render(<ButtonItem isSelected>Hello</ButtonItem>);
	await axe(container);
});

it('applies no transition on any state when the gate is off', () => {
	failGate('platform-dst-motion-uplift-list-item');
	render(
		<ButtonItem testId="t" isSelected>
			Hello
		</ButtonItem>,
	);
	const el = screen.getByTestId('t');
	expect(el).not.toHaveCompiledCss('transition', expect.anything());
	expect(el).not.toHaveCompiledCss('transition', expect.anything(), { target: ':hover' });
	expect(el).not.toHaveCompiledCss('transition', expect.anything(), { target: ':active' });
});

it('applies hover and pressed motion tokens when the gate is on', () => {
	passGate('platform-dst-motion-uplift-list-item');
	render(<ButtonItem testId="t">Hello</ButtonItem>);
	const el = screen.getByTestId('t');
	expect(el).not.toHaveCompiledCss('transition', expect.anything());
	expect(el).toHaveCompiledCss('transition', hovered, { target: ':hover' });
	expect(el).toHaveCompiledCss('transition', pressed, { target: ':active' });
});

it('applies the selected motion token when selected and the gate is on', () => {
	passGate('platform-dst-motion-uplift-list-item');
	render(
		<ButtonItem testId="t" isSelected>
			Hello
		</ButtonItem>,
	);
	const el = screen.getByTestId('t');
	expect(el).toHaveCompiledCss('transition', selected);
	expect(el).toHaveCompiledCss('transition', hovered, { target: ':hover' });
	expect(el).toHaveCompiledCss('transition', pressed, { target: ':active' });
});
