import React from 'react';
import Button from '@atlaskit/button/new';
import ModalDialog, {
	ModalBody,
	ModalFooter,
	ModalHeader,
	ModalTitle,
} from '@atlaskit/modal-dialog';
import {
	createStorybookMediaClientConfig,
	defaultCollectionName,
} from '@atlaskit/media-test-helpers';
import { imageItem } from '../example-helpers';
import { MainWrapper } from '../example-helpers/MainWrapper';
import { MediaViewer } from '../src';
import { type Identifier } from '@atlaskit/media-client';

const mediaClientConfig = createStorybookMediaClientConfig();

export type State = {
	selectedItem?: Identifier;
	isModalOpen: boolean;
};

export default class Example extends React.Component<{}, State> {
	state: State = { selectedItem: undefined, isModalOpen: true };
	setItem = (selectedItem: Identifier) => () => {
		this.setState({ selectedItem });
	};

	toggleModal = () => {
		this.setState({ isModalOpen: !this.state.isModalOpen });
	};

	render() {
		const { isModalOpen } = this.state;

		return (
			<MainWrapper>
				<Button onClick={this.toggleModal}>Open Modal</Button>
				{isModalOpen && (
					<ModalDialog onClose={this.toggleModal}>
						<ModalHeader hasCloseButton>
							<ModalTitle>Example Modal Dialog</ModalTitle>
						</ModalHeader>
						<ModalBody>
							<p>MediaViewer should open on top of the modal dialog</p>
							<Button appearance="primary" onClick={this.setItem(imageItem)}>
								Open MediaViewer
							</Button>
						</ModalBody>
						<ModalFooter></ModalFooter>
					</ModalDialog>
				)}

				{this.state.selectedItem && (
					<MediaViewer
						mediaClientConfig={mediaClientConfig}
						selectedItem={this.state.selectedItem}
						items={[this.state.selectedItem]}
						collectionName={defaultCollectionName}
						onClose={() => this.setState({ selectedItem: undefined })}
					/>
				)}
			</MainWrapper>
		);
	}
}
