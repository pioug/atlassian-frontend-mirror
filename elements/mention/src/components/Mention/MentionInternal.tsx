/**
 * @jsxRuntime classic
 * @jsx jsx
 * @jsxFrag React.Fragment
 */
/* eslint-disable @atlaskit/design-system/no-deprecated-imports, @typescript-eslint/no-empty-object-type, @typescript-eslint/no-wrapper-object-types -- Preserve existing mention implementation while focus-ring usage is reviewed separately. */

import React from 'react';

import { css } from '@compiled/react';

import { jsx } from '@atlaskit/css';
import FocusRing from '@atlaskit/focus-ring/focus-ring';
import { token } from '@atlaskit/tokens';
import { UFOExperienceState } from '@atlaskit/ufo/experience-state';

import { UNKNOWN_USER_ID } from '../../_constants';
import { isRestricted } from '../../is-restricted';
import { MentionType } from '../../types';
import { UnknownUserError } from '../../util/i18n';
import AsyncDisabledMentionTooltip from '../DisabledMentionTooltip';
import MessagesIntlProvider from '../MessagesIntlProvider';
import AsyncNoAccessTooltip from '../NoAccessTooltip';
import { ANALYTICS_HOVER_DELAY } from './index';
import type { Props } from './index';
import PrimitiveMention from './PrimitiveMention';
import { UfoErrorBoundary, mentionRenderedUfoExperience } from './ufoExperiences';

const avatarStyles = css({
	display: 'inline-flex',
	// `em` is required here so the avatar tracks inherited heading sizes. This value is not
	// supported by the stricter `@atlaskit/css` API, so this isolated style uses Compiled directly.
	width: '1em',
	height: '1em',
	alignItems: 'center',
	justifyContent: 'center',
	flexShrink: 0,
	marginInlineEnd: token('space.050'),
	overflow: 'hidden',
	borderRadius: token('radius.full'),
	verticalAlign: '-0.125em',
});

const avatarFallbackStyles = css({
	verticalAlign: '0.05em',
});

const avatarImageStyles = css({
	display: 'block',
	width: '100%',
	height: '100%',
	objectFit: 'cover',
});

const agentAvatarStyles = css({
	borderRadius: 0,
	clipPath: 'polygon(25% 6.7%, 75% 6.7%, 100% 50%, 75% 93.3%, 25% 93.3%, 0 50%)',
});

type State = {
	avatarUrl?: string;
	hasAvatarError: boolean;
};

export class MentionInternal extends React.PureComponent<Props, State> {
	private hoverTimeout?: number;
	state: State = { hasAvatarError: false };

	constructor(props: Props) {
		super(props);
		mentionRenderedUfoExperience.getInstance(props.id).start();
	}

	componentDidMount(): void {
		mentionRenderedUfoExperience.getInstance(this.props.id).success();
	}

	static getDerivedStateFromProps(props: Props, state: State): Partial<State> | null {
		if (props.avatarUrl !== state.avatarUrl) {
			return { avatarUrl: props.avatarUrl, hasAvatarError: false };
		}

		return null;
	}

	private handleAvatarError = (): void => {
		this.setState({ hasAvatarError: true });
	};

	private handleOnClick = (e: React.MouseEvent<HTMLSpanElement>) => {
		const { id, text, onClick, isDisabled } = this.props;
		if (isDisabled) {
			// Disabled chips do not invoke their click handler.
			return;
		}
		if (onClick) {
			onClick(id, text, e);
		}
	};

	private handleOnMouseEnter = (e: React.MouseEvent<HTMLSpanElement>) => {
		const { id, text, onMouseEnter, onHover } = this.props;
		if (onMouseEnter) {
			onMouseEnter(id, text, e);
		}
		this.hoverTimeout = window.setTimeout(() => {
			if (onHover) {
				onHover();
			}
			this.hoverTimeout = undefined;
		}, ANALYTICS_HOVER_DELAY);
	};

	private handleOnMouseLeave = (e: React.MouseEvent<HTMLSpanElement>) => {
		const { id, text, onMouseLeave } = this.props;
		if (onMouseLeave) {
			onMouseLeave(id, text, e);
		}
		if (this.hoverTimeout) {
			clearTimeout(this.hoverTimeout);
		}
	};

	private getMentionType = (): MentionType => {
		const { accessLevel, isHighlighted, isDisabled } = this.props;
		if (isDisabled) {
			return MentionType.DISABLED;
		}
		if (isHighlighted) {
			return MentionType.SELF;
		}
		if (isRestricted(accessLevel)) {
			return MentionType.RESTRICTED;
		}
		return MentionType.DEFAULT;
	};

