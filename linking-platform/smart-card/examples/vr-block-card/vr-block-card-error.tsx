import React from 'react';

import { ErroredClient } from '@atlaskit/link-test-helpers';

import VRCardView from '../utils/vr-card-view';

export const BlockCardErrorView = () => (
	<VRCardView appearance="block" client={new ErroredClient()} />
);
