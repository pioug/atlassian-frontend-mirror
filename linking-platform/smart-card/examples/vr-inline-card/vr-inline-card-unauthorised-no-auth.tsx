import React from 'react';

import { UnAuthClientWithNoAuthFlow } from '../utils/custom-client';
import VRCardView from '../utils/vr-card-view';

export default () => <VRCardView appearance="inline" client={new UnAuthClientWithNoAuthFlow()} />;
