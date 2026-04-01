/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx, type SerializedStyles } from '@emotion/react';
import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip';
import {
	type AnalyticsEventPayload,
	withAnalyticsEvents,
	type WithAnalyticsEventsProps,
} from '@atlaskit/analytics-next';

import { createAndFireEventInElementsChannel, userInfoEvent } from '../../analytics';
import { type ExternalUser } from '../../types';
import { textWrapper } from '../AvatarItemOption';
import { AvatarOrIcon } from '../AvatarOrIcon';
import { SizeableAvatar } from '../SizeableAvatar';
import { ExternalUserSourcesContainer } from '../ExternalUserSourcesContainer';
import InfoIcon from './InfoIcon';
import { ExternalAvatarItemOption } from './ExternalAvatarItemOption';
import { SourcesTooltipContent } from './SourcesTooltipContent';
import { getAppearanceForAppType } from '@atlaskit/avatar';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const imageContainer: SerializedStyles = css({
	height: '16px',
	width: '16px',
	paddingRight: token('space.050'),
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const emailDomainWrapper: SerializedStyles = css({
	fontWeight: token('font.weight.bold'),
});

export type ExternalUserOptionProps = WithAnalyticsEventsProps & {
	isSelected: boolean;
	status?: string;
	user: ExternalUser;
};

class ExternalUserOptionImpl extends React.PureComponent<ExternalUserOptionProps> {
	render() {
		return (
			<ExternalAvatarItemOption
				avatar={this.renderAvatar()}
				isDisabled={this.props.user.isDisabled}
				primaryText={this.getPrimaryText()}
				secondaryText={this.renderSecondaryText()}
				sourcesInfoTooltip={this.getSourcesInfoTooltip()}
			/>
		);
	}

	private getPrimaryText = () => {
		const {
			user: { name },
		} = this.props;

		return (
			<span
				key="name"
				// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
				css={textWrapper(
					this.props.isSelected ? token('color.text.selected') : token('color.text'),
				)}
			>
				{name}
			</span>
		);
	};

	private renderSecondaryText = () => {
		const { byline, email } = this.props.user;

		if (!byline && !email) {
			return;
		}

		const textColor = this.props.isSelected
			? token('color.text.selected')
			: token('color.text.subtlest');

		// Render byline if present
		if (byline) {
			// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
			return <span css={textWrapper(textColor)}>{byline}</span>;
		}

		// Render email if byline isn't present
		if (email) {
			const [emailUser, emailDomain] = email.split('@');
			const emailDomainWithAt = `@${emailDomain}`;

			return (
				// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
				<span css={textWrapper(textColor)}>
					{emailUser}
					<span css={emailDomainWrapper}>{emailDomainWithAt}</span>
				</span>
			);
		}

		return null;
	};

	private renderAvatar = () => {
		const {
			user: { avatarUrl, appType, icon, iconColor },
			status,
		} = this.props;
		if (icon) {
			return (
				<AvatarOrIcon
					appearance="big"
					icon={icon}
					iconColor={iconColor}
					src={avatarUrl}
					presence={status}
					avatarAppearanceShape={getAppearanceForAppType(appType)}
				/>
			);
		}
		// Fallback to original behavior
		return (
			<SizeableAvatar
				appearance="big"
				src={avatarUrl}
				presence={status}
				avatarAppearanceShape={getAppearanceForAppType(appType)}
			/>
		);
	};

	private fireEvent = <Args extends unknown[]>(
		eventCreator: (...args: Args) => AnalyticsEventPayload,
		...args: Args
	) => {
		const { createAnalyticsEvent } = this.props;
		if (createAnalyticsEvent) {
			createAndFireEventInElementsChannel(eventCreator(...args))(createAnalyticsEvent);
		}
	};

	private onShow = () => {
		const { user } = this.props;
		this.fireEvent(userInfoEvent, user.sources, user.id);
	};

	private getSourcesInfoTooltip = () =>
		this.props.user.isExternal ? (
			<Tooltip
				content={this.formattedTooltipContent()}
				position={'right-start'}
				onShow={this.onShow}
			>
				<InfoIcon />
			</Tooltip>
		) : undefined;

	private formattedTooltipContent() {
		const {
			user: { id, requiresSourceHydration, sources },
		} = this.props;
		return (
			<ExternalUserSourcesContainer
				accountId={id}
				shouldFetchSources={Boolean(requiresSourceHydration)}
				initialSources={sources}
			>
				{(sourceData) => <SourcesTooltipContent {...sourceData} />}
			</ExternalUserSourcesContainer>
		);
	}
}

export const ExternalUserOption: React.ForwardRefExoticComponent<
	Omit<
		{
			isSelected: boolean;
			status?: string;
			user: ExternalUser;
		},
		keyof WithAnalyticsEventsProps
	> &
		React.RefAttributes<any>
> = withAnalyticsEvents()(ExternalUserOptionImpl);
