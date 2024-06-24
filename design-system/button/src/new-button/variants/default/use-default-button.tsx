import React, { Fragment } from 'react';

import Content from '../shared/content';
import IconRenderer from '../shared/icon-renderer';
import useButtonBase, {
	type UseButtonBaseArgs,
	type UseButtonBaseReturn,
} from '../shared/use-button-base';
import type { CommonButtonProps } from '../types';

import type { CommonDefaultButtonProps } from './types';

type UseDefaultButtonArgs<TagName extends HTMLElement> = UseButtonBaseArgs<TagName> &
	CommonDefaultButtonProps &
	Pick<CommonButtonProps<TagName>, 'testId'>;

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
	ariaLabel,
	ariaLabelledBy,
	autoFocus,
	buttonType,
	children,
	iconAfter,
	iconBefore,
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
	ref,
	shouldFitContainer,
	spacing,
	testId,
	UNSAFE_iconAfter_size,
	UNSAFE_iconBefore_size,
}: UseDefaultButtonArgs<TagName>): UseButtonReturn<TagName> => {
	const baseProps = useButtonBase<TagName>({
		analyticsContext,
		appearance,
		autoFocus,
		ariaLabel,
		ariaLabelledBy,
		buttonType,
		children: (
			<Fragment>
				{iconBefore && (
					<Content type="icon" position="before" isLoading={isLoading}>
						<IconRenderer icon={iconBefore} size={UNSAFE_iconBefore_size} />
					</Content>
				)}
				{children && <Content isLoading={isLoading}>{children}</Content>}
				{iconAfter && (
					<Content type="icon" position="after" isLoading={isLoading}>
						<IconRenderer icon={iconAfter} size={UNSAFE_iconAfter_size} />
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
		ref,
		shouldFitContainer,
		spacing,
		testId,
		hasIconBefore: Boolean(iconBefore),
		hasIconAfter: Boolean(iconAfter),
	});

	return baseProps;
};

export default useDefaultButton;
