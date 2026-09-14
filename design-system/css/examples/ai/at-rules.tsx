import type ContainerQuery from '@atlaskit/css/at-rules/container';
import type KeyframesAtRule from '@atlaskit/css/at-rules/keyframes';
import type LayerAtRule from '@atlaskit/css/at-rules/layer';
import type MediaAboveLg from '@atlaskit/css/at-rules/media-above-lg';
import type MediaAboveMd from '@atlaskit/css/at-rules/media-above-md';
import type MediaAboveSm from '@atlaskit/css/at-rules/media-above-sm';
import type MediaAboveXl from '@atlaskit/css/at-rules/media-above-xl';
import type MediaAboveXs from '@atlaskit/css/at-rules/media-above-xs';
import type MediaAboveXxs from '@atlaskit/css/at-rules/media-above-xxs';
import type MediaBelowLg from '@atlaskit/css/at-rules/media-below-lg';
import type MediaBelowMd from '@atlaskit/css/at-rules/media-below-md';
import type MediaBelowSm from '@atlaskit/css/at-rules/media-below-sm';
import type MediaBelowXl from '@atlaskit/css/at-rules/media-below-xl';
import type MediaBelowXs from '@atlaskit/css/at-rules/media-below-xs';
import type MediaDarkMode from '@atlaskit/css/at-rules/media-dark-mode';
import type MediaForcedColorsActive from '@atlaskit/css/at-rules/media-forced-colors-active';
import type MediaForcedColorsOrLegacyHighContrast from '@atlaskit/css/at-rules/media-forced-colors-or-legacy-high-contrast';
import type MediaLegacyHighContrast from '@atlaskit/css/at-rules/media-legacy-high-contrast';
import type MediaLightMode from '@atlaskit/css/at-rules/media-light-mode';
import type MediaOnlyLg from '@atlaskit/css/at-rules/media-only-lg';
import type MediaOnlyMd from '@atlaskit/css/at-rules/media-only-md';
import type MediaOnlySm from '@atlaskit/css/at-rules/media-only-sm';
import type MediaOnlyXl from '@atlaskit/css/at-rules/media-only-xl';
import type MediaOnlyXs from '@atlaskit/css/at-rules/media-only-xs';
import type MediaOnlyXxs from '@atlaskit/css/at-rules/media-only-xxs';
import type MediaReducedMotion from '@atlaskit/css/at-rules/media-reduced-motion';
import type MediaReducedTransparency from '@atlaskit/css/at-rules/media-reduced-transparency';
import type PropertyAtRule from '@atlaskit/css/at-rules/property';
import type ScopeAtRule from '@atlaskit/css/at-rules/scope';
import type StartingStyleAtRule from '@atlaskit/css/at-rules/starting-style';
import type SupportsAtRule from '@atlaskit/css/at-rules/supports';
import type ViewTransitionAtRule from '@atlaskit/css/at-rules/view-transition';

const canonicalAtRules: Record<string, string> = {
	mediaAboveXxs: '@media all',
	mediaAboveXs: '@media (min-width: 30rem)',
	mediaAboveSm: '@media (min-width: 48rem)',
	mediaAboveMd: '@media (min-width: 64rem)',
	mediaAboveLg: '@media (min-width: 90rem)',
	mediaAboveXl: '@media (min-width: 110.5rem)',
	mediaBelowXs: '@media not all and (min-width: 30rem)',
	mediaBelowSm: '@media not all and (min-width: 48rem)',
	mediaBelowMd: '@media not all and (min-width: 64rem)',
	mediaBelowLg: '@media not all and (min-width: 90rem)',
	mediaBelowXl: '@media not all and (min-width: 110.5rem)',
	mediaOnlyXxs: '@media (min-width: 0rem) and (max-width: 29.99rem)',
	mediaOnlyXs: '@media (min-width: 30rem) and (max-width: 47.99rem)',
	mediaOnlySm: '@media (min-width: 48rem) and (max-width: 63.99rem)',
	mediaOnlyMd: '@media (min-width: 64rem) and (max-width: 89.99rem)',
	mediaOnlyLg: '@media (min-width: 90rem) and (max-width: 110.49rem)',
	mediaOnlyXl: '@media (min-width: 110.5rem)',
	mediaDarkMode: '@media (prefers-color-scheme: dark)',
	mediaLightMode: '@media (prefers-color-scheme: light)',
	mediaReducedMotion: '@media (prefers-reduced-motion: reduce)',
	mediaReducedTransparency: '@media (prefers-reduced-transparency: reduce)',
	mediaForcedColorsActive: '@media screen and (forced-colors: active)',
	mediaLegacyHighContrast: '@media screen and (-ms-high-contrast: active)',
	mediaForcedColorsOrLegacyHighContrast:
		'@media screen and (forced-colors: active), screen and (-ms-high-contrast: active)',
	container: '@container sidebar (width > 300px)',
	supports: '@supports (display: grid)',
	property: '@property --theme-color',
	layer: '@layer components',
	scope: '@scope (.article-body)',
	keyframes: '@keyframes fade-in',
	startingStyle: '@starting-style',
	viewTransition: '@view-transition',
} satisfies {
	mediaAboveXxs: MediaAboveXxs;
	mediaAboveXs: MediaAboveXs;
	mediaAboveSm: MediaAboveSm;
	mediaAboveMd: MediaAboveMd;
	mediaAboveLg: MediaAboveLg;
	mediaAboveXl: MediaAboveXl;
	mediaBelowXs: MediaBelowXs;
	mediaBelowSm: MediaBelowSm;
	mediaBelowMd: MediaBelowMd;
	mediaBelowLg: MediaBelowLg;
	mediaBelowXl: MediaBelowXl;
	mediaOnlyXxs: MediaOnlyXxs;
	mediaOnlyXs: MediaOnlyXs;
	mediaOnlySm: MediaOnlySm;
	mediaOnlyMd: MediaOnlyMd;
	mediaOnlyLg: MediaOnlyLg;
	mediaOnlyXl: MediaOnlyXl;
	mediaDarkMode: MediaDarkMode;
	mediaLightMode: MediaLightMode;
	mediaReducedMotion: MediaReducedMotion;
	mediaReducedTransparency: MediaReducedTransparency;
	mediaForcedColorsActive: MediaForcedColorsActive;
	mediaLegacyHighContrast: MediaLegacyHighContrast;
	mediaForcedColorsOrLegacyHighContrast: MediaForcedColorsOrLegacyHighContrast;
	container: ContainerQuery;
	supports: SupportsAtRule;
	property: PropertyAtRule;
	layer: LayerAtRule;
	scope: ScopeAtRule;
	keyframes: KeyframesAtRule;
	startingStyle: StartingStyleAtRule;
	viewTransition: ViewTransitionAtRule;
};

export default canonicalAtRules;
