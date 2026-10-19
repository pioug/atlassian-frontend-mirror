import React from 'react';

import { NotFoundClient } from '@atlaskit/link-test-helpers/smart-card/mocks/clients';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box } from '@atlaskit/primitives/box';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { xcss } from '@atlaskit/primitives/xcss/xcss';

import VRCardView from '../utils/vr-card-view';

const wrapperStyles = xcss({
	width: '200px',
});
export default (): React.JSX.Element => (
	<Box xcss={wrapperStyles}>
		<VRCardView appearance="inline" truncateInline client={new NotFoundClient()} />
	</Box>
);
