import React, { type ReactNode } from 'react';

import { RawIntlProvider, type IntlShape } from 'react-intl';

import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import { isSSR } from '../core-utils/is-ssr';

interface Props {
	children: ReactNode;
	intl: IntlShape | undefined;
}

export function ExtensionSSRReactContextsProvider({ children, intl }: Props): ReactNode {
	if (!expValEquals('platform_editor_editor_ssr_streaming', 'isEnabled', true) || !isSSR()) {
		return children;
	}

	if (!intl) {
		return children;
	}

	return <RawIntlProvider value={intl}>{children}</RawIntlProvider>;
}
