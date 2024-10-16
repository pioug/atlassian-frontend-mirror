import React from 'react';
import { fireEvent, screen } from '@testing-library/react';
import { renderWithIntl } from '@atlaskit/media-test-helpers/renderWithIntl';
import { getResolvedProps, mockUrl } from '../../../__mocks__/get-resolved-props';
import { type ResolvedViewProps } from '../../../../view/BlockCard/views/ResolvedView';
import { BlockCardUnauthorisedView } from '../../../../view/BlockCard';

let mockOnClick: React.MouseEventHandler = jest.fn();

describe('BlockCard Views - Unauthorised', () => {
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
		renderWithIntl(
			<BlockCardUnauthorisedView
				{...props}
				context={{ text: 'cool theatre stuff' }}
				testId="unauthorised-view"
				actions={[]}
			/>,
		);
		const nameFrame = screen.getByTestId('unauthorised-view-link');
		expect(nameFrame.textContent).toBe(mockUrl);
		const byline = screen.getByTestId('unauthorised-view-byline');
		expect(byline.textContent).toBe(
			`To show a preview of this link, connect your cool theatre stuff account.`,
		);
	});

	it('renders view with actions', () => {
		renderWithIntl(
			<BlockCardUnauthorisedView
				{...props}
				context={{ text: 'not allowed to view' }}
				testId="unauthorised-view"
				actions={[
					{
						id: 'test-button',
						text: 'One of a kind',
						promise: () => Promise.resolve('historemix'),
					},
				]}
			/>,
		);
		expect(screen.getByText('One of a kind')).toBeInTheDocument();
	});

	it('renders view with actions - reacts to click on action', async () => {
		renderWithIntl(
			<BlockCardUnauthorisedView
				{...props}
				context={{ text: 'not allowed to view' }}
				testId="unauthorised-view"
				actions={[
					{
						id: 'test-button',
						text: 'One of a kind',
						promise: () => Promise.resolve('historemix'),
					},
				]}
			/>,
		);
		// Check button is there
		const button = screen.getByTestId('button-test-button');
		expect(button).toBeInTheDocument();
		expect(button.textContent).toBe('One of a kind');

		// Click button, expecting it to succeed.
		fireEvent.click(button);
		const checkIcon = await screen.findByTestId('check-icon');
		expect(checkIcon).toBeInTheDocument();
	});

	it('does not render actions when actions are hidden', async () => {
		renderWithIntl(
			<BlockCardUnauthorisedView
				{...props}
				context={{ text: 'not allowed to view' }}
				testId="unauthorised-view"
				actionOptions={{ hide: true }}
				actions={[
					{
						id: 'test-button',
						text: 'One of a kind',
						promise: () => Promise.resolve('historemix'),
					},
				]}
			/>,
		);

		// Check button is not there
		expect(screen.queryByTestId('button-test-button')).toBeNull();
	});

	it('does render actions when action options are not hidden', async () => {
		renderWithIntl(
			<BlockCardUnauthorisedView
				{...props}
				context={{ text: 'not allowed to view' }}
				testId="unauthorised-view"
				actionOptions={{ hide: false }}
				actions={[
					{
						id: 'test-button',
						text: 'One of a kind',
						promise: () => Promise.resolve('historemix'),
					},
				]}
			/>,
		);

		// Check button is there
		const button = screen.getByTestId('button-test-button');
		expect(button).toBeInTheDocument();
		expect(button.textContent).toBe('One of a kind');
	});

	it('clicking on link should have no side-effects', () => {
		renderWithIntl(
			<BlockCardUnauthorisedView {...props} testId="unauthorised-view" actions={[]} />,
		);
		const view = screen.getByTestId('unauthorised-view');
		const link = view.querySelector('a');

		expect(link).toBeTruthy();
		fireEvent.click(link!);
		expect(mockOnClick).toHaveBeenCalledTimes(1);
	});
});
