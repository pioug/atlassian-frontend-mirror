import React from 'react';

import VRTestWrapper, { VRTestWrapperProps } from '../utils/vr-test-wrapper';
import CardView, { CardViewProps } from './card-view';

const VRCardView: React.FC<CardViewProps & VRTestWrapperProps> = ({
  overrideCss,
  ...props
}) => (
  <VRTestWrapper overrideCss={overrideCss}>
    <CardView {...props} />
  </VRTestWrapper>
);

export default VRCardView;
