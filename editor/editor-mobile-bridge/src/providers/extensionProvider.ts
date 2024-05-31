import { type GasPurePayload, type GasPureScreenEventPayload } from '@atlaskit/analytics-gas-types';
import {
	type ExtensionManifest,
	DefaultExtensionProvider,
} from '@atlaskit/editor-common/extensions';
import { getConfluenceMobileMacroManifests } from '@atlaskit/legacy-mobile-macros';
import { createPromise } from '../cross-platform-promise';
import { eventDispatcher } from '../renderer/dispatcher';

export function createExtensionProvider(
	enableConfluenceMobileMacros: boolean,
	handleAnalyticsEvent: (event: GasPurePayload | GasPureScreenEventPayload) => void,
	onLinkClick?: Function,
) {
	let manifests: Promise<ExtensionManifest[]> = Promise.resolve([]);
	if (enableConfluenceMobileMacros) {
		manifests = Promise.all([
			manifests,
			getConfluenceMobileMacroManifests(
				createPromise,
				eventDispatcher,
				handleAnalyticsEvent,
				onLinkClick,
			),
		]).then((nested) => nested.flat());
	}

	return Promise.resolve(new DefaultExtensionProvider(manifests, []));
}
