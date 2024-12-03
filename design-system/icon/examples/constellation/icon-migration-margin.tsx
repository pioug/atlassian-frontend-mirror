import React from 'react';

import LegacyChevronIcon from '@atlaskit/icon/glyph/chevron-down';
import ChevronIcon from '@atlaskit/icon/utility/chevron-down';
import ChevronIconMigration from '@atlaskit/icon/utility/migration/chevron-down';
import { Box, Inline, Stack, xcss } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';

import { IconContainer, RowHeader } from './utils';

const negativeMarginStyles = xcss({ marginInline: 'space.negative.075' });

const IconDefaultExample = () => {
	return (
		<Stack space="space.100">
			<Inline space="space.100">
				<RowHeader>Legacy icon</RowHeader>
				<IconContainer>
					<Box xcss={negativeMarginStyles}>
						<LegacyChevronIcon label="" />
					</Box>
				</IconContainer>
			</Inline>
			<Inline space="space.100">
				<RowHeader>Feature flagged</RowHeader>
				<IconContainer>
					<ChevronIconMigration label="" LEGACY_margin={`0 ${token('space.negative.075')}`} />
				</IconContainer>
			</Inline>
			<Inline space="space.100">
				<RowHeader>New icon</RowHeader>
				<IconContainer>
					<ChevronIcon label="" />
				</IconContainer>
			</Inline>
		</Stack>
	);
};

export default IconDefaultExample;
