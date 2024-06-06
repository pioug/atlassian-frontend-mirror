/** @jsx jsx */
import { jsx } from '@emotion/react';
import { smallImage } from '@atlaskit/media-test-helpers';
import { InlineCardResolvedView as ResolvedView } from '../src/view/InlineCard/ResolvedView';
import { VRTestCase } from './utils/common';

export default () => {
	return (
		<VRTestCase title="Inline card with default icon">
			{() => (
				<ResolvedView
					isSelected={false}
					icon={smallImage}
					title="Smart Links - Designs"
					lozenge={{
						text: 'in progress',
						appearance: 'inprogress',
						isBold: true,
					}}
				/>
			)}
		</VRTestCase>
	);
};
