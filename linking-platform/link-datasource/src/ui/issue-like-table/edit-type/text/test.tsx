import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl';

import { asMock } from '@atlaskit/link-test-helpers/jest/as-mock';
import { Box } from '@atlaskit/primitives/compiled/box';
import { Text } from '@atlaskit/primitives/compiled/text';
import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import { useDatasourceExperienceId } from '../../../../contexts/datasource-experience-id/use-datasource-experience-id';
import { type DatasourceTypeWithOnlyTypeValues } from '../../../issue-like-table/types';
import TextEditType from './index';

jest.mock('../../../../contexts/datasource-experience-id/use-datasource-experience-id');

describe('TextEditType', () => {
	const testId = 'inline-edit-text';
	const currentValue = {
		type: 'string',
		values: ['Some text'],
	} as DatasourceTypeWithOnlyTypeValues<'string'>;

	const setup = (parentKeyDownHandler: jest.Mock) =>
		render(
			<Box onKeyDown={parentKeyDownHandler}>
				<Text id="text-label">Summary</Text>
				<TextEditType
					id="text"
					isRequired={false}
					isDisabled={false}
					isInvalid={false}
					name="text"
					onBlur={() => {}}
					onChange={() => {}}
					onFocus={() => {}}
					currentValue={currentValue}
					setEditValues={jest.fn()}
					aria-invalid="false"
					aria-labelledby="text-label"
					labelId="text-label"
				/>
			</Box>,
			{
				wrapper: ({ children }) => <IntlProvider locale="en">{children}</IntlProvider>,
			},
		);

	beforeEach(() => {
		jest.clearAllMocks();
		asMock(useDatasourceExperienceId).mockReturnValue('experience-id');
	});

	it('should be accessible', async () => {
		failGate('platform-dst-top-layer');
		const { container } = setup(jest.fn());

		await expect(container).toBeAccessible();
	});

	it('should not prevent Escape when the top-layer gate is off', () => {
		failGate('platform-dst-top-layer');
		const parentKeyDownHandler = jest.fn();
		setup(parentKeyDownHandler);

		const isNotPrevented = fireEvent.keyDown(screen.getByTestId(testId), { key: 'Escape' });

		expect(isNotPrevented).toBe(true);
		expect(parentKeyDownHandler).toHaveBeenCalledTimes(1);
	});

	it('should leave Escape to the inline edit when the top-layer gate is on', () => {
		passGate('platform-dst-top-layer');
		const parentKeyDownHandler = jest.fn();
		setup(parentKeyDownHandler);

		const isNotPrevented = fireEvent.keyDown(screen.getByTestId(testId), { key: 'Escape' });

		// The inline edit cancels the edit and prevents the Escape, so a containing modal stays open.
		// See `datasource-modal/test.tsx`.
		expect(isNotPrevented).toBe(true);
		expect(parentKeyDownHandler).toHaveBeenCalledTimes(1);
	});
});
