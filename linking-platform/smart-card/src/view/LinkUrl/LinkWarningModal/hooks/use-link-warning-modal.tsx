import { useState, MouseEvent } from 'react';
import { normalizeUrl } from '@atlaskit/linking-common/url';
import { useAnalyticsEvents } from '@atlaskit/analytics-next';
import { ANALYTICS_CHANNEL } from '../../../../utils/analytics';

export const useLinkWarningModal = () => {
  const [unsafeLinkText, setUnsafeLinkText] = useState<string | null>(null);
  const [url, setUrl] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const { createAnalyticsEvent } = useAnalyticsEvents();
  const sendAnalyticsEvent = () => {
    createAnalyticsEvent({
      action: 'shown',
      actionSubject: 'warningModal',
      actionSubjectId: 'linkSafetyWarning',
      eventType: 'operational',
    }).fire(ANALYTICS_CHANNEL);
  };

  /**
   * It checks and warns if a link text is a URL and different from an actual link destination
   */
  const checkLinkSafety = (event: MouseEvent, href: string | undefined) => {
    const linkText = (event.currentTarget as HTMLAnchorElement).innerText;

    const anchorLinkRegex = new RegExp(/^#/im);
    const isAnchorLink = anchorLinkRegex.test(linkText);

    if (isAnchorLink) {
      return;
    }

    const normalisedUrlFromLinkText = normalizeUrl(linkText);

    if (!!normalisedUrlFromLinkText && normalisedUrlFromLinkText !== href) {
      event.preventDefault();
      setUnsafeLinkText(linkText);
      href && setUrl(href);
      setIsOpen(true);
      sendAnalyticsEvent();
    }
  };

  const onClose = () => {
    setIsOpen(false);
    setUnsafeLinkText(null);
    setUrl(null);
  };

  const onContinue = () => {
    onClose();
    url && window.location.assign(url);
  };

  return { checkLinkSafety, unsafeLinkText, onClose, onContinue, isOpen, url };
};
