import React from 'react';

import { UnAuthClientWithNoAuthFlow } from '@atlaskit/link-test-helpers';

import VRCardView from '../utils/vr-card-view';

export default () => <VRCardView appearance="embed" client={new UnAuthClientWithNoAuthFlow()} />;
