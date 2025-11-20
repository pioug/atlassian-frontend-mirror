import React from 'react';

import { Card } from '../src';
// eslint-disable-next-line @atlaskit/platform/prefer-crypto-random-uuid -- Use crypto.randomUUID instead
import uuid from 'uuid/v4';
import { mediaPickerAuthProvider, defaultCollectionName } from '@atlaskit/media-test-helpers';
import { type FileIdentifier, MediaClient } from '@atlaskit/media-client';
import { MainWrapper } from '../example-helpers';

const mediaClientConfig = {
	authProvider: mediaPickerAuthProvider('asap'),
};
const mediaClient = new MediaClient(mediaClientConfig);
const collection = defaultCollectionName;

interface State {
	identifier?: FileIdentifier;
}

class Example extends React.Component<{}, State> {
	state: State = {};

	onChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
		const files = event.currentTarget.files;
		if (!files) {
			return;
		}
		if (files.length === 0) {
			return;
		}
		const file = files.item(0);
		if (!file) {
			return;
		}
		// eslint-disable-next-line @atlaskit/platform/prefer-crypto-random-uuid -- Use crypto.randomUUID instead
		const fileId = uuid();
		const touchedFiles = mediaClient.file.touchFiles([
			{
				fileId,
				collection,
			},
		]);
		mediaClient.file.upload(
			{
				content: file,
				name: file.name,
				collection,
			},
			undefined,
			{
				id: fileId,
				deferredUploadId: touchedFiles.then((touchedFiles) => touchedFiles.created[0].uploadId),
			},
		);

		this.setState({
			identifier: {
				mediaItemType: 'file',
				id: fileId,
				collectionName: collection,
			},
		});
	};

	private renderCards(identifier: FileIdentifier) {
		return (
			<table>
				<thead>
					<tr>
						<th>Resize Mode</th>
						<th>Landscapy parent</th>
						<th>Portraity parent</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<th>Fit</th>
						<td>
							<Card
								resizeMode="fit"
								mediaClientConfig={mediaClientConfig}
								identifier={identifier}
								dimensions={{
									width: 200,
									height: 100,
								}}
							/>
						</td>
						<td>
							<Card
								resizeMode="fit"
								mediaClientConfig={mediaClientConfig}
								identifier={identifier}
								dimensions={{
									width: 100,
									height: 200,
								}}
							/>
						</td>
					</tr>
					<tr>
						<th>Cover</th>
						<td>
							<Card
								resizeMode="crop"
								mediaClientConfig={mediaClientConfig}
								identifier={identifier}
								dimensions={{
									width: 200,
									height: 100,
								}}
							/>
						</td>
						<td>
							<Card
								resizeMode="crop"
								mediaClientConfig={mediaClientConfig}
								identifier={identifier}
								dimensions={{
									width: 100,
									height: 200,
								}}
							/>
						</td>
					</tr>
				</tbody>
			</table>
		);
	}

	render() {
		const { identifier } = this.state;

		return (
			<MainWrapper disableFeatureFlagWrapper={true}>
				<div>
					<h2>Choose a file</h2>
					In this example you can test how media-card handles images with orientation info saved in
					EXIF.
					<br />
					<input type="file" onChange={this.onChange} />
					{identifier ? this.renderCards(identifier) : null}
				</div>
			</MainWrapper>
		);
	}
}

export default (): React.JSX.Element => <Example />;