	componentWillUnmount(): void {
		if (this.hoverTimeout) {
			clearTimeout(this.hoverTimeout);
		}

		const ufoInstance = mentionRenderedUfoExperience.getInstance(this.props.id);
		if (
			[UFOExperienceState['STARTED'], UFOExperienceState['IN_PROGRESS']].includes(ufoInstance.state)
		) {
			ufoInstance.abort();
		}
	}

	renderUnknownUserError(id: string): React.JSX.Element {
		return (
			<UnknownUserError values={{ userId: id.slice(-5) }}>
				{(message) => <>{`@${message}`}</>}
			</UnknownUserError>
		);
	}

	render(): React.JSX.Element {
		const { handleAvatarError, handleOnClick, handleOnMouseEnter, handleOnMouseLeave, props } =
			this;
		const {
			appType,
			avatarUrl,
			text,
			id,
			accessLevel,
			localId,
			disabledTooltip,
			isAvatarImagePreShaped,
			renderAvatarSlot,
			isRovoChat,
		} = props;
		const mentionType: MentionType = this.getMentionType();

		const failedMention = text === `@${UNKNOWN_USER_ID}`;
		const showAvatarSlot = Boolean(renderAvatarSlot) && !failedMention;
		const visibleText = showAvatarSlot && text.startsWith('@') ? text.slice(1) : text;
		const shouldApplyAgentShape = appType === 'agent' && !isAvatarImagePreShaped;
		const shouldRenderAvatar = avatarUrl && !this.state.hasAvatarError;

		const showRestrictedTooltip = mentionType === MentionType.RESTRICTED;
		const showDisabledTooltip = mentionType === MentionType.DISABLED && !!disabledTooltip;

		// A11y: when the chip is in the disabled visual state, expose
		// `aria-disabled` so assistive tech announces it as such. The
		// disabled-tooltip text is mirrored into `aria-label` so the
		// announcement carries the reason even without portal-id wiring for
		// `aria-describedby`.
		const isDisabledChip = mentionType === MentionType.DISABLED;
		const disabledA11yProps = isDisabledChip
			? {
					'aria-disabled': true as const,
					tabIndex: 0,
					...(disabledTooltip ? { 'aria-label': `${text || '@...'} — ${disabledTooltip}` } : {}),
				}
			: {};

		const mentionComponent = (
			<FocusRing>
				<PrimitiveMention
					isAvatarVisible={showAvatarSlot}
					mentionType={mentionType}
					onClick={handleOnClick}
					onMouseEnter={handleOnMouseEnter}
					onMouseLeave={handleOnMouseLeave}
					spellCheck={false}
					data-testid={`mention-${id}`}
					data-mention-type={mentionType}
					data-mention-tooltip={showRestrictedTooltip || showDisabledTooltip}
					isRovoChat={isRovoChat}
					{...disabledA11yProps}
				>
					{failedMention ? (
						this.renderUnknownUserError(id)
					) : showAvatarSlot ? (
						<>
							<span
								aria-hidden="true"
								css={[
									avatarStyles,
									shouldApplyAgentShape && agentAvatarStyles,
									this.state.hasAvatarError && avatarFallbackStyles,
								]}
								data-testid="mention-avatar-slot"
							>
								{shouldRenderAvatar ? (
									<img
										alt=""
										css={avatarImageStyles}
										decoding="async"
										draggable={false}
										height={16}
										loading="lazy"
										onError={handleAvatarError}
										src={avatarUrl}
										data-testid="mention-avatar"
										width={16}
									/>
								) : this.state.hasAvatarError ? (
									'@'
								) : null}
							</span>
							<span>{visibleText || '...'}</span>
						</>
					) : (
						text || '@...'
					)}
				</PrimitiveMention>
			</FocusRing>
		);

		const ssrPlaceholderProp = props.ssrPlaceholderId
			? { 'data-ssr-placeholder': props.ssrPlaceholderId }
			: {};

		const wrappedMention = (() => {
			if (showRestrictedTooltip) {
				return (
					<React.Suspense fallback={mentionComponent}>
						<AsyncNoAccessTooltip name={text}>{mentionComponent}</AsyncNoAccessTooltip>
					</React.Suspense>
				);
			}
			if (showDisabledTooltip) {
				return (
					<React.Suspense fallback={mentionComponent}>
						<AsyncDisabledMentionTooltip tooltip={disabledTooltip!}>
							{mentionComponent}
						</AsyncDisabledMentionTooltip>
					</React.Suspense>
				);
			}
			return mentionComponent;
		})();

		return (
			<UfoErrorBoundary id={id}>
				<span
					id={localId}
					data-mention-id={id}
					data-local-id={localId}
					data-access-level={accessLevel}
					spellCheck={false}
					{...ssrPlaceholderProp}
				>
					<MessagesIntlProvider>{wrappedMention}</MessagesIntlProvider>
				</span>
			</UfoErrorBoundary>
		);
	}
}
