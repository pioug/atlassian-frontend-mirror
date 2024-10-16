import React from 'react';

import '@testing-library/jest-dom';
import { DeleteAction, EditAction } from '../index';
import { SmartLinkSize } from '../../../../../constants';
import CrossIcon from '@atlaskit/icon/core/migration/close--cross';
import { token } from '@atlaskit/tokens';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IntlProvider } from 'react-intl-next';
import { type ActionProps } from '../action/types';

interface Options {
	name: string;
	NamedAction: React.ComponentType<ActionProps>;
}

export const testNamedAction = ({ name, NamedAction }: Options) => {
	describe(`Action: ${name}`, () => {
		const testId = `smart-action-${name.toLocaleLowerCase()}-action}`;

		describe.each([
			['as dropdown item', true],
			['as button', false],
		])('%s', (_: string, asDropdownItem: boolean) => {
			it(`should render ${NamedAction.name} with default text`, async () => {
				render(
					<IntlProvider locale="en">
						<NamedAction onClick={() => {}} testId={testId} />
					</IntlProvider>,
				);

				const element = await screen.findByTestId(testId);

				expect(element).toBeTruthy();
				expect(element.textContent).toBe(name);
			});

			it(`should render ${NamedAction.name} with custom text`, async () => {
				const text = 'spaghetti';
				const onClick = () => {};
				render(
					<IntlProvider locale="en">
						<NamedAction
							asDropDownItem={asDropdownItem}
							onClick={onClick}
							content={text}
							testId={testId}
						/>
					</IntlProvider>,
				);

				const element = await screen.findByTestId(testId);

				expect(element).toBeTruthy();
				expect(element.textContent).toBe('spaghetti');
			});

			it('should call the supplied onClick when button is clicked', async () => {
				const user = userEvent.setup();
				const mockOnClick = jest.fn();
				render(
					<IntlProvider locale="en">
						<NamedAction asDropDownItem={asDropdownItem} onClick={mockOnClick} testId={testId} />
					</IntlProvider>,
				);

				const element = await screen.findByTestId(testId);

				await user.click(element);
				expect(mockOnClick).toHaveBeenCalled();
			});
		});

		describe('size', () => {
			it.each([
				[SmartLinkSize.XLarge, '1.5rem'],
				[SmartLinkSize.Large, '1.5rem'],
				[SmartLinkSize.Medium, '1rem'],
				[SmartLinkSize.Small, '1rem'],
			])('should render action in %s size', async (size: SmartLinkSize, expectedSize: string) => {
				render(
					<IntlProvider locale="en">
						<NamedAction
							onClick={() => {}}
							size={size}
							testId={testId}
							icon={<CrossIcon label="test" color={token('color.icon', '#44546F')} />}
						/>
					</IntlProvider>,
				);

				const element = await screen.findByTestId(`${testId}-icon`);

				expect(element).toHaveStyleDeclaration('height', expectedSize);
				expect(element).toHaveStyleDeclaration('width', expectedSize);
			});
		});

		it('show tooltips on hover', async () => {
			const mockOnClick = jest.fn();
			render(
				<IntlProvider locale="en">
					<NamedAction asDropDownItem={false} onClick={mockOnClick} testId={testId} />
				</IntlProvider>,
			);

			const element = await screen.findByTestId(testId);
			fireEvent.mouseOver(element);
			const tooltip = await screen.findByTestId(`${testId}-tooltip`);

			expect(tooltip).toBeTruthy();
			expect(tooltip.textContent).toBe(name);
		});
	});
};

describe('Named Action', () => {
	testNamedAction({
		name: 'Delete',
		NamedAction: DeleteAction,
	});
	testNamedAction({
		name: 'Edit',
		NamedAction: EditAction,
	});
});
