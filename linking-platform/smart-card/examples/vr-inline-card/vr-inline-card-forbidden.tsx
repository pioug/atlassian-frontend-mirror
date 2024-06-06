import React from 'react';

import { ForbiddenClient } from '../utils/custom-client';
import VRCardView from '../utils/vr-card-view';

export default () => <VRCardView appearance="inline" client={new ForbiddenClient()} />;
