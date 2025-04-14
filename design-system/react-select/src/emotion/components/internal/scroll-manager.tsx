/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { Fragment, type MouseEvent, type ReactElement, type RefCallback } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled
import { css, jsx } from '@emotion/react';

import useScrollCapture from './use-scroll-capture';
import useScrollLock from './use-scroll-lock';

const styles = css({
	position: 'fixed',
	insetBlockEnd: 0,
	insetBlockStart: 0,
	insetInlineEnd: 0,
	insetInlineStart: 0,
});
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
				// eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
				<div onClick={blurSelectInput} css={styles} />
			)}
			{children(targetRef)}
		</Fragment>
	);
}
