import React, { ReactNode } from 'react';
import { enableMediaUfoLogger } from '@atlaskit/media-test-helpers';
import { payloadPublisher } from '@atlassian/ufo';

type Props = {
  children: ReactNode;
};

export const UfoLoggerWrapper: React.FC<Props> = ({ children }) => {
  enableMediaUfoLogger(payloadPublisher);
  return <>{children}</>;
};
