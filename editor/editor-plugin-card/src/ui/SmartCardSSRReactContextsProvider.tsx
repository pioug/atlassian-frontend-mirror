import React, { type ReactNode } from 'react';

import { RawIntlProvider, type IntlShape } from 'react-intl';

import { isSSR, isSSRStreaming } from '@atlaskit/editor-common/core-utils';
import { type CardContext, SmartCardContext } from '@atlaskit/link-provider';

interface Props {
	children: ReactNode;
	intl: IntlShape | undefined;
	smartCardContext: CardContext | undefined;
}

export function SmartCardSSRReactContextsProvider({
	smartCardContext,
	children,
	intl,
}: Props): ReactNode {
	if (!isSSR() || !isSSRStreaming()) {
		return children;
	}

	if (!intl || !smartCardContext) {
		return children;
	}

	return (
		<RawIntlProvider value={intl}>
			<SmartCardContext.Provider value={smartCardContext}>{children}</SmartCardContext.Provider>
		</RawIntlProvider>
	);
}
