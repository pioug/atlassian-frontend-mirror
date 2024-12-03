import React from 'react';

import InfoIcon from '@atlaskit/icon/core/information';
import InfoIconMigration from '@atlaskit/icon/core/migration/information--info';
import LegacyInfoIcon from '@atlaskit/icon/glyph/info';
import { Inline, Stack } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';

import { RowHeader } from './utils';

const IconDefaultExample = () => {
	return (
		<Stack space="space.100">
			<Inline space="space.100">
				<RowHeader>Legacy icon</RowHeader>
				<LegacyInfoIcon
					primaryColor={token('color.icon.selected')}
					secondaryColor={token('color.icon.inverse')}
					size="small"
					label=""
				/>
			</Inline>
			<Inline space="space.100">
				<RowHeader>Feature flagged</RowHeader>
				<InfoIconMigration
					color={token('color.icon.selected')}
					LEGACY_secondaryColor={token('color.icon.inverse')}
					LEGACY_size="small"
					label=""
				/>
			</Inline>
			<Inline space="space.100">
				<RowHeader>New icon</RowHeader>
				<InfoIcon color={token('color.icon.selected')} label="" />
			</Inline>
		</Stack>
	);
};

export default IconDefaultExample;
