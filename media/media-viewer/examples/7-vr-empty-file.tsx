import React from 'react';

import type { Identifier } from '@atlaskit/media-client/identifier';
import { MediaClient } from '@atlaskit/media-client/media-client';
import { defaultCollectionName } from '@atlaskit/media-test-helpers/collectionNames';
import { addGlobalEventEmitterListeners } from '@atlaskit/media-test-helpers/globalEventEmitterListeners';
import { I18NWrapper } from '@atlaskit/media-test-helpers/I18nWrapper';
import { createStorybookMediaClientConfig } from '@atlaskit/media-test-helpers/mediaClientProvider';

import { emptyImage } from '../example-helpers';
import { ButtonList, Group, MainWrapper } from '../example-helpers/MainWrapper';
import { NativeMediaPreview } from '../example-helpers/NativeMediaPreview';
import { MediaViewer } from '../src';

addGlobalEventEmitterListeners();

const mediaClientConfig = createStorybookMediaClientConfig();
const mediaClient = new MediaClient(mediaClientConfig);

export type State = {
	selectedIdentifier?: Identifier;
};

export default class Example extends React.Component<{}, State> {
	state: State = { selectedIdentifier: undefined };

	setItem = (selectedIdentifier: Identifier) => (): void => {
		this.setState({ selectedIdentifier });
	};

	createItem = (identifier: Identifier, title: string): React.JSX.Element => {
		const onClick = this.setItem(identifier);

		return (
			<div>
				<h4>{title}</h4>
				<NativeMediaPreview identifier={identifier} mediaClient={mediaClient} onClick={onClick} />
			</div>
		);
	};

	render(): React.JSX.Element {
		const { selectedIdentifier } = this.state;

		return (
			<I18NWrapper>
				<MainWrapper>
					<Group>
						<h2>Empty</h2>
						<ButtonList>
							<li>{this.createItem(emptyImage, 'Empty File (version: 0)')}</li>
						</ButtonList>
					</Group>
					{selectedIdentifier && (
						<MediaViewer
							mediaClientConfig={mediaClientConfig}
							selectedItem={selectedIdentifier}
							items={[selectedIdentifier]}
							collectionName={defaultCollectionName}
							onClose={() => this.setState({ selectedIdentifier: undefined })}
						/>
					)}
				</MainWrapper>
			</I18NWrapper>
		);
	}
}
