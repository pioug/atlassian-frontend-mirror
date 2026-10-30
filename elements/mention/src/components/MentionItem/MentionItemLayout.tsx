import React from 'react';

import { useIntl } from 'react-intl';

import { PickerItemContent } from '@atlaskit/user-picker/picker-item-content';

import { isRestricted } from '../../is-restricted';
import type { MentionDescription } from '../../types';
import { MentionAvatar } from '../MentionAvatar';
import { getMentionDescriptionByline } from '../MentionDescriptionByline/getMentionDescriptionByline';
import { renderHighlight } from './MentionHighlightHelpers';
import { FullNameStyle } from './styles';

type Props = React.PropsWithChildren<{
	mention: MentionDescription;
	selected?: boolean;
}>;

export const MentionItemLayoutNext = ({
	mention,
	selected,
	children,
}: Props): React.JSX.Element => {
	const intl = useIntl();
	return (
		<PickerItemContent
			avatar={<MentionAvatar selected={selected} mention={mention} />}
			title={renderHighlight(FullNameStyle, mention.name, mention.highlight?.name)}
			subtext={getMentionDescriptionByline(mention, intl)}
			after={<>{children}</>}
			isMuted={isRestricted(mention.accessLevel)}
		/>
	);
};
