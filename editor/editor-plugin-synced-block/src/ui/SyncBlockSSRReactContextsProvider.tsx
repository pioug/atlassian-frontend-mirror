import React, { type ReactNode } from 'react';

import { RawIntlProvider, type IntlShape } from 'react-intl';

import { isSSR } from '@atlaskit/editor-common/core-utils';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

interface Props {
	children: ReactNode;
	intl: IntlShape | undefined;
}

/**
 * Wraps syncBlock nodeview children with the editor's actual IntlProvider during
 * SSR streaming (renderToStaticMarkup). This ensures that components using
 * useIntl() — such as SyncBlockLabel, SyncedBlockLoadingState, and
 * ReactRenderer's table/code-block node renderers — have a valid intl context
 * and do not throw during the static render pass.
 *
 * Outside of SSR streaming this is a no-op passthrough.
 *
 * Follows the same pattern as MediaSSRReactContextsProvider.
 */
export function SyncBlockSSRReactContextsProvider({ children, intl }: Props): ReactNode {
	if (!expValEquals('platform_editor_editor_ssr_streaming', 'isEnabled', true) || !isSSR()) {
		return children;
	}

	if (!intl) {
		return children;
	}

	return <RawIntlProvider value={intl}>{children}</RawIntlProvider>;
}
