import React from 'react';

import VRTestWrapper, { type VRTestWrapperProps } from '../utils/vr-test-wrapper';

import CardView, { type CardViewLayoutProps } from './card-view';

// Statically import the component to ensure it's loaded before the test runs
import '../../src/view/CardWithUrl/component-lazy';

export type VRCardViewProps = CardViewLayoutProps & VRTestWrapperProps;

const VRCardView = ({ dependencyOverrides, style, ...props }: VRCardViewProps): React.JSX.Element => (
	// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
	<VRTestWrapper dependencyOverrides={dependencyOverrides} style={style}>
		<CardView {...props} />
	</VRTestWrapper>
);

export default VRCardView;
