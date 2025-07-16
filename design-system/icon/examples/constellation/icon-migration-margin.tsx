import React from 'react';

import ChevronIcon from '@atlaskit/icon/core/chevron-down';
import ChevronIconMigration from '@atlaskit/icon/core/migration/chevron-down';
import LegacyChevronIcon from '@atlaskit/icon/glyph/chevron-down';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box, Inline, Stack, xcss } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';

import { IconContainer, RowHeader } from './utils';

const negativeMarginStyles = xcss({ marginInline: 'space.negative.075' });

const IconMarginExample = () => {
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
					<ChevronIconMigration
						label=""
						LEGACY_margin={`0 ${token('space.negative.075')}`}
						size="small"
					/>
				</IconContainer>
			</Inline>
			<Inline space="space.100">
				<RowHeader>New icon</RowHeader>
				<IconContainer>
					<ChevronIcon label="" size="small" />
				</IconContainer>
			</Inline>
		</Stack>
	);
};

export default IconMarginExample;
