import React, { Component, useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';

import Popper from 'popper.js';
import type { Boundary, Data } from 'popper.js'; // eslint-disable-line import/extensions
import rafSchedule from 'raf-schd';

import { fg } from '@atlaskit/platform-feature-flags/fg';
import { type Modifier, Popper as WrappedPopper } from '@atlaskit/popper/main';

import { positionPropToPopperPosition } from './internal/helpers';

export type Props = {
	children?: React.ReactNode;
	content: ReactNode | null;
	offset: string;
	onPositioned: () => void;
	position: string;
};

export type State = {
	cssPosition: string; // 'fixed' or 'absolute'
	hasExtractedStyles: boolean;
	maxHeight: number | null;
	offsets: {
		popper: {
			left: number;
			top: number;
		};
	};
	originalHeight: number | null;
	position?: string;
	transform?: string;
};

const defaultState = {
	hasExtractedStyles: false,
	// We set these default offsets to prevent a flash of popper content in the wrong position
	// which can cause incorrect height calculations. Popper will calculate these values
	offsets: {
		popper: {
			left: -9999,
			top: -9999,
			position: null,
		},
	},
	cssPosition: 'absolute',
	originalHeight: null,
	maxHeight: null,
};

function defaultOnPositioned() {}

const defaultProps = {
	boundariesElement: 'viewport',
	children: null,
	content: null,
	offset: '0, 0',
	position: 'right middle',
	zIndex: 400,
	lockScroll: false,
	isAlwaysFixed: false,
	onPositioned: defaultOnPositioned,
};

// Ignored via go/ees005
// eslint-disable-next-line @repo/internal/react/no-class-components
class LegacyLayer extends Component<Props, State> {
	private popper: Popper | undefined;
	private targetRef = React.createRef<HTMLDivElement>();
	private contentRef = React.createRef<HTMLDivElement>();

	// working with extract-react-types
	static defaultProps = defaultProps;

	constructor(props: Props) {
		super(props);
		this.state = defaultState;

		this.extractStyles = rafSchedule(this.extractStyles.bind(this));
	}

	componentDidMount(): void {
		this.applyPopper(this.props);
	}

	componentDidUpdate(prevProps: Props, prevState: State): void {
		const { onPositioned } = this.props;
		const { hasExtractedStyles } = this.state;
		if (this.props !== prevProps) {
			this.applyPopper(this.props);
		}

		// This flag is set the first time the position is calculated from Popper and applied to the content
		if (!prevState.hasExtractedStyles && hasExtractedStyles && onPositioned) {
			onPositioned();
		}
	}

	componentWillUnmount(): void {
		// this.extractStyles.cancel();
		if (this.popper) {
			this.popper.destroy();
		}
	}

	/* Calculate the max height of the popper if it's height is greater than the viewport to prevent
	 * the bottom of the popper not being viewable.
	 * Only works if the popper uses viewport as the boundary and has a fixed position ancestor.
	 */
	calculateMaxHeight(
		originalHeight: number,
		currentHeight: number,
		positionTop: number,
		cssPosition: string,
	): number | null {
		let DocumentElementClientHeight = 0;

		if (document.documentElement) {
			DocumentElementClientHeight = document.documentElement.clientHeight;
		}
		if (cssPosition !== 'fixed') {
			return null;
		}
		const viewportHeight = Math.max(DocumentElementClientHeight, window.innerHeight || 0);
		return viewportHeight < originalHeight && currentHeight + positionTop >= viewportHeight - 50
			? // allow some spacing either side of viewport height
				viewportHeight - 12
			: null;
	}

	extractStyles = (state: Data): void => {
		if (state) {
			const popperHeight = state.offsets.popper.height;
			const left = Math.round(state.offsets.popper.left);
			const top = Math.round(state.offsets.popper.top);
			const cssPosition = 'absolute';

			const originalHeight = this.state.originalHeight || popperHeight;
			const maxHeight = this.calculateMaxHeight(originalHeight, popperHeight, top, cssPosition);
			this.setState({
				// position: fixed or absolute
				cssPosition,
				hasExtractedStyles: true,
				transform: `translate3d(${left}px, ${top}px, 0px)`,
				originalHeight,
				maxHeight,
			});
		}
	};

	applyPopper(props: Props): void {
		if (!this.targetRef.current || !this.contentRef.current) {
			return;
		}

		if (this.popper) {
			this.popper.destroy();
		}

		// "new Popper(...)" operation is very expensive when called on virtual DOM.
		// This condition reduces the number of calls so we can run our tests faster
		// (time was reduced from 100s to 13s).
		if (!props.content) {
			return;
		}

		// we wrap our target in a div so that we can safely get a reference to it, but we pass the
		// actual target to popper
		const isAlwaysFixed = false;
		const actualTarget = this.targetRef.current.children[0];
		const popperOpts = {
			placement: positionPropToPopperPosition(props.position),
			onCreate: this.extractStyles,
			onUpdate: this.extractStyles,
			modifiers: {
				applyStyle: {
					enabled: false,
				},
				hide: {
					enabled: false,
				},
				offset: {
					enabled: true,
					offset: this.props.offset,
				},
				flip: {
					enabled: false,
					flipVariations: true,
					boundariesElement: 'viewport' as Boundary,
					padding: 0, // leave 0 pixels between popper and the boundariesElement
				},
				preventOverflow: {
					enabled: false,
					escapeWithReference: true,
				},
			},
			positionFixed: isAlwaysFixed,
		};
		if (actualTarget) {
			this.popper = new Popper(actualTarget, this.contentRef.current, popperOpts);
		}
	}

	render(): React.JSX.Element {
		const { transform, hasExtractedStyles, maxHeight } = this.state;
		const opacity = hasExtractedStyles ? {} : { opacity: 0 };

		return (
			<div>
				<div ref={this.targetRef}>{this.props.children}</div>
				<div
					ref={this.contentRef}
					style={{
						// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
						top: 0,
						// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
						left: 0,
						// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
						position: 'absolute',
						// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
						transform,
						maxHeight: maxHeight ? maxHeight : 'auto',
						// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
						...opacity,
					}}
				>
					{this.props.content}
				</div>
			</div>
		);
	}
}

function parseOffset({ offset }: { offset: string }): [number, number] {
	const [rawSkidding, rawDistance] = offset.split(',');
	const skidding = Number.parseFloat(rawSkidding);
	const distance = Number.parseFloat(rawDistance);

	return [Number.isFinite(skidding) ? skidding : 0, Number.isFinite(distance) ? distance : 0];
}

type TPopperInteropProps = Props & {
	strategy: 'absolute' | 'fixed';
};

type TPopperInteropModifierName =
	| 'editorLayerFirstPositioned'
	| 'flip'
	| 'preventOverflow'
	| 'hide';

const popperInteropModifiers: Modifier<TPopperInteropModifierName>[] = [
	{ name: 'flip', enabled: false },
	{ name: 'preventOverflow', enabled: false },
	{ name: 'hide', enabled: false },
];

function usePopperInteropModifiers({
	onPositioned,
}: {
	onPositioned: () => void;
}): Modifier<TPopperInteropModifierName>[] {
	const onPositionedRef = useRef(onPositioned);
	const hasPositionedRef = useRef(false);
	useLayoutEffect(() => {
		onPositionedRef.current = onPositioned;
	}, [onPositioned]);

	return useMemo(
		() => [
			...popperInteropModifiers,
			{
				name: 'editorLayerFirstPositioned',
				enabled: true,
				// React Popper commits calculated styles in `write`; the legacy callback ran afterwards.
				phase: 'afterWrite',
				fn() {
					if (hasPositionedRef.current) {
						return;
					}
					hasPositionedRef.current = true;
					onPositionedRef.current();
				},
			},
		],
		[],
	);
}

function PopperInterop({
	children,
	content,
	offset,
	onPositioned,
	position,
	strategy,
}: TPopperInteropProps): ReactNode {
	const targetRef = useRef<HTMLDivElement>(null);
	const [referenceElement, setReferenceElement] = useState<HTMLElement | null>(null);
	const modifiers = usePopperInteropModifiers({ onPositioned });
	// Popper v2 compares the offset prop by reference, so memoise to avoid re-running positioning every render.
	const parsedOffset = useMemo(() => parseOffset({ offset }), [offset]);

	useLayoutEffect(() => {
		const actualTarget = targetRef.current?.children[0];
		setReferenceElement(actualTarget instanceof HTMLElement ? actualTarget : null);
	}, [children]);

	return (
		<div>
			<div ref={targetRef}>{children}</div>
			{content && referenceElement ? (
				<WrappedPopper
					modifiers={modifiers}
					offset={parsedOffset}
					placement={positionPropToPopperPosition(position)}
					referenceElement={referenceElement}
					strategy={strategy}
				>
					{({ ref, style }) => (
						<div ref={ref} style={style}>
							{content}
						</div>
					)}
				</WrappedPopper>
			) : (
				<div />
			)}
		</div>
	);
}

/** Selects the reversible Popper v1 or ADS wrapper implementation. */
export default function Layer({
	children = defaultProps.children,
	content = defaultProps.content,
	offset = defaultProps.offset,
	onPositioned = defaultProps.onPositioned,
	position = defaultProps.position,
}: Partial<Props>): ReactNode {
	if (fg('platform-dst-popper-consolidation')) {
		return (
			<PopperInterop
				content={content}
				offset={offset}
				onPositioned={onPositioned}
				position={position}
				strategy="absolute"
			>
				{children}
			</PopperInterop>
		);
	}

	return (
		<LegacyLayer content={content} offset={offset} onPositioned={onPositioned} position={position}>
			{children}
		</LegacyLayer>
	);
}
