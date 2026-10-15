import React from 'react';

import { render, screen } from '@testing-library/react';

import ChevronDownIcon from '@atlaskit/icon/core/chevron-down';
import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import { SplitButton } from '../../../new-button/containers/split-button/split-button';
import Button from '../../../new-button/variants/default/button';
import IconButton from '../../../new-button/variants/icon/button';
import { expectTokenStyle } from '../_util/expect-token-style';

/**
 * Exercises the gate-on cohort while testing controls that must bypass the gate.
 */
function FinesseGateControl(): React.JSX.Element {
	return (
		<SplitButton appearance="primary">
			<Button>Gate control action</Button>
			<IconButton icon={ChevronDownIcon} label="Gate control options" isSelected />
		</SplitButton>
	);
}

describe('SplitButton Finesse brand treatment', () => {
	it.each([false, true])('is accessible when Finesse is %s', async (finesseEnabled) => {
		if (finesseEnabled) {
			passGate('platform-dst-tokens-finesse');
		} else {
			failGate('platform-dst-tokens-finesse');
		}

		const { container } = render(
			<SplitButton appearance="primary">
				<Button>Update</Button>
				<IconButton icon={ChevronDownIcon} label="More update options" isSelected />
			</SplitButton>,
		);

		await expect(container).toBeAccessible();
	});

	it('keeps the selected primary trigger brand-coloured in all interaction states', () => {
		passGate('platform-dst-tokens-finesse');
		render(
			<SplitButton appearance="primary">
				<Button>Update</Button>
				<IconButton icon={ChevronDownIcon} label="More update options" isSelected />
			</SplitButton>,
		);

		const trigger = screen.getByRole('button', { name: 'More update options' });
		expectTokenStyle(trigger, 'background-color', 'color.background.brand.subtlest');
		expectTokenStyle(
			trigger,
			'background-color',
			'color.background.brand.subtlest.hovered',
			':hover',
		);
		expectTokenStyle(
			trigger,
			'background-color',
			'color.background.brand.subtlest.pressed',
			':active',
		);
		expectTokenStyle(trigger, 'border-color', 'color.border.brand', '::after');
		['', ':hover', ':active', ':focus'].forEach((target) => {
			expectTokenStyle(trigger, 'color', 'color.text.brand', target);
		});

		// The main action must keep its existing bold brand treatment.
		expectTokenStyle(
			screen.getByRole('button', { name: 'Update' }),
			'background-color',
			'color.background.brand.bold',
		);
	});

	it('preserves the existing selected treatment when Finesse is off', () => {
		failGate('platform-dst-tokens-finesse');
		render(
			<SplitButton appearance="primary">
				<Button>Update</Button>
				<IconButton icon={ChevronDownIcon} label="More update options" isSelected />
			</SplitButton>,
		);

		const trigger = screen.getByRole('button', { name: 'More update options' });
		expectTokenStyle(trigger, 'background-color', 'color.background.selected');
		expectTokenStyle(trigger, 'background-color', 'color.background.selected.hovered', ':hover');
		expectTokenStyle(trigger, 'background-color', 'color.background.selected.pressed', ':active');
		expectTokenStyle(trigger, 'border-color', 'color.border.selected', '::after');
	});

	it('does not change standalone selected primary buttons', () => {
		passGate('platform-dst-tokens-finesse');
		render(
			<>
				<Button appearance="primary" isSelected>
					Update
				</Button>
				<FinesseGateControl />
			</>,
		);

		expectTokenStyle(
			screen.getByRole('button', { name: 'Update' }),
			'background-color',
			'color.background.selected',
		);
	});

	it('does not change selected default SplitButton triggers', () => {
		passGate('platform-dst-tokens-finesse');
		render(
			<>
				<SplitButton>
					<Button>Update</Button>
					<IconButton icon={ChevronDownIcon} label="More update options" isSelected />
				</SplitButton>
				<FinesseGateControl />
			</>,
		);

		expectTokenStyle(
			screen.getByRole('button', { name: 'More update options' }),
			'background-color',
			'color.background.selected',
		);
	});

	it('preserves disabled primary SplitButton styles even when isSelected is passed', () => {
		passGate('platform-dst-tokens-finesse');
		render(
			<>
				<SplitButton appearance="primary" isDisabled>
					<Button>Update</Button>
					<IconButton icon={ChevronDownIcon} label="More update options" isSelected />
				</SplitButton>
				<FinesseGateControl />
			</>,
		);

		const trigger = screen.getByRole('button', { name: 'More update options' });
		expect(trigger).toBeDisabled();
		expectTokenStyle(trigger, 'background-color', 'color.background.disabled');
		expectTokenStyle(trigger, 'color', 'color.text.disabled');
	});
});
