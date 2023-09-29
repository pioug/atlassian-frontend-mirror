import React from 'react';
import { withAnalyticsContext } from '@atlaskit/analytics-next';

import { withLinkClickedEvent } from '../../utils/analytics/click';
import { LinkAnalyticsContext } from '../../utils/analytics/LinkAnalyticsContext';
import { useLinkWarningModal } from './LinkWarningModal/hooks/use-link-warning-modal';
import LinkWarningModal from './LinkWarningModal';
import { LinkUrlProps, PackageDataType } from './types';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';

const PACKAGE_DATA: PackageDataType = {
  packageName: process.env._PACKAGE_NAME_ as string,
  packageVersion: process.env._PACKAGE_VERSION_ as string,
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
  const { isLinkSafe, showSafetyWarningModal, ...linkWarningModalProps } =
    useLinkWarningModal();

  return (
    <>
      <LinkAnalyticsContext url={href} display="url">
        <Link
          data-testid={testId}
          href={href}
          onClick={(e) => {
            if (
              getBooleanFF(
                'platform.linking-platform.smart-card.should-call-onclick-in-warning-modal-only-when-safe',
              )
            ) {
              if (!checkSafety) {
                onClick && onClick(e);
                return;
              }

              // Only call the onClick if the link is safe
              if (isLinkSafe(e, href)) {
                onClick && onClick(e);
              } else {
                showSafetyWarningModal(e, href);
              }
            } else {
              if (checkSafety && !isLinkSafe(e, href)) {
                showSafetyWarningModal(e, href);
              }
              // Call the onClick regardless of the link safety
              onClick && onClick(e);
            }
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
