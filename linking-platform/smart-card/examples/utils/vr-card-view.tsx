import React from 'react';

import VRTestWrapper from '../utils/vr-test-wrapper';
import CardView, { CardViewProps } from './card-view';

const VRCardView: React.FC<CardViewProps> = (props) => (
  <VRTestWrapper>
    <CardView {...props} />
  </VRTestWrapper>
);

export default VRCardView;
