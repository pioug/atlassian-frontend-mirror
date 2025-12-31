import type React from 'react';
import { useEffect, useState } from 'react';

import { isSSR } from '@atlaskit/editor-common/core-utils';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

/**
 * ExcludeFromHydration component delays rendering of its children until after the initial
 * hydration phase, based on a feature flag check. If the feature flag is disabled,
 * it will render children immediately after hydration.
 * @param param0
 * @returns
 */
function ExcludeFromHydration({ children }: { children: React.ReactNode }): React.ReactNode {
	const [shouldRender, setShouldRender] = useState(false);

	useEffect(() => {
		if (isSSR()) {
			return;
		}
		setShouldRender(true);
	}, []);

	if (expValEquals('platform_editor_hydratable_ui', 'isEnabled', true) && !shouldRender) {
		return null;
	}

	return children;
}

export default ExcludeFromHydration;
