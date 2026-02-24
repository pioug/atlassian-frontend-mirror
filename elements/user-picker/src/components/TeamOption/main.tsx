/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { B400, N800, N200 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';
import { Inline } from '@atlaskit/primitives/compiled';
import { VerifiedTeamIcon } from '@atlaskit/people-teams-ui-public/verified-team-icon';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import React from 'react';
import { FormattedMessage } from 'react-intl-next';
import { type Team } from '../../types';
import { AvatarItemOption, textWrapper } from '../AvatarItemOption';
import { HighlightText } from '../HighlightText';
import { messages } from '../i18n';
import { AvatarOrIcon } from '../AvatarOrIcon';
import { SizeableAvatar } from '../SizeableAvatar';

export type TeamOptionProps = {
	includeTeamsUpdates?: boolean;
	isSelected: boolean;
	team: Team;
};

export class TeamOption extends React.PureComponent<TeamOptionProps> {
	private getPrimaryText = () => {
		const {
			team: { name, highlight, verified },
			includeTeamsUpdates,
		} = this.props;

		return [
			<span
				key="name"
				// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
				css={textWrapper(
					this.props.isSelected ? token('color.text.selected', B400) : token('color.text', N800),
				)}
			>
				{
					<Inline alignBlock="center">
						<HighlightText highlights={highlight && highlight.name}>{name}</HighlightText>
						{verified && !includeTeamsUpdates && this.renderVerifiedIcon()}
					</Inline>
				}
			</span>,
		];
	};

	private renderByline = () => {
		const {
			isSelected,
			team: { memberCount, includesYou, verified, teamTypeName },
			includeTeamsUpdates,
		} = this.props;

		const isVerified = includeTeamsUpdates && verified;
		const hasTeamTypeName = Boolean(teamTypeName);
		const verifiedIcon = isVerified ? this.renderVerifiedIcon() : null;

		// if Member count is missing, do not show the byline, regardless of the availability of includesYou
		if (memberCount === null || typeof memberCount === 'undefined') {
			return undefined;
		} else {
			if (includesYou === true) {
				if (memberCount > 50) {
					return this.getBylineComponent(
						isSelected,
						hasTeamTypeName ? (
							<FormattedMessage
								{...messages.officialPlus50MembersWithYou}
								values={{ verifiedIcon, teamTypeName }}
							/>
						) : (
							<FormattedMessage {...messages.plus50MembersWithYou} />
						),
					);
				} else {
					return this.getBylineComponent(
						isSelected,
						hasTeamTypeName ? (
							<FormattedMessage
								{...messages.officialMemberCountWithYou}
								values={{ verifiedIcon, count: memberCount, teamTypeName }}
							/>
						) : (
							<FormattedMessage {...messages.memberCountWithYou} values={{ count: memberCount }} />
						),
					);
				}
			} else {
				if (memberCount > 50) {
					return this.getBylineComponent(
						isSelected,
						hasTeamTypeName ? (
							<FormattedMessage
								{...messages.officialPlus50MembersWithoutYou}
								values={{ verifiedIcon, teamTypeName }}
							/>
						) : (
							<FormattedMessage {...messages.plus50MembersWithoutYou} />
						),
					);
				} else {
					return this.getBylineComponent(
						isSelected,
						hasTeamTypeName ? (
							<FormattedMessage
								{...messages.officialMemberCountWithoutYou}
								values={{ verifiedIcon, count: memberCount, teamTypeName }}
							/>
						) : (
							<FormattedMessage
								{...messages.memberCountWithoutYou}
								values={{ count: memberCount }}
							/>
						),
					);
				}
			}
		}
	};

	private getBylineComponent = (isSelected: boolean, message: JSX.Element) => (
		<span
			// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
			css={textWrapper(
				isSelected ? token('color.text.selected', B400) : token('color.text.subtlest', N200),
			)}
			data-testid="user-picker-team-secondary-text"
		>
			{message}
		</span>
	);

	private renderAvatar = () => {
		const {
			team: { avatarUrl, icon, iconColor },
		} = this.props;
		if (icon) {
			return (
				<AvatarOrIcon
					appearance="big"
					icon={icon}
					iconColor={iconColor}
					src={avatarUrl}
					type="team"
				/>
			);
		}
		// Fallback to original behavior
		return <SizeableAvatar appearance="big" src={avatarUrl} type="team" />;
	};

	private renderVerifiedIcon = () => {
		if (this.props.team.verified) {
			return <VerifiedTeamIcon label="" size="small" />;
		}
		return undefined;
	};

	private getLozengeProps = () =>
		typeof this.props.team.lozenge === 'string'
			? {
					text: this.props.team.lozenge,
				}
			: this.props.team.lozenge;

	private renderCustomByLine = () => {
		if (!this.props.team?.byline) {
			return undefined;
		}

		return (
			<span
				// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
				css={textWrapper(
					this.props.isSelected
						? token('color.text.selected', B400)
						: token('color.text.subtlest', N200),
				)}
			>
				{this.props.team.byline}
			</span>
		);
	};

	render(): React.JSX.Element {
		return (
			<AvatarItemOption
				avatar={this.renderAvatar()}
				isDisabled={this.props.team.isDisabled}
				lozenge={this.getLozengeProps()}
				primaryText={this.getPrimaryText()}
				secondaryText={this.renderCustomByLine() || this.renderByline()}
			/>
		);
	}
}
