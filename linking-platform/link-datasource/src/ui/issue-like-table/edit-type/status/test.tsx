import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';

import { FlagsProvider } from '@atlaskit/flag';
import { asMock } from '@atlaskit/link-test-helpers/jest';
import { ffTest } from '@atlassian/feature-flags-test-utils';

import { useDatasourceExperienceId } from '../../../../contexts/datasource-experience-id';
import { useLoadOptions } from '../../../../hooks/useLoadOptions';
import { type DatasourceTypeWithOnlyTypeValues } from '../../../issue-like-table/types';

import StatusEditType from './index';

jest.mock('../../../../contexts/datasource-experience-id');
jest.mock('../../../../hooks/useLoadOptions');

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

	const setup = (props?: Partial<React.ComponentProps<typeof StatusEditType>>) =>
		render(
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
			/>,
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

	ffTest.on('navx-sllv-fix-inline-edit-error', '', () => {
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
	});
});
