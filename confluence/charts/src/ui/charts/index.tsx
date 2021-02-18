import React from 'react';

import { Wrapper } from './styled';
import { ChartsProps } from './types';

export default function Charts({ testId }: ChartsProps) {
  return <Wrapper testId={testId}>Hello world 👋</Wrapper>;
}
