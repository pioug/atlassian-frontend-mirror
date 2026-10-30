import React from 'react';

import { isRestricted } from '../../is-restricted';
import type { MentionDescription } from '../../types';
import { MentionAvatar } from '../MentionAvatar';
import MentionDescriptionByline from '../MentionDescriptionByline';
import { renderHighlight } from './MentionHighlightHelpers';
import { AvatarStyle, FullNameStyle, NameSectionStyle, type RowStyle } from './styles';

type Props = React.PropsWithChildren<{
	legacyRow: typeof RowStyle;
	mention: MentionDescription;
	selected?: boolean;
}>;

export const MentionItemLayoutLegacy = ({
	mention,
	selected,
	legacyRow: LegacyRow,
	children,
}: Props): React.JSX.Element => {
	const restricted = isRestricted(mention.accessLevel);
	return (
		<LegacyRow>
			<AvatarStyle restricted={restricted}>
				<MentionAvatar selected={selected} mention={mention} />
			</AvatarStyle>
			<NameSectionStyle restricted={restricted}>
				{renderHighlight(FullNameStyle, mention.name, mention.highlight?.name)}
				<MentionDescriptionByline mention={mention} />
			</NameSectionStyle>
			{children}
		</LegacyRow>
	);
};
