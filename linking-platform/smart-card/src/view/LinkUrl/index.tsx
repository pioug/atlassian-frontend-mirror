import React from 'react';
import { useLinkWarningModal } from './LinkWarningModal/hooks/use-link-warning-modal';
import LinkWarningModal from './LinkWarningModal';
import { LinkUrlProps, PackageDataType } from './types';
import { withAnalyticsContext } from '@atlaskit/analytics-next';
import {
  name as packageName,
  version as packageVersion,
} from '../../version.json';

const PACKAGE_DATA: PackageDataType = {
  packageName,
  packageVersion,
  componentName: 'linkUrl',
};

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

export default withAnalyticsContext(PACKAGE_DATA)(LinkUrl);
