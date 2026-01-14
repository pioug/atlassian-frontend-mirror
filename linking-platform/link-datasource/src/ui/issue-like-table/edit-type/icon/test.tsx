import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';

import { FlagsProvider } from '@atlaskit/flag';
import { asMock } from '@atlaskit/link-test-helpers/jest';
import { Box } from '@atlaskit/primitives/compiled';
import { ffTest } from '@atlassian/feature-flags-test-utils';

import { useDatasourceExperienceId } from '../../../../contexts/datasource-experience-id';
import { useLoadOptions } from '../../../../hooks/useLoadOptions';
import { type DatasourceTypeWithOnlyTypeValues } from '../../../issue-like-table/types';

import IconEditType from './index';

jest.mock('../../../../contexts/datasource-experience-id');
jest.mock('../../../../hooks/useLoadOptions');

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
			const container = screen.getByTestId('inline-edit-priority-select--container');

			// When portaled, menu should not be inside the container
			expect(container.contains(menu)).toBe(false);
		});
	});

	ffTest.off('platform_navx_sllv_j2ws_dropdown_for_single_row', '', () => {
		it('should render dropdown menu inline when feature flag is disabled', async () => {
			setup();

			const menu = await screen.findByRole('listbox');
			const container = screen.getByTestId('inline-edit-priority-select--container');

			// When not portaled, menu should be inside the container
			expect(container.contains(menu)).toBe(true);
		});
	});
});
