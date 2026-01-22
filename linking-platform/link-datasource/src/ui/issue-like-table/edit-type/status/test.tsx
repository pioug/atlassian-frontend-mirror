import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';

import { FlagsProvider } from '@atlaskit/flag';
import { asMock } from '@atlaskit/link-test-helpers/jest';
import { Box } from '@atlaskit/primitives/compiled';
import { skipAutoA11yFile } from '@atlassian/a11y-jest-testing';
import { ffTest } from '@atlassian/feature-flags-test-utils';

import { useDatasourceExperienceId } from '../../../../contexts/datasource-experience-id';
import { useLoadOptions } from '../../../../hooks/useLoadOptions';
import { type DatasourceTypeWithOnlyTypeValues } from '../../../issue-like-table/types';

import StatusEditType from './index';

jest.mock('../../../../contexts/datasource-experience-id');
jest.mock('../../../../hooks/useLoadOptions');

// This file exposes one or more accessibility violations. Testing is currently skipped but violations need to
// be fixed in a timely manner or result in escalation. Once all violations have been fixed, you can remove
// the next line and associated import. For more information, see go/afm-a11y-tooling:jest
skipAutoA11yFile();

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('StatusEditType', () => {
	const testId = 'inline-edit-status-select--input';
	const setEditValues = jest.fn();
	const values = [
		{
			text: 'To do',
			style: { appearance: 'new' },
		},
	];
	const options = [
		...values,
		{
			text: 'Backlog',
			style: { appearance: 'default' },
		},
	];
	const currentValue = { type: 'status', values } as DatasourceTypeWithOnlyTypeValues<'status'>;
	const mockUseLoadOptions = asMock(useLoadOptions);
	const mockUseDatasourceExperienceId = asMock(useDatasourceExperienceId);

	const setup = (
		props?: Partial<React.ComponentProps<typeof StatusEditType>>,
		parentKeyDownHandler?: jest.Mock,
	) =>
		render(
			<Box onKeyDown={parentKeyDownHandler}>
				<StatusEditType
					id="status"
					isRequired={false}
					isDisabled={false}
					isInvalid={false}
					name="status"
					onBlur={() => {}}
					onChange={() => {}}
					onFocus={() => {}}
					currentValue={currentValue}
					setEditValues={setEditValues}
					aria-invalid="false"
					aria-labelledby="status"
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
		mockUseLoadOptions.mockReturnValue({
			options,
			isLoading: false,
			hasFailed: false,
		});
	});

	it('should render status type component', async () => {
		asMock(useDatasourceExperienceId).mockReturnValue('');

		setup();

		expect(await screen.findByTestId(testId)).toBeInTheDocument();
	});

	it('should render status options', async () => {
		setup();

		const component = await screen.findByTestId(testId);

		fireEvent.click(component);

		expect(await screen.findByText('Backlog')).toBeInTheDocument();
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

		expect(async () => {
			setup();

			const component = await screen.findByTestId(testId);

			fireEvent.click(component);
		}).not.toThrow();
	});

	ffTest.on(
		'platform_navx_sllv_dropdown_escape_and_focus_fix',
		'shouldPreventEscapePropagation when feature flag is on',
		() => {
			it('should stop propagation of Escape key event when feature flag is enabled', async () => {
				const parentKeyDownHandler = jest.fn();

				setup(undefined, parentKeyDownHandler);

				const input = await screen.findByTestId(testId);

				// Fire Escape key event on the input (menu is open by default)
				fireEvent.keyDown(input, { key: 'Escape' });

				// Event should not propagate to parent because stopPropagation is called
				expect(parentKeyDownHandler).not.toHaveBeenCalled();
			});
		},
	);

	ffTest.off(
		'platform_navx_sllv_dropdown_escape_and_focus_fix',
		'shouldPreventEscapePropagation when feature flag is off',
		() => {
			it('should not stop propagation of Escape key event when feature flag is disabled', async () => {
				const parentKeyDownHandler = jest.fn();

				setup(undefined, parentKeyDownHandler);

				const input = await screen.findByTestId(testId);

				// Fire Escape key event on the input (menu is open by default)
				fireEvent.keyDown(input, { key: 'Escape' });

				// Event should propagate to parent because stopPropagation is not called
				expect(parentKeyDownHandler).toHaveBeenCalled();
			});
		},
	);

	ffTest.on('platform_navx_sllv_j2ws_dropdown_for_single_row', '', () => {
		it('should render dropdown menu in portal when feature flag is enabled', async () => {
			setup();

			const menu = await screen.findByRole('listbox');
			const container = screen.getByTestId('inline-edit-status-select--container');

			// When portaled, menu should not be inside the container
			expect(container.contains(menu)).toBe(false);
		});
	});

	ffTest.off('platform_navx_sllv_j2ws_dropdown_for_single_row', '', () => {
		it('should render dropdown menu inline when feature flag is disabled', async () => {
			setup();

			const menu = await screen.findByRole('listbox');
			const container = screen.getByTestId('inline-edit-status-select--container');

			// When not portaled, menu should be inside the container
			expect(container.contains(menu)).toBe(true);
		});
	});
});
