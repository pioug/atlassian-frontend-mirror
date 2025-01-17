import React from 'react';
import Button from '@atlaskit/button/custom-theme-button';
import { type ProcessedFileState } from '@atlaskit/media-client';
import { type BaseProps, BaseViewer, type BaseState } from '../../../../viewers/base-viewer';
import { Outcome } from '../../../../domain';
import { ErrorMessage } from '../../../../errorMessage';
import { MediaViewerError } from '../../../../errors';
import { Spinner } from '../../../../loading';
import { fakeMediaClient } from '@atlaskit/media-test-helpers';
import { mount } from 'enzyme';
import { IntlProvider } from 'react-intl-next';

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

	// 'setProps' can only set props of the root component.
	// Therefore, we require this component to pass the root props to the child component that we are testing
	const PropsPasser = (props: BaseProps) => {
		return (
			<IntlProvider locale="en">
				<TestViewer {...props} />
			</IntlProvider>
		);
	};

	const el = mount(<PropsPasser {...props} />);
	return { TestViewer, el, initSpy, releaseSpy, renderSuccessfulSpy };
}

describe('BaseViewer', () => {
	it('calls init() when component is mounted', () => {
		const { initSpy } = createTestViewer(createProps());
		expect(initSpy).toHaveBeenCalledTimes(1);
	});

	it('calls release() when component is unmounted', () => {
		const { el, releaseSpy } = createTestViewer(createProps());
		el.unmount();
		expect(releaseSpy).toHaveBeenCalledTimes(1);
	});

	it('calls release(), then init() when item was updated', () => {
		const { el, initSpy, releaseSpy } = createTestViewer(createProps());
		const newItem = { ...createItem(), id: 'new-id' };
		el.setProps({ item: newItem });
		expect(releaseSpy).toHaveBeenCalledTimes(1);
		expect(initSpy).toHaveBeenCalledTimes(2);
	});

	it('calls release(), then init() when collectionName was updated', () => {
		const { el, initSpy, releaseSpy } = createTestViewer(createProps());
		el.setProps({ collectionName: 'another-collection-name' });
		expect(releaseSpy).toHaveBeenCalledTimes(1);
		expect(initSpy).toHaveBeenCalledTimes(2);
	});

	it('sets the initialState when component is mounted', () => {
		const { el, TestViewer } = createTestViewer(createProps());
		expect(el.find(TestViewer).state()).toMatchObject(createInitialState());
	});

	it('resets the component to the initialState when properties were updated', () => {
		const { el, TestViewer } = createTestViewer(createProps());
		const newItem = { ...createItem(), id: 'new-id' };
		el.setProps({ item: newItem });
		expect(el.find(TestViewer).state()).toMatchObject(createInitialState());
	});

	it('renders a spinner while the content is pending', () => {
		const { el } = createTestViewer(createProps());
		expect(el.find(Spinner)).toHaveLength(1);
	});

	it('invokes renderSuccessful() when the content loading was successful', () => {
		const { el, renderSuccessfulSpy } = createTestViewer(createProps(), {
			content: Outcome.successful('test'),
		});
		expect(el.text()).toEqual('test');
		expect(renderSuccessfulSpy).toHaveBeenCalled();
	});

	it('renders an error message when the content loading has failed', () => {
		const { el } = createTestViewer(createProps(), {
			content: Outcome.failed(new MediaViewerError('unsupported')),
		});
		const errorMessage = el.find(ErrorMessage);
		expect(errorMessage).toHaveLength(1);
		expect(errorMessage.text()).toContain("We couldn't generate a preview for this file");

		// download button
		expect(errorMessage.text()).toContain('Try downloading the file to view it');
		expect(errorMessage.find(Button)).toHaveLength(1);
	});
});
