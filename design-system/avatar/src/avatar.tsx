/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import {
	forwardRef,
	isValidElement,
	type MouseEvent,
	type ReactNode,
	useCallback,
	useEffect,
	useRef,
} from 'react';

import { type UIAnalyticsEvent, useAnalyticsEvents } from '@atlaskit/analytics-next';
import { css, jsx } from '@atlaskit/css';
import { useId } from '@atlaskit/ds-lib/use-id';

import { AvatarContent } from './avatar-content';
import { AvatarContentContext, EnsureIsInsideAvatarContext, useAvatarContext } from './context';
import AvatarImage from './internal/avatar-image';
import { PresenceWrapper } from './presence';
import { StatusWrapper } from './status';
import {
	type AppearanceType,
	type AvatarClickEventHandler,
	type Presence,
	type SizeType,
	type Status,
} from './types';
import { getCustomElement } from './utilities';

const packageName = process.env._PACKAGE_NAME_ as string;
const packageVersion = process.env._PACKAGE_VERSION_ as string;

const containerStyles = css({
	display: 'inline-block',
	position: 'relative',
	outline: 0,
});

// eslint-disable-next-line @repo/internal/react/consistent-types-definitions
export interface AvatarPropTypes {
	/**
	 * Indicates the shape of the avatar. Most avatars are circular, but square avatars
	 * can be used for 'container' objects.
	 */
	appearance?: AppearanceType;
	/**
	 * Used to provide custom content to screen readers.
	 * Status or presence is not added to the label by default if it passed as nodes.
	 * If status or presence is passed as a string, the default content format is "John Smith (online)".
	 */
	label?: string;
	/**
	 * Used to override the default border color around the avatar body.
	 * Accepts any color argument that the border-color CSS property accepts.
	 */
	borderColor?: string;
	/**
	 * Supply a custom avatar component instead of the default.
	 */
	children?: ReactNode;
	/**
	 * Provides a url for avatars being used as a link.
	 */
	href?: string;
	/**
	 * Change the style to indicate the avatar is disabled.
	 */
	isDisabled?: boolean;
	/**
	 * Provides alt text for the avatar image.
	 */
	name?: string;
	/**
	 * Indicates a user's online status by showing a small icon on the avatar.
	 * Refer to presence values on the presence component.
	 * Alternatively accepts any React element. For best results, it is recommended to
	 * use square content with height and width of 100%.
	 */
	presence?: Presence | Omit<ReactNode, string> | (string & {}) | null;
	/**
	 * Defines the size of the avatar. Default value is `medium`.
	 *
	 * This can also be controlled by the `size` property of the
	 * `AvatarContext` export from this package. If no prop is given when the
	 * `size` is set via this context, the context's value will be used.
	 */
	size?: SizeType;
	/**
	 * A url to load an image from (this can also be a base64 encoded image).
	 */
	src?: string;
	/**
	 * Indicates contextual information by showing a small icon on the avatar.
	 * Refer to status values on the Status component.
	 */
	status?: Status | Omit<ReactNode, string> | (string & {}) | null;
	/**
	 * The index of where this avatar is in the group `stack`.
	 */
	stackIndex?: number;
	/**
	 * Assign specific tabIndex order to the underlying node.
	 */
	tabIndex?: number;
	/**
	 * Pass target down to the anchor, if href is provided.
	 */
	target?: '_blank' | '_self' | '_top' | '_parent';
	/**
	 * Handler to be called on click.
	 */
	onClick?: AvatarClickEventHandler;
	/**
	 * A `testId` prop is provided for specified elements, which is a unique string that appears as a data attribute `data-testid` in the rendered code, serving as a hook for automated tests.
	 */
	testId?: string;
	/**
	 * Analytics context meta data.
	 */
	analyticsContext?: Record<string, any>;
	/**
	 * Replace the wrapping element. This accepts the name of a html tag which will
	 * be used to wrap the element.
	 */
	as?: keyof JSX.IntrinsicElements | React.ComponentType<React.AllHTMLAttributes<HTMLElement>>;
	/**
	 * whether disable aria-labelledby for avatar img
	 */
	isDecorative?: boolean;
	/**
	 * Defines the loading behaviour of the avatar image. Default value is eager.
	 */
	imgLoading?: 'lazy' | 'eager';
	/**
	 * Identifies the popup element that the avatar controls.
	 * Used when Avatar is a trigger for a popup.
	 */
	'aria-controls'?: string;
	/**
	 * Announces to assistive technology whether the controlled popup is currently open or closed.
	 */
	'aria-expanded'?: boolean;
	/**
	 * Informs assistive technology that this element triggers a popup.
	 * When set, Avatar will render as a `<button>` element even without `onClick`.
	 */
	'aria-haspopup'?: boolean | 'dialog';
}

/**
 * __Avatar__
 *
 * An avatar is a visual representation of a user or entity.
 *
 * - [Examples](https://atlassian.design/components/avatar/examples)
 * - [Code](https://atlassian.design/components/avatar/code)
 * - [Usage](https://atlassian.design/components/avatar/usage)
 */
