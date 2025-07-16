import React from 'react';

import StarIconMigration from '@atlaskit/icon/core/migration/star-starred--star-filled';
import StarIcon from '@atlaskit/icon/core/star-starred';
import LegacyStarIcon from '@atlaskit/icon/glyph/star-filled';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Inline, Stack } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';

import { RowHeader } from './utils';

const IconMigrationColorExample = () => {
	return (
		<Stack space="space.100">
			<Inline space="space.100">
				<RowHeader>Legacy icon</RowHeader>
				<LegacyStarIcon
					primaryColor={token('color.background.accent.yellow.subtle')}
					label="Starred"
				/>
			</Inline>
			<Inline space="space.100">
				<RowHeader>Feature flagged</RowHeader>
				<StarIconMigration
					color={token('color.icon.accent.orange')}
					LEGACY_primaryColor={token('color.background.accent.yellow.subtle')}
					spacing="spacious"
					label="Starred"
				/>
			</Inline>
			<Inline space="space.100">
				<RowHeader>New icon</RowHeader>
				<StarIcon color={token('color.icon.accent.orange')} spacing="spacious" label="Starred" />
			</Inline>
		</Stack>
	);
};

export default IconMigrationColorExample;
