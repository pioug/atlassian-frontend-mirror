import React from 'react';
import { useLinkWarningModal } from './LinkWarningModal/hooks/use-link-warning-modal';
import LinkWarningModal from './LinkWarningModal';
import { LinkUrlProps } from './types';

const LinkUrl: React.FC<LinkUrlProps> = ({
  href,
  children,
  checkSafety = true,
  onClick,
  testId = 'link-with-safety',
  ...props
}) => {
  const { checkLinkSafety, ...linkWarningModalProps } = useLinkWarningModal();

  return (
    <>
      <a
        data-testid={testId}
        href={href}
        onClick={(e) => {
          checkSafety && checkLinkSafety(e, href);
          onClick && onClick(e);
        }}
        {...props}
      >
        {children}
      </a>
      {checkSafety && <LinkWarningModal {...linkWarningModalProps} />}
    </>
  );
};

export default LinkUrl;
