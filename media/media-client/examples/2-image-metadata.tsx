import React from 'react';
import { Component } from 'react';
import { MediaStore, type ImageMetadata } from '../src';
import { createStorybookMediaClient, imageFileId } from '../src/test-helpers';

export interface ExampleState {
	metadata?: ImageMetadata;
}
const context = createStorybookMediaClient();

class Example extends Component<{}, ExampleState> {
	context: any;
	state: ExampleState = {};

	async componentDidMount() {
		const store = new MediaStore({
			authProvider: context.config.authProvider,
		});
		const response = await store.getImageMetadata(imageFileId.id, {
			collection: imageFileId.collectionName,
		});

		this.setState({
			metadata: response.metadata,
		});
	}

	render() {
		const { metadata } = this.state;

		return (
			<div>
				<h1>Image metadata for {imageFileId.id}</h1>
				<hr role="presentation" />
				{metadata ? JSON.stringify(metadata, undefined, 2) : 'fetching metadata'}
			</div>
		);
	}
}

export default () => <Example />;
