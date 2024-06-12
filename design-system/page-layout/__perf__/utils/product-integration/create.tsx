import React from 'react';

import { Create } from '@atlaskit/atlassian-navigation';
import noop from '@atlaskit/ds-lib/noop';
import { token } from '@atlaskit/tokens';

const StyledTooltip = () => (
	<span>
		Create
		{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
		<span style={{ color: token('color.text.accent.orange', 'orange') }}> [c]</span>
	</span>
);

export const DefaultCreate = () => (
	<Create
		buttonTooltip={<StyledTooltip />}
		iconButtonTooltip="Create button"
		onClick={noop}
		text="Create"
		testId="create-cta"
	/>
);
