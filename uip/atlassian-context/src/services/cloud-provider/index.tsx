import {
	BIFROST_ATL_CTX_CLOUD_SERVICE_PROVIDER,
	CLOUD_SERVICE_PROVIDER_GCP,
} from '../../common/constants';
import { getRawCookieValue } from '../../common/utils/cookies';

/**
 * Determines if the current environment is running on GCP (Google Cloud Platform).
 *
 * This is determined by reading the `Bifrost-Atl-Ctx-Cloud-Service-Provider` cookie,
 * which Bifrost sets to `GCP` when running on GCP and `AWS` when running on AWS.
 *
 * @returns {boolean} True if the current environment is running on GCP, false otherwise.
 */
export function isGoogleCloudPlatform(): boolean {
	if (typeof document === 'undefined') {
		// @ts-ignore
		return globalThis.ssrContext?.isInGCP ?? false;
	}

	try {
		const cookies = globalThis.document.cookie;
		const cloudServiceProvider = getRawCookieValue(BIFROST_ATL_CTX_CLOUD_SERVICE_PROVIDER, cookies);

		return cloudServiceProvider === CLOUD_SERVICE_PROVIDER_GCP;
	} catch (e) {
		return false;
	}
}
