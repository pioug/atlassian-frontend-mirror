import React from 'react';

import VRTestWrapper, { type VRTestWrapperProps } from '../utils/vr-test-wrapper';

import CardView from './card-view';
import type { MultiCardViewProps } from './card-view-props';

const VRCardView = ({ style, ...props }: MultiCardViewProps & VRTestWrapperProps): React.JSX.Element => (
	// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
	<VRTestWrapper style={style}>
		<CardView {...props} />
	</VRTestWrapper>
);

export default VRCardView;
