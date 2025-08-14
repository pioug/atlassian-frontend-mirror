import type { ReactNode } from 'react';
import React, { useCallback, useMemo } from 'react';

import { useSmartLinkActions } from '@atlaskit/smart-card/hooks';

type PreviewInvokerProps = {
	url: string;
	appearance: 'inline' | 'block' | 'embed';
	children: (api: { canPreview: boolean; invokePreview?: () => void }) => ReactNode;
};

export const PreviewInvoker = ({ url, appearance, children }: PreviewInvokerProps) => {
	const actions = useSmartLinkActions({ url, appearance });
	const preview = useMemo(
		() => actions.find((action) => action.id === 'preview-content'),
		[actions],
	);

	const invokePreview = useCallback(() => {
		try {
			preview?.invoke();
		} catch {}
	}, [preview]);

	return <>{children({ canPreview: !!preview, invokePreview })}</>;
};
