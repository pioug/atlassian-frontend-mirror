/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { useCallback, useRef } from 'react';

import { cssMap, jsx } from '@compiled/react';

import { ExitingPersistence, SlideIn, type Transition } from '@atlaskit/motion';
import type { SlideInProps } from '@atlaskit/motion/types';
import { CURRENT_SURFACE_CSS_VAR, token } from '@atlaskit/tokens';

import { EnsureIsInsideDrawerContext, OnCloseContext } from '../../context';
import { type DrawerPanelProps } from '../types';

import FocusLock from './focus-lock';

const LOCAL_CURRENT_SURFACE_CSS_VAR: typeof CURRENT_SURFACE_CSS_VAR =
	'--ds-elevation-surface-current';

const styles = cssMap({
	root: {
		display: 'flex',
		height: '100vh',
		position: 'fixed',
		zIndex: 500,
		backgroundColor: token('elevation.surface.overlay'),
		[LOCAL_CURRENT_SURFACE_CSS_VAR]: token('elevation.surface.overlay'),
		insetBlockStart: token('space.0'),
		insetInlineStart: token('space.0'),
		overflow: 'hidden',
		fontFamily: token('font.family.body'),
	},
	full: { width: '100vw' },
	extended: { width: '95vw' },
	narrow: { width: 360 },
	medium: { width: 480 },
	wide: { width: 600 },
});

/**
 * This wrapper is used to specify separate durations for enter and exit.
 */
const CustomSlideIn = ({
	children,
	onFinish,
	enterFrom,
}: Pick<SlideInProps, 'children' | 'onFinish' | 'enterFrom'>) => {
	return (
		<SlideIn
			animationTimingFunction="ease-out"
			duration="small"
			enterFrom={enterFrom}
			exitTo={enterFrom}
			fade="none"
			onFinish={onFinish}
		>
			{children}
		</SlideIn>
	);
};

/**
 * __Drawer panel__
 */
export const DrawerPanel = ({
	children,
	onClose,
	onCloseComplete,
	onOpenComplete,
	testId,
	isOpen,
	shouldReturnFocus,
	autoFocusFirstElem,
	isFocusLockEnabled,
	width = 'narrow',
	label,
	titleId,
	enterFrom = 'left',
}: DrawerPanelProps) => {
	/**
	 * A ref to point to our wrapper, passed to `onCloseComplete` and `onOpenComplete` callbacks.
	 */
	const drawerRef = useRef<HTMLDivElement>(null);

	const onFinish = useCallback(
		(state: Transition) => {
			if (state === 'entering') {
				onOpenComplete?.(drawerRef.current);
			} else if (state === 'exiting') {
				onCloseComplete?.(drawerRef.current);
			}
		},
		[onCloseComplete, onOpenComplete],
	);

	return (
		<ExitingPersistence appear>
			{isOpen && (
				<CustomSlideIn onFinish={onFinish} enterFrom={enterFrom}>
					{({ className }) => (
						<FocusLock
							autoFocusFirstElem={autoFocusFirstElem}
							isFocusLockEnabled={isFocusLockEnabled}
							shouldReturnFocus={shouldReturnFocus}
						>
							<div
								css={[styles.root, styles[width]]}
								// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
								className={className}
								data-testid={testId}
								ref={drawerRef}
								aria-modal={true}
								role="dialog"
								aria-label={label}
								aria-labelledby={titleId}
							>
								<EnsureIsInsideDrawerContext.Provider value={true}>
									<OnCloseContext.Provider value={onClose}>{children}</OnCloseContext.Provider>
								</EnsureIsInsideDrawerContext.Provider>
							</div>
						</FocusLock>
					)}
				</CustomSlideIn>
			)}
		</ExitingPersistence>
	);
};
