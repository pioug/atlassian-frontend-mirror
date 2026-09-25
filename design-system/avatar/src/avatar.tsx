/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import {
	type CSSProperties,
	forwardRef,
	isValidElement,
	type MouseEvent,
	type PropsWithoutRef,
	type ReactNode,
	type RefAttributes,
	useCallback,
	useEffect,
	useRef,
} from 'react';

import { cssMap as unboundCssMap } from '@compiled/react';

import type UIAnalyticsEvent from '@atlaskit/analytics-next/UIAnalyticsEvent';
import { useAnalyticsEvents } from '@atlaskit/analytics-next/useAnalyticsEvents';
import { css, jsx } from '@atlaskit/css';
import { useId } from '@atlaskit/ds-lib/use-id';
import { fg } from '@atlaskit/platform-feature-flags/fg';

import { AvatarContent } from './avatar-content';
import AvatarImage from './internal/avatar-image';
import { AvatarContentContext } from './internal/content-context';
import { EnsureIsInsideAvatarContext } from './internal/ensure-is-inside-avatar-context';
import getCustomElement from './internal/get-custom-element';
import PresenceWrapper from './internal/presence-wrapper';
import StatusWrapper from './internal/status-wrapper';
import {
	type AppearanceType,
	type AvatarClickEventHandler,
	type IndicatorSizeType,
	type Presence,
	type SizeType,
	type Status,
} from './types';
import { useAvatarContext } from './use-avatar-context';

const packageName = process.env._PACKAGE_NAME_ as string;
const packageVersion = process.env._PACKAGE_VERSION_ as string;

const containerStyles = css({
	display: 'inline-block',
	position: 'relative',
	outline: 0,
});

const updatedHexagonNegativeMarginMap = unboundCssMap({
	xxsmall: { marginBlockEnd: '-0.585px', marginBlockStart: '-0.585px' },
	small: { marginBlockEnd: '-0.88px', marginBlockStart: '-0.88px' },
	medium: { marginBlockEnd: '-1.17px', marginBlockStart: '-1.17px' },
	large: { marginBlockEnd: '-1.465px', marginBlockStart: '-1.465px' },
	xlarge: { marginBlockEnd: '-3.51px', marginBlockStart: '-3.51px' },
	xxlarge: { marginBlockEnd: '-4.68px', marginBlockStart: '-4.68px' },
});

const normalizeAvatarSize = (size: SizeType): SizeType =>
	size === 'xsmall' && !fg('platform_design-system-team_avatar-remove-xsmall') ? 'xxsmall' : size;

// eslint-disable-next-line @repo/internal/react/consistent-types-definitions
export interface AvatarPropTypes {
	/**
	 * Indicates the shape of the avatar. Most avatars are circular, but square avatars
	 * can be used for 'container' objects.
	 */
	appearance?: AppearanceType;
	/**
	 * Selects an experimental taller hexagon geometry for 16px, 24px, 32px, 40px, 96px, and 128px
	 * avatars. The 20px size retains the legacy geometry.
	 */
	UNSAFE_isUpdatedGeometry?: boolean;
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
	 * Available sizes (in pixels): `xxsmall` (16), `small` (24), `medium` (32),
	 * `large` (40), `xlarge` (96), `xxlarge` (128).
	 *
	 * The `xsmall` size is deprecated. Use `xxsmall` for 16px avatars.
	 *
	 * The `UNSAFE_xsmall` (20px) size is an unsafe, transitional value and is
	 * intentionally not documented for general use — see `SizeType`.
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
type AvatarPropsWithoutDeprecatedSize = Omit<AvatarPropTypes, 'size'> & {
	size?: Exclude<SizeType, 'xsmall'>;
};

interface AvatarComponent {
	(
		props: PropsWithoutRef<AvatarPropsWithoutDeprecatedSize> & RefAttributes<HTMLElement>,
	): ReactNode;
	/**
	 * @deprecated Use `xxsmall` for 16px avatars.
	 */
	(props: PropsWithoutRef<AvatarPropTypes> & RefAttributes<HTMLElement>): ReactNode;
	displayName?: string;
}

const Avatar = forwardRef<HTMLElement, AvatarPropTypes>(
	(
		{
			analyticsContext,
			appearance = 'circle',
			UNSAFE_isUpdatedGeometry,
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
			imgLoading,
			'aria-controls': ariaControls,
			'aria-expanded': ariaExpanded,
			'aria-haspopup': ariaHasPopup,
		},
		ref,
	) => {
		const { createAnalyticsEvent } = useAnalyticsEvents();
		const context = useAvatarContext();
		const size = normalizeAvatarSize(sizeProp || context?.size || 'medium');
		const isUpdatedHexagonGeometry =
			appearance === 'hexagon' && Boolean(UNSAFE_isUpdatedGeometry) && size !== 'UNSAFE_xsmall';
		const customPresenceNode = isValidElement(presence) ? presence : null;
		const customStatusNode = isValidElement(status) ? status : null;
		const isValidIconSize = size !== 'xxlarge' && size !== 'xxsmall' && size !== 'xsmall';
		// Presence/status indicators are only defined for `IndicatorSizeType`
		// (small, medium, large, xlarge). Compute `indicatorSize` only for sizes
		// that support an indicator (`isValidIconSize`), so the value is
		// structurally guaranteed to be a valid `IndicatorSizeType` rather than
		// relying on the guard at each call site. The `UNSAFE_xsmall` (20px) size
		// reuses the `small` indicator sizing as its nearest supported neighbor;
		// unsupported sizes (`xxsmall`/`xsmall`/`xxlarge`) fall back to `small` and are never
		// actually rendered because `isPresence`/`isStatus` also guard on
		// `isValidIconSize`.
		const indicatorSize: IndicatorSizeType = !isValidIconSize
			? 'small'
			: size === 'UNSAFE_xsmall'
				? 'small'
				: size;
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
				<AvatarContainer
					data-testid={testId}
					role={containerShouldBeImage ? 'img' : undefined}
					aria-labelledby={containerShouldBeImage ? labelId : undefined}
					css={[
						containerStyles,
						isUpdatedHexagonGeometry &&
							updatedHexagonNegativeMarginMap[
								size as 'xxsmall' | 'small' | 'medium' | 'large' | 'xlarge' | 'xxlarge'
							],
					]}
					style={{ zIndex: stackIndex } as CSSProperties}
				>
					<AvatarContentContext.Provider
						value={{
							as: getCustomElement(isDisabled, href, onClick, ariaHasPopup),
							appearance,
							UNSAFE_isUpdatedGeometry: isUpdatedHexagonGeometry,
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
									UNSAFE_isUpdatedGeometry={isUpdatedHexagonGeometry}
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
							size={indicatorSize}
							presence={typeof presence === 'string' ? (presence as Presence) : undefined}
							testId={testId}
						>
							{customPresenceNode}
						</PresenceWrapper>
					)}
					{isStatus && (
						<StatusWrapper
							appearance={appearance}
							size={indicatorSize}
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
) as AvatarComponent;

Avatar.displayName = 'Avatar';

export default Avatar;
