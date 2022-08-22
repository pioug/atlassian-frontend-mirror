import React from 'react';
import Tooltip from '@atlaskit/tooltip';
import Button from '@atlaskit/button/custom-theme-button';
import { LinkInfoButtonProps } from './types';

const LinkInfoButton: React.FC<LinkInfoButtonProps> = ({
  content,
  href,
  icon,
  onClick,
  target,
  testId,
}) => {
  return (
    <Tooltip
      content={content}
      hideTooltipOnClick={true}
      position="top"
      tag="span"
      testId={`${testId}-tooltip`}
    >
      <Button
        appearance="subtle"
        href={href}
        iconBefore={icon}
        onClick={onClick}
        target={target}
        testId={`${testId}-button`}
      />
    </Tooltip>
  );
};

export default LinkInfoButton;
