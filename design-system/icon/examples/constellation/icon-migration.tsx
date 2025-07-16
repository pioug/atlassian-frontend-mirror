import React from 'react';

import LikeIconMigration from '@atlaskit/icon/core/migration/thumbs-up--like';
import LikeIcon from '@atlaskit/icon/core/thumbs-up';
import LegacyLikeIcon from '@atlaskit/icon/glyph/like';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box, Inline, Stack, Text, xcss } from '@atlaskit/primitives';

const TextBoxStyles = xcss({ width: '150px' });

const IconDefaultExample = () => {
	return (
		<Stack space="space.100">
			<Inline space="space.100">
				<Box xcss={TextBoxStyles}>
					<Text weight="bold">Legacy icon</Text>
				</Box>
				<LegacyLikeIcon label="" />
			</Inline>
			<Inline space="space.100">
				<Box xcss={TextBoxStyles}>
					<Text weight="bold">Feature flagged</Text>
				</Box>
				<LikeIconMigration LEGACY_size="medium" spacing="spacious" label="" />
				<LikeIcon
					LEGACY_fallbackIcon={LegacyLikeIcon}
					LEGACY_size="medium"
					spacing="spacious"
					label=""
				/>
			</Inline>
			<Inline space="space.100">
				<Box xcss={TextBoxStyles}>
					<Text weight="bold">New icon</Text>
				</Box>
				<LikeIcon spacing="spacious" label="" />
			</Inline>
		</Stack>
	);
};

export default IconDefaultExample;
