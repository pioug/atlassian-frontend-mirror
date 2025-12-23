/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

import type { RichMediaLayout } from '@atlaskit/adf-schema';
import type { EnabledHandles, ResizerProps } from '@atlaskit/editor-common/ui';
import {
	calcColumnsFromPx,
	calcMediaPxWidth,
	calcPctFromPx,
	calcPxFromColumns,
	handleSides,
	imageAlignmentMap,
	Resizer,
	snapTo,
	wrappedLayouts,
	wrapperStyle,
} from '@atlaskit/editor-common/ui';
import {
	findParentNodeOfTypeClosestToPos,
	hasParentNodeOfType,
} from '@atlaskit/editor-prosemirror/utils';
import {
	akEditorBreakoutPadding,
	akEditorMediaResizeHandlerPadding,
	akEditorWideLayoutWidth,
	breakoutWideScaleRatio,
	DEFAULT_EMBED_CARD_HEIGHT,
	DEFAULT_EMBED_CARD_WIDTH,
} from '@atlaskit/editor-shared-styles';
import { embedHeaderHeight } from '@atlaskit/smart-card';
import { token } from '@atlaskit/tokens';

type State = {
	offsetLeft: number;
	resizedPctWidth?: number;
};

export type Props = Omit<ResizerProps, 'height' | 'width'> & {
	aspectRatio: number;
	height?: number;
	isResizeDisabled?: boolean;
	width?: number;
};

// eslint-disable-next-line @repo/internal/react/no-class-components
export default class ResizableEmbedCard extends React.Component<Props, State> {
	static defaultProps = {
		aspectRatio: DEFAULT_EMBED_CARD_WIDTH / DEFAULT_EMBED_CARD_HEIGHT,
	};

	state: State = {
		offsetLeft: this.calcOffsetLeft(),
	};

	componentDidUpdate(prevProps: Props): void {
		const offsetLeft = this.calcOffsetLeft();
		if (offsetLeft !== this.state.offsetLeft && offsetLeft >= 0) {
			this.setState({ offsetLeft });
		}
		if (this.props.layout !== prevProps.layout) {
			this.checkLayout(prevProps.layout, this.props.layout);
		}
	}

	get wrappedLayout() {
		return wrappedLayouts.indexOf(this.props.layout) > -1;
	}

	/**
	 * When returning to center layout from a wrapped/aligned layout, it might actually
	 * be wide or full-width
	 */
	checkLayout(oldLayout: RichMediaLayout, newLayout: RichMediaLayout): void {
		const { resizedPctWidth } = this.state;
		if (wrappedLayouts.indexOf(oldLayout) > -1 && newLayout === 'center' && resizedPctWidth) {
			const layout = this.calcUnwrappedLayout(resizedPctWidth, this.calcPxWidth(newLayout));
			this.props.updateSize(resizedPctWidth, layout);
		}
	}

	calcNewSize = (newWidth: number, stop: boolean) => {
		const {
			layout,
			view: { state },
		} = this.props;

		const newPct = calcPctFromPx(newWidth, this.props.lineLength) * 100;
		this.setState({ resizedPctWidth: newPct });

		let newLayout: RichMediaLayout = hasParentNodeOfType(state.schema.nodes.table)(state.selection)
			? layout
			: this.calcUnwrappedLayout(newPct, newWidth);
		if (newPct <= 100) {
			if (this.wrappedLayout && (stop ? newPct !== 100 : true)) {
				newLayout = layout;
			}
			return {
				width: newPct,
				layout: newLayout,
			};
		} else {
			return {
				width: this.props.pctWidth || null,
				layout: newLayout,
			};
		}
	};

	calcUnwrappedLayout = (pct: number, width: number): 'center' | 'wide' | 'full-width' => {
		if (pct <= 100) {
			return 'center';
		}
		if (width <= this.wideLayoutWidth) {
			return 'wide';
		}
		return 'full-width';
	};

	get $pos() {
		if (typeof this.props.getPos !== 'function') {
			return null;
		}
		const pos = this.props.getPos();
		if (Number.isNaN(pos) || typeof pos !== 'number') {
			return null;
		}

		// need to pass view because we may not get updated props in time
		return this.props.view.state.doc.resolve(pos);
	}

	/**
	 * The maxmimum number of grid columns this node can resize to.
	 */
	get gridWidth() {
		const { gridSize } = this.props;
		return !(this.wrappedLayout || this.insideInlineLike) ? gridSize / 2 : gridSize;
	}

