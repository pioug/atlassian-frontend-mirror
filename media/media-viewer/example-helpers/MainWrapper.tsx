import React, { ReactNode } from 'react';
import { enableMediaUfoLogger } from '@atlaskit/media-test-helpers';
import { payloadPublisher } from '@atlassian/ufo';
import { Container } from './styled';

type Props = {
  children: ReactNode;
};

export const MainWrapper: React.FC<Props> = ({ children }) => {
  enableMediaUfoLogger(payloadPublisher);
  return <Container>{children}</Container>;
};
