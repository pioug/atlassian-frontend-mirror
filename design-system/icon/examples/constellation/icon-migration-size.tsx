import React from 'react';

import CloseIcon from '@atlaskit/icon/core/close';
import CloseIconMigration from '@atlaskit/icon/core/migration/close--cross';
import LegacyCloseIcon from '@atlaskit/icon/glyph/cross';
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
				<CloseIcon color={token('color.icon.danger')} label="" />
			</Inline>
		</Stack>
	);
};

export default IconSizeExample;
