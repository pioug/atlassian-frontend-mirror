import { useEffect, useState } from 'react';

import type { Auth, MediaClientConfig } from '@atlaskit/media-core';
import { createStorybookMediaClientConfig } from '@atlaskit/media-test-helpers';

export const useMockMediaConfig = (): MediaClientConfig | null => {
	const [config, setConfig] = useState<MediaClientConfig | null>(null);
	useEffect(() => {
		let cancelled = false;
		const base = createStorybookMediaClientConfig();
		base.authProvider().then((initialAuth: Auth) => {
			if (!cancelled) {
				setConfig({ ...base, initialAuth });
			}
		});
		return () => {
			cancelled = true;
		};
	}, []);
	return config;
};
