import React from 'react';
import { act, render } from '@atlassian/testing-library';
import { fakeMediaClient, nextTick } from '@atlaskit/media-test-helpers';

import { DropzoneLoader } from '../../dropzone';

const mediaClient = fakeMediaClient();
const container = document.createElement('div');
const config = { container, uploadParams: {} };

const flushAsyncLoad = async () => {
	await act(async () => {
		await nextTick();
		await nextTick();
	});
};

describe('Dropzone Async Loader', () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('When the async import returns with error', () => {
		beforeEach(() => {
			jest.mock('../../dropzone/dropzone', () => {
				throw new Error('Forcing async import error');
			});
		});

		it('should NOT render Dropzone component', async () => {
			const addEventListenerSpy = jest.spyOn(container, 'addEventListener');

			render(<DropzoneLoader mediaClientConfig={mediaClient.config} config={config} />);
			await flushAsyncLoad();

			const events = addEventListenerSpy.mock.calls.map((args) => args[0]);
			expect(events).not.toContain('dragover');
			expect(events).not.toContain('dragleave');
			expect(events).not.toContain('drop');
		});
	});

	describe('When the async import for Error Boundary returns with error', () => {
		beforeEach(() => {
			jest.unmock('../../dropzone/dropzone');
			jest.mock('../../../service/uploadServiceImpl');
			jest.mock('../../media-picker-analytics-error-boundary', () => {
				throw new Error('Forcing error boundary async import error');
			});
		});

		it('should NOT render Dropzone component', async () => {
			const addEventListenerSpy = jest.spyOn(container, 'addEventListener');

			render(<DropzoneLoader mediaClientConfig={mediaClient.config} config={config} />);
			await flushAsyncLoad();

			const events = addEventListenerSpy.mock.calls.map((args) => args[0]);
			expect(events).not.toContain('dragover');
			expect(events).not.toContain('dragleave');
			expect(events).not.toContain('drop');
		});
	});

	describe('When the async import returns with success', () => {
		beforeEach(() => {
			jest.unmock('../../dropzone/dropzone');
			jest.unmock('../../media-picker-analytics-error-boundary');
			jest.mock('../../../service/uploadServiceImpl');
		});

		// todo: fix me — original test was already skipped (state-based assertion on Dropzone constructor presence).
		// Note: enzyme-state-assertion couldn't be converted because the original test was skipped before migration.
		it.skip('should render Dropzone component', async () => {
			render(<DropzoneLoader mediaClientConfig={mediaClient.config} config={config} />);
			await flushAsyncLoad();
		});

		it('should render Error boundary component', async () => {
			const addEventListenerSpy = jest.spyOn(container, 'addEventListener');

			render(<DropzoneLoader mediaClientConfig={mediaClient.config} config={config} />);
			await flushAsyncLoad();

			const events = addEventListenerSpy.mock.calls.map((args) => args[0]);
			expect(events).toContain('dragover');
			expect(events).toContain('dragleave');
			expect(events).toContain('drop');
		});

		it('should not introduce any accessibility violations', async () => {
			render(<DropzoneLoader mediaClientConfig={mediaClient.config} config={config} />);
			await flushAsyncLoad();
			await expect(document.body).toBeAccessible();
		});
	});
});
