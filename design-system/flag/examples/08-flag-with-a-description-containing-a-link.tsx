import React from 'react';

import Flag, { FlagGroup } from '@atlaskit/flag';
import SuccessIcon from '@atlaskit/icon/glyph/check-circle';
import Link from '@atlaskit/link';
import Text from '@atlaskit/primitives/text';
import { token } from '@atlaskit/tokens';

export default () => (
	<>
		<Text>This is a flag with a description containing a link.</Text>
		<FlagGroup>
			<Flag
				description={
					<Text>
						My favourite issue is{' '}
						<Link href="https://ecosystem.atlassian.net/browse/AK-90210">AK-90210</Link>
					</Text>
				}
				icon={<SuccessIcon primaryColor={token('color.icon.success')} label="Success" />}
				id="1"
				key="1"
				title="I am a Flag"
			/>
		</FlagGroup>
	</>
);
