import React from 'react';

import { NotFoundClient } from '@atlaskit/link-test-helpers';

import VRCardView from '../utils/vr-card-view';

export const BlockCardNotFoundView = (): React.JSX.Element => (
	<VRCardView appearance="block" client={new NotFoundClient()} />
);
