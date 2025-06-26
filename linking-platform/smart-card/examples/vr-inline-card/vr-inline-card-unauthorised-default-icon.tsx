import React from 'react';

import { UnAuthClientWithNoIcon } from '@atlaskit/link-test-helpers';

import VRCardView from '../utils/vr-card-view';

export default () => <VRCardView appearance="inline" client={new UnAuthClientWithNoIcon()} />;
