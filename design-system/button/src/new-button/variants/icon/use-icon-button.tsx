import React from 'react';

import VisuallyHidden from '@atlaskit/visually-hidden';

import Content from '../shared/content';
import IconRenderer from '../shared/icon-renderer';
import renderLoadingOverlay from '../shared/loading-overlay';
import useButtonBase, {
	type UseButtonBaseArgs,
	type UseButtonBaseReturn,
} from '../shared/use-button-base';
import type { CommonButtonProps } from '../types';

import type { CommonIconButtonProps } from './types';

type UseIconButtonArgs<TagName extends HTMLElement> = Omit<UseButtonBaseArgs<TagName>, 'children'> &
	Omit<CommonIconButtonProps, 'isTooltipDisabled' | 'tooltip'> &
	Pick<CommonButtonProps<TagName>, 'testId'>;

type UseIconButtonReturn<TagName extends HTMLElement> = UseButtonBaseReturn<TagName>;

/**
 * __Use icon button__
 *
 * A React hook that accepts a set of icon Button props,
 * and processes them to return consistent base props for usage
 * across IconButton and LinkIconButton variants.
 *
 * @private
 */
const useIconButton = <TagName extends HTMLElement>({
	analyticsContext,
	appearance,
	ariaLabel,
	ariaLabelledBy,
	autoFocus,
	buttonType,
	icon,
	interactionName,
	isDisabled,
	isLoading,
	isSelected,
	label,
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
	shape,
	shouldFitContainer,
	spacing,
	testId,
	UNSAFE_size,
}: UseIconButtonArgs<TagName>): UseIconButtonReturn<TagName> => {
	const hasOverlay = Boolean(overlay || isLoading);
	const isCircle = shape === 'circle';

	const baseProps = useButtonBase<TagName>({
		analyticsContext,
		appearance,
		autoFocus,
		ariaLabel,
		ariaLabelledBy,
		buttonType,
		children: (
			<Content type="icon" hasOverlay={hasOverlay}>
				<IconRenderer icon={icon} size={UNSAFE_size} />
				<VisuallyHidden>{label}</VisuallyHidden>
			</Content>
		),
		interactionName,
		isDisabled,
		isLoading,
		isSelected,
		isIconButton: true,
		isCircle,
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
					testId,
				})
			: overlay,
		ref,
		shouldFitContainer,
		spacing,
	});

	return baseProps;
};

export default useIconButton;
