import React from 'react';

import {
	fireEvent,
	render,
	screen,
	waitFor,
	waitForElementToBeRemoved,
	within,
} from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';

import { AuditLogExportButton } from './index';

const testId = 'audit-logs-export';

// Helper function to wrap components with IntlProvider
const renderWithIntl = (component: React.ReactElement) => {
	return render(
		<IntlProvider locale="en" messages={{}}>
			{component}
		</IntlProvider>,
	);
};

describe('AuditLogExportButton', () => {
	it('should capture and report a11y violations', async () => {
		const { container } = renderWithIntl(
			<AuditLogExportButton testId={testId} onExport={jest.fn()} orgId="test-org-123" />,
		);

		await expect(container).toBeAccessible();
	});

	it('should find AuditLogExportButton by its testid', async () => {
		renderWithIntl(
			<AuditLogExportButton testId={testId} onExport={jest.fn()} orgId="test-org-123" />,
		);

		expect(screen.getByTestId(testId)).toBeTruthy();
	});
});

describe('AuditLogExportButton', () => {
	const mockOnExport = jest.fn();
	const defaultProps = {
		onExport: mockOnExport,
		orgId: 'test-org-123',
		search: '?from=2023-01-01&to=2023-12-31',
		testId: 'audit-log-export-button',
	};

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should render the export button', () => {
		renderWithIntl(<AuditLogExportButton {...defaultProps} />);

		expect(screen.getByTestId('audit-log-export-button')).toBeInTheDocument();
		expect(screen.getByText('Export')).toBeInTheDocument();
	});

	it('should open modal when export button is clicked', () => {
		renderWithIntl(<AuditLogExportButton {...defaultProps} />);

		fireEvent.click(screen.getByTestId('audit-log-export-button'));

		const modal = screen.getByTestId('modal-dialog');
		expect(within(modal).getByText('Export log')).toBeInTheDocument();
		expect(within(modal).getByTestId('modal-dialog--body')).toHaveTextContent(
			"We'll email you a CSV file of all activities matching your filter criteria is ready to download.",
		);
	});

	it('should close modal when cancel button is clicked', async () => {
		renderWithIntl(<AuditLogExportButton {...defaultProps} />);

		// Open modal
		fireEvent.click(screen.getByTestId('audit-log-export-button'));
		const modal = screen.getByTestId('modal-dialog');
		expect(within(modal).getByText('Export log')).toBeInTheDocument();

		// Close modal
		fireEvent.click(within(modal).getByText('Cancel'));
		await waitForElementToBeRemoved(() => screen.queryByTestId('modal-dialog'));
		expect(screen.queryByTestId('modal-dialog')).not.toBeInTheDocument();
	});

	it('should show terms and conditions checkbox', () => {
		renderWithIntl(<AuditLogExportButton {...defaultProps} />);

		fireEvent.click(screen.getByTestId('audit-log-export-button'));

		const modal = screen.getByTestId('modal-dialog');
		expect(within(modal).getByText('Please read and accept to continue')).toBeInTheDocument();
		expect(
			within(modal).getByText(
				/I understand that if I share these audit logs with people that don't otherwise have access to them, any existing user permissions set in Atlassian Administration and other apps will no longer apply to them./,
			),
		).toBeInTheDocument();
		// Checkbox is rendered inside a label, so query within the modal for the input instead
		expect(within(modal).getByRole('checkbox', { name: 'checkbox' })).toBeInTheDocument();
	});

	it('should show error when trying to export without accepting terms', async () => {
		renderWithIntl(<AuditLogExportButton {...defaultProps} />);

		fireEvent.click(screen.getByTestId('audit-log-export-button'));

		const modal = screen.getByTestId('modal-dialog');
		fireEvent.click(within(modal).getByText('Export'));

		await waitFor(() => {
			expect(within(modal).getByText('This field is required')).toBeInTheDocument();
		});

		expect(mockOnExport).not.toHaveBeenCalled();
	});

	it('should call onExport when terms are accepted and export is clicked', async () => {
		const mockOnSuccess = jest.fn();
		renderWithIntl(<AuditLogExportButton {...defaultProps} onSuccess={mockOnSuccess} />);

		fireEvent.click(screen.getByTestId('audit-log-export-button'));
		const modal = screen.getByTestId('modal-dialog');
		fireEvent.click(within(modal).getByRole('checkbox', { name: 'checkbox' }));
		fireEvent.click(within(modal).getByText('Export'));

		await waitFor(() => {
			expect(mockOnExport).toHaveBeenCalledWith({
				orgId: 'test-org-123',
				from: '2023-01-01',
				to: '2023-12-31',
				q: undefined,
				action: undefined,
				actor: undefined,
				ip: undefined,
				location: undefined,
				product: undefined,
			});
		});
	});

	it('should call onSuccess when export succeeds', async () => {
		mockOnExport.mockResolvedValue(undefined);
		const mockOnSuccess = jest.fn();

		renderWithIntl(<AuditLogExportButton {...defaultProps} onSuccess={mockOnSuccess} />);

		fireEvent.click(screen.getByTestId('audit-log-export-button'));
		const modal = screen.getByTestId('modal-dialog');
		fireEvent.click(within(modal).getByRole('checkbox', { name: 'checkbox' }));
		fireEvent.click(within(modal).getByText('Export'));

		await waitFor(() => {
			expect(mockOnSuccess).toHaveBeenCalled();
		});
	});

	it('should call onError when export fails', async () => {
		const testError = new Error('Export failed');
		mockOnExport.mockRejectedValue(testError);
		const mockOnError = jest.fn();

		renderWithIntl(<AuditLogExportButton {...defaultProps} onError={mockOnError} />);

		fireEvent.click(screen.getByTestId('audit-log-export-button'));
		const modal = screen.getByTestId('modal-dialog');
		fireEvent.click(within(modal).getByRole('checkbox', { name: 'checkbox' }));
		fireEvent.click(within(modal).getByText('Export'));

		await waitFor(() => {
			expect(mockOnError).toHaveBeenCalled();
		});
	});

	it('should clear error state when terms checkbox is checked', () => {
		renderWithIntl(<AuditLogExportButton {...defaultProps} />);

		fireEvent.click(screen.getByTestId('audit-log-export-button'));
		const modal = screen.getByTestId('modal-dialog');
		fireEvent.click(within(modal).getByText('Export')); // This should show error

		expect(within(modal).getByText('This field is required')).toBeInTheDocument();

		fireEvent.click(within(modal).getByRole('checkbox', { name: 'checkbox' })); // Check terms

		expect(within(modal).queryByText('This field is required')).not.toBeInTheDocument();
	});

	it('should be accessible', async () => {
		const { container } = renderWithIntl(<AuditLogExportButton {...defaultProps} />);

		await expect(container).toBeAccessible();
	});
});
