import React from 'react';

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { IntlProvider } from 'react-intl';

import { FlagsProvider } from '@atlaskit/flag/flags-provider';
import { asMock } from '@atlaskit/link-test-helpers/jest/as-mock';
import { Box } from '@atlaskit/primitives/compiled/box';
import { skipAutoA11yFile } from '@atlassian/a11y-jest-testing/skip-file-decorator';
import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';
import { userEvent } from '@atlassian/testing-library/user-event';

import { useDatasourceExperienceId } from '../../../../contexts/datasource-experience-id/use-datasource-experience-id';
import { useLoadOptions } from '../../../../hooks/useLoadOptions';
import { type DatasourceTypeWithOnlyTypeValues } from '../../../issue-like-table/types';
import IconEditType from './index';

jest.mock('../../../../contexts/datasource-experience-id/use-datasource-experience-id');
jest.mock('../../../../hooks/useLoadOptions');

// This file exposes one or more accessibility violations. Testing is currently skipped but violations need to
// be fixed in a timely manner or result in escalation. Once all violations have been fixed, you can remove
// the next line and associated import. For more information, see go/afm-a11y-tooling:jest
skipAutoA11yFile();

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('IconEditType', () => {
	const testId = 'inline-edit-priority-select--input';
	const setEditValues = jest.fn();
	const values = [
		{ label: 'major', source: 'data:image/svg+xml;base64...', text: 'Major', id: '1' },
	];
	const options = [
		...values,
		{ label: 'blocker', source: 'data:image/svg+xml;base64...', text: 'Blocker', id: '2' },
	];
	const currentValue = { type: 'icon', values } as DatasourceTypeWithOnlyTypeValues<'icon'>;
	const mockUseLoadOptions = asMock(useLoadOptions);
	const mockUseDatasourceExperienceId = asMock(useDatasourceExperienceId);

	const setup = (
		props?: Partial<React.ComponentProps<typeof IconEditType>>,
		parentKeyDownHandler?: jest.Mock,
	) =>
		render(
			<Box onKeyDown={parentKeyDownHandler}>
				<IconEditType
					id="icon"
					isRequired={false}
					isDisabled={false}
					isInvalid={false}
					name="icon"
					onBlur={() => {}}
					onChange={() => {}}
					onFocus={() => {}}
					currentValue={currentValue}
					setEditValues={setEditValues}
					aria-invalid="false"
					aria-labelledby="icon"
					{...props}
				/>
			</Box>,
			{
				wrapper: ({ children }) => (
					<IntlProvider locale="en">
						<FlagsProvider>{children}</FlagsProvider>
					</IntlProvider>
				),
			},
		);

	beforeEach(() => {
		jest.clearAllMocks();
		mockUseDatasourceExperienceId.mockImplementation(() => 'experience-id');
		mockUseLoadOptions.mockReturnValue({ options, isLoading: false, hasFailed: false });
	});

	it('should render icon type component', async () => {
		asMock(useDatasourceExperienceId).mockReturnValue('');

		setup();

		expect(await screen.findByTestId(testId)).toBeInTheDocument();
	});

	it.each([
		['undefined object', undefined],
		['empty array', []],
		['empty item', [{}]],
		['no text', [{ transitions: [] }]],
		['wrong text type', [{ text: true }]],
	])('should not throw error when receives invalid options with %s', async (_, options) => {
		mockUseLoadOptions.mockReturnValue({
			options,
			isLoading: false,
			hasFailed: false,
		});

		expect(() => setup()).not.toThrow();
	});

	it('should stop propagation of Escape key event', async () => {
		failGate('platform-dst-top-layer');
		const parentKeyDownHandler = jest.fn();

		setup(undefined, parentKeyDownHandler);

		const input = await screen.findByTestId(testId);

		// Fire Escape key event on the input (menu is open by default)
		fireEvent.keyDown(input, { key: 'Escape' });

		// Event should not propagate to parent because stopPropagation is called
		expect(parentKeyDownHandler).not.toHaveBeenCalled();
	});

	it('should update the edit value when an option is selected', async () => {
		setup();

		await userEvent.click(await screen.findByRole('option', { name: 'Blocker' }));

		expect(setEditValues).toHaveBeenCalledWith({ type: 'icon', values: [options[1]] });
	});

	describe('with the top-layer gate on', () => {
		beforeEach(() => {
			passGate('platform-dst-top-layer');
		});

		it('should close the open menu on Escape without cancelling the edit', async () => {
			const parentKeyDownHandler = jest.fn();
			setup(undefined, parentKeyDownHandler);
			const input = await screen.findByTestId(testId);
			expect(await screen.findByRole('listbox')).toBeInTheDocument();

			const isNotPrevented = fireEvent.keyDown(input, { key: 'Escape' });

			expect(isNotPrevented).toBe(false);
			expect(parentKeyDownHandler).not.toHaveBeenCalled();
			await waitFor(() => expect(screen.queryByRole('listbox')).not.toBeInTheDocument());
		});

		it('should let Escape reach the inline edit when the menu is closed, and prevent it so a modal stays open', async () => {
			const parentKeyDownHandler = jest.fn();
			setup(undefined, parentKeyDownHandler);
			const input = await screen.findByTestId(testId);
			expect(await screen.findByRole('listbox')).toBeInTheDocument();
			fireEvent.keyDown(input, { key: 'Escape' });
			await waitFor(() => expect(screen.queryByRole('listbox')).not.toBeInTheDocument());

			const isNotPrevented = fireEvent.keyDown(input, { key: 'Escape' });

			expect(isNotPrevented).toBe(false);
			expect(parentKeyDownHandler).toHaveBeenCalledTimes(1);
		});
	});
});
