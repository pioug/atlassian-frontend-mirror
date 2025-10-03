import React, { Fragment, type MouseEvent, type ReactElement, type RefCallback } from 'react';

import useScrollCapture from './use-scroll-capture';
import useScrollLock from './use-scroll-lock';

interface ScrollManagerProps {
	readonly children: (ref: RefCallback<HTMLElement>) => ReactElement;
	// eslint-disable-next-line @repo/internal/react/boolean-prop-naming-convention
	readonly lockEnabled: boolean;
	// eslint-disable-next-line @repo/internal/react/boolean-prop-naming-convention
	readonly captureEnabled: boolean;
	readonly onBottomArrive?: (event: WheelEvent | TouchEvent) => void;
	readonly onBottomLeave?: (event: WheelEvent | TouchEvent) => void;
	readonly onTopArrive?: (event: WheelEvent | TouchEvent) => void;
	readonly onTopLeave?: (event: WheelEvent | TouchEvent) => void;
}

const blurSelectInput = (event: MouseEvent<HTMLDivElement>) => {
	const element = event.target as HTMLDivElement;
	return (
		element.ownerDocument.activeElement &&
		(element.ownerDocument.activeElement as HTMLElement).blur()
	);
};

export default function ScrollManager({
	children,
	lockEnabled,
	captureEnabled = true,
	onBottomArrive,
	onBottomLeave,
	onTopArrive,
	onTopLeave,
}: ScrollManagerProps) {
	const setScrollCaptureTarget = useScrollCapture({
		isEnabled: captureEnabled,
		onBottomArrive,
		onBottomLeave,
		onTopArrive,
		onTopLeave,
	});
	const setScrollLockTarget = useScrollLock({ isEnabled: lockEnabled });

	const targetRef: RefCallback<HTMLElement> = (element) => {
		setScrollCaptureTarget(element);
		setScrollLockTarget(element);
	};

	return (
		<Fragment>
			{lockEnabled && (
				// eslint-disable-next-line jsx-a11y/no-static-element-interactions, @atlassian/a11y/interactive-element-not-keyboard-focusable, @atlassian/a11y/click-events-have-key-events
				<div
					onClick={blurSelectInput}
					style={{
						// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
						position: 'fixed',
						// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
						insetBlockEnd: 0,
						// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
						insetBlockStart: 0,
						// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
						insetInlineEnd: 0,
						// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
						insetInlineStart: 0,
					}}
				/>
			)}
			{children(targetRef)}
		</Fragment>
	);
}
