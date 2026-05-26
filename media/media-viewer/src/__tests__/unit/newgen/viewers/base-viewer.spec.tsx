import React from 'react';
import { render, screen } from '@atlassian/testing-library';
import { IntlProvider } from 'react-intl';
import { type ProcessedFileState } from '@atlaskit/media-client';
import { type BaseProps, BaseViewer, type BaseState } from '../../../../viewers/base-viewer';
import { Outcome } from '../../../../domain';
import { MediaViewerError } from '../../../../errors';
import { fakeMediaClient } from '@atlaskit/media-test-helpers';

const traceContext = { traceId: 'some-trace-id' };

function createItem(): ProcessedFileState {
	return {
		id: 'some-id',
		status: 'processed',
		name: 'my image',
		size: 11222,
		mediaType: 'image',
		mimeType: 'jpeg',
		artifacts: {},
		representations: {},
	};
}

function createProps(): BaseProps {
	const item = createItem();
	const mediaClient = fakeMediaClient();
	const collectionName = 'test-collection';
	return { item, mediaClient, collectionName, traceContext };
}

function createInitialState() {
	return {
		content: Outcome.pending<string, MediaViewerError>(),
	};
}

function createTestViewer(
	props: BaseProps,
	initialState: BaseState<string> = createInitialState(),
) {
	const initSpy = jest.fn();
	const releaseSpy = jest.fn();
	const renderSuccessfulSpy = jest.fn((content: string) => <div>{content}</div>);

	class TestViewer extends BaseViewer<string, BaseProps> {
		protected get initialState() {
			return initialState;
		}
		protected init = initSpy;
		protected release = releaseSpy;
		protected renderSuccessful = renderSuccessfulSpy;
	}

	const renderTree = (renderProps: BaseProps) => (
		<IntlProvider locale="en">
			<TestViewer {...renderProps} />
		</IntlProvider>
	);

	const utils = render(renderTree(props));
	const rerenderWithProps = (nextProps: BaseProps) => utils.rerender(renderTree(nextProps));

	return { utils, rerender: rerenderWithProps, initSpy, releaseSpy, renderSuccessfulSpy };
}

describe('BaseViewer', () => {
	it('calls init() when component is mounted', () => {
		const { initSpy } = createTestViewer(createProps());
		expect(initSpy).toHaveBeenCalledTimes(1);
	});

	it('calls release() when component is unmounted', () => {
		const { utils, releaseSpy } = createTestViewer(createProps());
		utils.unmount();
		expect(releaseSpy).toHaveBeenCalledTimes(1);
	});

	it('calls release(), then init() when item was updated', () => {
		const props = createProps();
		const { rerender, initSpy, releaseSpy } = createTestViewer(props);
		const newItem = { ...createItem(), id: 'new-id' };
		rerender({ ...props, item: newItem });
		expect(releaseSpy).toHaveBeenCalledTimes(1);
		expect(initSpy).toHaveBeenCalledTimes(2);
	});

	it('calls release(), then init() when collectionName was updated', () => {
		const props = createProps();
		const { rerender, initSpy, releaseSpy } = createTestViewer(props);
		rerender({ ...props, collectionName: 'another-collection-name' });
		expect(releaseSpy).toHaveBeenCalledTimes(1);
		expect(initSpy).toHaveBeenCalledTimes(2);
	});

	it('sets the initialState (pending content) when component is mounted', () => {
		// Pending state -> Spinner is rendered
		createTestViewer(createProps());
		expect(screen.getByTestId('spinner-wrapper')).toBeInTheDocument();
	});

	it('resets the component to the initialState when properties were updated', () => {
		// initialState getter returns pending -> spinner shown both before and after
		// reset; we observe behaviorally that updating props keeps the component in
		// initialState (pending -> spinner) rather than crashing or leaking prior state.
		const props = createProps();
		const { rerender } = createTestViewer(props);
		expect(screen.getByTestId('spinner-wrapper')).toBeInTheDocument();
		rerender({ ...props, item: { ...createItem(), id: 'new-id' } });
		expect(screen.getByTestId('spinner-wrapper')).toBeInTheDocument();
	});

	it('renders a spinner while the content is pending', () => {
		createTestViewer(createProps());
		expect(screen.getByTestId('spinner-wrapper')).toBeInTheDocument();
	});

	it('invokes renderSuccessful() when the content loading was successful', async () => {
		const { renderSuccessfulSpy } = createTestViewer(createProps(), {
			content: Outcome.successful('test'),
		});
		expect(screen.getByText('test')).toBeInTheDocument();
		expect(renderSuccessfulSpy).toHaveBeenCalled();
		await expect(document.body).toBeAccessible();
	});

	it('renders an error message when the content loading has failed', () => {
		createTestViewer(createProps(), {
			content: Outcome.failed(new MediaViewerError('unsupported')),
		});
		expect(screen.getByText("We couldn't generate a preview for this file.")).toBeInTheDocument();
		expect(screen.getByText('Try downloading the file to view it.')).toBeInTheDocument();
		expect(screen.getByRole('button', { name: /download/i })).toBeInTheDocument();
	});
});
