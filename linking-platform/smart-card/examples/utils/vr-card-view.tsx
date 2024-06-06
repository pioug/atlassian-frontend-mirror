import React from 'react';

import VRTestWrapper, { type VRTestWrapperProps } from '../utils/vr-test-wrapper';
import CardView, { type CardViewProps } from './card-view';

const VRCardView: React.FC<CardViewProps & VRTestWrapperProps> = ({ overrideCss, ...props }) => (
	<VRTestWrapper overrideCss={overrideCss}>
		<CardView {...props} />
	</VRTestWrapper>
);

export default VRCardView;
