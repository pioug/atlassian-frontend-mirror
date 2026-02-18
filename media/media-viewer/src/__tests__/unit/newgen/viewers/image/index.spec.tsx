import React from 'react';

import { type ProcessedFileState } from '@atlaskit/media-client';
import { awaitError, fakeMediaClient, asMockFunction } from '@atlaskit/media-test-helpers';
import { IntlProvider } from 'react-intl-next';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { getRandomTelemetryId, type MediaTraceContext } from '@atlaskit/media-common';
import { ImageViewer, type ImageViewerProps } from '../../../../../viewers/image';

const collectionName = 'some-collection';
const imageItem: ProcessedFileState = {
	id: 'some-id',
	status: 'processed',
	name: 'my image',
	size: 11222,
	mediaType: 'image',
	mimeType: 'image/jpeg',
	artifacts: {},
	representations: {
		image: {},
	},
};

const traceContext: MediaTraceContext = {
	traceId: getRandomTelemetryId(),
};

function setup(response: Promise<Blob>, props?: Partial<ImageViewerProps>) {
	const mediaClient = fakeMediaClient();
	asMockFunction(mediaClient.getImage).mockReturnValue(response);
	asMockFunction(mediaClient.file.getFileBinaryURL).mockResolvedValue('some-binary-url');
	asMockFunction(mediaClient.getClientId).mockResolvedValue(undefined);
	const onClose = jest.fn();
	const onLoaded = jest.fn();
	const onError = jest.fn();

	const component = render(
		<IntlProvider locale="en">
			<ImageViewer
				mediaClient={mediaClient}
				item={imageItem}
				collectionName={collectionName}
				onClose={onClose}
				onLoad={onLoaded}
				onError={onError}
				traceContext={traceContext}
				{...props}
			/>
		</IntlProvider>,
	);

	return { mediaClient, component, onClose, onLoaded };
}

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('ImageViewer', () => {
	it('assigns an object url for images when successful', async () => {
		const response = Promise.resolve(new Blob());
		setup(response);

		await waitFor(() => expect(screen.queryByLabelText('Loading file...')).not.toBeInTheDocument());

		const imageElm = screen.getByTestId('media-viewer-image');
		expect(imageElm.getAttribute('src')).toBe('mock result of URL.createObjectURL()');
	});

	it('should not try get originalBinaryImageUrl when is local file reference', async () => {
		const response = Promise.resolve(new Blob());
		const { mediaClient } = setup(response, {
			item: {
				...imageItem,
				preview: {
					value: new File([], 'some-file-name'),
					origin: 'local',
				},
			},
		});
		await waitFor(() => expect(screen.queryByLabelText('Loading file...')).not.toBeInTheDocument());
		expect(mediaClient.file.getFileBinaryURL).not.toHaveBeenCalled();
	});

	it('should not try get originalBinaryImageUrl when is file is not an image', async () => {
		const response = Promise.resolve(new Blob());
		const { mediaClient } = setup(response, {
			item: {
				...imageItem,
				mediaType: 'unknown',
			},
		});

		await waitFor(() => expect(screen.queryByLabelText('Loading file...')).not.toBeInTheDocument());
		expect(mediaClient.file.getFileBinaryURL).not.toHaveBeenCalled();
	});

	it('should not try get originalBinaryImageUrl when has unsupported mime type', async () => {
		const response = Promise.resolve(new Blob());
		const { mediaClient } = setup(response, {
			item: {
				...imageItem,
				mimeType: 'image/heic',
			},
		});

		await waitFor(() => expect(screen.queryByLabelText('Loading file...')).not.toBeInTheDocument());
		expect(mediaClient.file.getFileBinaryURL).not.toHaveBeenCalled();
	});

	it('should not update state when image fetch request is cancelled', async () => {
		const abort = jest.fn();
		class FakeAbortController {
			abort = abort;
			signal = {
				aborted: true,
			};
		}
		(global as any).AbortController = FakeAbortController;

		const response = Promise.reject(new Error('Error: User aborted request'));
		setup(response);
		await screen.findByLabelText('Loading file...');

		await awaitError(response, 'Error: User aborted request');

		await screen.findByLabelText('Loading file...');
		// Explicit asssertion required despite checks above, otherwise the test will fail assertion check.
		expect(1).toBe(1);
	});

	it('should not call `onLoad` callback when image fetch request is cancelled', async () => {
		const abort = jest.fn();
		class FakeAbortController {
			abort = abort;
			signal = {
				aborted: true,
			};
		}
		(global as any).AbortController = FakeAbortController;

		const response = Promise.reject(new Error('Error: User aborted request'));
		const { onLoaded } = setup(response);

		expect(onLoaded).not.toHaveBeenCalled();

		await awaitError(response, 'Error: User aborted request');

		expect(onLoaded).not.toHaveBeenCalled();
	});

	it('cancels an image fetch request when unmounted', async () => {
		const abort = jest.fn();
		class FakeAbortController {
			abort = abort;
			signal = {
				aborted: true,
			};
		}
		(global as any).AbortController = FakeAbortController;
		const response: any = new Promise(() => {});
		const { component } = setup(response);

		// Wait for async init operations (getClientId) to complete before unmounting
		await new Promise((resolve) => setTimeout(resolve, 0));

		component.unmount();

		await waitFor(() => {
			expect(abort).toHaveBeenCalled();
		});
	});

	it('revokes an existing object url when unmounted', async () => {
		global.URL.revokeObjectURL = jest.fn();

		const response = Promise.resolve(new Blob());
		const { component } = setup(response);

		// make sure unmount happens after loading finish
		await waitFor(() => expect(screen.queryByLabelText('Loading file...')).not.toBeInTheDocument());
		component.unmount();

		await waitFor(() => {
			expect(URL.revokeObjectURL).toHaveBeenCalled();
		});
	});

	it('should call mediaClient.getImage when image representation is present and no preview is present', async () => {
		const response = Promise.resolve(new Blob());
		const { mediaClient } = setup(response);

		await waitFor(() => expect(screen.queryByLabelText('Loading file...')).not.toBeInTheDocument());

		expect(mediaClient.getImage).toHaveBeenCalledWith(
			'some-id',
			{
				collection: 'some-collection',
				mode: 'fit',
			},
			expect.anything(),
			true,
			traceContext,
		);
	});

	it('should not call mediaClient.getImage when image representation and a preview is present', async () => {
		const response = Promise.resolve(new Blob());
		const { mediaClient } = setup(response, {
			item: { ...imageItem, preview: { value: new Blob() } },
		});

		await waitFor(() => expect(screen.queryByLabelText('Loading file...')).not.toBeInTheDocument());

		expect(mediaClient.getImage).not.toHaveBeenCalled();
	});

	it('should not call mediaClient.getImage when image representation is not present', async () => {
		const response = Promise.resolve(new Blob());
		const { mediaClient } = setup(response, {
			item: {
				...imageItem,
				representations: {},
			},
		});

		expect(mediaClient.getImage).not.toHaveBeenCalled();
	});

	it('MSW-700: clicking on background of ImageViewer does not close it', async () => {
		const response = Promise.resolve(new Blob());
		const {
			component: { container },
			onClose,
		} = setup(response);

		await waitFor(() => expect(screen.queryByLabelText('Loading file...')).not.toBeInTheDocument());

		fireEvent.click(container);

		expect(onClose).not.toHaveBeenCalled();
	});

	it('should add file attrs to src if contextId is passed', async () => {
		const response = Promise.resolve(new Blob());
		setup(response, {
			contextId: 'some-context-id',
		});

		await waitFor(() => expect(screen.queryByLabelText('Loading file...')).not.toBeInTheDocument());

		const imageElm = screen.getByTestId('media-viewer-image');
		expect(imageElm.getAttribute('src')).toBe(
			'mock result of URL.createObjectURL()#media-blob-url=true&id=some-id&contextId=some-context-id&collection=some-collection&clientId=',
		);
	});
});
