import React from 'react';
import { withAnalyticsContext } from '@atlaskit/analytics-next';

import {
  name as packageName,
  version as packageVersion,
} from '../../version.json';
import { withLinkClickedEvent } from '../../utils/analytics/click';
import { LinkAnalyticsContext } from '../../utils/analytics/LinkAnalyticsContext';
import { useLinkWarningModal } from './LinkWarningModal/hooks/use-link-warning-modal';
import LinkWarningModal from './LinkWarningModal';
import { LinkUrlProps, PackageDataType } from './types';

const PACKAGE_DATA: PackageDataType = {
  packageName,
  packageVersion,
  componentName: 'linkUrl',
};

const Link = withLinkClickedEvent('a');

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
      <LinkAnalyticsContext url={href} display="url">
        <Link
          data-testid={testId}
          href={href}
          onClick={(e) => {
            checkSafety && checkLinkSafety(e, href);
            onClick && onClick(e);
          }}
          {...props}
        >
          {children}
        </Link>
      </LinkAnalyticsContext>
      {checkSafety && <LinkWarningModal {...linkWarningModalProps} />}
    </>
  );
};

export default withAnalyticsContext(PACKAGE_DATA)(LinkUrl);
