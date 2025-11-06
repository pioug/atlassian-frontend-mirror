import React from 'react';
import Button from '@atlaskit/button/new';
import { MediaStore } from '../src';
import { createUploadMediaClient } from '../src/test-helpers';
// eslint-disable-next-line @atlaskit/platform/prefer-crypto-random-uuid -- Use crypto.randomUUID instead
import uuid from 'uuid/v4';
import { Response, Row, UploadTouchWrapper as Wrapper } from '../example-helpers/stylesWrapper';

const context = createUploadMediaClient();

export interface State {
	result: any;
}

class Example extends React.Component<{}, State> {
	context: any;
	private store: MediaStore;
	private lastFileId: string = '';

	constructor(props: any) {
		super(props);
		this.state = {
			result: null,
		};
		this.store = new MediaStore({
			authProvider: context.config.authProvider,
		});
	}

	createNewFile = async () => {
		// eslint-disable-next-line @atlaskit/platform/prefer-crypto-random-uuid -- Use crypto.randomUUID instead
		this.lastFileId = uuid();
		let result: any;
		try {
			result = await this.store.touchFiles({
				descriptors: [
					{
						fileId: this.lastFileId,
					},
				],
			});
		} catch (reason: any) {
			let data = {};
			try {
				data = await reason.json();
			} catch (e) {}

			result = {
				status: reason.status,
				data: data,
			};
		}
		this.setState({ result });
	};

	createSameFile = async () => {
		try {
			await this.store.touchFiles({
				descriptors: [
					{
						fileId: this.lastFileId,
					},
					{
						// eslint-disable-next-line @atlaskit/platform/prefer-crypto-random-uuid -- Use crypto.randomUUID instead
						fileId: uuid(),
					},
				],
			});
		} catch (e) {
			const response = e as Response;
			const result = {
				status: response.status,
				body: await response.text(),
			};
			this.setState({ result });
		}
	};

	render() {
		const result = this.state.result;
		return (
			<Wrapper>
				<Row>
					<Button appearance="primary" onClick={this.createNewFile}>
						Create new files
					</Button>
					<Button appearance="primary" onClick={this.createSameFile} isDisabled={result === null}>
						Try create same files
					</Button>
				</Row>
				<Row>
					<Response>{result !== null ? JSON.stringify(result, null, 4) : ''}</Response>
				</Row>
			</Wrapper>
		);
	}
}

export default () => <Example />;
