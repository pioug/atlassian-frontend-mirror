/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@compiled/react';
import React, { useEffect, useRef, useState } from 'react';
import { type Identifier, MediaClient } from '@atlaskit/media-client';
import {
	createStorybookMediaClientConfig,
	defaultCollectionName,
	htmlFileId,
	I18NWrapper,
} from '@atlaskit/media-test-helpers';

import { type CustomRendererStateProps, type ViewerOptionsProps, MediaViewer } from '../src';
import { NativeMediaPreview } from '../example-helpers/NativeMediaPreview';
import { ButtonList, Group, MainWrapper } from '../example-helpers/MainWrapper';
import { type CustomRendererProps } from '../src/viewerOptions';
import { zipFileWithHtmlId } from '@atlaskit/media-test-helpers/exampleMediaItems';
import { Spinner } from '../src/loading';

const mediaClientConfig = createStorybookMediaClientConfig();
const mediaClient = new MediaClient(mediaClientConfig);

export default function () {
	const [selectedIdentifier, setSelectedIdentifier] = useState(undefined as Identifier | undefined);
	const createItem = (identifier: Identifier, title: string) => {
		return (
			<div>
				<h4>{title}</h4>
				<NativeMediaPreview
					identifier={identifier}
					mediaClient={mediaClient}
					onClick={() => setSelectedIdentifier(identifier)}
				/>
			</div>
		);
	};

	// set zip with html file for tests
	// add another example with html file
	return (
		<I18NWrapper>
			<MainWrapper>
				<Group>
					<h2>Archive side bar</h2>
					<ButtonList>
						<li>{createItem(zipFileWithHtmlId, 'Zip with HTML file')}</li>
						<li>{createItem(htmlFileId, 'HTML file')}</li>
					</ButtonList>
				</Group>
				{selectedIdentifier && (
					<MediaViewer
						mediaClientConfig={mediaClientConfig}
						selectedItem={selectedIdentifier}
						items={[selectedIdentifier]}
						collectionName={defaultCollectionName}
						onClose={() => setSelectedIdentifier(undefined)}
						viewerOptions={viewerOptions}
					/>
				)}
			</MainWrapper>
		</I18NWrapper>
	);
}

const listOfSafeAttachments = [
	'5c2397e4-93fd-440d-829f-ba16048f3bd8',
	'34c01a5d-5a23-49d0-9a21-c27c3a9b13de',
];

const shouldRenderCustomViewer = (props: CustomRendererStateProps): boolean => {
	return (
		listOfSafeAttachments.includes(props.fileItem.id) &&
		(props.fileItem.name.endsWith('.html') ||
			(props.archiveFileItem?.name?.endsWith('.html') ?? false))
	);
};

const iframeStyles = css({
	width: '100vw',
	height: '95vh',
	marginTop: '50px',
	overflow: 'auto',
});

const renderCustomViewer = (props: CustomRendererProps): React.ReactNode => {
	return <HTMLRenderer {...props} />;
};

const HTMLRenderer = ({
	fileItem,
	archiveFileItem,
	getBinaryContent,
	onLoad,
	onError,
}: CustomRendererProps) => {
	const [content, setContent] = useState<Blob>();
	const iframeElement: React.RefObject<HTMLIFrameElement> = useRef(null);
	useEffect(() => {
		let isSubscribed = true;
		setContent(undefined);
		getBinaryContent()
			.then(async (blob) => {
				if (!isSubscribed) {
					return;
				}
				setContent(blob);
				const htmlString = await blob.text();
				if (!isSubscribed) {
					return;
				}
				const iframe = iframeElement?.current;
				if (!iframe) {
					return;
				}

				const iframeDocument = iframe.contentDocument || iframe.contentWindow?.document;
				if (!iframeDocument) {
					return;
				}
				iframeDocument.open();
				iframeDocument.write(htmlString);
				iframeDocument.close();
				onLoad();
			})
			.catch((error) => {
				if (isSubscribed) {
					onError(error);
				}
			});

		return () => {
			isSubscribed = false;
		};
	}, [fileItem, archiveFileItem, getBinaryContent, onLoad, onError]);

	if (!content) {
		return <Spinner />;
	}
	// eslint-disable-next-line jsx-a11y/iframe-has-title
	return <iframe ref={iframeElement} css={iframeStyles}></iframe>;
};

const viewerOptions = {
	customRenderers: [
		{
			shouldUseCustomRenderer: shouldRenderCustomViewer,
			renderContent: renderCustomViewer,
		},
	],
} as ViewerOptionsProps;
