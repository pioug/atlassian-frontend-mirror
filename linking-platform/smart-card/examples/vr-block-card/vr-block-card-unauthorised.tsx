import React from 'react';

import { UnAuthClient } from '@atlaskit/link-test-helpers';

import VRCardView from '../utils/vr-card-view';

export const BlockCardUnauthorisedView = () => (
	<VRCardView appearance="block" client={new UnAuthClient()} />
);
