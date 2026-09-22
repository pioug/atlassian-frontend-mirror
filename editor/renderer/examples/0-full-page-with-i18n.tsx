import React, { useState, useEffect } from 'react';

import { IntlProvider } from 'react-intl';

import { getTranslations } from '@af/editor-examples-helpers/utils/get-translations';

import RendererDemo from './helper/RendererDemo';

const Example = (): React.JSX.Element => {
	const [locale] = useState('en');
	const [messages, setMessages] = useState({});

	useEffect(() => {
		getTranslations(locale).then((translations) => {
			setMessages(translations);
		});
	}, [locale]);

	return (
		<IntlProvider locale={locale} messages={messages}>
			<RendererDemo
				appearance="full-page"
				serializer="react"
				allowHeadingAnchorLinks
				allowColumnSorting={true}
				allowWrapCodeBlock
				allowCopyToClipboard
			/>
		</IntlProvider>
	);
};

export default Example;
