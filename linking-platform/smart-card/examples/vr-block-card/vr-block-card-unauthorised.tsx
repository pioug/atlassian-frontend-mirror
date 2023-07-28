import React from 'react';

import { UnAuthClient } from '../utils/custom-client';
import VRCardView from '../utils/vr-card-view';

export default () => (
  <VRCardView appearance="block" client={new UnAuthClient()} />
);
