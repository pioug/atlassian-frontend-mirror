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
  const checkLinkSafety = (
    event: MouseEvent<HTMLAnchorElement>,
    href: string | undefined,
  ) => {
    if (!href) {
      return;
    }
    const anchor = event.currentTarget;
    const linkText = anchor.innerText;

    const normalisedUrlFromLinkText = normalizeUrl(linkText);
    if (!normalisedUrlFromLinkText) {
      return;
    }

    const anchorLinkRegex = new RegExp(/^#/im);
    const isAnchorLink = anchorLinkRegex.test(linkText);

    if (isAnchorLink) {
      return;
    }

    const relativeLinkRegex = new RegExp(/^\//im);
    const isRelativeHrefLink = relativeLinkRegex.test(href);
    if (isRelativeHrefLink) {
      return;
    }

    const hrefUrl = new URL(href, window.location.origin);
    const linkTextUrl = new URL(normalisedUrlFromLinkText, hrefUrl.origin);

    const httpProtocols = ['http:', 'https:'];

    let areProtocolsEquivalent: boolean;
    if (
      httpProtocols.includes(linkTextUrl.protocol) &&
      httpProtocols.includes(hrefUrl.protocol)
    ) {
      const noUserNameAndPassword =
        !linkTextUrl.username &&
        !linkTextUrl.password &&
        !hrefUrl.username &&
        !hrefUrl.password;
      areProtocolsEquivalent = noUserNameAndPassword;
    } else {
      areProtocolsEquivalent = linkTextUrl.protocol === hrefUrl.protocol;
    }

    const areEquivalentLinks =
      linkTextUrl.hostname === hrefUrl.hostname &&
      linkTextUrl.pathname === hrefUrl.pathname &&
      linkTextUrl.search === hrefUrl.search &&
      linkTextUrl.username === hrefUrl.username &&
      linkTextUrl.password === hrefUrl.password &&
      areProtocolsEquivalent;

    if (!areEquivalentLinks) {
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
