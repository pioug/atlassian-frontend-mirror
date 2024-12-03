import React from 'react';
import { canUseDOM } from 'exenv';
import Button from '@atlaskit/button/standard-button';
import ArrowRightIcon from '@atlaskit/icon/core/migration/arrow-right';
import DetailViewIcon from '@atlaskit/icon/glyph/detail-view';
import { MediaClient, type Identifier } from '@atlaskit/media-client';
import { MediaClientContext } from '@atlaskit/media-client-react';
import {
	MediaMock,
	defaultCollectionName,
	smallImage,
	tallImage,
	defaultBaseUrl,
	generateFilesFromTestData,
	type MockFile,
} from '@atlaskit/media-test-helpers';
import { token } from '@atlaskit/tokens';
import { wideImage } from '../example-helpers/assets/wide-image';
import { MainWrapper, MVSidebar, MVSidebarHeader } from '../example-helpers/MainWrapper';
import { MediaViewerBase } from '../src/components/media-viewer';
import { type MediaViewerExtensionsActions } from '../src';

let files: MockFile[] = [];

if (canUseDOM) {
	(window as any).areControlsRendered = () => {
		return !!document.querySelector('div.mvng-hide-controls');
	};

	(window as any).areControlsVisible = () => {
		const controls = document.querySelector('div.mvng-hide-controls');
		if (!controls) {
			return false;
		} else {
			return window.getComputedStyle(controls).opacity === '1';
		}
	};

	(window as any).areControlsHidden = () => {
		const controls = document.querySelector('div.mvng-hide-controls');
		if (!controls) {
			return false;
		} else {
			return window.getComputedStyle(controls).opacity === '0';
		}
	};

	files = generateFilesFromTestData([
		{
			name: 'media-test-file-1.png',
			dataUri: smallImage,
		},
		{
			name: 'media-test-file-2.jpg',
			dataUri: wideImage,
		},
		{
			name: 'media-test-file-3.png',
			dataUri: tallImage,
		},
	]);
	const mediaMock = new MediaMock({
		[defaultCollectionName]: files,
	});
	mediaMock.enable();
}
const mediaClient = new MediaClient({
	authProvider: () =>
		Promise.resolve({
			clientId: '',
			token: '',
			baseUrl: defaultBaseUrl,
		}),
});

export interface State {
	isMediaViewerActive: boolean;
}
export default class Example extends React.Component<{}, State> {
	state = {
		isMediaViewerActive: true,
	};

	deactivate = () => {
		this.setState({ isMediaViewerActive: false });
	};

	sidebarRenderer = (selectedIdentifier: Identifier, actions: MediaViewerExtensionsActions) => {
		let id = '';
		if (selectedIdentifier.mediaItemType === 'file') {
			id = selectedIdentifier.id;
		}

		return (
			<Sidebar
				identifier={selectedIdentifier}
				actions={actions}
				fileData={files.find((file: MockFile) => file.id === id)}
			/>
		);
	};

	render() {
		const { isMediaViewerActive } = this.state;

		return (
			<MediaClientContext.Provider value={mediaClient}>
				<MainWrapper>
					{isMediaViewerActive && files.length && (
						<MediaViewerBase
							items={files
								.map(
									({ id }): Identifier => ({
										id,
										collectionName: defaultCollectionName,
										mediaItemType: 'file',
									}),
								)
								.concat([
									{
										mediaItemType: 'external-image',
										dataURI:
											/* eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage */
											'https://wac-cdn.atlassian.com/dam/jcr:616e6748-ad8c-48d9-ae93-e49019ed5259/Atlassian-horizontal-blue-rgb.svg',
									},
								])}
							selectedItem={{
								id: files[1].id,
								collectionName: defaultCollectionName,
								mediaItemType: 'file',
							}}
							collectionName={defaultCollectionName}
							mediaClient={mediaClient}
							onClose={this.deactivate}
							extensions={{
								sidebar: {
									renderer: this.sidebarRenderer,
									// TODO: https://product-fabric.atlassian.net/browse/DSP-20899
									// eslint-disable-next-line @atlaskit/design-system/no-legacy-icons
									icon: <DetailViewIcon label="sidebar" />,
								},
							}}
						/>
					)}
				</MainWrapper>
			</MediaClientContext.Provider>
		);
	}
}

interface SidebarProps {
	identifier: Identifier;
	actions: MediaViewerExtensionsActions;
	fileData?: MockFile;
}

const Sidebar = (props: SidebarProps) => {
	const { actions, fileData } = props;

	const renderFileStateItem = <FileState, K extends keyof FileState>(
		fileState: FileState,
		item: K,
	) => {
		return (
			<tr>
				<td>{String(item)}: </td>
				<td>{(fileState && String(fileState[item])) || <i>Unknown</i>}</td>
			</tr>
		);
	};

	const renderFileState = () => {
		if (!fileData) {
			return null;
		}
		return (
			<table>
				<tbody>
					{renderFileStateItem({ id: 'dummy-id' }, 'id')}
					{renderFileStateItem(fileData, 'mediaType')}
					{renderFileStateItem(fileData, 'mimeType')}
					{renderFileStateItem(fileData, 'name')}
					{renderFileStateItem(fileData, 'size')}
				</tbody>
			</table>
		);
	};

	return (
		<MVSidebar>
			<MVSidebarHeader>
				<h2>Attachment details</h2>
				<Button
					onClick={actions.close}
					aria-label="Close panel"
					iconBefore={
						<ArrowRightIcon spacing="spacious" color={token('color.icon', 'white')} label="" />
					}
				/>
			</MVSidebarHeader>
			{renderFileState()}
		</MVSidebar>
	);
};
