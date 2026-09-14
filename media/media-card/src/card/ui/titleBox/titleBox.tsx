import React from 'react';

import { injectIntl, type WithIntlProps, type WrappedComponentProps } from 'react-intl';

import LockFilledIcon from '@atlaskit/icon/core/lock-locked';
import { formatDate } from '@atlaskit/media-ui/formatDate';
import { Truncate } from '@atlaskit/media-ui/truncateText/truncate';

import { TitleBoxFooter } from './TitleBoxFooter';
import { TitleBoxHeader } from './TitleBoxHeader';
import { TitleBoxIcon } from './TitleBoxIcon';
import { TitleBoxWrapper } from './TitleBoxWrapper';
import { type TitleBoxProps } from './types';

const placeholderText = ' ';

const isValidTimestamp = (timeStamp: number) => new Date(timeStamp).getTime() > 0;

export const TitleBox: React.FC<WithIntlProps<TitleBoxProps & WrappedComponentProps>> & {
	WrappedComponent: React.ComponentType<TitleBoxProps & WrappedComponentProps>;
} = injectIntl(
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
				suppressHydrationWarning
			>
				{createdAt !== undefined && isValidTimestamp(createdAt)
					? formatDate(createdAt, intl?.locale ?? 'en')
					: placeholderText}
			</TitleBoxFooter>
			{titleBoxIcon === 'LockFilledIcon' && (
				<TitleBoxIcon>
					<LockFilledIcon color="currentColor" label="" size="small" />
				</TitleBoxIcon>
			)}
		</TitleBoxWrapper>
	),
	{
		enforceContext: false,
	},
);
