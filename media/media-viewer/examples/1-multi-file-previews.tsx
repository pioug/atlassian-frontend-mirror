import React from 'react';

import Button from '@atlaskit/button/default/button';
import { type Identifier } from '@atlaskit/media-client';
import {
	externalImageIdentifier,
	externalSmallImageIdentifier,
	createStorybookMediaClient,
	defaultCollectionName,
} from '@atlaskit/media-test-helpers';
import { videoFileId } from '@atlaskit/media-test-helpers';
import { I18NWrapper } from '@atlaskit/media-test-helpers';
import { addGlobalEventEmitterListeners } from '@atlaskit/media-test-helpers';

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
import { ButtonList, Group, MainWrapper } from '../example-helpers/MainWrapper';
import { MediaViewer } from '../src';

addGlobalEventEmitterListeners();

const mediaClient = createStorybookMediaClient();

export type State = {
	selected?: {
		items: Identifier[];
		identifier: Identifier;
	};
};

export default class Example extends React.Component<{}, State> {
	state: State = {};

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

	private openListWithItemNotOnList = () => {
		this.setState({
			selected: {
				items: [
					imageIdentifier,
					videoIdentifier,
					videoHorizontalFileItem,
					wideImageIdentifier,
					audioItem,
					audioItemNoCover,
					largePdfIdentifier,
					imageIdentifier2,
					unsupportedIdentifier,
				],
				identifier: docIdentifier,
			},
		});
	};

	private openErrorList = () => {
		const invalidItem: Identifier = {
			mediaItemType: 'file',
			id: 'invalid-id',
			occurrenceKey: 'invalid-key',
		};

		this.setState({
			selected: {
				items: [
					imageIdentifier,
					invalidItem,
					wideImageIdentifier,
					videoIdentifier,
					videoHorizontalFileItem,
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

	private openNotFound = () => {
		this.setState({
			selected: {
				items: [imageIdentifier, wideImageIdentifier],
				identifier: {
					mediaItemType: 'file',
					id: videoFileId.id,
					occurrenceKey: 'testOccurrenceKey',
				},
			},
		});
	};

	private openInvalidId = () => {
		const invalidItem: Identifier = {
			mediaItemType: 'file',
			id: 'invalid-id',
			occurrenceKey: 'invalid-key',
		};

		this.setState({
			selected: {
				identifier: invalidItem,
				items: [invalidItem],
			},
		});
	};

	private onClose = () => {
		this.setState({ selected: undefined });
	};

	render(): React.JSX.Element {
		const { selected } = this.state;
		return (
			<I18NWrapper>
				<MainWrapper>
					<Group>
						<h2>File lists</h2>
						<ButtonList>
							<li>
								<Button onClick={this.openList}>Small list</Button>
							</li>
							<li>
								<Button onClick={this.openListWithItemNotOnList}>
									Small list with selected item not on the list
								</Button>
							</li>
						</ButtonList>
					</Group>
					<Group>
						<h2>Errors</h2>
						<ButtonList>
							<li>
								<Button onClick={this.openNotFound}>Selected item not found</Button>
							</li>
							<li>
								<Button onClick={this.openInvalidId}>Invalid ID</Button>
							</li>
							<li>
								<Button onClick={this.openErrorList}>Error list</Button>
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
						/>
					)}
				</MainWrapper>
			</I18NWrapper>
		);
	}
}
