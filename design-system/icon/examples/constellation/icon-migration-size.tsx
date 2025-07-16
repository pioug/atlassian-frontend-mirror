import React from 'react';

import CrossIcon from '@atlaskit/icon/core/cross';
import CloseIconMigration from '@atlaskit/icon/core/migration/cross';
import LegacyCloseIcon from '@atlaskit/icon/glyph/cross';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Inline, Stack } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';

import { RowHeader } from './utils';

const IconSizeExample = () => {
	return (
		<Stack space="space.100">
			<Inline space="space.100">
				<RowHeader>Legacy icon</RowHeader>
				<LegacyCloseIcon primaryColor={token('color.icon.danger')} size="small" label="" />
			</Inline>
			<Inline space="space.100">
				<RowHeader>Feature flagged</RowHeader>
				<CloseIconMigration color={token('color.icon.danger')} LEGACY_size="small" label="" />
			</Inline>
			<Inline space="space.100">
				<RowHeader>New icon</RowHeader>
				<CrossIcon color={token('color.icon.danger')} label="" />
			</Inline>
		</Stack>
	);
};

export default IconSizeExample;
