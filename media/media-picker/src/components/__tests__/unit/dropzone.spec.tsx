import React from 'react';

jest.mock('../../../service/uploadServiceImpl');
jest.mock('@atlaskit/media-ui/browser', () => ({
	__esModule: true,
	isWebkitSupported: jest.fn(),
}));

import { act, render } from '@atlassian/testing-library';
import { AnalyticsListener } from '@atlaskit/analytics-next';
import { ANALYTICS_MEDIA_CHANNEL } from '@atlaskit/media-common';
import { MEDIA_CONTEXT } from '@atlaskit/analytics-namespaced-context/MediaAnalyticsContext';
import { fakeMediaClient, asMockFunction } from '@atlaskit/media-test-helpers';
import { isWebkitSupported } from '@atlaskit/media-ui/browser';

import { Dropzone, DropzoneBase } from '../../dropzone/dropzone';
import { type DropzoneDragEnterEventPayload } from '../../types';
import { UploadServiceImpl } from '../../../service/uploadServiceImpl';

const MockedUploadServiceImpl = jest.mocked(UploadServiceImpl);

const files = [new File([], '')];

const createDragOverOrDropEvent = (
	eventName: 'dragover' | 'drop' | 'dragleave',
	type?: string,
	customFiles?: File[],
) => {
	const event = document.createEvent('Event') as Event & { dataTransfer: DataTransfer };
	event.initEvent(eventName, true, true);
	(event as Event).preventDefault = () => {};
	(event as unknown as { dataTransfer: unknown }).dataTransfer = {
		types: [type || 'Files'],
		effectAllowed: 'move',
		items: [
			{
				kind: 'file',
				file: customFiles || files,
				webkitGetAsEntry: () => ({ isDirectory: true }),
			},
			{
				kind: 'string',
				file: customFiles || files,
				webkitGetAsEntry: () => ({ isDirectory: false }),
			},
		],
		files: customFiles || files,
	};
	return event;
};

const createDragOverEvent = (type?: string) => createDragOverOrDropEvent('dragover', type);
const createDragLeaveEvent = () => createDragOverOrDropEvent('dragleave');
const createDropEvent = (customFiles?: File[]) =>
	createDragOverOrDropEvent('drop', '', customFiles);

const mediaClient = fakeMediaClient();
const containerEl = document.createElement('div');

const getLatestUploadServiceMock = () => {
	const instances = MockedUploadServiceImpl.mock.instances;
	return instances[instances.length - 1] as unknown as {
		addFiles: jest.Mock;
		cancel: jest.Mock;
		setUploadParams: jest.Mock;
	};
};

