import { setBooleanFeatureFlagResolver } from '@atlaskit/platform-feature-flags/setBooleanFeatureFlagResolver';

/**
 * These demos require the new grid as well as ChatPanel. Enable it before any
 * children render, including PanelProvider's initial width selection.
 *
 * The examples website renders each demo in its own iframe and supplies the
 * toolbar's selected flags as repeated featureFlag query parameters. Preserve
 * those selections instead of switching off unrelated flags in the demo.
 * This setup is example-only; it does not enable the production rollout.
 */
export function enableChatPanelLayout(): void {
	const selectedFlags = new Set(
		typeof window === 'undefined'
			? []
			: new URLSearchParams(window.location.search).getAll('featureFlag'),
	);
	selectedFlags.add('platform-dst-chat-panel-layout');
	setBooleanFeatureFlagResolver((flag) => selectedFlags.has(flag));
}
