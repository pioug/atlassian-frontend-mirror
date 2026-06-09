import React, { type ReactNode } from 'react';

import { RawIntlProvider, type IntlShape } from 'react-intl';

import { isSSR, isSSRStreaming } from '@atlaskit/editor-common/core-utils';

interface Props {
	children: ReactNode;
	intl: IntlShape | undefined;
}

/**
 * Wraps the layout section nodeview children with the editor's actual
 * IntlProvider during SSR streaming (renderToStaticMarkup). This ensures any
 * descendants that call `useIntl()` (e.g. `BreakoutResizer`'s ARIA labels)
 * have a valid intl context and do not throw during the static render pass.
 *
 * Outside of SSR streaming this is a no-op passthrough.
 *
 * Follows the same pattern as `MediaSSRReactContextsProvider` and
 * `SyncBlockSSRReactContextsProvider`.
 */
export function LayoutSSRReactContextsProvider({ children, intl }: Props): ReactNode {
	if (!isSSRStreaming() || !isSSR()) {
		return children;
	}

	if (!intl) {
		return children;
	}

	return <RawIntlProvider value={intl}>{children}</RawIntlProvider>;
}
