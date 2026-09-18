import React, { type ReactNode } from 'react';

import { RawIntlProvider, type IntlShape } from 'react-intl';

import { isSSR } from '@atlaskit/editor-common/core-utils';
import { SmartCardContext } from '@atlaskit/link-provider/context';
import type { CardContext } from '@atlaskit/link-provider/types';

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
	if (!isSSR()) {
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
