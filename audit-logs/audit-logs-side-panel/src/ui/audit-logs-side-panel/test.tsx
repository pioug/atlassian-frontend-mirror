import React from 'react';

import { render, screen } from '@testing-library/react';

import { PROGRESS_BAR_TEST_ID } from './constants';

import AuditLogsSidePanel from './index';

const testId = 'audit-logs-side-panel';

describe('AuditLogsSidePanel', () => {
	it('should capture and report a11y violations', async () => {
		const { container } = render(<AuditLogsSidePanel testId={testId} />);

		await expect(container).toBeAccessible();
	});

	it('should find AuditLogsSidePanel by its testid', async () => {
		render(<AuditLogsSidePanel testId={testId} />);

		expect(screen.getByTestId(testId)).toBeTruthy();
	});
});

describe('Progress bar', () => {
	it('should have a left margin', () => {
		render(<AuditLogsSidePanel testId={testId} />);

		expect(screen.getByTestId(PROGRESS_BAR_TEST_ID)).toHaveCompiledCss({
			marginLeft: 'var(--ds-space-100,8px)',
		});
	});
});
