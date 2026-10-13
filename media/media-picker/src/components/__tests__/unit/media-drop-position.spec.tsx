import React from 'react';

import AnalyticsListener from '@atlaskit/analytics-next/AnalyticsListener';
import { fakeMediaClient } from '@atlaskit/media-test-helpers/fakeMediaClient';
import { act } from '@atlassian/testing-library/act';
import { render } from '@atlassian/testing-library/render';

import { LocalFileSource } from '../../../service/types';
import { UploadServiceImpl } from '../../../service/uploadServiceImpl';
import { Dropzone } from '../../dropzone/dropzone';
import type { DropzoneProps } from '../../dropzone/dropzone';

jest.mock('../../../service/uploadServiceImpl');

const MockUploadService = jest.mocked(UploadServiceImpl);
const files = [new File(['image'], 'image.png', { type: 'image/png' })];

const dragEvent = (type: 'dragover' | 'drop'): Event => {
	const event = new Event(type, { bubbles: true, cancelable: true });
	Object.defineProperty(event, 'dataTransfer', {
		value: {
			files,
			items: [{ kind: 'file', type: 'image/png' }],
			types: ['Files'],
			effectAllowed: 'all',
		},
	});
	return event;
};

const setup = (callbacks: Partial<DropzoneProps> = {}) => {
	const container = document.createElement('div');
	const listeners = jest.spyOn(container, 'addEventListener');
	const onAnalyticsEvent = jest.fn();
	render(
		<AnalyticsListener channel="media" onEvent={onAnalyticsEvent}>
			<Dropzone
				mediaClient={fakeMediaClient()}
				config={{ container, uploadParams: {} }}
				{...callbacks}
			/>
		</AnalyticsListener>,
	);
	const service = jest.mocked(
		MockUploadService.mock.instances[MockUploadService.mock.instances.length - 1],
	);
	const dropzoneActions = () => onAnalyticsEvent.mock.calls.map(([event]) => event.payload.action);
	return { container, listeners, service, dropzoneActions };
};

const dispatch = async (container: HTMLElement, event: Event) => {
	await act(async () => {
		container.dispatchEvent(event);
	});
};

describe('media drop position callbacks', () => {
	it('keeps legacy callbacks and uploads when no pointer callbacks are supplied', async () => {
		const onDrop = jest.fn();
		const { container, service } = setup({ onDrop });
		await dispatch(container, dragEvent('dragover'));
		await dispatch(container, dragEvent('drop'));
		expect(onDrop).toHaveBeenCalledTimes(1);
		expect(service.addFiles).toHaveBeenCalledWith(files);
		expect(service.addFilesWithSource).not.toHaveBeenCalled();
		await expect(document.body).toBeAccessible();
	});

	it('forwards every pointer update but enters only once', async () => {
		const onDragOver = jest.fn();
		const onDragEnter = jest.fn();
		const { container } = setup({ onDragOver, onDragEnter });
		const first = dragEvent('dragover');
		const second = dragEvent('dragover');
		await dispatch(container, first);
		await dispatch(container, second);
		expect(onDragOver.mock.calls).toEqual([[first], [second]]);
		expect(onDragEnter).toHaveBeenCalledTimes(1);
	});

	it('retains the default uploader without a contextual callback', async () => {
		const { container, service } = setup();
		await dispatch(container, dragEvent('drop'));
		expect(service.addFiles).toHaveBeenCalledWith(files);
		expect(service.addFilesWithSource).not.toHaveBeenCalled();
	});

	it('passes the drop identity to upload preparation and cleans up only after preparation', async () => {
		const cleanup = jest.fn();
		const onDrop = jest.fn();
		const onDropWithContext = jest.fn().mockReturnValue(cleanup);
		const { container, service } = setup({ onDrop, onDropWithContext });
		let finishPreparation = () => {};
		service.addFilesWithSource.mockReturnValue(
			new Promise<void>((resolve) => {
				finishPreparation = resolve;
			}),
		);
		const event = dragEvent('drop');
		await dispatch(container, event);
		const traceContext = onDropWithContext.mock.calls[0][1];
		expect(onDropWithContext).toHaveBeenCalledWith(event, { traceId: expect.any(String) });
		expect(service.addFilesWithSource).toHaveBeenCalledWith(
			[{ file: files[0], source: LocalFileSource.LocalUpload }],
			traceContext,
		);
		expect(service.addFiles).not.toHaveBeenCalled();
		expect(onDrop).toHaveBeenCalledTimes(1);
		expect(cleanup).not.toHaveBeenCalled();
		await act(async () => finishPreparation());
		expect(cleanup).toHaveBeenCalledTimes(1);
	});

	it('does not upload when the editor rejects the drop location', async () => {
		const onDropWithContext = jest.fn().mockReturnValue(false);
		const { container, service } = setup({ onDropWithContext });
		await dispatch(container, dragEvent('drop'));
		expect(onDropWithContext).toHaveBeenCalledTimes(1);
		expect(service.addFiles).not.toHaveBeenCalled();
		expect(service.addFilesWithSource).not.toHaveBeenCalled();
	});

	it('reports droppedInto only for drops that upload', async () => {
		const rejected = setup({ onDropWithContext: () => false });
		await dispatch(rejected.container, dragEvent('drop'));
		expect(rejected.dropzoneActions()).not.toContain('droppedInto');

		const accepted = setup({ onDropWithContext: () => undefined });
		await dispatch(accepted.container, dragEvent('drop'));
		expect(accepted.dropzoneActions()).toContain('droppedInto');
	});

	it('still notifies the consumer when the editor rejects the drop location', async () => {
		const onDrop = jest.fn();
		const { container, dropzoneActions } = setup({ onDrop, onDropWithContext: () => false });
		await dispatch(container, dragEvent('dragover'));
		await dispatch(container, dragEvent('drop'));
		expect(onDrop).toHaveBeenCalledTimes(1);
		expect(dropzoneActions()).toEqual(['draggedInto']);
	});

	it('reports droppedInto for legacy drops without a contextual callback', async () => {
		const { container, dropzoneActions } = setup();
		await dispatch(container, dragEvent('drop'));
		expect(dropzoneActions()).toContain('droppedInto');
	});

	it('releases drop preparation state when upload preparation rejects', async () => {
		const cleanup = jest.fn();
		const { container, listeners, service } = setup({ onDropWithContext: () => cleanup });
		const error = new Error('upload preparation failed');
		service.addFilesWithSource.mockRejectedValue(error);
		const listener = listeners.mock.calls.find(([type]) => type === 'drop')?.[1];
		expect(typeof listener).toBe('function');
		if (typeof listener !== 'function') {
			throw new Error('Drop listener was not registered');
		}
		await act(async () => {
			await expect(listener.call(container, dragEvent('drop'))).rejects.toBe(error);
		});
		expect(cleanup).toHaveBeenCalledTimes(1);
	});

	it('assigns different identities to concurrent drops', async () => {
		const onDropWithContext = jest.fn();
		const { container, service } = setup({ onDropWithContext });
		service.addFilesWithSource.mockResolvedValue(undefined);
		await dispatch(container, dragEvent('drop'));
		await dispatch(container, dragEvent('drop'));
		expect(onDropWithContext).toHaveBeenCalledTimes(2);
		expect(onDropWithContext.mock.calls[0][1].traceId).not.toBe(
			onDropWithContext.mock.calls[1][1].traceId,
		);
		expect(service.addFilesWithSource).toHaveBeenCalledTimes(2);
	});
});
