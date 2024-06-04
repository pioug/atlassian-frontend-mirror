import React, { Fragment } from 'react';

import Content from '../shared/content';
import renderLoadingOverlay from '../shared/loading-overlay';
import useButtonBase, {
	type UseButtonBaseArgs,
	type UseButtonBaseReturn,
} from '../shared/use-button-base';

import { type CommonDefaultButtonProps } from './types';

type UseDefaultButtonArgs<TagName extends HTMLElement> = UseButtonBaseArgs<TagName> &
	CommonDefaultButtonProps;

type UseButtonReturn<TagName extends HTMLElement> = UseButtonBaseReturn<TagName>;

/**
 * __Use default button base__
 *
 * A React hook that accepts a set of default Button props,
 * and processes them to return consistent base props for usage
 * across Button and LinkButton variants.
 *
 * @private
 */
const useDefaultButton = <TagName extends HTMLElement>({
	analyticsContext,
	appearance,
	autoFocus,
	buttonType,
	children,
	iconAfter: IconAfter,
	iconBefore: IconBefore,
	interactionName,
	isDisabled,
	isLoading = false,
	isSelected,
	onClick,
	onClickCapture,
	onKeyDownCapture,
	onKeyUpCapture,
	onMouseDownCapture,
	onMouseUpCapture,
	onPointerDownCapture,
	onPointerUpCapture,
	onTouchEndCapture,
	onTouchStartCapture,
	overlay,
	ref,
	shouldFitContainer,
	spacing,
	UNSAFE_iconAfter_size,
	UNSAFE_iconBefore_size,
}: UseDefaultButtonArgs<TagName>): UseButtonReturn<TagName> => {
	const hasOverlay = Boolean(overlay || isLoading);

	const baseProps = useButtonBase<TagName>({
		analyticsContext,
		appearance,
		autoFocus,
		buttonType,
		children: (
			<Fragment>
				{IconBefore && (
					<Content type="icon" position="before" hasOverlay={hasOverlay}>
						<IconBefore label="" size={UNSAFE_iconBefore_size} color={'currentColor'} />
					</Content>
				)}
				{children && <Content hasOverlay={hasOverlay}>{children}</Content>}
				{IconAfter && (
					<Content type="icon" position="after" hasOverlay={hasOverlay}>
						<IconAfter label="" size={UNSAFE_iconAfter_size} color={'currentColor'} />
					</Content>
				)}
			</Fragment>
		),
		interactionName,
		isDisabled,
		isLoading,
		isSelected,
		onClick,
		onMouseDownCapture,
		onMouseUpCapture,
		onKeyDownCapture,
		onKeyUpCapture,
		onTouchStartCapture,
		onTouchEndCapture,
		onPointerDownCapture,
		onPointerUpCapture,
		onClickCapture,
		overlay: isLoading
			? renderLoadingOverlay({
					spacing,
					appearance,
					isDisabled,
					isSelected,
				})
			: overlay,
		ref,
		shouldFitContainer,
		spacing,
		hasIconBefore: Boolean(IconBefore),
		hasIconAfter: Boolean(IconAfter),
	});

	return baseProps;
};

export default useDefaultButton;
