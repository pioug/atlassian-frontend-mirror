import React, { useMemo } from 'react';

import { useSmartCardContext } from '@atlaskit/link-provider';
import type { CardContext } from '@atlaskit/link-provider';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

export const WithCardContext = ({
	children,
	value,
}: {
	children: (cardContext: ReturnType<typeof useSmartCardContext>) => React.ReactNode;
	value?: CardContext;
}): React.JSX.Element => {
	const cardContext = useSmartCardContext();

	const cardContextWithValue = useMemo(() => {
		if (!expValEquals('platform_editor_editor_ssr_streaming', 'isEnabled', true)) {
			return cardContext;
		}

		return value
			? {
					...cardContext,
					value,
				}
			: cardContext;
	}, [value, cardContext]);

	return <>{children(cardContextWithValue)}</>;
};
