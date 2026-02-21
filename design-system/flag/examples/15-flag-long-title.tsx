import React from 'react';

import noop from '@atlaskit/ds-lib/noop';
import Flag, { FlagGroup } from '@atlaskit/flag';
import SuccessIcon from '@atlaskit/icon/core/status-success';
import { Text } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

export default (): React.JSX.Element => (
	<>
		<Text> Flag with long title text that is wrapped</Text>
		<FlagGroup>
			<Flag
				icon={
					<SuccessIcon spacing="spacious" label="Success" color={token('color.icon.success')} />
				}
				id="success"
				key="success"
				title="This is a flag with a very long title, including this_really_long_filename_that_spans_longer_than_the_container.png. The text should wrap and the Flag should grow in height. It should not truncate."
				description="All wires now hooked up."
				actions={[{ content: 'Alrighty then', onClick: noop }]}
			/>
		</FlagGroup>
	</>
);
