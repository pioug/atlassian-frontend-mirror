import React from 'react';

import { render, screen } from '@testing-library/react';

import AuditLogEventsQueryController from './index';

const testId = 'audit-log-events-query-controller';

describe('AuditLogEventsQueryController', () => {
	it('should capture and report a11y violations', async () => {
		const { container } = render(<AuditLogEventsQueryController testId={testId} />);

		await expect(container).toBeAccessible();
	});

	it('should render the component with placeholder text and be findable by testId', () => {
		render(<AuditLogEventsQueryController testId={testId} />);

		expect(screen.getByTestId(`${testId}-events-query-controller-container`)).toBeInTheDocument();
		expect(screen.getByText('Query Mode Switcher Placeholder')).toBeInTheDocument();
		expect(screen.getByText('Basic Query Filter Controller')).toBeInTheDocument();
		expect(screen.getByText('ALQL Query Filter Controller')).toBeInTheDocument();
	});

	it('should render with default props when no props are provided', () => {
		render(<AuditLogEventsQueryController />);

		expect(screen.getByText('Query Mode Switcher Placeholder')).toBeInTheDocument();
	});

	it('should render with custom testId prop and be findable by testId', () => {
		const customTestId = 'custom-test-id';
		render(<AuditLogEventsQueryController testId={customTestId} />);

		expect(
			screen.getByTestId(`${customTestId}-events-query-controller-container`),
		).toBeInTheDocument();
		expect(screen.getByText('Query Mode Switcher Placeholder')).toBeInTheDocument();
	});
});
