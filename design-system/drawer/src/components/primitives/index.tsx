import React, { useCallback, useRef } from 'react';

import { IconButton } from '@atlaskit/button/new';
import ArrowLeft from '@atlaskit/icon/core/migration/arrow-left';
import { ExitingPersistence, SlideIn, type Transition } from '@atlaskit/motion';
import type { SlideInProps } from '@atlaskit/motion/types';

import {
	type DrawerPrimitiveDefaults,
	type DrawerPrimitiveOverrides,
	type DrawerPrimitiveProps,
} from '../types';
import { createExtender } from '../utils';

import ContentOverrides from './content';
import DrawerWrapper from './drawer-wrapper';
import FocusLock from './focus-lock';
import SidebarOverrides from './sidebar';

// Misc.
// ------------------------------

const defaults: DrawerPrimitiveDefaults = {
	Sidebar: SidebarOverrides,
	Content: ContentOverrides,
};

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

const DrawerPrimitive = ({
	children,
	icon: Icon,
	closeLabel = 'Close drawer',
	scrollContentLabel,
	onClose,
	onCloseComplete,
	onOpenComplete,
	overrides,
	testId,
	in: isOpen,
	shouldReturnFocus,
	autoFocusFirstElem,
	isFocusLockEnabled,
	width,
	label,
	titleId,
	enterFrom = 'left',
}: DrawerPrimitiveProps) => {
	const getOverrides = createExtender<DrawerPrimitiveDefaults, DrawerPrimitiveOverrides>(
		defaults,
		overrides,
	);

	const { component: Sidebar, ...sideBarOverrides } = getOverrides('Sidebar');
	const { component: Content, ...contentOverrides } = getOverrides('Content');

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
							<DrawerWrapper
								// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
								className={className}
								width={width}
								testId={testId}
								drawerRef={drawerRef}
								label={label}
								titleId={titleId}
							>
								<Sidebar {...sideBarOverrides}>
									<IconButton
										onClick={onClose}
										testId={testId && 'DrawerPrimitiveSidebarCloseButton'}
										icon={
											Icon
												? (iconProps) => <Icon {...iconProps} size="large" LEGACY_size="large" />
												: ArrowLeft
										}
										label={closeLabel}
										shape="circle"
										appearance="subtle"
									/>
								</Sidebar>

								<Content scrollContentLabel={scrollContentLabel} {...contentOverrides}>
									{children}
								</Content>
							</DrawerWrapper>
						</FocusLock>
					)}
				</CustomSlideIn>
			)}
		</ExitingPersistence>
	);
};

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default DrawerPrimitive;
