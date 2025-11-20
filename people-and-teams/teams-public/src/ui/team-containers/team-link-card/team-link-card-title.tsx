import React from 'react';

import { cssMap } from '@atlaskit/css';
import { Anchor, Text } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	anchorWithUnderline: {
		textDecoration: 'none',
		'&:hover': {
			color: token('color.text'),
			textDecoration: 'underline',
		},
	},
});

export interface TeamLinkCardTitleProps {
	isTeamLensInHomeEnabled: boolean;
	isOpenWebLinkInNewTabEnabled: boolean;
	link: string;
	handleLinkClick: (e: React.MouseEvent<HTMLAnchorElement>) => void;
	title: string;
}

export const TeamLinkCardTitle = ({
	isTeamLensInHomeEnabled,
	isOpenWebLinkInNewTabEnabled,
	link = '#',
	handleLinkClick,
	title,
}: TeamLinkCardTitleProps): React.JSX.Element => {
	return isTeamLensInHomeEnabled ? (
		<Anchor
			xcss={styles.anchorWithUnderline}
			href={link}
			onClick={handleLinkClick}
			testId="team-link-card-linkable-content"
			target={isOpenWebLinkInNewTabEnabled ? '_blank' : '_self'}
		>
			<Text maxLines={1} weight="medium" color="color.text">
				{title}
			</Text>
		</Anchor>
	) : (
		<Text maxLines={1} weight="medium" color="color.text">
			{title}
		</Text>
	);
};
