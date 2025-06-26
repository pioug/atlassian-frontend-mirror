import React from 'react';

import { NotFoundClient } from '@atlaskit/link-test-helpers';

import VRCardView from '../utils/vr-card-view';

export const BlockCardNotFoundView = () => (
	<VRCardView appearance="block" client={new NotFoundClient()} />
);
