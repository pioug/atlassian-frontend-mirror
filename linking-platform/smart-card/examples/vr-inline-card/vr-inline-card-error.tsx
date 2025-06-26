import React from 'react';

import { ErroredClient } from '@atlaskit/link-test-helpers';

import VRCardView from '../utils/vr-card-view';

export default () => <VRCardView appearance="inline" client={new ErroredClient()} />;
