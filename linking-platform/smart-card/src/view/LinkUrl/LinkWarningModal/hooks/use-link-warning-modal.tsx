import { type MouseEvent, useState } from 'react';

import { useAnalyticsEvents } from '@atlaskit/analytics-next';
import { normalizeUrl } from '@atlaskit/linking-common/url';

import { ANALYTICS_CHANNEL } from '../../../../utils/analytics';

const toUrl = (url: string, base?: string): URL | undefined => {
	try {
		return new URL(url, base);
	} catch {
		return undefined;
	}
};

export const useLinkWarningModal = () => {
	const [unsafeLinkText, setUnsafeLinkText] = useState<string | null>(null);
	const [url, setUrl] = useState<string | null>(null);
	const [isOpen, setIsOpen] = useState<boolean>(false);

	const { createAnalyticsEvent } = useAnalyticsEvents();
	const sendWarningModalViewedEvent = () => {
		createAnalyticsEvent({
			action: 'viewed',
			actionSubject: 'linkSafetyWarningModal',
			eventType: 'screen',
			name: 'linkSafetyWarningModal',
		}).fire(ANALYTICS_CHANNEL);
	};

	const sendContinueClickedEvent = () => {
		createAnalyticsEvent({
			action: 'clicked',
			actionSubject: 'button',
			actionSubjectId: 'linkSafetyWarningModalContinue',
			eventType: 'ui',
			screen: 'linkSafetyWarningModal',
		}).fire(ANALYTICS_CHANNEL);
	};

	/**
	 * It checks and warns if a link text is a URL and different from an actual link destination
	 */
	const isLinkSafe = (event: MouseEvent<HTMLAnchorElement>, href: string | undefined) => {
		if (!href) {
			return true;
		}
		const anchor = event.currentTarget;
		const linkText = anchor.innerText;

		const normalisedUrlFromLinkText = normalizeUrl(linkText);
		if (!normalisedUrlFromLinkText) {
			return true;
		}

		const anchorLinkRegex = new RegExp(/^#/im);
		const isLinkTextAnchorLink = anchorLinkRegex.test(linkText);
		const isAnchorLink = anchorLinkRegex.test(href);
		if (isAnchorLink || isLinkTextAnchorLink) {
			return true;
		}

		const relativeLinkRegex = new RegExp(/^\//im);
		const isRelativeHrefLink = relativeLinkRegex.test(href);
		if (isRelativeHrefLink) {
			return true;
		}

		const hrefUrl = toUrl(href, window.location.origin);
		const linkTextUrl = toUrl(normalisedUrlFromLinkText, hrefUrl?.origin);
		if (!hrefUrl || !linkTextUrl) {
			return true;
		}

		const httpProtocols = ['http:', 'https:'];

		let areProtocolsEquivalent: boolean;
		if (httpProtocols.includes(linkTextUrl.protocol) && httpProtocols.includes(hrefUrl.protocol)) {
			const noUserNameAndPassword =
				!linkTextUrl.username && !linkTextUrl.password && !hrefUrl.username && !hrefUrl.password;
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
			return false;
		}
		return true;
	};

	const showSafetyWarningModal = (
		event: MouseEvent<HTMLAnchorElement>,
		href: string | undefined,
	) => {
		event.preventDefault();
		const anchor = event.currentTarget;
		const linkText = anchor.innerText;
		setUnsafeLinkText(linkText);
		href && setUrl(href);
		setIsOpen(true);
		sendWarningModalViewedEvent();
	};

	const onClose = () => {
		setIsOpen(false);
		setUnsafeLinkText(null);
		setUrl(null);
	};

	const onContinue = () => {
		onClose();
		sendContinueClickedEvent();
		url && window.open(url, '_blank', 'noopener noreferrer');
	};

	return {
		isLinkSafe,
		isOpen,
		onClose,
		onContinue,
		showSafetyWarningModal,
		unsafeLinkText,
		url,
	};
};
