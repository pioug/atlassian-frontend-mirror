// platform/packages/people-and-teams/profilecard/src/__tests__/unit/ProfileCardTrigger.test.tsx

import React from 'react';

import { fireEvent, render, waitFor } from '@testing-library/react';

import { Text } from '@atlaskit/primitives';

import ProfileCardTrigger from '../../../components/common/ProfileCardTrigger';

describe('ProfileCardTrigger', () => {
	const fetchProfile = jest.fn();
	const renderProfileCard = jest.fn();

	const renderWithIntl = ({ trigger }: { trigger: 'hover' | 'click' }) => {
		return render(
			<ProfileCardTrigger
				trigger={trigger}
				renderProfileCard={renderProfileCard}
				fetchProfile={fetchProfile}
				profileCardType="user"
			>
				<Text>Profile card Trigger</Text>
			</ProfileCardTrigger>,
		);
	};

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('should show profile card on mouse enter', async () => {
		const { getByText } = renderWithIntl({ trigger: 'hover' });

		fireEvent.mouseEnter(getByText('Profile card Trigger'));

		await waitFor(() => {
			expect(fetchProfile).toHaveBeenCalled();
			expect(renderProfileCard).toHaveBeenCalled();
		});
	});

	it('should show profile card on click', async () => {
		const { getByText } = renderWithIntl({ trigger: 'click' });

		fireEvent.click(getByText('Profile card Trigger'));

		await waitFor(() => {
			expect(fetchProfile).toHaveBeenCalled();
			expect(renderProfileCard).toHaveBeenCalled();
		});
	});
});
