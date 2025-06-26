import React from 'react';

import { NotFoundClient } from '@atlaskit/link-test-helpers';

import VRCardView from '../utils/vr-card-view';

export default () => <VRCardView appearance="embed" client={new NotFoundClient()} />;
