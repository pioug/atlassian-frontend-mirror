/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { forwardRef } from 'react';

import { css, jsx } from '@compiled/react';

import { fg } from '@atlaskit/platform-feature-flags';

import { TruncateTextTagOld } from './truncate-text-tag-old';

const truncateTextStyles = css({
	overflow: 'hidden',
	textOverflow: 'ellipsis',
	whiteSpace: 'nowrap',
});

export const TruncateTextTagNew = forwardRef(
	(props: React.PropsWithChildren<unknown>, ref: React.Ref<HTMLElement>) => {
		return (
			<span css={truncateTextStyles} {...props} ref={ref}>
				{props.children}
			</span>
		);
	},
);

export const TruncateTextTag = forwardRef(
	(props: React.PropsWithChildren<unknown>, ref: React.Ref<HTMLElement>) => {
		if (fg('bandicoots-compiled-migration-link-datasource')) {
			return <TruncateTextTagNew {...props} ref={ref} />;
		} else {
			return <TruncateTextTagOld {...props} ref={ref} />;
		}
	},
);
