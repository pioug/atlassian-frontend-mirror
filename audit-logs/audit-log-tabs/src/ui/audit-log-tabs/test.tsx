import React from 'react';

import { IntlProvider } from 'react-intl-next';

import { render, screen, userEvent } from '@atlassian/testing-library';

import AuditLogTabs from './index';

const testId = 'audit-log-tabs';

const renderWithIntl = (component: React.ReactElement) => {
	return render(<IntlProvider locale="en">{component}</IntlProvider>);
};

describe('AuditLogTabs', () => {
	it('should capture and report a11y violations', async () => {
		const { container } = renderWithIntl(<AuditLogTabs testId={testId} />);

		await expect(container).toBeAccessible();
	});

	it('should render the tabs component', async () => {
		renderWithIntl(<AuditLogTabs testId={testId} />);

		// Check if the tabs component is rendered
		expect(screen.getByRole('tablist')).toBeInTheDocument();
	});

	it('should render Home tab by default', () => {
		renderWithIntl(<AuditLogTabs testId={testId} />);

		expect(screen.getByText('Home')).toBeInTheDocument();
		expect(screen.getByText('Home tab content goes here')).toBeInTheDocument();
	});

	it('should render Asynchronous queries tab', () => {
		renderWithIntl(<AuditLogTabs testId={testId} />);

		expect(screen.getByText('Asynchronous queries')).toBeInTheDocument();
	});

	it('should switch to Asynchronous queries tab when clicked', async () => {
		const user = userEvent.setup();
		renderWithIntl(<AuditLogTabs testId={testId} />);

		const asyncTab = screen.getByText('Asynchronous queries');
		await user.click(asyncTab);

		expect(screen.getByText('Asynchronous queries tab content goes here')).toBeInTheDocument();
	});
});
