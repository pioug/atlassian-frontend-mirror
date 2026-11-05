import React, { useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';

import { fg } from '@atlaskit/platform-feature-flags/fg';
import { type Modifier, Popper as WrappedPopper } from '@atlaskit/popper/main';
import { Manager } from '@atlaskit/popper/manager';

import { positionPropToPopperPosition } from './internal/helpers';

export type Props = {
	children?: React.ReactNode;
	content: ReactNode | null;
	offset: string;
	onPositioned: () => void;
	position: string;
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
	isContentShown,
	onPositioned,
}: {
	isContentShown: boolean;
	onPositioned: () => void;
}): Modifier<TPopperInteropModifierName>[] {
	const onPositionedRef = useRef(onPositioned);
	const hasPositionedRef = useRef(false);
	useLayoutEffect(() => {
		onPositionedRef.current = onPositioned;
	}, [onPositioned]);

	// On the top-layer path `@atlaskit/popper` ignores `modifiers`: CSS Anchor Positioning places
	// the content when it mounts. So report the first position once the content is shown.
	useLayoutEffect(() => {
		if (!fg('platform-dst-top-layer') || !isContentShown || hasPositionedRef.current) {
			return;
		}
		hasPositionedRef.current = true;
		onPositionedRef.current();
	}, [isContentShown]);

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
	const isContentShown = Boolean(content && referenceElement);
	const modifiers = usePopperInteropModifiers({ isContentShown, onPositioned });
	// Popper v2 compares the offset prop by reference, so memoise to avoid re-running positioning every render.
	const parsedOffset = useMemo(() => parseOffset({ offset }), [offset]);

	useLayoutEffect(() => {
		const actualTarget = targetRef.current?.children[0];
		setReferenceElement(actualTarget instanceof HTMLElement ? actualTarget : null);
	}, [children]);

	return (
		<div>
			<div ref={targetRef}>{children}</div>
			{content ? (
				// Mount `content` in the same commit as the Layer, before `referenceElement` resolves.
				// Callers act on the content DOM in that commit: DropList focuses it, and menus
				// dispatch `ArrowDown` to focus their first item. The `Manager` stops Popper from
				// using an ancestor `Manager`'s reference until `referenceElement` is set.
				<Manager>
					<WrappedPopper
						modifiers={modifiers}
						offset={parsedOffset}
						placement={positionPropToPopperPosition(position)}
						referenceElement={referenceElement ?? undefined}
						strategy={strategy}
					>
						{({ ref, style }) => (
							<div ref={ref} style={style}>
								{content}
							</div>
						)}
					</WrappedPopper>
				</Manager>
			) : (
				<div />
			)}
		</div>
	);
}

/** Positions `content` next to `children` with the ADS Popper wrapper. */
export default function Layer({
	children = defaultProps.children,
	content = defaultProps.content,
	offset = defaultProps.offset,
	onPositioned = defaultProps.onPositioned,
	position = defaultProps.position,
}: Partial<Props>): ReactNode {
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
