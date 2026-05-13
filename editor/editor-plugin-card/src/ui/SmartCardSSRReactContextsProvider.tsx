import React, { type ReactNode } from 'react';

import { RawIntlProvider, type IntlShape } from 'react-intl';

import { isSSR } from '@atlaskit/editor-common/core-utils';
import { type CardContext, SmartCardContext } from '@atlaskit/link-provider';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

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
	if (!expValEquals('platform_editor_editor_ssr_streaming', 'isEnabled', true) || !isSSR()) {
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
