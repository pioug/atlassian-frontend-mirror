import React from 'react';

import { ForbiddenClient } from '@atlaskit/link-test-helpers';

import VRCardView from '../utils/vr-card-view';

export const BlockCardForbiddenView = () => (
	<VRCardView appearance="block" client={new ForbiddenClient()} />
);
