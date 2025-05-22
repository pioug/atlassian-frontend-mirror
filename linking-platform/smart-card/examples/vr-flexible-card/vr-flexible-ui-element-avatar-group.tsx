/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

import { css, jsx } from '@compiled/react';

import { token } from '@atlaskit/tokens';

import { SmartLinkSize } from '../../src/constants';
import { FlexibleCardContext, FlexibleUiContext } from '../../src/state/flexible-ui-context';
import {
	AssignedToGroup,
	AuthorGroup,
	CollaboratorGroup,
	OwnedByGroup,
} from '../../src/view/FlexibleCard/components/elements';
import { getContext } from '../utils/flexible-ui';
import VRTestWrapper from '../utils/vr-test-wrapper';

const containerStyles = css({
	display: 'flex',
	flexWrap: 'wrap',
	gap: token('space.050', '4px'),
	paddingTop: token('space.050', '4px'),
	paddingRight: token('space.050', '4px'),
	paddingBottom: token('space.050', '4px'),
	paddingLeft: token('space.050', '4px'),
});

const overrideCss = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	li: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'span, svg': {
			backgroundColor: token('color.background.accent.blue.subtle', '#579DFF'),
		},
	},
});
const authorGroup = [{ name: 'Bob' }, { name: 'Charlie' }, { name: 'Spaghetti' }];
const collaboratorGroup = [{ name: 'Alexander' }, { name: 'Hamilton' }, { name: 'Lasagna' }];
const ownedByGroup = [{ name: 'Alexander Owner' }];
const assignedToGroup = [{ name: 'Alexander Assigned' }];
const context = getContext({
	authorGroup,
	collaboratorGroup,
	ownedByGroup,
	assignedToGroup,
});

export default () => {
	return (
		<VRTestWrapper>
			<FlexibleCardContext.Provider value={{ data: context }}>
				{/* Remove FlexibleUiContext on cleanup of platform-linking-flexible-card-context */}
				<FlexibleUiContext.Provider value={context}>
					{Object.values(SmartLinkSize).map((size, tIdx) => (
						<React.Fragment key={tIdx}>
							<h5>{size}</h5>
							<div css={containerStyles}>
								<AuthorGroup size={size} testId={`vr-test-author-group-${size}-${tIdx}`} />
								<CollaboratorGroup
									size={size}
									testId={`vr-test-collaborator-group-${size}-${tIdx}`}
								/>
								<OwnedByGroup size={size} testId={`vr-test-ownedBy-group-${size}-${tIdx}`} />
								<AssignedToGroup size={size} testId={`vr-test-assignedTo-group-${size}-${tIdx}`} />
							</div>
						</React.Fragment>
					))}
					<h5>Override CSS</h5>
					<div css={containerStyles}>
						<AuthorGroup css={overrideCss} />
					</div>
				</FlexibleUiContext.Provider>
			</FlexibleCardContext.Provider>
		</VRTestWrapper>
	);
};
