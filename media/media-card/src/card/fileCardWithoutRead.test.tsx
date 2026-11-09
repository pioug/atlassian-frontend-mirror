import React from 'react';

import { createIntl, IntlProvider } from 'react-intl';

import DeleteIcon from '@atlaskit/icon/core/delete';
import { MediaClientContext } from '@atlaskit/media-client-react/media-client-provider';
import { createMediaSubject } from '@atlaskit/media-client/create-media-subject';
import { fromObservable } from '@atlaskit/media-client/from-observable';
import { MediaClient } from '@atlaskit/media-client/media-client';
import type { FileState } from '@atlaskit/media-client/media-state';
import { createMediaStore } from '@atlaskit/media-state/create-media-store';
import { passGate, failGate } from '@atlassian/feature-flags-test-utils/mock-gates';
import { screen } from '@atlassian/testing-library/screen';
import { act, render, waitFor } from '@atlassian/testing-library/testing-library/react';
import { userEvent } from '@atlassian/testing-library/user-event';

import { CardBase } from './CardBase';

const identifier = {
	id: '51646012-ad88-478d-8d83-ca962c0bfa71',
	mediaItemType: 'file',
	collectionName: 'upload-project-10070',
} as const;
const metadata = { id: identifier.id, name: 'attachment.svg', mimeType: 'image/svg+xml', size: 57 };
const intl = createIntl({ locale: 'en' });

const setup = (
	state: FileState | null = { ...metadata, mediaType: 'image', status: 'processed', artifacts: {} },
	skipRemoteFileState = true,
	props: Partial<React.ComponentProps<typeof CardBase>> = {},
) => {
	const store = createMediaStore({ files: state ? { [identifier.id]: state } : {} });
	const authProvider = jest.fn();
	const mediaClient = new MediaClient({ authProvider }, store);
	const getFileState = jest
		.spyOn(mediaClient.file, 'getFileState')
		.mockReturnValue(fromObservable(createMediaSubject<FileState>()));
	const remove = jest.fn();
	const result = render(
		<IntlProvider locale="en">
			<MediaClientContext.Provider value={mediaClient}>
				<CardBase
					intl={intl}
					mediaClient={mediaClient}
					identifier={identifier}
					isLazy={false}
					skipRemoteFileState={skipRemoteFileState}
					dimensions={{ width: 150, height: 100 }}
					actions={[{ label: 'Remove', handler: remove, icon: <DeleteIcon label="" /> }]}
					shouldOpenMediaViewer
					shouldEnableDownloadButton
					{...props}
				/>
			</MediaClientContext.Provider>
		</IntlProvider>,
	);
	return { ...result, store, authProvider, getFileState, remove };
};

it('renders an accessible cached SVG card without fetching its binary', async () => {
	passGate('platform_media_upload_without_read');
	const { container, authProvider, getFileState, remove } = setup();
	expect(screen.getByTestId('title-box-header')).toHaveTextContent(metadata.name);
	await expect(container).toBeAccessible();
	await userEvent.click(screen.getByRole('button', { name: /Remove/ }));
	expect(remove).toHaveBeenCalledWith({ type: 'file', details: expect.objectContaining(metadata) });
	expect(screen.queryByRole('button', { name: /preview|download/i })).not.toBeInTheDocument();
	expect(container.querySelector('img')).toBeNull();
	expect(getFileState).not.toHaveBeenCalled();
	expect(authProvider).not.toHaveBeenCalled();
});

it('updates from cached upload progress and treats pending processing as an uploaded file', () => {
	passGate('platform_media_upload_without_read');
	const { store, getFileState, authProvider } = setup({
		...metadata,
		mediaType: 'image',
		status: 'uploading',
		progress: 0.5,
	});
	expect(screen.getByRole('progressbar')).toBeInTheDocument();
	act(() =>
		store.setState({
			files: { [identifier.id]: { ...metadata, mediaType: 'image', status: 'processing' } },
		}),
	);
	expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
	expect(screen.queryByText(/creating preview/i)).not.toBeInTheDocument();
	expect(screen.getByTestId('title-box-header')).toHaveTextContent(metadata.name);
	expect(getFileState).not.toHaveBeenCalled();
	expect(authProvider).not.toHaveBeenCalled();
});

it('preserves interaction callbacks with local metadata without fetching Media', async () => {
	passGate('platform_media_upload_without_read');
	const onClick = jest.fn();
	const onMouseEnter = jest.fn();
	const onFocus = jest.fn();
	const { getFileState, authProvider } = setup(undefined, true, {
		onClick,
		onMouseEnter,
		onFocus,
	});
	const card = screen.getByTestId('media-card-view');
	await userEvent.hover(card);
	expect(onMouseEnter).toHaveBeenCalledWith(
		expect.objectContaining({
			mediaItemDetails: expect.objectContaining(metadata),
			event: expect.anything(),
		}),
	);
	await userEvent.click(card);
	expect(onClick).toHaveBeenCalledWith(
		expect.objectContaining({
			mediaItemDetails: expect.objectContaining(metadata),
			event: expect.anything(),
		}),
		expect.anything(),
	);
	await userEvent.tab();
	expect(screen.getByRole('button', { name: /Remove/ })).toHaveFocus();
	expect(onFocus).toHaveBeenCalledWith(
		expect.objectContaining({
			mediaItemDetails: expect.objectContaining(metadata),
			event: expect.anything(),
		}),
	);
	expect(getFileState).not.toHaveBeenCalled();
	expect(authProvider).not.toHaveBeenCalled();
});

