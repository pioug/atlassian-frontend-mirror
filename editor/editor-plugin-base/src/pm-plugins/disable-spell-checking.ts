import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type {
	Browsers,
	DisableSpellcheckByBrowser,
	FeatureFlags,
} from '@atlaskit/editor-common/types';
import { browser as browserEnv } from '@atlaskit/editor-common/utils';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';

function getCurrentBrowserAndVersion():
	| {
			browser: Browsers;
			version: number;
	  }
	| undefined {
	switch (true) {
		case browserEnv.chrome === true:
			return { browser: 'chrome', version: browserEnv.chrome_version };
		case browserEnv.ie === true:
			return { browser: 'ie', version: browserEnv.ie_version };
		case browserEnv.gecko === true:
			return { browser: 'gecko', version: browserEnv.gecko_version };
		case browserEnv.safari === true:
			return { browser: 'safari', version: browserEnv.safari_version };
	}
	return undefined;
}

export default (featureFlags: FeatureFlags) =>
	new SafePlugin({
		key: new PluginKey('disableSpellchecking'),
		props: {
			attributes: (editorState: EditorState) => {
				if (!featureFlags) {
					return {};
				}
				const browserConfigFeatureFlag: DisableSpellcheckByBrowser | undefined =
					featureFlags.disableSpellcheckByBrowser;

				const userCurrentBrowserAndVersion = getCurrentBrowserAndVersion();
				if (!userCurrentBrowserAndVersion || !browserConfigFeatureFlag) {
					return {};
				}

				const browserVersionDisableRange =
					browserConfigFeatureFlag[userCurrentBrowserAndVersion!.browser];

				if (!browserVersionDisableRange || !browserEnv[userCurrentBrowserAndVersion.browser]) {
					return {};
				}

				const shouldDisableSpellcheck = !!browserVersionDisableRange.maximum
					? userCurrentBrowserAndVersion.version >= browserVersionDisableRange.minimum &&
						userCurrentBrowserAndVersion.version <= browserVersionDisableRange.maximum
					: browserEnv[userCurrentBrowserAndVersion.browser] &&
						userCurrentBrowserAndVersion.version >= browserVersionDisableRange.minimum;

				if (shouldDisableSpellcheck) {
					return { spellcheck: 'false' } as Record<'spellcheck', 'false'>;
				}

				return {};
			},
		},
	});
