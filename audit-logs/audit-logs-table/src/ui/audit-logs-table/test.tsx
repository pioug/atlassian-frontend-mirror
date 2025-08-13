import React from 'react';

import { render, screen } from '@testing-library/react';

import { PROGRESS_BAR_TEST_ID } from './constants';

import AuditLogsTable from './index';

const testId = 'audit-logs-table';

describe('AuditLogsTable', () => {
	it('should capture and report a11y violations', async () => {
		const { container } = render(<AuditLogsTable testId={testId} />);

		await expect(container).toBeAccessible();
	});

	it('should find AuditLogsTable by its testid', async () => {
		render(<AuditLogsTable testId={testId} />);

		expect(screen.getByTestId(testId)).toBeTruthy();
	});
});

describe('Progress bar', () => {
	it('should have a left margin', () => {
		render(<AuditLogsTable testId={testId} />);

		expect(screen.getByTestId(PROGRESS_BAR_TEST_ID)).toHaveCompiledCss({
			marginLeft: 'var(--ds-space-100,8px)',
		});
	});
});
