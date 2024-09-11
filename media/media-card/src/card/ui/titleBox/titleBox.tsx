import React from 'react';
import { injectIntl, type WrappedComponentProps } from 'react-intl-next';

import LockFilledIcon from '@atlaskit/icon/glyph/lock-filled';
import { Truncate } from '@atlaskit/media-ui/truncateText';
import { formatDate } from '@atlaskit/media-ui/formatDate';

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
		hidden,
		intl,
	}: TitleBoxProps & WrappedComponentProps) => (
		<TitleBoxWrapper hidden={hidden} breakpoint={breakpoint} titleBoxBgColor={titleBoxBgColor}>
			<TitleBoxHeader hasIconOverlap={!!titleBoxIcon && !createdAt}>
				<Truncate text={name ?? placeholderText} />
			</TitleBoxHeader>
			<TitleBoxFooter hasIconOverlap={!!titleBoxIcon}>
				{createdAt !== undefined && isValidTimestamp(createdAt)
					? formatDate(createdAt, intl?.locale ?? 'en')
					: placeholderText}
			</TitleBoxFooter>
			{titleBoxIcon === 'LockFilledIcon' && (
				<TitleBoxIcon>
					<LockFilledIcon label="" size="small" />
				</TitleBoxIcon>
			)}
		</TitleBoxWrapper>
	),
	{
		enforceContext: false,
	},
);
