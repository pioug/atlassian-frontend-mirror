import React from 'react';
import { Caption } from '@atlaskit/editor-common';

const RenderCaption = ({ children }: { children: React.ReactNode }) => {
  return <Caption hasContent={true}>{children}</Caption>;
};

export default RenderCaption;
