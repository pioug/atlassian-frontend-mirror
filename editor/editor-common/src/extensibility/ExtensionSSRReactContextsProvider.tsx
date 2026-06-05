import React, { type ReactNode } from 'react';

import { RawIntlProvider, type IntlShape } from 'react-intl';

import { isSSR } from '../core-utils/is-ssr';
import { isSSRStreaming } from '../core-utils/is-ssr-streaming';

interface Props {
	children: ReactNode;
	intl: IntlShape | undefined;
}

export function ExtensionSSRReactContextsProvider({ children, intl }: Props): ReactNode {
	if (!isSSR() || !isSSRStreaming()) {
		return children;
	}

	if (!intl) {
		return children;
	}

	return <RawIntlProvider value={intl}>{children}</RawIntlProvider>;
}
