import { useEffect } from 'react';

import { doc, link, paragraph, text } from '@atlaskit/adf-utils/builders';

import { useMacroViewedAnalyticsEvent } from '../../../common/utils';

import { type ExtensionLinkComponentProps } from './types';

export const ExtensionLinkComponent = (props: ExtensionLinkComponentProps) => {
	const { extension, render } = props;
	const { extensionKey } = extension;
	const fireMacroViewedAnalyticsEvent = useMacroViewedAnalyticsEvent();
	useEffect(() => {
		fireMacroViewedAnalyticsEvent(extensionKey, 'link');
	}, [extensionKey, fireMacroViewedAnalyticsEvent]);
	const url = extension.parameters.macroParams.url.value;
	const document = doc(
		paragraph(
			link({
				href: url,
				title: url,
			})(text(url)),
		),
	);

	return render(document);
};
