/** @jsx jsx */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import { smallImage } from '@atlaskit/media-test-helpers';

import { BlockCardResolvedView } from '../../src/view/BlockCard';
import { VRTestCase } from '../utils/common';
import { type ActionProps } from '../../src/view/BlockCard/components/Action';
import VrExpandDropdownMenuWrapper from '../utils/vr-expand-dropdown-menu-wrapper';

export default () => {
	const actionsList: Array<ActionProps> = [
		{
			id: 'Preview',
			text: 'Open preview',
			promise: () => Promise.resolve(),
		},
		{
			id: 'Like',
			text: 'Like',
			promise: () => Promise.resolve(),
		},
		{
			id: 'Open',
			text: 'Open',
			promise: () => Promise.resolve(),
		},
		{
			id: 'Download',
			text: 'Download',
			promise: () => Promise.resolve(),
		},
	];
	return (
		<VrExpandDropdownMenuWrapper>
			<VRTestCase title="Block card with actions menu">
				{() => (
					<BlockCardResolvedView
						icon={{ url: smallImage }}
						title="Smart Links - Designs"
						link="https://icatcare.org/app/uploads/2019/09/The-Kitten-Checklist-1.png"
						byline={'Updated 2 days ago. Created 3 days ago.'}
						thumbnail={smallImage}
						context={{ text: 'Dropbox', icon: smallImage }}
						actions={actionsList}
					/>
				)}
			</VRTestCase>
		</VrExpandDropdownMenuWrapper>
	);
};
