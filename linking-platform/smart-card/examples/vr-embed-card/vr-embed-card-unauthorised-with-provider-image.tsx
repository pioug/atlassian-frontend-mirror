import React from 'react';

import { UnAuthClientWithProviderImage } from '../utils/custom-client';
import VRCardView from '../utils/vr-card-view';

export default () => <VRCardView appearance="embed" client={new UnAuthClientWithProviderImage()} />;
