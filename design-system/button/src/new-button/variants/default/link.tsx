import React, { forwardRef, memo, type Ref } from 'react';

import Anchor from '@atlaskit/primitives/anchor';

import { type AdditionalDefaultLinkVariantProps, type CommonLinkVariantProps } from '../types';

import { type CommonDefaultButtonProps } from './types';
import useDefaultButton from './use-default-button';

export type LinkButtonProps<RouterLinkConfig extends Record<string, any> = never> =
	CommonDefaultButtonProps &
		CommonLinkVariantProps<RouterLinkConfig> &
		AdditionalDefaultLinkVariantProps;

const LinkButtonBase = <RouterLinkConfig extends Record<string, any> = never>(
	{
		analyticsContext,
		appearance,
		'aria-label': ariaLabel,
		'aria-labelledby': ariaLabelledBy,
		autoFocus,
		children,
		href,
		iconAfter,
		iconBefore,
		interactionName,
		isDisabled,
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
		shouldFitContainer,
		spacing,
		testId,
		UNSAFE_iconAfter_size,
		UNSAFE_iconBefore_size,
		...rest
	}: LinkButtonProps<RouterLinkConfig>,
	ref: Ref<HTMLAnchorElement>,
) => {
	const baseProps = useDefaultButton<HTMLAnchorElement>({
		ariaLabel,
		ariaLabelledBy,
		analyticsContext,
		appearance,
		autoFocus,
		buttonType: 'link',
		children,
		iconAfter,
		iconBefore,
		interactionName,
		isDisabled,
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
		testId,
		UNSAFE_iconAfter_size,
		UNSAFE_iconBefore_size,
	});

	return (
		<Anchor
			// eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
			{...rest}
			aria-label={baseProps['aria-label']}
			aria-labelledby={baseProps['aria-labelledby']}
			ref={baseProps.ref}
			xcss={baseProps.xcss}
			onClick={baseProps.onClick}
			onMouseDownCapture={baseProps.onMouseDownCapture}
			onMouseUpCapture={baseProps.onMouseUpCapture}
			onKeyDownCapture={baseProps.onKeyDownCapture}
			onKeyUpCapture={baseProps.onKeyUpCapture}
			onTouchStartCapture={baseProps.onTouchStartCapture}
			onTouchEndCapture={baseProps.onTouchEndCapture}
			onPointerDownCapture={baseProps.onPointerDownCapture}
			onPointerUpCapture={baseProps.onPointerUpCapture}
			onClickCapture={baseProps.onClickCapture}
			testId={testId}
			/**
			 * Disable link in an accessible way using `href`, `role`, and `aria-disabled`.
			 * @see https://a11y-guidelines.orange.com/en/articles/disable-elements/#disable-a-link
			 */
			// @ts-expect-error (`href` is required, we could make it optional but don't want to encourage this pattern elsewhere)
			href={baseProps.isDisabled ? undefined : href}
			role={baseProps.isDisabled ? 'link' : undefined}
			aria-disabled={baseProps.isDisabled === true ? true : undefined}
			analyticsContext={analyticsContext}
			interactionName={interactionName}
			componentName="LinkButton"
		>
			{baseProps.children}
		</Anchor>
	);
};

// Workarounds to support generic types with forwardRef + memo
const WithRef = forwardRef(LinkButtonBase) as <
	RouterLinkConfig extends Record<string, any> = never,
>(
	props: LinkButtonProps<RouterLinkConfig> & { ref?: Ref<HTMLAnchorElement> },
) => ReturnType<typeof LinkButtonBase>;

/**
 * __Link Button__
 *
 * Renders a link in the style of a button.
 *
 * - [Examples](https://atlassian.design/components/link-button/examples)
 * - [Code](https://atlassian.design/components/link-button/code)
 * - [Usage](https://atlassian.design/components/link-button/usage)
 */
const LinkButton = memo(WithRef) as typeof WithRef;

export default LinkButton;