describe('Dropzone', () => {
	[
		{ config: { container: containerEl, uploadParams: {} }, expectedContainer: containerEl },
		{ config: { uploadParams: {} }, expectedContainer: document.body },
	].forEach((data) => {
		describe(`Dropzone with config: ${JSON.stringify(data.config)}`, () => {
			const { config, expectedContainer } = data;

			beforeEach(() => {
				asMockFunction(isWebkitSupported).mockReset();
			});

			afterEach(() => {
				jest.clearAllMocks();
			});

			it('adds "dragover", "dragleave" and "drop" events to container', () => {
				const addEventListenerSpy = jest.spyOn(expectedContainer, 'addEventListener');

				render(<Dropzone mediaClient={mediaClient} config={config} />);

				const events = addEventListenerSpy.mock.calls.map((args) => args[0]);
				expect(events).toContain('dragover');
				expect(events).toContain('dragleave');
				expect(events).toContain('drop');
			});

			it('removes "dragover", "dragleave" and "drop" events from container', () => {
				const removeEventListenerSpy = jest.spyOn(expectedContainer, 'removeEventListener');

				const { unmount } = render(<Dropzone mediaClient={mediaClient} config={config} />);
				unmount();

				const events = removeEventListenerSpy.mock.calls.map((args) => args[0]);
				expect(events).toContain('dragover');
				expect(events).toContain('dragleave');
				expect(events).toContain('drop');
			});

			it('should emit drag-enter for drag over with type "Files" and contain files length', () => {
				const onDragEnter = jest.fn<void, [DropzoneDragEnterEventPayload]>();
				render(<Dropzone mediaClient={mediaClient} config={config} onDragEnter={onDragEnter} />);

				expectedContainer.dispatchEvent(createDragOverEvent());

				expect(onDragEnter).toHaveBeenCalledTimes(1);
				expect(onDragEnter).toHaveBeenCalledWith({ length: 1 });
			});

			it('should not emit drag-enter for drag over with type "Not Files"', () => {
				const onDragEnter = jest.fn();
				render(<Dropzone mediaClient={mediaClient} config={config} onDragEnter={onDragEnter} />);

				expectedContainer.dispatchEvent(createDragOverEvent('Not Files'));

				expect(onDragEnter).not.toHaveBeenCalled();
			});

			it('should emit drag-leave for dragleave event', () => {
				jest.useFakeTimers();
				try {
					const onDragLeave = jest.fn();
					render(<Dropzone mediaClient={mediaClient} config={config} onDragLeave={onDragLeave} />);

					expectedContainer.dispatchEvent(createDragOverEvent());
					expectedContainer.dispatchEvent(createDragLeaveEvent());
					act(() => {
						jest.advanceTimersByTime(100);
					});

					expect(onDragLeave).toHaveBeenCalledTimes(1);
				} finally {
					jest.useRealTimers();
				}
			});

			it('should not emit drag-leave for dragleave event if there was no dragover', () => {
				jest.useFakeTimers();
				try {
					const onDragLeave = jest.fn();
					render(<Dropzone mediaClient={mediaClient} config={config} onDragLeave={onDragLeave} />);

					expectedContainer.dispatchEvent(createDragLeaveEvent());
					act(() => {
						jest.advanceTimersByTime(100);
					});

					expect(onDragLeave).not.toHaveBeenCalled();
				} finally {
					jest.useRealTimers();
				}
			});

			it('should upload files when files are dropped', () => {
				render(<DropzoneBase mediaClient={mediaClient} config={config} />);

				expectedContainer.dispatchEvent(createDropEvent());

				const uploadService = getLatestUploadServiceMock();
				expect(uploadService.addFiles).toHaveBeenCalledTimes(1);
				expect(uploadService.addFiles).toHaveBeenCalledWith(files);
			});

			it('should provide a function to onCancelFn callback property and call uploadService.cancel', () => {
				const onCancelFnMock = jest.fn<void, [(uniqueIdentifier: string) => void]>();
				render(
					<DropzoneBase mediaClient={mediaClient} config={config} onCancelFn={onCancelFnMock} />,
				);

				expect(onCancelFnMock).toHaveBeenCalledTimes(1);
				const cancel = onCancelFnMock.mock.calls[0][0];
				cancel('some-id');
				expect(getLatestUploadServiceMock().cancel).toHaveBeenCalled();
			});

			it('should change event listeners when container changes', () => {
				const newContainer = document.createElement('div');
				const removeEventListenerSpyOverOldContainer = jest.spyOn(
					expectedContainer,
					'removeEventListener',
				);
				const addEventListenerSpyOverNewContainer = jest.spyOn(newContainer, 'addEventListener');

				const { rerender } = render(<Dropzone mediaClient={mediaClient} config={config} />);

				removeEventListenerSpyOverOldContainer.mockClear();

				rerender(
					<Dropzone
						mediaClient={mediaClient}
						config={{ container: newContainer, uploadParams: {} }}
					/>,
				);

				expect(removeEventListenerSpyOverOldContainer).toHaveBeenCalledTimes(3);
				expect(addEventListenerSpyOverNewContainer).toHaveBeenCalledTimes(3);
			});

			describe('Analytics', () => {
				const context = [
					expect.objectContaining({
						packageName: expect.any(String),
						packageVersion: expect.any(String),
						componentName: 'dropzone',
						component: 'dropzone',
					}),
				];

				it('should fire a draggedInto event when a file is dragged over dropzone', () => {
					const handleAnalyticsEvent = jest.fn();

					render(
						<AnalyticsListener channel="media" onEvent={handleAnalyticsEvent}>
							<Dropzone mediaClient={mediaClient} config={config} />
						</AnalyticsListener>,
					);

					expectedContainer.dispatchEvent(createDragOverEvent());

					expect(handleAnalyticsEvent).toHaveBeenNthCalledWith(
						1,
						expect.objectContaining({
							context,
							payload: {
								eventType: 'ui',
								action: 'draggedInto',
								actionSubject: 'dropzone',
								attributes: { fileCount: 1 },
							},
						}),
						ANALYTICS_MEDIA_CHANNEL,
					);
				});

				it('should fire a draggedOut event when mouse leaves dropzone', () => {
					jest.useFakeTimers();
					try {
						const handleAnalyticsEvent = jest.fn();

						render(
							<AnalyticsListener channel="media" onEvent={handleAnalyticsEvent}>
								<Dropzone mediaClient={mediaClient} config={config} />
							</AnalyticsListener>,
						);

						expectedContainer.dispatchEvent(createDragOverEvent());
						expectedContainer.dispatchEvent(createDragLeaveEvent());

						act(() => {
							jest.advanceTimersByTime(100);
						});

						expect(handleAnalyticsEvent).toHaveBeenCalledTimes(2);
						expect(handleAnalyticsEvent).toHaveBeenNthCalledWith(
							2,
							expect.objectContaining({
								context,
								payload: {
									eventType: 'ui',
									action: 'draggedOut',
									actionSubject: 'dropzone',
									attributes: { fileCount: 1 },
								},
							}),
							ANALYTICS_MEDIA_CHANNEL,
						);
					} finally {
						jest.useRealTimers();
					}
				});

				it('should fire a droppedInto event when a file is dropped in dropzone', () => {
					const handleAnalyticsEvent = jest.fn();

					render(
						<AnalyticsListener channel="media" onEvent={handleAnalyticsEvent}>
							<Dropzone mediaClient={mediaClient} config={config} />
						</AnalyticsListener>,
					);

					expectedContainer.dispatchEvent(createDragOverEvent());
					expectedContainer.dispatchEvent(createDropEvent());

					expect(handleAnalyticsEvent).toHaveBeenCalledTimes(2);
					expect(handleAnalyticsEvent).toHaveBeenNthCalledWith(
						2,
						expect.objectContaining({
							context,
							payload: {
								eventType: 'ui',
								action: 'droppedInto',
								actionSubject: 'dropzone',
								attributes: { fileCount: 1 },
							},
						}),
						ANALYTICS_MEDIA_CHANNEL,
					);
				});

				it('should fire an event with expected feature flags', () => {
					const handleAnalyticsEvent = jest.fn();

					render(
						<AnalyticsListener channel="media" onEvent={handleAnalyticsEvent}>
							<Dropzone mediaClient={mediaClient} config={config} />
						</AnalyticsListener>,
					);

					expectedContainer.dispatchEvent(createDragOverEvent());
					expectedContainer.dispatchEvent(createDropEvent());

					const contextWithFeatureFlags = [
						expect.objectContaining({
							packageName: expect.any(String),
							packageVersion: expect.any(String),
							componentName: 'dropzone',
							component: 'dropzone',
							[MEDIA_CONTEXT]: {
								featureFlags: undefined,
							},
						}),
					];

					expect(handleAnalyticsEvent).toHaveBeenCalledTimes(2);
					expect(handleAnalyticsEvent).toHaveBeenNthCalledWith(
						2,
						expect.objectContaining({
							context: contextWithFeatureFlags,
							payload: expect.objectContaining({
								eventType: 'ui',
								action: 'droppedInto',
								actionSubject: 'dropzone',
								attributes: { fileCount: 1 },
							}),
						}),
						ANALYTICS_MEDIA_CHANNEL,
					);
				});
			});
		});
	});

	it('should correctly change the container if instanciated with null and container canged', () => {
		const newContainer = document.createElement('div');
		const removeEventListenerSpyOverOldContainer = jest.spyOn(document.body, 'removeEventListener');
		const addEventListenerSpyOverNewContainer = jest.spyOn(newContainer, 'addEventListener');

		const config = { container: null as unknown as HTMLDivElement, uploadParams: {} };
		const { rerender } = render(<DropzoneBase mediaClient={mediaClient} config={config} />);
		removeEventListenerSpyOverOldContainer.mockClear();

		rerender(
			<DropzoneBase
				mediaClient={mediaClient}
				config={{ container: newContainer, uploadParams: {} }}
			/>,
		);

		expect(removeEventListenerSpyOverOldContainer).toHaveBeenCalledTimes(3);
		expect(addEventListenerSpyOverNewContainer).toHaveBeenCalledTimes(3);
	});

	it('should not introduce any accessibility violations', async () => {
		render(
			<Dropzone mediaClient={mediaClient} config={{ container: containerEl, uploadParams: {} }} />,
		);
		await expect(document.body).toBeAccessible();
	});
});
