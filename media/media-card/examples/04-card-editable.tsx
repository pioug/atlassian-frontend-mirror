/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import { Component } from 'react';
import { createStorybookMediaClientConfig, genericFileId } from '@atlaskit/media-test-helpers';
import Toggle from '@atlaskit/toggle';
import Range from '@atlaskit/range';
import { type Identifier } from '@atlaskit/media-client';
import { Card, type CardDimensions } from '../src';
import { cardDimensionsWrapperStyles } from '../example-helpers/styles';
import { editableCardOptionsStyles, editableCardContentStyles } from '../example-helpers/styles';
import { MainWrapper } from '../example-helpers';

const mediaClientConfig = createStorybookMediaClientConfig();

const maxHeight = 1000;
const maxWidth = 1000;

export interface EditableCardState {
	identifier: Identifier;
	dimensions: CardDimensions;
	parentDimensions: CardDimensions;
	isWidthPercentage: boolean;
	isHeightPercentage: boolean;
	isLazy: boolean;
	useDimensions: boolean;
}

class EditableCard extends Component<{}, EditableCardState> {
	state: EditableCardState = {
		identifier: genericFileId,
		dimensions: { width: 100, height: 50 },
		parentDimensions: { height: 300, width: 500 },
		isWidthPercentage: true,
		isHeightPercentage: true,
		isLazy: false,
		useDimensions: true,
	};

	onWidthChange = (e: any) => {
		const { height } = this.state.dimensions;
		this.setState({ dimensions: { width: parseInt(e, 0), height } });
	};

	onHeightChange = (e: any) => {
		const { width } = this.state.dimensions;
		this.setState({ dimensions: { height: parseInt(e, 0), width } });
	};

	onWidthPercentageChange = () => {
		this.setState({ isWidthPercentage: !this.state.isWidthPercentage });
	};

	onHeightPercentageChange = () => {
		this.setState({ isHeightPercentage: !this.state.isHeightPercentage });
	};

	onParentWidthChange = (e: any) => {
		const { height } = this.state.parentDimensions;
		this.setState({ parentDimensions: { width: parseInt(e, 0), height } });
	};

	onParentHeightChange = (e: any) => {
		const { width } = this.state.parentDimensions;
		this.setState({ parentDimensions: { height: parseInt(e, 0), width } });
	};

	onIsLazyChange = () => {
		this.setState({ isLazy: !this.state.isLazy });
	};

	onUseDimensionsChange = () => {
		this.setState({ useDimensions: !this.state.useDimensions });
	};

	printUnit = (dimension: `w` | `h`) => {
		const isPercentage =
			dimension === 'w' ? this.state.isWidthPercentage : this.state.isHeightPercentage;
		return isPercentage ? '%' : 'px';
	};

	getCardDimensions = () => {
		const {
			dimensions: { width, height },
		} = this.state;
		return {
			width: `${width}${this.printUnit('w')}`,
			height: `${height}${this.printUnit('h')}`,
		};
	};

	render() {
		const {
			identifier,
			dimensions: { width, height },
			isWidthPercentage,
			isHeightPercentage,
			parentDimensions: { width: parentWidth, height: parentHeight },
			isLazy,
			useDimensions,
		} = this.state;
		const parentStyle = { width: parentWidth, height: parentHeight };
		const formattedWidth = this.getCardDimensions().width;
		const formattedHeight = this.getCardDimensions().height;
		return (
			<MainWrapper>
				<div>
					{/* eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766 */}
					<div css={editableCardOptionsStyles}>
						Card dimensions <hr role="presentation" />
						{/* eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766 */}
						<div css={cardDimensionsWrapperStyles}>
							<div>
								Card Width ({formattedWidth}) | Use percentage:
								<Toggle
									defaultChecked={isWidthPercentage}
									onChange={this.onWidthPercentageChange}
								/>
								<Range
									value={Number(width)}
									min={10}
									max={isWidthPercentage ? 100 : maxWidth}
									onChange={this.onWidthChange}
								/>
							</div>
							<div>
								Card Height ({formattedHeight}) | Use percentage:
								<Toggle
									defaultChecked={isHeightPercentage}
									onChange={this.onHeightPercentageChange}
								/>
								<Range
									value={Number(height)}
									min={10}
									max={isHeightPercentage ? 100 : maxHeight}
									onChange={this.onHeightChange}
								/>
							</div>
							<div>
								Parent Width ({parentWidth}px)
								<Range
									value={Number(parentWidth)}
									min={0}
									max={maxWidth}
									onChange={this.onParentWidthChange}
								/>
							</div>
							<div>
								Parent Height ({parentHeight}px)
								<Range
									value={Number(parentHeight)}
									min={50}
									max={maxHeight}
									onChange={this.onParentHeightChange}
								/>
							</div>
						</div>
						isLazy
						<Toggle defaultChecked={isLazy} onChange={this.onIsLazyChange} />
						use dimensions
						<Toggle defaultChecked={useDimensions} onChange={this.onUseDimensionsChange} />
					</div>
					{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop, @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766 */}
					<div css={editableCardContentStyles} style={parentStyle}>
						<Card
							mediaClientConfig={mediaClientConfig}
							identifier={identifier}
							dimensions={useDimensions ? this.getCardDimensions() : undefined}
							isLazy={isLazy}
							alt="this is an alt text"
						/>
					</div>
				</div>
			</MainWrapper>
		);
	}
}

export default () => <EditableCard />;