	calcOffsetLeft() {
		let offsetLeft = 0;
		if (this.wrapper && this.insideInlineLike) {
			const currentNode: HTMLElement = this.wrapper;
			const boundingRect = currentNode.getBoundingClientRect();
			const pmRect = this.props.view.dom.getBoundingClientRect();
			offsetLeft = boundingRect.left - pmRect.left;
		}
		return offsetLeft;
	}

	calcColumnLeftOffset = () => {
		const { offsetLeft } = this.state;
		return this.insideInlineLike
			? calcColumnsFromPx(offsetLeft, this.props.lineLength, this.props.gridSize)
			: 0;
	};

	wrapper?: HTMLElement;

	get wideLayoutWidth() {
		const { lineLength } = this.props;
		if (lineLength) {
			return Math.ceil(lineLength * breakoutWideScaleRatio);
		} else {
			return akEditorWideLayoutWidth;
		}
	}

	// check if is inside of a table
	isNestedInTable() {
		const { table } = this.props.view.state.schema.nodes;
		if (!this.$pos) {
			return false;
		}
		return !!findParentNodeOfTypeClosestToPos(this.$pos, table);
	}

	calcSnapPoints() {
		const { offsetLeft } = this.state;

		const { containerWidth, lineLength } = this.props;
		const snapTargets: number[] = [];
		for (let i = 0; i < this.gridWidth; i++) {
			snapTargets.push(calcPxFromColumns(i, lineLength, this.gridWidth) - offsetLeft);
		}
		// full width
		snapTargets.push(lineLength - offsetLeft);

		const minimumWidth = calcPxFromColumns(
			this.wrappedLayout || this.insideInlineLike ? 1 : 2,
			lineLength,
			this.props.gridSize,
		);

		const snapPoints = snapTargets.filter((width) => width >= minimumWidth);
		const $pos = this.$pos;
		if (!$pos) {
			return snapPoints;
		}

		const isTopLevel = $pos.parent.type.name === 'doc';
		if (isTopLevel) {
			snapPoints.push(this.wideLayoutWidth);
			const fullWidthPoint = containerWidth - akEditorBreakoutPadding;
			if (fullWidthPoint > this.wideLayoutWidth) {
				snapPoints.push(fullWidthPoint);
			}
		}
		return snapPoints;
	}

	calcPxWidth = (useLayout?: RichMediaLayout): number => {
		const {
			layout,
			pctWidth,
			lineLength,
			containerWidth,
			fullWidthMode,
			getPos,
			view: { state },
		} = this.props;
		const { resizedPctWidth } = this.state;

		const pos = typeof getPos === 'function' ? getPos() : undefined;

		return calcMediaPxWidth({
			origWidth: DEFAULT_EMBED_CARD_WIDTH,
			origHeight: DEFAULT_EMBED_CARD_HEIGHT,
			pctWidth,
			state,
			containerWidth: { width: containerWidth, lineLength },
			isFullWidthModeEnabled: fullWidthMode,
			layout: useLayout || layout,
			pos: pos,
			resizedPctWidth,
		});
	};

	get insideInlineLike(): boolean {
		const $pos = this.$pos;
		if (!$pos) {
			return false;
		}

		const { listItem } = this.props.view.state.schema.nodes;
		return !!findParentNodeOfTypeClosestToPos($pos, [listItem]);
	}

	highlights = (newWidth: number, snapPoints: number[]) => {
		const snapWidth = snapTo(newWidth, snapPoints);
		const { layoutColumn, table, expand, nestedExpand } = this.props.view.state.schema.nodes;

		if (
			this.$pos &&
			!!findParentNodeOfTypeClosestToPos(
				this.$pos,
				[layoutColumn, table, expand, nestedExpand].filter(Boolean),
			)
		) {
			return [];
		}

		if (snapWidth > this.wideLayoutWidth) {
			return ['full-width'];
		}

		const { layout, lineLength, gridSize } = this.props;
		const columns = calcColumnsFromPx(snapWidth, lineLength, gridSize);
		const columnWidth = Math.round(columns);
		const highlight: number[] = [];

		if (layout === 'wrap-left' || layout === 'align-start') {
			highlight.push(0, columnWidth);
		} else if (layout === 'wrap-right' || layout === 'align-end') {
			highlight.push(gridSize, gridSize - columnWidth);
		} else if (this.insideInlineLike) {
			highlight.push(Math.round(columns + this.calcColumnLeftOffset()));
		} else {
			highlight.push(
				Math.floor((gridSize - columnWidth) / 2),
				Math.ceil((gridSize + columnWidth) / 2),
			);
		}

		return highlight;
	};

