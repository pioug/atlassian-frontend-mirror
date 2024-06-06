import React, { useState, useEffect } from 'react';
import {
	I18NWrapper,
	defaultCollectionName,
	addGlobalEventEmitterListeners,
	createStorybookMediaClientConfig,
} from '@atlaskit/media-test-helpers';
import { MainWrapper } from '../example-helpers/MainWrapper';
import Button from '@atlaskit/button/new';
import {
	docIdentifier,
	largePdfIdentifier,
	imageIdentifier,
	imageIdentifier2,
	unsupportedIdentifier,
	videoHorizontalFileItem,
	videoIdentifier,
	wideImageIdentifier,
	audioItem,
	audioItemNoCover,
} from '../example-helpers';
import { MediaViewer } from '../src';

addGlobalEventEmitterListeners();

const items = [
	imageIdentifier,
	videoIdentifier,
	videoHorizontalFileItem,
	wideImageIdentifier,
	audioItem,
	audioItemNoCover,
	docIdentifier,
	largePdfIdentifier,
	imageIdentifier2,
	unsupportedIdentifier,
];

const Example = () => {
	const [configVer, setConfigVer] = useState(0);
	const [mediaViewerOpened, setMediaViewerOpened] = useState(false);
	const [mediaClientConfig, setMediaClientConfig] = useState({
		...createStorybookMediaClientConfig(),
		configVer,
	} as any);

	useEffect(() => {
		setConfigVer((prevConfigVer) => prevConfigVer + 1);
	}, [mediaClientConfig]);

	useEffect(() => {
		console.log({ configVer });
	}, [configVer]);

	// listen to keyboard event of ArrowRight and ArrowLeft and perform an update to Media Client
	useEffect(() => {
		const handleKeyDown = (event: { key: string }) => {
			if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
				setMediaClientConfig(createStorybookMediaClientConfig());
			}
		};
		document.addEventListener('keydown', handleKeyDown);

		return () => {
			document.removeEventListener('keydown', handleKeyDown);
		};
	}, []);

	return (
		<I18NWrapper>
			<ul>
				<li>
					In the past, we encountered an issue where the Media Viewer would flicker when the 'right'
					arrow key was pressed. This problem occurred specifically when the Media Viewer was opened
					in the Attachment panel in JIRA.
				</li>
				<li>
					Upon investigating the issue, we discovered that the referenced mediaClient was being
					changed. This change triggered an unnecessary re-render of Media Viewer, resulting in the
					observed flickering.
				</li>
				<li>
					This example demonstrates how Media Viewer responds to a constantly changing Media Client
					configuration on 'right' and 'left' key presses.
				</li>
				<li>
					We have included logs to help debug the current version of the media client configuration,
					which increments with each change.
				</li>
				<li>Press the button to open Media Viewer.</li>
			</ul>
			<hr />
			<Button
				onClick={() => {
					setMediaViewerOpened(true);
				}}
			>
				Open Media Viewer
			</Button>
			<MainWrapper>
				{mediaViewerOpened && (
					<MediaViewer
						mediaClientConfig={mediaClientConfig}
						selectedItem={imageIdentifier}
						items={items}
						collectionName={defaultCollectionName}
						onClose={() => setMediaViewerOpened(false)}
					/>
				)}
			</MainWrapper>
		</I18NWrapper>
	);
};

export default Example;
