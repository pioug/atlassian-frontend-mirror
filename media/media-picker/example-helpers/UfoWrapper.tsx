import React, { type ReactNode } from 'react';

import { enableMediaUfoLogger } from '@atlaskit/media-test-helpers/ufoLogger';
import { payloadPublisher } from '@atlassian/ufo/publisher';

type Props = {
	children: ReactNode;
};

export const UfoLoggerWrapper: React.FC<Props> = ({ children }) => {
	enableMediaUfoLogger(payloadPublisher);
	return <>{children}</>;
};
