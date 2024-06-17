/**@jsx jsx */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import { Component } from 'react';
import { genericFileId, createStorybookMediaClientConfig } from '@atlaskit/media-test-helpers';
import Spinner from '@atlaskit/spinner';
import { MediaImage } from '../src';

export type MediaImageId = {
	label: string;
	value: any;
};

export interface ExampleState {
	imageId: MediaImageId;
	width: number;
	height: number;
}

const mediaClientConfig = createStorybookMediaClientConfig();

class Example extends Component<{}, ExampleState> {
	state: ExampleState = {
		imageId: { label: 'Generic', value: genericFileId },
		width: 100,
		height: 100,
	};

	render() {
		const { imageId, width, height } = this.state;

		return (
			<MediaImage
				identifier={imageId.value}
				mediaClientConfig={mediaClientConfig}
				apiConfig={{ width, height }}
			>
				{({ loading, error, data }) => {
					if (loading) {
						return <Spinner />;
					}

					if (error) {
						console.error(error);
						return <div>Error :(</div>;
					}

					if (!data) {
						return null;
					}

					return <img src={data.src} />;
				}}
			</MediaImage>
		);
	}
}

export default () => <Example />;
