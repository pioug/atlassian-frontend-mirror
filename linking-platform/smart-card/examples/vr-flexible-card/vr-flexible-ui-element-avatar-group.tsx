/** @jsx jsx */
import React from 'react';
import { css, jsx } from '@emotion/react';

import { FlexibleUiContext } from '../../src/state/flexible-ui-context';
import { SmartLinkSize } from '../../src/constants';
import { exampleTokens, getContext } from '../utils/flexible-ui';
import {
	AuthorGroup,
	CollaboratorGroup,
	OwnedByGroup,
	AssignedToGroup,
} from '../../src/view/FlexibleCard/components/elements';
import VRTestWrapper from '../utils/vr-test-wrapper';
import { token } from '@atlaskit/tokens';

const containerStyles = css({
	display: 'flex',
	flexWrap: 'wrap',
	gap: token('space.050', '4px'),
	padding: token('space.050', '4px'),
});
const overrideCss = css({
	li: {
		'span, svg': {
			backgroundColor: exampleTokens.overrideColor,
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

export default () => (
	<VRTestWrapper>
		<FlexibleUiContext.Provider value={context}>
			{Object.values(SmartLinkSize).map((size, tIdx) => (
				<React.Fragment key={tIdx}>
					<h5>{size}</h5>
					<div css={containerStyles}>
						<AuthorGroup size={size} testId={`vr-test-author-group-${size}-${tIdx}`} />
						<CollaboratorGroup size={size} testId={`vr-test-collaborator-group-${size}-${tIdx}`} />
						<OwnedByGroup size={size} testId={`vr-test-ownedBy-group-${size}-${tIdx}`} />
						<AssignedToGroup size={size} testId={`vr-test-assignedTo-group-${size}-${tIdx}`} />
					</div>
				</React.Fragment>
			))}
			<h5>Override CSS</h5>
			<div css={containerStyles}>
				<AuthorGroup overrideCss={overrideCss} />
			</div>
		</FlexibleUiContext.Provider>
	</VRTestWrapper>
);
