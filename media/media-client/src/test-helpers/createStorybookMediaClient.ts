import { MediaClient } from '..';
import type { AuthParameter } from './AuthParameter';
import { createStorybookMediaClientConfig } from './createStorybookMediaClientConfig';
import { defaultAuthParameter } from './defaultAuthParameter';

/**
 * Creates and returns `MediaClient` (from `media-client`) based on the data provided in parameter object.
 *
 * @param {AuthParameter} authParameter specifies serviceName and whatever auth should be done with clientId or asapIssuer
 * @returns {Context}
 */
export const createStorybookMediaClient = (
	authParameter: AuthParameter = defaultAuthParameter,
): MediaClient => {
	return new MediaClient(createStorybookMediaClientConfig(authParameter));
};
