import type React from 'react';
import { useEffect, useState } from 'react';

import { isSSR } from '@atlaskit/editor-common/core-utils';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

/**
 * ExcludeFromHydration component delays rendering of its children until after the initial
 * hydration phase, based on a feature flag check. If the feature flag is disabled,
 * it will render children immediately after hydration.
 * @param children - The content to render after hydration
 * @param fallback - Optional fallback content to render during hydration (e.g., a placeholder to prevent layout shift)
 * @returns
 */
function ExcludeFromHydration({
	children,
	fallback = null,
}: {
	children: React.ReactNode;
	fallback?: React.ReactNode;
}): React.ReactNode {
	const [shouldRender, setShouldRender] = useState(false);

	useEffect(() => {
		if (isSSR()) {
			return;
		}
		setShouldRender(true);
	}, []);

	if (expValEquals('platform_editor_hydratable_ui', 'isEnabled', true) && !shouldRender) {
		return fallback ?? null;
	}

	return children;
}

export default ExcludeFromHydration;
