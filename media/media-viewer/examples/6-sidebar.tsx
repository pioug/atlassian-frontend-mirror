import React from 'react';
import { useState, useEffect } from 'react';
import Button from '@atlaskit/button/standard-button';
import AkSpinner from '@atlaskit/spinner';
import DetailViewIcon from '@atlaskit/icon/core/layout-two-columns-sidebar-left';
import ArrowRightIcon from '@atlaskit/icon/core/migration/arrow-right';
import {
	type ExternalImageIdentifier,
	type Identifier,
	type FileState,
} from '@atlaskit/media-client';
import {
	externalImageIdentifier,
	externalSmallImageIdentifier,
	createStorybookMediaClient,
	defaultCollectionName,
} from '@atlaskit/media-test-helpers';
import { N0 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import {
	MainWrapper,
	ButtonList,
	Group,
	MVSidebar,
	MVSidebarHeader,
} from '../example-helpers/MainWrapper';
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
import { MediaViewer, type MediaViewerExtensionsActions } from '../src';

const mediaClient = createStorybookMediaClient();

export type State = {
	selected?: {
		items: Array<Identifier>;
		identifier: Identifier;
	};
	sidebarFileState?: FileState;
};

export default class Example extends React.Component<{}, State> {
	state: State = {};

	componentDidMount = () => this.openList();

	private openList = () => {
		this.setState({
			selected: {
				items: [
					externalImageIdentifier,
					imageIdentifier,
					videoIdentifier,
					externalSmallImageIdentifier,
					videoHorizontalFileItem,
					wideImageIdentifier,
					audioItem,
					audioItemNoCover,
					docIdentifier,
					largePdfIdentifier,
					imageIdentifier2,
					unsupportedIdentifier,
				],
				identifier: imageIdentifier,
			},
		});
	};

	private onClose = () => {
		this.setState({ selected: undefined });
	};

	sidebarRenderer = (selectedIdentifier: Identifier, actions: MediaViewerExtensionsActions) => {
		return <Sidebar identifier={selectedIdentifier} actions={actions} />;
	};

	render() {
		const { selected } = this.state;
		return (
			<MainWrapper>
				<Group>
					<h2>Sidebar integration</h2>
					<ButtonList>
						<li>
							<Button onClick={this.openList}>Open</Button>
						</li>
					</ButtonList>
				</Group>
				{selected && (
					<MediaViewer
						mediaClientConfig={mediaClient.config}
						selectedItem={selected.identifier}
						items={selected.items}
						collectionName={defaultCollectionName}
						onClose={this.onClose}
						extensions={{
							sidebar: {
								renderer: this.sidebarRenderer,
								icon: <DetailViewIcon label="sidebar" />,
							},
						}}
					/>
				)}
			</MainWrapper>
		);
	}
}

interface SidebarProps {
	identifier: Identifier;
	actions: MediaViewerExtensionsActions;
}

const Sidebar = (props: SidebarProps) => {
	const { identifier, actions } = props;
	const [fileState, setFileState] = useState<FileState | undefined>();
	const [status, setStatus] = useState<'loading' | 'succeed' | 'error'>('loading');

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
		if (status === 'loading') {
			return <AkSpinner />;
		}
		if (status === 'error') {
			return <div>Error loading file</div>;
		}
		if (!fileState) {
			return null;
		}
		if (fileState.status === 'error') {
			return <p>Error loading attachment details</p>;
		}
		return (
			<table>
				<tbody>
					{renderFileStateItem(fileState, 'id')}
					{renderFileStateItem(fileState, 'mediaType')}
					{renderFileStateItem(fileState, 'mimeType')}
					{renderFileStateItem(fileState, 'name')}
					{renderFileStateItem(fileState, 'size')}
				</tbody>
			</table>
		);
	};

	useEffect(() => {
		if (identifier.mediaItemType === 'file') {
			setStatus('loading');
			mediaClient.file
				.getFileState(identifier.id, {
					collectionName: identifier.collectionName,
				})
				.subscribe({
					next: (newFileState) => {
						setFileState(newFileState);
						setStatus('succeed');
					},
					error(error) {
						console.log('sidebar error', error);
						setStatus('error');
					},
				});
		}
	}, [identifier]);

	const renderExternalFileState = (identifier: ExternalImageIdentifier) => {
		return (
			<>
				<p>External file</p>
				<p>{identifier.dataURI}</p>
			</>
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
						<ArrowRightIcon spacing="spacious" color={token('color.icon', N0)} label="" />
					}
				/>
			</MVSidebarHeader>
			{identifier.mediaItemType === 'file'
				? renderFileState()
				: renderExternalFileState(identifier)}
		</MVSidebar>
	);
};
