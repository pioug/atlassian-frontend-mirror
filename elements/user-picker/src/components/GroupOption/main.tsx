/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';
import { FormattedMessage } from 'react-intl-next';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import { N20, B400, N800, N200 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';
import PeopleIcon from '@atlaskit/icon/core/migration/people-group--people';

import { type Group } from '../../types';
import { AvatarItemOption, textWrapper } from '../AvatarItemOption';
import { messages } from '../i18n';
import { HighlightText } from '../HighlightText';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const groupOptionIconWrapper = css({
	padding: token('space.025', '2px'),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'> span': {
		backgroundColor: token('color.background.neutral', N20),
		borderRadius: '50%',
		padding: token('space.050', '4px'),
	},
});

export type GroupOptionProps = {
	group: Group;
	isSelected: boolean;
};

export class GroupOption extends React.PureComponent<GroupOptionProps> {
	private getPrimaryText = () => {
		const {
			isSelected,
			group: { name, highlight },
		} = this.props;
		return [
			<span
				key="name"
				// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
				css={textWrapper(
					isSelected ? token('color.text.selected', B400) : token('color.text', N800),
				)}
			>
				<HighlightText highlights={highlight && highlight.name}>{name}</HighlightText>
			</span>,
		];
	};

	private renderAvatar = () => (
		<span css={groupOptionIconWrapper}>
			<PeopleIcon color="currentColor" label="group-icon" LEGACY_size="medium" spacing="spacious" />
		</span>
	);

	private renderByline = () => {
		const { isSelected, group } = this.props;
		return (
			<span
				// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
				css={textWrapper(
					isSelected ? token('color.text.selected', B400) : token('color.text.subtlest', N200),
				)}
				data-testid="user-picker-group-secondary-text"
			>
				{group.byline ? group.byline : <FormattedMessage {...messages.groupByline} />}
			</span>
		);
	};

	private getLozengeProps = () =>
		typeof this.props.group.lozenge === 'string'
			? {
					text: this.props.group.lozenge,
				}
			: this.props.group.lozenge;

	render() {
		return (
			<AvatarItemOption
				avatar={this.renderAvatar()}
				isDisabled={this.props.group.isDisabled}
				lozenge={this.getLozengeProps()}
				primaryText={this.getPrimaryText()}
				secondaryText={this.renderByline()}
			/>
		);
	}
}
