import { CustomViewer, type Props } from '../../../../../viewers/customViewer/customViewer';

jest.mock('@atlaskit/media-client', () => {
	const actualModule = jest.requireActual('@atlaskit/media-client');
	return {
		...actualModule,
		request: jest.fn().mockResolvedValue({
			text: jest.fn().mockResolvedValue('some-src'),
			arrayBuffer: jest.fn().mockResolvedValue(new ArrayBuffer(0)),
		}),
	};
});
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';
import {
	globalMediaEventEmitter,
	type NonErrorFileState,
	type ProcessedFileState,
} from '@atlaskit/media-client';
import { fakeMediaClient } from '@atlaskit/media-test-helpers';
import type { CustomRendererConfig, CustomRendererProps } from '@atlaskit/media-viewer';
import { sleep } from '@atlaskit/media-common/test-helpers';
import { MediaViewerError } from '../../../../../errors';

jest.mock('../../../../../viewers/codeViewer/msg-parser', () => ({
	__esModule: true,
	msgToText: jest.fn(),
}));

function createFixture(
	item: NonErrorFileState,
	customRendererConfig: CustomRendererConfig,
	mockReturnGetFileBinary: () => Promise<Blob>,
	props: Partial<Props> = {},
) {
	const mediaClient = fakeMediaClient();
	const onSuccess = jest.fn();
	const onError = jest.fn();

	jest.spyOn(mediaClient.mediaStore, 'getFileBinary').mockImplementation(mockReturnGetFileBinary);

	const el = render(
		<IntlProvider locale="en">
			<CustomViewer
				item={item}
				customRendererConfig={customRendererConfig}
				mediaClient={mediaClient}
				onSuccess={onSuccess}
				onError={onError}
				{...props}
			/>
		</IntlProvider>,
	);

	return { mediaClient, el, onSuccess, onError };
}

const codeItem: ProcessedFileState = {
	id: 'some-id',
	status: 'processed',
	name: 'code.py',
	size: 11222,
	mediaType: 'unknown',
	mimeType: 'unknown',
	artifacts: {
		'document.pdf': {
			url: '/pdf',
			processingStatus: 'succeeded',
		},
	},
	representations: {},
};

const emailItem: NonErrorFileState = {
	id: 'some-id',
	status: 'processing',
	name: 'emailItem.msg',
	size: 11222,
	mediaType: 'unknown',
	mimeType: 'unknown',
	artifacts: {
		'document.pdf': {
			url: '/pdf',
			processingStatus: 'succeeded',
		},
	},
	representations: {},
};

const MyCustomComponent = ({ getBinaryContent, fileItem }: CustomRendererProps) => {
	const [content, setContent] = React.useState<string | undefined>(undefined);

	React.useEffect(() => {
		getBinaryContent().then(async (blob) => {
			setContent(await blob.text());
		});
	}, [fileItem, getBinaryContent]);

	if (!content) {
		return <div data-testid="custom-renderer-loading">Loading...</div>;
	}

	return <div data-testid="custom-renderer-content">{content}</div>;
};

describe('CustomViewer', () => {
	beforeEach(() => {
		jest.spyOn(globalMediaEventEmitter, 'emit');
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	const shouldUseCustomRenderer = jest.fn().mockReturnValue(true);
	const renderContent = jest.fn().mockReturnValue(<div data-testid="custom-test-renderer" />);
	const customRendererConfig: CustomRendererConfig = { shouldUseCustomRenderer, renderContent };
	const blobContent = 'test blob content';
	const getBlob = jest.fn(() => {
		const blob = new Blob([blobContent]);
		blob.text = async () => blobContent;
		return blob;
	});
	const blobPromise = async () => getBlob();

	it('displays spinner when item is not processed', async () => {
		createFixture(emailItem, customRendererConfig, blobPromise);
		await waitFor(async () => {
			await sleep(100);
			expect(screen.queryByLabelText('Loading file...')).toBeInTheDocument();
		});
		expect(renderContent).toHaveBeenCalledTimes(0);
	});

	it('displays custom renderer when item is ready', async () => {
		createFixture(codeItem, customRendererConfig, blobPromise);
		await waitFor(() => expect(screen.queryByLabelText('Loading file...')).not.toBeInTheDocument());

		expect(renderContent).toHaveBeenCalledTimes(1);
		expect(screen.getByTestId('custom-test-renderer')).toBeInTheDocument();
	});

	it('custom renderer can fetch item blob data', async () => {
		renderContent.mockImplementation((props) => {
			return <MyCustomComponent {...props} />;
		});
		createFixture(codeItem, customRendererConfig, blobPromise);
		await waitFor(() => {
			expect(screen.queryByTestId('custom-renderer-loading')).not.toBeInTheDocument();
		});

		expect(renderContent).toHaveBeenCalledTimes(2);
		expect(screen.getByTestId('custom-renderer-content')).toBeInTheDocument();
		expect(screen.getByTestId('custom-renderer-content')).toHaveTextContent(blobContent);
		expect(screen.queryByTestId('custom-renderer-loading')).not.toBeInTheDocument();
		expect(getBlob).toHaveBeenCalledTimes(1);
	});

	it('should call onError when an error happens in custom renderer', async () => {
		renderContent.mockImplementation((props) => {
			props.onError(new Error('error'));
			return <div data-testid="custom-renderer-content">test</div>;
		});
		const { onError } = createFixture(codeItem, customRendererConfig, blobPromise);
		await waitFor(() => {
			expect(screen.queryByLabelText('Loading file...')).not.toBeInTheDocument();
			expect(screen.queryByTestId('custom-renderer-loading')).not.toBeInTheDocument();
		});

		expect(renderContent).toHaveBeenCalledTimes(3);
		expect(onError).toHaveBeenCalledWith(
			new MediaViewerError('custom-viewer-error', new Error('error')),
			codeItem,
		);
	});
});
