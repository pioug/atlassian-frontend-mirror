import React from 'react';

import SmartLinkListIcon from '@atlaskit/icon/core/smart-link-list';
import type { GlyphProps } from '@atlaskit/icon/types';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Flex } from '@atlaskit/primitives/components/flex';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { xcss } from '@atlaskit/primitives/xcss/xcss';

const wrapperStyles = xcss({
	padding: 'space.050',
	justifyContent: 'center',
	alignItems: 'center',
	width: 'space.300',
	height: 'space.300',
});

export const DatasourceIcon = (props: GlyphProps): React.JSX.Element => {
	return (
		<Flex xcss={wrapperStyles}>
			<SmartLinkListIcon label={props?.label} />
		</Flex>
	);
};