it('honors disabled overlays without enabling previews or the viewer', () => {
	passGate('platform_media_upload_without_read');
	const { container, getFileState, authProvider } = setup(undefined, true, {
		disableOverlay: true,
		selectable: true,
		selected: true,
	});
	expect(
		screen.queryByRole('button', { name: /Remove|preview|download/i }),
	).not.toBeInTheDocument();
	expect(screen.queryByTestId('title-box-header')).not.toBeInTheDocument();
	expect(screen.queryByRole('img', { name: 'tick' })).not.toBeInTheDocument();
	expect(container.querySelector('img')).toBeNull();
	expect(getFileState).not.toHaveBeenCalled();
	expect(authProvider).not.toHaveBeenCalled();
});

it('renders the selection indicator when local cards are selectable', () => {
	passGate('platform_media_upload_without_read');
	const { getFileState, authProvider } = setup(undefined, true, {
		selectable: true,
		selected: true,
	});
	expect(screen.getByRole('img', { name: 'tick' })).toBeInTheDocument();
	expect(getFileState).not.toHaveBeenCalled();
	expect(authProvider).not.toHaveBeenCalled();
});

it.each([
	{ enabled: false, skip: true, scenario: 'the gate is off with skipRemoteFileState supplied' },
	{ enabled: true, skip: false, scenario: 'the gate is on without skipRemoteFileState' },
])('retains remote cards when $scenario', async ({ enabled, skip }) => {
	(enabled ? passGate : failGate)('platform_media_upload_without_read');
	const { getFileState } = setup(null, skip);
	await waitFor(() => expect(getFileState).toHaveBeenCalled());
});

it('keeps missing cache entries loading until local state is available', () => {
	passGate('platform_media_upload_without_read');
	const { container, store, getFileState, authProvider } = setup(null);
	expect(container.querySelector('[data-test-status]')).toHaveAttribute(
		'data-test-status',
		'loading',
	);
	expect(container.querySelector('[data-test-progress]')).not.toBeInTheDocument();
	act(() =>
		store.setState({
			files: {
				[identifier.id]: { ...metadata, mediaType: 'image', status: 'uploading', progress: 0.5 },
			},
		}),
	);
	expect(screen.getByRole('progressbar')).toBeInTheDocument();
	expect(screen.getByTestId('title-box-header')).toHaveTextContent(metadata.name);
	expect(getFileState).not.toHaveBeenCalled();
	expect(authProvider).not.toHaveBeenCalled();
});

it('returns to loading when a completed file is removed from the cache', () => {
	passGate('platform_media_upload_without_read');
	const { container, store, getFileState } = setup();
	expect(container.querySelector('[data-test-status]')).toHaveAttribute(
		'data-test-status',
		'complete',
	);
	act(() => store.setState({ files: {} }));
	expect(container.querySelector('[data-test-status]')).toHaveAttribute(
		'data-test-status',
		'loading',
	);
	expect(getFileState).not.toHaveBeenCalled();
});

it('shows failed uploads rather than preview unavailable when mounting an error state', async () => {
	passGate('platform_media_upload_without_read');
	const { getFileState, authProvider } = setup({
		id: identifier.id,
		status: 'error',
		message: 'Upload failed',
	});
	expect(await screen.findByText(/failed to upload/i)).toBeInTheDocument();
	expect(screen.queryByText(/preview unavailable/i)).not.toBeInTheDocument();
	expect(getFileState).not.toHaveBeenCalled();
	expect(authProvider).not.toHaveBeenCalled();
});

it('shows an upload error after cached progress', async () => {
	passGate('platform_media_upload_without_read');
	const { store, getFileState } = setup({
		...metadata,
		mediaType: 'image',
		status: 'uploading',
		progress: 0.5,
	});
	act(() =>
		store.setState({
			files: { [identifier.id]: { id: identifier.id, status: 'error', message: 'Upload failed' } },
		}),
	);
	expect(await screen.findByText(/failed to upload/i)).toBeInTheDocument();
	expect(getFileState).not.toHaveBeenCalled();
});

it('renders a local preview without fetching remote metadata or previews', async () => {
	passGate('platform_media_upload_without_read');
	failGate('platform_media_cross_client_copy_with_auth');
	const localPreview = 'data:image/png;base64,iVBORw0KGgo=';
	const { container, getFileState, authProvider } = setup({
		...metadata,
		name: 'attachment.png',
		mimeType: 'image/png',
		mediaType: 'image',
		status: 'processing',
		preview: { value: localPreview, origin: 'local' },
	});
	await waitFor(() => expect(container.querySelector('img')).toHaveAttribute('src', localPreview));
	expect(getFileState).not.toHaveBeenCalled();
	expect(authProvider).not.toHaveBeenCalled();
});
