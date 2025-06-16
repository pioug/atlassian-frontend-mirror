/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import { Component } from 'react';
import Textfield from '@atlaskit/textfield';
import {
	genericFileId,
	gifFileId,
	largeImageFileId,
	imageFileId,
	docFileId,
	errorFileId,
	createStorybookMediaClientConfig,
} from '@atlaskit/media-test-helpers';
import Spinner from '@atlaskit/spinner';
import Select from '@atlaskit/select';
import { MediaImage } from '../src';
import { optionsWrapperStyles, mediaImageWrapperStyles } from '../example-helpers/styles';

export interface ExampleProps {}

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
const imageIds: MediaImageId[] = [
	{ label: 'Generic', value: genericFileId },
	{ label: 'Gif', value: gifFileId },
	{ label: 'Large', value: largeImageFileId },
	{ label: 'Image', value: imageFileId },
	{ label: 'Doc', value: docFileId },
	{ label: 'Error', value: errorFileId },
];
class Example extends Component<ExampleProps, ExampleState> {
	state: ExampleState = {
		imageId: imageIds[0],
		width: 100,
		height: 100,
	};

	onWidthChange = (e: any) => {
		this.setState({
			width: parseInt(e.currentTarget.value),
		});
	};

	onHeightChange = (e: any) => {
		this.setState({
			height: parseInt(e.currentTarget.value),
		});
	};

	render() {
		const { imageId, width, height } = this.state;

		return (
			<div>
				{/* eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766 */}
				<div css={optionsWrapperStyles}>
					<Select
						options={imageIds}
						defaultValue={imageId}
						onChange={(imageId: any) => {
							this.setState({ imageId });
						}}
					/>
					<Textfield
						label="Width"
						placeholder="width"
						value={`${width}`}
						onChange={this.onWidthChange}
					/>
					<Textfield
						label="Height"
						placeholder="height"
						value={`${height}`}
						onChange={this.onHeightChange}
					/>
				</div>
				{/* eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766 */}
				<div css={mediaImageWrapperStyles}>
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

							return <img src={data.src} alt="Media" />;
						}}
					</MediaImage>
				</div>
			</div>
		);
	}
}

export default () => <Example />;
