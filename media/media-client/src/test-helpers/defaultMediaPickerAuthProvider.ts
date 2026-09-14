import type { Auth } from '@atlaskit/media-core/auth';

import { authProviderBaseURL } from './mediaPickerAuthProvider';

export const defaultMediaPickerAuthProvider: any = () => (): Promise<Auth> => {
	const auth: Auth = {
		clientId: 'a89be2a1-f91f-485c-9962-a8fb25ccfa13',
		token:
			'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJhODliZTJhMS1mOTFmLTQ4NWMtOTk2Mi1hOGZiMjVjY2ZhMTMiLCJ1bnNhZmUiOnRydWUsImlhdCI6MTQ3MzIyNTEzNn0.6Isj5jKgKzWDnPqfoMLiC_LVIlGM8kg_wxG6eGGwhTw',
		baseUrl: authProviderBaseURL,
	};

	return Promise.resolve(auth);
};
