/** @jsx jsx */
import React from 'react';

import { jsx } from '@emotion/core';
import { TitleBlockProps } from '../types';
import { BaseTitleBlockComponent } from '../utils';

const TitleBlockResolvedView: React.FC<TitleBlockProps> = (props) => {
  return (
    <BaseTitleBlockComponent {...props} blockTestIdPostfix="resolved-view" />
  );
};

export default TitleBlockResolvedView;
