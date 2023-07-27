import React from 'react';

import { NotFoundClient } from '../utils/custom-client';
import VRCardView from '../utils/vr-card-view';

export default () => (
  <VRCardView appearance="embed" client={new NotFoundClient()} />
);
