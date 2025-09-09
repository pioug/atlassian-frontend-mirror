/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { jsx, css } from '@compiled/react';

import { token } from '@atlaskit/tokens';
import React from 'react';
import Page, { Grid, GridColumn } from '@atlaskit/page';
import { ImagePlacer, type ImageActions } from '../src/image-placer';
import Button from '@atlaskit/button/new';

export interface ExampleState {
	containerWidth: number;
	containerHeight: number;
	margin: number;
	zoom: number;
	maxZoom: number;
	useConstraints: boolean;
	isCircular: boolean;
	useCircularClipWithActions: boolean;
	src?: string | File;
	exportedDataURI?: string;
}

const CONTAINER_WIDTH_LABEL = 'Container_Width';
const CONTAINER_HEIGHT_LABEL = 'Container_Height';
const MARGIN_LABEL = 'Margin';

const labelStyles = css({
	display: 'block',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'> input': {
		marginLeft: token('space.100', '8px'),
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'> span': {
		display: 'inline-block',
		minWidth: '120px',
		textAlign: 'right',
	},
});

const exportedImageStyles = css({
	borderWidth: token('border.width'),
	borderStyle: 'solid',
	borderColor: token('color.border', '#ccc'),
});

const exportedImageWrapperStyles = css({
	display: 'inline-block',
	marginTop: token('space.250', '20px'),
	position: 'relative',
});

const checkeredBg =
	'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAIAAABLbSncAAAABGdBTUEAALGPC/xhBQAAAAlwSFlzAAALEwAACxMBAJqcGAAABCJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IlhNUCBDb3JlIDUuNC4wIj4KICAgPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICAgICAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgICAgICAgICAgeG1sbnM6dGlmZj0iaHR0cDovL25zLmFkb2JlLmNvbS90aWZmLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOmV4aWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vZXhpZi8xLjAvIgogICAgICAgICAgICB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iCiAgICAgICAgICAgIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyI+CiAgICAgICAgIDx0aWZmOlJlc29sdXRpb25Vbml0PjI8L3RpZmY6UmVzb2x1dGlvblVuaXQ+CiAgICAgICAgIDx0aWZmOkNvbXByZXNzaW9uPjU8L3RpZmY6Q29tcHJlc3Npb24+CiAgICAgICAgIDx0aWZmOlhSZXNvbHV0aW9uPjcyPC90aWZmOlhSZXNvbHV0aW9uPgogICAgICAgICA8dGlmZjpPcmllbnRhdGlvbj4xPC90aWZmOk9yaWVudGF0aW9uPgogICAgICAgICA8dGlmZjpZUmVzb2x1dGlvbj43MjwvdGlmZjpZUmVzb2x1dGlvbj4KICAgICAgICAgPGV4aWY6UGl4ZWxYRGltZW5zaW9uPjg8L2V4aWY6UGl4ZWxYRGltZW5zaW9uPgogICAgICAgICA8ZXhpZjpDb2xvclNwYWNlPjE8L2V4aWY6Q29sb3JTcGFjZT4KICAgICAgICAgPGV4aWY6UGl4ZWxZRGltZW5zaW9uPjg8L2V4aWY6UGl4ZWxZRGltZW5zaW9uPgogICAgICAgICA8ZGM6c3ViamVjdD4KICAgICAgICAgICAgPHJkZjpTZXEvPgogICAgICAgICA8L2RjOnN1YmplY3Q+CiAgICAgICAgIDx4bXA6TW9kaWZ5RGF0ZT4yMDE4OjA3OjE4IDEwOjA3OjUwPC94bXA6TW9kaWZ5RGF0ZT4KICAgICAgICAgPHhtcDpDcmVhdG9yVG9vbD5QaXhlbG1hdG9yIDMuNy4zPC94bXA6Q3JlYXRvclRvb2w+CiAgICAgIDwvcmRmOkRlc2NyaXB0aW9uPgogICA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgrsp//0AAAAKUlEQVQIHWP8//8/Aww8ffoUxmRggrPQGKRLsCCbKy0tDTeQdKNw6gAAbSMIvvnXfF4AAAAASUVORK5CYII=';

class Example extends React.Component<object, ExampleState> {
	zoomSliderElement?: HTMLInputElement;

	// part of ImageActions exported with onImageActions prop of ImagePlacer
	toDataURL?: () => string;

	state: ExampleState = {
		containerWidth: 200,
		containerHeight: 200,
		margin: 30,
		zoom: 0,
		maxZoom: 4,
		useConstraints: true,
		isCircular: false,
		useCircularClipWithActions: false,
	};

	onZoomSliderChange = (e: React.SyntheticEvent<HTMLInputElement>) => {
		const value = e.currentTarget.valueAsNumber;
		const zoom = value / 100;
		this.setState({ zoom });
	};

	onUseConstraintsChanged = (e: React.SyntheticEvent<HTMLInputElement>) => {
		const useConstraints = e.currentTarget.checked;
		this.setState({ zoom: 0, useConstraints });
	};

	onCircularChanged = (e: React.SyntheticEvent<HTMLInputElement>) => {
		const isCircular = e.currentTarget.checked;
		this.setState({ isCircular });
	};

	onRenderCircularMaskChanged = (e: React.SyntheticEvent<HTMLInputElement>) => {
		const useCircularClipWithActions = e.currentTarget.checked;
		this.setState({ useCircularClipWithActions });
	};

	onZoomSliderElement = (el: HTMLInputElement) => {
		this.zoomSliderElement = el;
	};

	onImageChange = () => {
		this.setState({ zoom: 0 });
	};

	onZoomChange = (zoom: number) => {
		this.setState({ zoom });
	};

	onFileInputChange = async (e: React.SyntheticEvent<HTMLInputElement>) => {
		if (e.currentTarget.files) {
			const file = e.currentTarget.files[0];
			this.setState({ src: file });
		}
	};

	onImageActions = (actions: ImageActions) => {
		this.toDataURL = actions.toDataURL;
	};

	onGetImageClick = () => {
		const { toDataURL } = this;
		if (toDataURL) {
			this.setState({
				exportedDataURI: toDataURL(),
			});
		}
	};

	render() {
		const {
			containerWidth,
			containerHeight,
			margin,
			zoom,
			maxZoom,
			useConstraints,
			isCircular,
			useCircularClipWithActions,
			src,
			exportedDataURI,
		} = this.state;

		return (
			<Page>
				<Grid>
					<GridColumn>
						<h1>Image Placer</h1>
						<p>This component allows placement of an image via panning and zooming.</p>
						<p>It supports touch, svg, and Exif orientation.</p>
						<p>
							Normally you would set a fixed container size and margin, but feel free to change them
							here in this demo.
						</p>
						<p>
							With constraints, the image will never be smaller than the inner visible area
							(default:true), but this can turned off via useConstraints prop.
						</p>
						<p>
							To access the image at current view, provide a callback to onImageActions to receive
							an object with actions.
						</p>
						{this.createSlider(CONTAINER_WIDTH_LABEL, containerWidth)}
						{this.createSlider(CONTAINER_HEIGHT_LABEL, containerHeight)}
						{this.createSlider(MARGIN_LABEL, margin, 0, 100, 5)}
						<label css={labelStyles}>
							<span>Circular:</span>
							{/* eslint-disable-next-line @atlaskit/design-system/no-html-checkbox */}
							<input
								type="checkbox"
								defaultChecked={isCircular}
								onChange={this.onCircularChanged}
							/>
						</label>
						<label css={labelStyles}>
							<span>Render Circular Mask:</span>
							{/* eslint-disable-next-line @atlaskit/design-system/no-html-checkbox */}
							<input
								type="checkbox"
								defaultChecked={useCircularClipWithActions}
								onChange={this.onRenderCircularMaskChanged}
							/>
						</label>
						<label css={labelStyles}>
							<span>Use Constraints:</span>
							{/* eslint-disable-next-line @atlaskit/design-system/no-html-checkbox */}
							<input
								type="checkbox"
								defaultChecked={useConstraints}
								onChange={this.onUseConstraintsChanged}
							/>
						</label>
					</GridColumn>
				</Grid>
				<Grid>
					<GridColumn>
						<ImagePlacer
							containerWidth={containerWidth}
							containerHeight={containerHeight}
							src={src}
							margin={margin}
							zoom={zoom}
							maxZoom={maxZoom}
							useConstraints={useConstraints}
							isCircular={isCircular}
							useCircularClipWithActions={useCircularClipWithActions}
							onImageChange={this.onImageChange}
							onZoomChange={this.onZoomChange}
							onImageActions={this.onImageActions}
						/>
					</GridColumn>
				</Grid>
				<Grid>
					<GridColumn>
						{/* eslint-disable-next-line @atlaskit/design-system/no-html-range, @atlaskit/design-system/no-html-checkbox */}
						<input
							type="range"
							min="0"
							max="100"
							value={`${zoom * 100}`}
							step="1"
							onChange={this.onZoomSliderChange}
							ref={this.onZoomSliderElement}
							style={{ width: containerWidth + margin * 2 }}
						/>
					</GridColumn>
				</Grid>
				<Grid>
					<GridColumn>
						{/* eslint-disable-next-line @atlaskit/design-system/no-html-checkbox */}
						<input type="file" onChange={this.onFileInputChange} />
						{src !== undefined ? (
							<p>
								<Button onClick={this.onGetImageClick}>Export DataURI</Button>
							</p>
						) : null}
					</GridColumn>
				</Grid>
				<Grid>
					<GridColumn>
						{exportedDataURI ? (
							<div css={exportedImageWrapperStyles} style={{ background: `url('${checkeredBg}')` }}>
								<img
									css={exportedImageStyles}
									src={exportedDataURI}
									alt="Exported preview"
									style={{ margin: this.state.margin }}
								/>
							</div>
						) : null}
					</GridColumn>
				</Grid>
			</Page>
		);
	}

	private createSlider(
		title: string,
		defaultValue: number,
		min: number = 0,
		max: number = 500,
		step: number = 50,
	): JSX.Element {
		const dataListOptions: JSX.Element[] = [];
		for (let i = min; i < max; i += step) {
			dataListOptions.push(<option key={i + title}>{i}</option>);
		}
		const displayTitle = title.replace(/_/g, ' ');
		const stepListId = `stepList_${displayTitle}`;
		return (
			<label css={labelStyles}>
				<span>{displayTitle}:</span>
				{/* eslint-disable-next-line @atlaskit/design-system/no-html-range */}
				<input
					type="range"
					min={min}
					max={max}
					defaultValue={`${defaultValue}`}
					step={step}
					list={stepListId}
					onChange={this.onSliderChange(title)}
				/>
				{defaultValue}
				<datalist id={stepListId}>{dataListOptions}</datalist>
			</label>
		);
	}

	private onSliderChange(id: string) {
		return (e: React.SyntheticEvent<HTMLInputElement>) => {
			const value = e.currentTarget.valueAsNumber;
			switch (id) {
				case CONTAINER_WIDTH_LABEL:
					this.setState({ containerWidth: value });
					break;
				case CONTAINER_HEIGHT_LABEL:
					this.setState({ containerHeight: value });
					break;
				case MARGIN_LABEL:
					this.setState({ zoom: 0, margin: value });
					break;
			}
		};
	}
}

export default () => <Example />;