	/**
	 * Previously height of the box was controlled with paddingTop/paddingBottom trick inside Wrapper.
	 * It allowed height to be defined by a given percent ratio and so absolute value was defined by actual width.
	 * Also, it was part of styled component, which was fine because it was static through out life time of component.
	 *
	 * Now, two things changed:
	 * 1. If `height` is present we take it as actual height of the box, and hence we don't need
	 * (or even can't have, due to lack of width value) paddingTop trick.
	 * 2. Since `height` can be changing through out life time of a component, we can't have it as part of styled component,
	 * and hence we use `style` prop.
	 */
	private getHeightDefiningComponent() {
		const { height, aspectRatio } = this.props;
		let heightDefiningStyles: React.CSSProperties;
		if (height) {
			heightDefiningStyles = {
				height: `${height}px`,
			};
		} else {
			// paddingBottom css trick defines ratio of `iframe height (y) + header (32)` to `width (x)`,
			// where is `aspectRatio` defines iframe aspectRatio alone
			// So, visually:
			//
			//            x
			//       ┌──────────┐
			//       │  header  │ 32
			//       ├──────────┤
			//       │          │
			//       │  iframe  │ y
			//       │          │
			//       └──────────┘
			//
			// aspectRatio = x / y
			// paddingBottom = (y + 32) / x
			// which can be achieved with css calc() as (1 / (x/y)) * 100)% + 32px
			heightDefiningStyles = {
				paddingBottom: `calc(${((1 / aspectRatio) * 100).toFixed(3)}% + ${embedHeaderHeight}px)`,
			};
		}

		return (
			<span
				data-testid={'resizable-embed-card-height-definer'}
				style={{
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					display: 'block',
					/* Fixes extra padding problem in Firefox */
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop, @atlaskit/design-system/use-tokens-typography -- Ignored via go/DSP-18766
					fontSize: 0,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop, @atlaskit/design-system/use-tokens-typography -- Ignored via go/DSP-18766
					lineHeight: 0,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					...heightDefiningStyles,
				}}
			/>
		);
	}

	render() {
		const { layout, pctWidth, containerWidth, fullWidthMode, isResizeDisabled, children } =
			this.props;

		const resizerProps = {
			width: this.calcPxWidth(),
			innerPadding: akEditorMediaResizeHandlerPadding,
		};

		const enable: EnabledHandles = {};
		handleSides.forEach((side) => {
			if (isResizeDisabled) {
				enable[side] = false;
				return;
			}

			const oppositeSide = side === 'left' ? 'right' : 'left';
			enable[side] =
				['full-width', 'wide', 'center']
					.concat(`wrap-${oppositeSide}` as RichMediaLayout)
					.concat(`align-${imageAlignmentMap[oppositeSide]}` as RichMediaLayout)
					.indexOf(layout) > -1;

			if (side === 'left' && this.insideInlineLike) {
				enable[side] = false;
			}
		});

		const nestedInTableHandleStyles = (isNestedInTable: Boolean) => {
			if (!isNestedInTable) {
				return;
			}
			return {
				left: {
					left: `calc(${token('space.negative.025', '-0.125em')} * 0.5)`,
					paddingLeft: '0px',
				},
				right: {
					right: `calc(${token('space.negative.025', '-0.125em')} * 0.5)`,
					paddingRight: '0px',
				},
			};
		};

		/* eslint-disable  @atlaskit/design-system/consistent-css-prop-usage */
		return (
			<div data-testid="resizable-embed-card-spacing">
				<div
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
					css={wrapperStyle({
						layout,
						isResized: !!pctWidth,
						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
						containerWidth: containerWidth || DEFAULT_EMBED_CARD_WIDTH,
						fullWidthMode,
					})}
				>
					<Resizer
						// Ignored via go/ees005
						// eslint-disable-next-line react/jsx-props-no-spreading
						{...this.props}
						enable={enable}
						calcNewSize={this.calcNewSize}
						snapPoints={this.calcSnapPoints()}
						scaleFactor={!this.wrappedLayout && !this.insideInlineLike ? 2 : 1}
						highlights={this.highlights}
						nodeType="embed"
						handleStyles={nestedInTableHandleStyles(this.isNestedInTable())}
						// Ignored via go/ees005
						// eslint-disable-next-line react/jsx-props-no-spreading
						{...resizerProps}
					>
						{children}
						{this.getHeightDefiningComponent()}
					</Resizer>
				</div>
			</div>
		);
		/* eslint-enable @atlaskit/design-system/consistent-css-prop-usage */
	}
}
