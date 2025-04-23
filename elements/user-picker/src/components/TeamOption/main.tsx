/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { B400, N800, N200 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';
import { fg } from '@atlaskit/platform-feature-flags';
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
import { SizeableAvatar } from '../SizeableAvatar';

export type TeamOptionProps = {
	team: Team;
	isSelected: boolean;
};

export class TeamOption extends React.PureComponent<TeamOptionProps> {
	private getPrimaryText = () => {
		const {
			team: { name, highlight, verified },
		} = this.props;

		return [
			<span
				key="name"
				// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
				css={textWrapper(
					this.props.isSelected ? token('color.text.selected', B400) : token('color.text', N800),
				)}
			>
				{fg('verified-team-in-user-picker') ? (
					<Inline alignBlock="center">
						<HighlightText highlights={highlight && highlight.name}>{name}</HighlightText>
						{verified && <VerifiedTeamIcon />}
					</Inline>
				) : (
					<HighlightText highlights={highlight && highlight.name}>{name}</HighlightText>
				)}
			</span>,
		];
	};

	private renderByline = () => {
		const {
			isSelected,
			team: { memberCount, includesYou },
		} = this.props;

		// if Member count is missing, do not show the byline, regardless of the availability of includesYou
		if (memberCount === null || typeof memberCount === 'undefined') {
			return undefined;
		} else {
			if (includesYou === true) {
				if (memberCount > 50) {
					return this.getBylineComponent(
						isSelected,
						<FormattedMessage {...messages.plus50MembersWithYou} />,
					);
				} else {
					return this.getBylineComponent(
						isSelected,
						<FormattedMessage
							{...messages.memberCountWithYou}
							values={{
								count: memberCount,
							}}
						/>,
					);
				}
			} else {
				if (memberCount > 50) {
					return this.getBylineComponent(
						isSelected,
						<FormattedMessage {...messages.plus50MembersWithoutYou} />,
					);
				} else {
					return this.getBylineComponent(
						isSelected,
						<FormattedMessage
							{...messages.memberCountWithoutYou}
							values={{
								count: memberCount,
							}}
						/>,
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
			team: { avatarUrl },
		} = this.props;
		return <SizeableAvatar appearance="big" src={avatarUrl} type="team" />;
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

	render() {
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
