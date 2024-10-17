import { type FrontendExperimentsResponse } from '@atlaskit/feature-gate-fetcher';
import {
	FeatureGateEnvironment,
	type FrontendExperimentsResult,
} from '@atlaskit/feature-gate-js-client';

export const getFrontendExperimentsResult = (
	frontendExperimentsResponse: FrontendExperimentsResponse,
): FrontendExperimentsResult => {
	const {
		clientSdkKey,
		experimentValues,
		customAttributes: customAttributesFromFetch,
	} = frontendExperimentsResponse;
	return {
		clientSdkKey,
		experimentValues,
		customAttributesFromFetch,
	};
};

export const getValidatedPollingInterval = (
	currentInterval: number,
	environment: FeatureGateEnvironment,
	logInfo: boolean,
): number => {
	const prodMinInterval = 60000;
	const nonProdMinInterval = 1000;
	let newInterval = currentInterval;
	if (currentInterval < prodMinInterval) {
		if (environment === FeatureGateEnvironment.Production) {
			newInterval = prodMinInterval;
			if (logInfo) {
				// eslint-disable-next-line no-console
				console.info(
					`options.pollingInterval needs to be greater than ${prodMinInterval}, interval has been set to minimum`,
				);
			}
		} else if (currentInterval < nonProdMinInterval) {
			newInterval = nonProdMinInterval;
			if (logInfo) {
				// eslint-disable-next-line no-console
				console.info(
					`options.pollingInterval needs to be greater than ${nonProdMinInterval}, interval has been set to minimum`,
				);
			}
		} else {
			if (logInfo) {
				// eslint-disable-next-line no-console
				console.info(
					`options.pollingInterval needs to be greater than ${prodMinInterval} in Production`,
				);
			}
		}
	}
	return newInterval;
};

export const createHash = async (input: string): Promise<string> => {
	const msgUint8 = new TextEncoder().encode(input); // encode as (utf-8) Uint8Array
	const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgUint8); // hash the message
	const hashArray = Array.from(new Uint8Array(hashBuffer)); // convert buffer to byte array
	const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join(''); // convert bytes to hex string
	return hashHex;
};

export const cloneObject = <T>(obj: T): T => {
	const str = JSON.stringify(obj);
	return JSON.parse(str);
};
