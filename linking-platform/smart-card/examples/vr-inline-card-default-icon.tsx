/** @jsx jsx */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

import { InlineCardResolvedView as ResolvedView } from '../src/view/InlineCard/ResolvedView';
import { VRTestCase } from './utils/common';

export default () => {
	return (
		<VRTestCase title="Inline card with default icon">
			{() => (
				<ResolvedView
					link={'some-url'}
					isSelected={false}
					icon={'broken-url'}
					title="Smart Links - Designs"
					lozenge={{
						text: 'in progress',
						appearance: 'inprogress',
					}}
				/>
			)}
		</VRTestCase>
	);
};
