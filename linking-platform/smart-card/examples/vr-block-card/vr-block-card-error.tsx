import React from 'react';

import { ErroredClient } from '@atlaskit/link-test-helpers';

import VRCardView from '../utils/vr-card-view';

export const BlockCardErrorView = (): React.JSX.Element => (
	<VRCardView appearance="block" client={new ErroredClient()} />
);
