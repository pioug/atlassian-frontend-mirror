import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithIntl } from '@atlaskit/media-test-helpers/renderWithIntl';
import { BlockCardForbiddenView } from '../../../../view/BlockCard';
import { type ResolvedViewProps } from '../../../../view/BlockCard/views/ResolvedView';
import { getResolvedProps } from '../../../__mocks__/get-resolved-props';

let mockOnClick: React.MouseEventHandler = jest.fn();
describe('Block card views - Forbidden', () => {
	let props: ResolvedViewProps;

	beforeEach(() => {
		mockOnClick = jest.fn().mockImplementation((event: React.MouseEvent) => {
			expect(event.isPropagationStopped()).toBe(true);
			expect(event.isDefaultPrevented()).toBe(true);
		});
		props = getResolvedProps({}, mockOnClick);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('renders view', () => {
		renderWithIntl(<BlockCardForbiddenView {...props} testId="forbidden-view" />);
		const frame = screen.getByTestId('forbidden-view');
		expect(frame.textContent).toMatch(
			/https:\/\/github.com\/changesets\/changesetsYou'll need to request access or try a different account to view this preview./,
		);
		const icon = screen.getByTestId('forbidden-view-lock-icon');
		expect(icon.getAttribute('aria-label')).toBe('forbidden-lock-icon');
	});

	it('clicking on link should have no side-effects', () => {
		renderWithIntl(<BlockCardForbiddenView {...props} testId="forbidden-view" />);
		const view = screen.getByTestId('forbidden-view');
		const link = view.querySelector('a');

		expect(link).toBeTruthy();
		fireEvent.click(link!);
		expect(mockOnClick).toHaveBeenCalledTimes(1);
	});

	it('should show correct text if request access type is DIRECT_ACCESS', () => {
		const mockOnClick = jest.fn();
		const requestAccessContext = {
			descriptiveMessageKey: 'click_to_join_description',
			action: {
				promise: () => new Promise((resolve) => resolve(mockOnClick())),
				id: 'click_to_join',
				text: 'Join to preview',
			},
		};
		renderWithIntl(
			<BlockCardForbiddenView
				{...props}
				requestAccessContext={requestAccessContext as any}
				context={{ text: 'Jira' }}
				testId="forbidden-view"
			/>,
		);
		const span = screen.queryByText("You've been approved, so you can join Jira right away.");
		expect(span).not.toBeNull();
	});

	it('should show correct button text and have action if request access type is DIRECT_ACCESS', () => {
		const mockOnClick = jest.fn();
		const requestAccessContext = {
			descriptiveMessageKey: 'click_to_join_description',
			action: {
				promise: () => new Promise((resolve) => resolve(mockOnClick())),
				id: 'click_to_join',
				text: 'Join Jira',
			},
		};
		renderWithIntl(
			<BlockCardForbiddenView
				{...props}
				requestAccessContext={requestAccessContext as any}
				context={{ text: 'Jira' }}
				testId="forbidden-view"
			/>,
		);
		const button = screen.queryByText('Join Jira');
		expect(button).not.toBeNull();
		fireEvent.click(button!);
		expect(mockOnClick).toHaveBeenCalledTimes(1);
	});

	it('should show correct text if request access type is REQUEST_ACCESS', () => {
		const mockOnClick = jest.fn();
		const requestAccessContext = {
			descriptiveMessageKey: 'request_access_description',
			action: {
				promise: () => new Promise((resolve) => resolve(mockOnClick())),
				id: 'request_access',
				text: 'Request access to preview',
			},
		};
		renderWithIntl(
			<BlockCardForbiddenView
				{...props}
				requestAccessContext={requestAccessContext as any}
				context={{ text: 'Jira' }}
				testId="forbidden-view"
			/>,
		);
		const span = screen.queryByText(
			'Your team uses Jira to collaborate. Send your admin a request for access.',
		);
		expect(span).not.toBeNull();
	});

	it('should show correct button text and have action if request access type is REQUEST_ACCESS', () => {
		const mockOnClick = jest.fn();
		const requestAccessContext = {
			descriptiveMessageKey: 'request_access_description',
			action: {
				promise: () => new Promise((resolve) => resolve(mockOnClick())),
				id: 'request_access',
				text: 'Request access',
			},
		};
		renderWithIntl(
			<BlockCardForbiddenView
				{...props}
				requestAccessContext={requestAccessContext as any}
				context={{ text: 'Jira' }}
				testId="forbidden-view"
			/>,
		);
		const button = screen.queryByText('Request access');
		expect(button).not.toBeNull();
		fireEvent.click(button!);
		expect(mockOnClick).toHaveBeenCalledTimes(1);
	});

	it('should show correct text if request access type is PENDING_REQUEST_EXISTS', () => {
		const requestAccessContext = {
			descriptiveMessageKey: 'request_access_pending_description',
			hostname: 'Jira',
		};
		renderWithIntl(
			<BlockCardForbiddenView
				{...props}
				requestAccessContext={requestAccessContext as any}
				context={{ text: 'Jira' }}
				testId="forbidden-view"
			/>,
		);
		const span = screen.queryByText('Your request to access Jira is awaiting admin approval.');
		expect(span).not.toBeNull();
	});

	it('should not show pending request button text if request access type is PENDING_REQUEST_EXISTS', () => {
		const requestAccessContext = {
			descriptiveMessageKey: 'request_access_description',
		};
		renderWithIntl(
			<BlockCardForbiddenView
				{...props}
				requestAccessContext={requestAccessContext as any}
				context={{ text: 'Jira' }}
				testId="forbidden-view"
			/>,
		);
		const button = screen.queryByRole('button');
		expect(button).toBeNull();
	});

	it('should show correct text if request access type is FORBIDDEN', () => {
		const props = getResolvedProps();
		const requestAccessContext = {
			descriptiveMessageKey: 'forbidden_description',
			hostname: 'Jira',
		};
		renderWithIntl(
			<BlockCardForbiddenView
				{...props}
				requestAccessContext={requestAccessContext as any}
				context={{ text: 'Jira' }}
				testId="forbidden-view"
			/>,
		);
		const span = screen.queryByText('Contact your admin to request access to Jira.');
		expect(span).not.toBeNull();
	});

	it('should not show forbidden button text if request access type is FORBIDDEN', () => {
		const props = getResolvedProps();
		const requestAccessContext = {
			descriptiveMessageKey: 'forbidden_description',
		};
		const { container } = renderWithIntl(
			<BlockCardForbiddenView
				{...props}
				requestAccessContext={requestAccessContext as any}
				context={{ text: 'Jira' }}
				testId="forbidden-view"
			/>,
		);
		const button = container.querySelector('[type="button"]');
		expect(button).toBeNull();
	});

	it('should show correct text if request access type is DENIED_REQUEST_EXISTS', () => {
		const props = getResolvedProps();
		const requestAccessContext = {
			descriptiveMessageKey: 'request_denied_description',
			hostname: 'Jira',
		};
		renderWithIntl(
			<BlockCardForbiddenView
				{...props}
				requestAccessContext={requestAccessContext as any}
				context={{ text: 'Jira' }}
				testId="forbidden-view"
			/>,
		);
		const span = screen.queryByText(
			"Your admin didn't approve your request to view Jira pages from Jira.",
		);
		expect(span).not.toBeNull();
	});

	it('should not show request denied button text if request access type is DENIED_REQUEST_EXISTS', () => {
		const props = getResolvedProps();
		const requestAccessContext = {
			descriptiveMessageKey: 'request_denied_description',
		};
		renderWithIntl(
			<BlockCardForbiddenView
				{...props}
				requestAccessContext={requestAccessContext as any}
				context={{ text: 'Jira' }}
				testId="forbidden-view"
			/>,
		);
		const button = screen.queryByRole('button)');
		expect(button).toBeNull();
	});
});
