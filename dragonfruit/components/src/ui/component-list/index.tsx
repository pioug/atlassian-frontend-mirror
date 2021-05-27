import React from 'react';

import { Wrapper } from './styled';
import { ComponentListProps } from './types';

export default function ComponentList({ testId }: ComponentListProps) {
  return <Wrapper testId={testId}>Hello world 👋</Wrapper>;
}
