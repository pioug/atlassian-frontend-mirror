import { useCallback } from 'react';
import { useSmartLinkClientExtension } from '@atlaskit/link-client-extension';
import { useSmartLinkContext } from '@atlaskit/link-provider';
import type { InvokeRequest } from '@atlaskit/linking-types/smart-link-actions';

const useInvoke = () => {
	const { connections } = useSmartLinkContext();
	const clientExt = useSmartLinkClientExtension(connections.client);

	return useCallback(
		async (req: InvokeRequest, cb?: Function) => {
			const response = await clientExt.invoke(req);

			return cb ? cb(response) : response;
		},
		[clientExt],
	);
};

export default useInvoke;
