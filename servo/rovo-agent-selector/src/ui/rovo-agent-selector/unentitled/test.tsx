import React from 'react';

import { IntlProvider } from 'react-intl-next';

import { render, screen } from '@atlassian/testing-library';

import messages from './messages';

import { UnentitledState } from './index';

const renderTest = ({ isRovoEnabled }: { isRovoEnabled: boolean }) => {
	return render(<UnentitledState isRovoEnabled={isRovoEnabled} />, {
		wrapper: ({ children }) => <IntlProvider locale="en">{children}</IntlProvider>,
	});
};
describe('<UnentitledState />', () => {
	describe('when site has no rovo entitlement', () => {
		it('should capture and report a11y violations', async () => {
			const { container } = renderTest({ isRovoEnabled: false });
			await expect(container).toBeAccessible();
		});

		it('should render correctly', () => {
			renderTest({ isRovoEnabled: false });
			expect(screen.getByText(messages.noRovoEntitlementText.defaultMessage)).toBeInTheDocument();
		});
	});

	describe('when site has rovo entitlement', () => {
		it('should capture and report a11y violations', async () => {
			const { container } = renderTest({ isRovoEnabled: true });
			await expect(container).toBeAccessible();
		});

		it('should render correctly', () => {
			renderTest({ isRovoEnabled: true });
			expect(
				screen.getByText(messages.noCreateAgentsPermissionText.defaultMessage),
			).toBeInTheDocument();
		});
	});
});
