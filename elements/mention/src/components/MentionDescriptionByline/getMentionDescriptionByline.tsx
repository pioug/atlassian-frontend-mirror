import React from 'react';

import type { IntlShape } from 'react-intl';

import { type MentionDescription, UserType } from '../../types';
import { messages } from '../i18n';
import { renderHighlight } from '../MentionItem/MentionHighlightHelpers';

/** Content for MentionItemLayoutNext, selected by the email-search experiment. */
export const getMentionDescriptionByline = (
	mention: MentionDescription,
	intl: IntlShape,
): string | React.JSX.Element | null => {
	const { context, email, highlight, isXProductUser, name, nickname, userType } = mention;

	if (isXProductUser) {
		return intl.formatMessage(messages.xProductMentionDescription);
	}

	if (userType === UserType[UserType.TEAM]) {
		if (!context) {
			return null;
		}
		const { includesYou, memberCount } = context;
		if (memberCount > 50) {
			return intl.formatMessage(
				includesYou ? messages.plus50MembersWithYou : messages.plus50MembersWithoutYou,
			);
		}
		return intl.formatMessage(
			includesYou ? messages.memberCountWithYou : messages.memberCountWithoutYou,
			{ 0: memberCount },
		);
	}

	if (email && (!nickname || name === nickname)) {
		return email;
	}
	if (!nickname || name === nickname) {
		return null;
	}
	return highlight?.nickname?.length
		? renderHighlight(React.Fragment, nickname, highlight.nickname, '@')
		: `@${nickname}`;
};
