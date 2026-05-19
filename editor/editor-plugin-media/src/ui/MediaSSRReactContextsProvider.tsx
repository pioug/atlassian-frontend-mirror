import React, { type ReactNode } from 'react';

import { RawIntlProvider, type IntlShape } from 'react-intl';

import { isSSR } from '@atlaskit/editor-common/core-utils';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

interface Props {
	children: ReactNode;
	intl: IntlShape | undefined;
}

export function MediaSSRReactContextsProvider({ children, intl }: Props): ReactNode {
	if (!expValEquals('platform_editor_editor_ssr_streaming', 'isEnabled', true) || !isSSR()) {
		return children;
	}

	if (!intl) {
		return children;
	}

	return <RawIntlProvider value={intl}>{children}</RawIntlProvider>;
}
