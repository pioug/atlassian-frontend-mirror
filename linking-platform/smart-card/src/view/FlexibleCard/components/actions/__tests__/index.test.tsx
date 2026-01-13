import React from 'react';

import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IntlProvider } from 'react-intl-next';

import { skipAutoA11yFile } from '@atlassian/a11y-jest-testing';

import { type ActionProps } from '../action/types';
import { DeleteAction, EditAction } from '../index';

// This file exposes one or more accessibility violations. Testing is currently skipped but violations need to
// be fixed in a timely manner or result in escalation. Once all violations have been fixed, you can remove
// the next line and associated import. For more information, see go/afm-a11y-tooling:jest
skipAutoA11yFile();

interface Options {
	name: string;
	NamedAction: React.ComponentType<ActionProps>;
}

export const testNamedAction = ({ name, NamedAction }: Options): void => {
	describe(`Action: ${name}`, () => {
		const testId = `smart-action-${name.toLocaleLowerCase()}-action}`;

		it('should capture and report a11y violations', async () => {
			const { container } = render(
				<IntlProvider locale="en">
					<NamedAction onClick={() => {}} testId={testId} />
				</IntlProvider>,
			);

			await expect(container).toBeAccessible();
		});

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
				expect(element).toHaveTextContent(name);
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
				expect(element).toHaveTextContent('spaghetti');
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
			expect(tooltip).toHaveTextContent(name);
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
