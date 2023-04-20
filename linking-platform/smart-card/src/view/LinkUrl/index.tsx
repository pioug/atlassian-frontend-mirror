import React from 'react';
import { useLinkWarningModal } from './LinkWarningModal/hooks/use-link-warning-modal';
import LinkWarningModal from './LinkWarningModal';
import { LinkUrlProps, PackageDataType } from './types';
import {
  useAnalyticsEvents,
  withAnalyticsContext,
} from '@atlaskit/analytics-next';
import {
  name as packageName,
  version as packageVersion,
} from '../../version.json';
import { fireLinkClickedEvent } from '../../utils/analytics/click';
import useMouseDownEvent from '../../state/analytics/useMouseDownEvent';

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
  onMouseDown,
  testId = 'link-with-safety',
  ...props
}) => {
  const { checkLinkSafety, ...linkWarningModalProps } = useLinkWarningModal();

  const { createAnalyticsEvent } = useAnalyticsEvents();
  const handleMouseDown = useMouseDownEvent();

  return (
    <>
      <a
        data-testid={testId}
        href={href}
        onClick={(e) => {
          checkSafety && checkLinkSafety(e, href);
          onClick && onClick(e);
          fireLinkClickedEvent(createAnalyticsEvent)(e);
        }}
        onMouseDown={(e) => {
          onMouseDown && onMouseDown(e);
          handleMouseDown(e); // add analytics
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
