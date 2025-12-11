import React from 'react';
import { injectIntl, type WrappedComponentProps } from 'react-intl-next';

import LockFilledIcon from '@atlaskit/icon/core/migration/lock-locked--lock-filled';
import { Truncate } from '@atlaskit/media-ui/truncateText';
import { formatDate } from '@atlaskit/media-ui/formatDate';
import { fg } from '@atlaskit/platform-feature-flags';

import { type TitleBoxProps } from './types';
import {
	TitleBoxWrapper,
	TitleBoxFooter,
	TitleBoxHeader,
	TitleBoxIcon,
} from './titleBoxComponents';

const placeholderText = ' ';

const isValidTimestamp = (timeStamp: number) => new Date(timeStamp).getTime() > 0;

export const TitleBox = injectIntl(
	({
		name,
		createdAt,
		breakpoint,
		titleBoxBgColor,
		titleBoxIcon,
		hidden: _hidden,
		intl,
	}: TitleBoxProps & WrappedComponentProps) => (
		<TitleBoxWrapper breakpoint={breakpoint} titleBoxBgColor={titleBoxBgColor}>
			<TitleBoxHeader hasIconOverlap={!!titleBoxIcon && !createdAt}>
				<Truncate text={name ?? placeholderText} />
			</TitleBoxHeader>
			<TitleBoxFooter
				hasIconOverlap={!!titleBoxIcon}
				// Suppressing it here because of a timezone mismatch in the createdAt text
				// that can cause a late mutation in the attachments strip view
				suppressHydrationWarning={fg('jfp-magma-fix-attachments-hydration-error') ? true : false}
			>
				{createdAt !== undefined && isValidTimestamp(createdAt)
					? formatDate(createdAt, intl?.locale ?? 'en')
					: placeholderText}
			</TitleBoxFooter>
			{titleBoxIcon === 'LockFilledIcon' && (
				<TitleBoxIcon>
					<LockFilledIcon color="currentColor" label="" LEGACY_size="small" size="small" />
				</TitleBoxIcon>
			)}
		</TitleBoxWrapper>
	),
	{
		enforceContext: false,
	},
);
