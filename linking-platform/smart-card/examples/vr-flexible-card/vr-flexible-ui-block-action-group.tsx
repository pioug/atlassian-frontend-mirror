/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { css, jsx } from '@compiled/react';

import { fg } from '@atlaskit/platform-feature-flags';
import { token } from '@atlaskit/tokens';

import ActionGroup from '../../src/view/FlexibleCard/components/blocks/action-group';
import {
	makeCustomActionItem,
	makeDeleteActionItem,
	makeEditActionItem,
} from '../utils/flexible-ui';
import VrExpandDropdownMenuWrapper from '../utils/vr-expand-dropdown-menu-wrapper';
import VRTestWrapper from '../utils/vr-test-wrapper';

import Old from './vr-flexible-ui-block-action-groupOld';

// Override the padding that came with new vr wrapper
const containerStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'div.vr-test-wrapper': {
		padding: `${token('space.050', '4px')} 0 0 0`,
	},
});

export default () => {
	if (!fg('bandicoots-compiled-migration-smartcard')) {
		return <Old />;
	}
	return (
		<VRTestWrapper>
			<div css={containerStyles}>
				<h5>Item group</h5>
				<ActionGroup
					visibleButtonsNum={1}
					items={[makeCustomActionItem(), makeDeleteActionItem(), makeEditActionItem()]}
				/>

				<h5>Single action item</h5>
				<ActionGroup visibleButtonsNum={1} items={[makeCustomActionItem()]} />

				<h5>Item group (open)</h5>
				<VrExpandDropdownMenuWrapper>
					<ActionGroup
						visibleButtonsNum={1}
						items={[makeCustomActionItem(), makeDeleteActionItem(), makeEditActionItem()]}
					/>
				</VrExpandDropdownMenuWrapper>
			</div>
		</VRTestWrapper>
	);
};
