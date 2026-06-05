import React, { type ReactNode } from 'react';

import { RawIntlProvider, type IntlShape } from 'react-intl';

import { isSSR, isSSRStreaming } from '@atlaskit/editor-common/core-utils';

interface Props {
	children: ReactNode;
	intl: IntlShape | undefined;
}

export function MediaSSRReactContextsProvider({ children, intl }: Props): ReactNode {
	if (!isSSR() || !isSSRStreaming()) {
		return children;
	}

	if (!intl) {
		return children;
	}

	return <RawIntlProvider value={intl}>{children}</RawIntlProvider>;
}
