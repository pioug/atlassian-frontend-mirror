import React from 'react';

import { ForbiddenClient } from '@atlaskit/link-test-helpers/smart-card/mocks/clients';

import VRCardView from '../utils/vr-card-view';

export const BlockCardForbiddenView = (): React.JSX.Element => (
	<VRCardView appearance="block" client={new ForbiddenClient()} />
);
