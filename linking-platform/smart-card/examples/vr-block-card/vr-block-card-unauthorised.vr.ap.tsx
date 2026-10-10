import React from 'react';

import { UnAuthClient } from '@atlaskit/link-test-helpers/smart-card/mocks/clients';

import VRCardView from '../utils/vr-card-view';

export const BlockCardUnauthorisedView = (): React.JSX.Element => (
	<VRCardView appearance="block" client={new UnAuthClient()} />
);
