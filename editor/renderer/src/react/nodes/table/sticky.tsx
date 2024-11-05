/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import type { SerializedStyles } from '@emotion/react';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';

import { TableSharedCssClassName } from '@atlaskit/editor-common/styles';
import type { OverflowShadowProps } from '@atlaskit/editor-common/ui';
import { akEditorStickyHeaderZIndex } from '@atlaskit/editor-shared-styles';
import type { TableLayout } from '@atlaskit/adf-schema';
import { N40A } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { Table } from './table';
import { recursivelyInjectProps } from '../../utils/inject-props';
import type { RendererAppearance } from '../../../ui/Renderer/types';
export type StickyMode = 'none' | 'stick' | 'pin-bottom';

export const tableStickyPadding = 8;

type FixedProps = React.PropsWithChildren<{
	top?: number;
	wrapperWidth: number;
	mode: StickyMode;
	allowTableResizing?: boolean;
}>;

const modeSpecficStyles: Record<StickyMode, SerializedStyles> = {
	none: css({
		display: 'none',
	}),
	stick: css({
		position: 'fixed',
	}),
	'pin-bottom': css({
		position: 'absolute',
	}),
};

// TODO: Quality ticket: https://product-fabric.atlassian.net/browse/DSP-4123
const fixedTableDivStaticStyles = (
	top: number | undefined,
	width: number,
	allowTableResizing?: boolean,
) => {
	let stickyHeaderZIndex: number;
	if (allowTableResizing) {
		stickyHeaderZIndex = 13;
	} else {
		stickyHeaderZIndex = akEditorStickyHeaderZIndex;
	}

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	return css(typeof top === 'number' && `top: ${top}px;`, {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		width: `${width}px`,
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		zIndex: stickyHeaderZIndex,
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
		[`& .${TableSharedCssClassName.TABLE_CONTAINER}, & .${TableSharedCssClassName.TABLE_STICKY_WRAPPER} > table`]:
			{
				marginTop: 0,
				marginBottom: 0,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
				tr: {
					background: token('elevation.surface', 'white'),
				},
			},
		borderTop: `${tableStickyPadding}px solid ${token('elevation.surface', 'white')}`,
		background: token('elevation.surface.overlay', 'white'),
		boxShadow: `0 6px 4px -4px ${token('elevation.shadow.overflow.perimeter', N40A)}`,
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
		"div[data-expanded='false'] &": {
			display: 'none',
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
		[`& .${TableSharedCssClassName.TABLE_CONTAINER}.is-sticky.right-shadow::after, & .${TableSharedCssClassName.TABLE_CONTAINER}.is-sticky.left-shadow::before`]:
			{
				top: '0px',
				height: '100%',
			},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		"&.fixed-table-div-custom-table-resizing[mode='stick']": {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
			zIndex: stickyHeaderZIndex,
		},
	});
};

const FixedTableDiv = (props: FixedProps) => {
	const { top, wrapperWidth, mode, allowTableResizing } = props;
	const fixedTableCss = [
		fixedTableDivStaticStyles(top, wrapperWidth, allowTableResizing),
		modeSpecficStyles?.[mode],
	];

	const attrs = { mode };

	return (
		<div
			{...attrs}
			data-testid="sticky-table-fixed"
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
			className={allowTableResizing ? 'fixed-table-div-custom-table-resizing' : ''}
			// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
			css={fixedTableCss}
		>
			{props.children}
		</div>
	);
};

type StickyTableProps = {
	left?: number; // TODO: would be good to abstract this away
	top?: number;
	mode: StickyMode;
	innerRef: React.RefObject<HTMLDivElement>;
	rowHeight: number;

	wrapperWidth: number;
	tableWidth: 'inherit' | number;
	isNumberColumnEnabled: boolean;
	children: React.ReactNode[];
	layout: TableLayout;
	columnWidths?: number[];
	renderWidth: number;
	tableNode?: PMNode;
	rendererAppearance: RendererAppearance;
	allowTableResizing?: boolean;
} & OverflowShadowProps;

export const StickyTable = ({
	top,
	left,
	mode,
	shadowClassNames,
	innerRef,
	wrapperWidth,
	tableWidth,
	isNumberColumnEnabled,
	layout,
	children,
	columnWidths,
	renderWidth,
	rowHeight,
	tableNode,
	rendererAppearance,
	allowTableResizing,
}: StickyTableProps) => {
	let styles;
	/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
	if (allowTableResizing) {
		styles = css({
			// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage/preview, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
			top: mode === 'pin-bottom' ? top : undefined,
			position: 'absolute',
		});
	} else {
		styles = css({
			// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage/preview, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
			left: left && left < 0 ? left : undefined,
			// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage/preview, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
			top: mode === 'pin-bottom' ? top : undefined,
			position: 'relative',
		});
	}
	/* eslint-enable @atlaskit/design-system/ensure-design-token-usage */
	return (
		// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
		<div css={styles}>
			<FixedTableDiv
				top={mode === 'stick' ? top : undefined}
				mode={rowHeight > 300 ? 'none' : mode}
				wrapperWidth={wrapperWidth}
				allowTableResizing={allowTableResizing}
			>
				<div
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
					className={`${TableSharedCssClassName.TABLE_CONTAINER} is-sticky ${
						shadowClassNames || ''
					}`}
					data-layout={layout}
					style={{
						width: tableWidth,
					}}
				>
					<div
						ref={innerRef}
						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
						className={`${TableSharedCssClassName.TABLE_STICKY_WRAPPER}`}
						style={{
							// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
							overflow: 'hidden',
						}}
					>
						<Table
							columnWidths={columnWidths}
							layout={layout}
							isNumberColumnEnabled={isNumberColumnEnabled}
							renderWidth={renderWidth}
							tableNode={tableNode}
							rendererAppearance={rendererAppearance}
						>
							{
								/**
								 * @see https://product-fabric.atlassian.net/browse/ED-10235
								 * We pass prop 'invisible' to our table's children nodes meaning
								 * they exist inside of the 'invisible' duplicated table component that
								 * enables sticky headers.
								 */
								recursivelyInjectProps(children, { invisible: true })
							}
						</Table>
					</div>
				</div>
			</FixedTableDiv>
		</div>
	);
};

/**
 * Traverse DOM Tree upwards looking for table parents with "overflow: scroll".
 */
function findHorizontalOverflowScrollParent(table: HTMLElement | null, defaultScrollRootEl?: HTMLElement): HTMLElement | null {
	let parent: HTMLElement | null = table;
	if (!parent) {
		return null;
	}

	while ((parent = parent.parentElement)) {
		// IE11 on Window 8 doesn't show styles from CSS when accessing through element.style property.
		const style = window.getComputedStyle(parent);
		if (style.overflow === 'scroll' || style.overflowY === 'scroll') {
			return parent;
		}

		if (!!defaultScrollRootEl && defaultScrollRootEl === parent) {
			// If a defaultScrollRootEl was specified and we reached it without finding a closer scroll parent,
			// use the defaultScrollRootEl.
			return parent;
		}
	}

	return null;
}

export class OverflowParent {
	private constructor(private ref: HTMLElement | Window) {
		this.ref = ref;
	}

	static fromElement(el: HTMLElement | null, defaultScrollRootEl?: HTMLElement) {
		return new OverflowParent(findHorizontalOverflowScrollParent(el, defaultScrollRootEl) || window);
	}

	get isElement() {
		return this.ref instanceof HTMLElement;
	}

	get top() {
		if (this.ref instanceof HTMLElement) {
			return this.ref.getBoundingClientRect().top;
		}

		return 0;
	}

	public addEventListener(type: string, cb: EventListenerOrEventListenerObject, ...args: any[]) {
		this.ref.addEventListener(type, cb, ...args);
	}

	public removeEventListener(type: string, cb: EventListenerOrEventListenerObject, ...args: any[]) {
		this.ref.removeEventListener(type, cb, ...args);
	}
}
