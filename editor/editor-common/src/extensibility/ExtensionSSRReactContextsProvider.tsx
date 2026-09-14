import React, { type ReactNode } from 'react';

import { RawIntlProvider, type IntlShape } from 'react-intl';

import { isSSR } from '../core-utils/is-ssr';

interface Props {
	children: ReactNode;
	intl: IntlShape | undefined;
}

export function ExtensionSSRReactContextsProvider({ children, intl }: Props): ReactNode {
	if (!isSSR()) {
		return children;
	}

	if (!intl) {
		return children;
	}

	return <RawIntlProvider value={intl}>{children}</RawIntlProvider>;
}
