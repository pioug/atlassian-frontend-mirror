import { type JsonLd } from '@atlaskit/json-ld-types';
import {
	extractLink,
	extractPreview,
	extractProvider,
	extractProviderIcon,
	extractTitle,
	extractUrlFromIconJsonLd,
	type LinkPreview,
	type LinkProvider,
} from '@atlaskit/link-extractors';

import { type CardPlatform, type EmbedIframeUrlType } from '../../view/Card/types';
import { type EmbedCardResolvedViewProps } from '../../view/EmbedCard/views/ResolvedView';
import { prioritiseIcon } from '../common/icon';
import { extractIsSupportTheming } from '../common/meta/extractIsSupportTheming';
import { extractIsTrusted } from '../common/meta/extractIsTrusted';

const extractEmbedPreview = (
	jsonLd: JsonLd.Data.BaseData,
	platform?: CardPlatform,
	iframeUrlType?: EmbedIframeUrlType,
): (LinkPreview & { src: string }) | undefined => {
	const preview = extractPreview(jsonLd, platform, iframeUrlType);
	if (preview && preview.src) {
		return { ...preview, src: preview.src };
	}
};

function generateContext(jsonLd: JsonLd.Data.BaseData): LinkProvider | undefined {
	const provider = extractProvider(jsonLd);
	if (!provider) {
		return undefined;
	}

	// If no icon is supplied, return existing context
	if (!jsonLd.icon) {
		return provider;
	}

	const generator = jsonLd.generator;

	const icon: React.ReactNode = prioritiseIcon<React.ReactNode>({
		fileFormatIcon: undefined,
		documentTypeIcon: undefined,
		urlIcon: extractUrlFromIconJsonLd(jsonLd.icon),
		// We still attempt to follow the icon priority function even if no generator (and therefore provider icon) is defined
		providerIcon:
			generator &&
			typeof generator !== 'string' &&
			generator['@type'] !== 'Link' &&
			extractProviderIcon(generator.icon),
	});

	return {
		...provider,
		icon: icon ? icon : provider.icon,
	};
}

export const extractEmbedProps = (
	jsonLd: JsonLd.Data.BaseData,
	meta?: JsonLd.Meta.BaseMeta,
	platform?: CardPlatform,
	iframeUrlType?: EmbedIframeUrlType,
): EmbedCardResolvedViewProps => ({
	link: extractLink(jsonLd) || '',
	title: extractTitle(jsonLd),
	context: generateContext(jsonLd),
	preview: extractEmbedPreview(jsonLd, platform, iframeUrlType),
	isTrusted: extractIsTrusted(meta),
	isSupportTheming: extractIsSupportTheming(meta),
});
