import type React from 'react';
import { useEffect, useState } from 'react';

import { isSSR } from '@atlaskit/editor-common/is-ssr';

/**
 * ExcludeFromHydration component delays rendering of its children until after the initial
 * hydration phase. It renders the fallback during SSR/hydration and children after.
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

	if (!shouldRender) {
		return fallback ?? null;
	}

	return children;
}

export default ExcludeFromHydration;
