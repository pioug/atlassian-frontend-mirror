import React, { ReactChild } from 'react';

import Button from '@atlaskit/button/custom-theme-button';

interface Props {
  onClick?: () => void;
  children?: ReactChild;
  testId?: string;
}

export default (props: Props) => (
  <Button
    appearance="subtle"
    onClick={props.onClick}
    spacing="none"
    tabIndex={-1}
    iconBefore={props.children}
    testId={props.testId}
  />
);