const Avatar: React.ForwardRefExoticComponent<
	React.PropsWithoutRef<AvatarPropTypes> & React.RefAttributes<HTMLElement>
> = forwardRef<HTMLElement, AvatarPropTypes>(
	(
		{
			analyticsContext,
			appearance = 'circle',
			label,
			borderColor,
			children,
			href,
			isDisabled,
			name,
			onClick,
			presence,
			size: sizeProp,
			src,
			stackIndex,
			status,
			target,
			testId,
			as: AvatarContainer = 'div',
			isDecorative = false,
			imgLoading,
			'aria-controls': ariaControls,
			'aria-expanded': ariaExpanded,
			'aria-haspopup': ariaHasPopup,
		},
		ref,
	) => {
		const { createAnalyticsEvent } = useAnalyticsEvents();
		const context = useAvatarContext();
		const size = sizeProp || context?.size || 'medium';
		const customPresenceNode = isValidElement(presence) ? presence : null;
		const customStatusNode = isValidElement(status) ? status : null;
		const isValidIconSize = size !== 'xxlarge' && size !== 'xsmall';
		const lastAnalytics = useRef(analyticsContext);
		const labelId = useId();

		useEffect(() => {
			lastAnalytics.current = analyticsContext;
		}, [analyticsContext]);

		const onClickHandler = useCallback(
			(event: MouseEvent<HTMLElement>) => {
				if (isDisabled || typeof onClick !== 'function') {
					return;
				}

				const analyticsEvent = createAnalyticsEvent({
					action: 'clicked',
					actionSubject: 'avatar',
					attributes: {
						componentName: 'avatar',
						packageName,
						packageVersion,
					},
				});

				/**
				 * To avoid wrapping this component in AnalyticsContext we manually
				 * push the parent context's meta data into the context.
				 */
				const context: Record<string, any> = {
					componentName: 'avatar',
					packageName,
					packageVersion,
					...lastAnalytics.current,
				};

				analyticsEvent.context.push(context);

				/**
				 * Replicating the logic in the `withAnalyticsEvents` HOC.
				 */
				const clone: UIAnalyticsEvent | null = analyticsEvent.clone();
				if (clone) {
					clone.fire('atlaskit');
				}

				onClick(event, analyticsEvent);
			},
			[createAnalyticsEvent, isDisabled, onClick],
		);

		const isPresence = isValidIconSize && presence && !status;
		const isStatus = isValidIconSize && status;

		// add presence or status to the label by default if presence and status are passed as a string
		// if status or presence are nodes this is not added to the label by default
		const defaultLabel = [
			name,
			isStatus && !customStatusNode && `(${status})`,
			isPresence && !customPresenceNode && `(${presence})`,
		]
			.filter(Boolean)
			.join(' ');

		const isInteractive = onClick || href || isDisabled || ariaHasPopup;
		const containerShouldBeImage = Boolean(!isInteractive && defaultLabel);

		return (
			<EnsureIsInsideAvatarContext.Provider value={true}>
				{/* @ts-ignore - Workaround for typecheck issues with help-center local consumption */}
				<AvatarContainer
					data-testid={testId}
					role={containerShouldBeImage ? 'img' : undefined}
					aria-labelledby={containerShouldBeImage && !isDecorative ? labelId : undefined}
					css={containerStyles}
					style={{ zIndex: stackIndex }}
				>
					<AvatarContentContext.Provider
						value={{
							as: getCustomElement(isDisabled, href, onClick, ariaHasPopup),
							appearance,
							borderColor,
							href,
							isDisabled,
							label: label || defaultLabel,
							onClick: isInteractive ? onClickHandler : undefined,
							ref,
							size,
							stackIndex,
							target,
							testId: testId ? `${testId}--inner` : undefined,
							'aria-controls': ariaControls,
							'aria-expanded': ariaExpanded,
							'aria-haspopup': ariaHasPopup,
							avatarImage: (
								<AvatarImage
									alt={!containerShouldBeImage && src ? name : undefined}
									src={src}
									appearance={appearance}
									size={size}
									testId={testId}
									imgLoading={imgLoading}
								/>
							),
						}}
					>
						{children || <AvatarContent />}
					</AvatarContentContext.Provider>
					{isPresence && (
						<PresenceWrapper
							appearance={appearance}
							size={size}
							presence={typeof presence === 'string' ? (presence as Presence) : undefined}
							testId={testId}
						>
							{customPresenceNode}
						</PresenceWrapper>
					)}
					{isStatus && (
						<StatusWrapper
							appearance={appearance}
							size={size}
							borderColor={borderColor}
							status={typeof status === 'string' ? (status as Status) : undefined}
							testId={testId}
						>
							{customStatusNode}
						</StatusWrapper>
					)}
					{containerShouldBeImage ? (
						<span data-testid={testId && `${testId}--label`} id={labelId} hidden>
							{defaultLabel}
						</span>
					) : undefined}
				</AvatarContainer>
			</EnsureIsInsideAvatarContext.Provider>
		);
	},
);

Avatar.displayName = 'Avatar';

export default Avatar;
