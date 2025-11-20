import React from 'react';

import VRTestWrapper, { type VRTestWrapperProps } from '../utils/vr-test-wrapper';

import CardView, { type CardViewProps } from './card-view';

const VRCardView = ({ style, ...props }: CardViewProps & VRTestWrapperProps): React.JSX.Element => (
	// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
	<VRTestWrapper style={style}>
		<CardView {...props} />
	</VRTestWrapper>
);

export default VRCardView;
