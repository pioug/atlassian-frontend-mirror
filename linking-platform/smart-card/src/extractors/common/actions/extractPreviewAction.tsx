import { type JsonLd } from 'json-ld-types';
import { type InvokeClientOpts } from '../../../model/invoke-opts';
import { CardAction, type CardInnerAppearance, type CardPlatform } from '../../../view/Card/types';

import { extractDownloadUrl } from '../detail';
import { extractPreview, extractProvider } from '@atlaskit/link-extractors';
import { type BlockCardResolvedViewProps, PreviewAction } from '../../../view/BlockCard';
import { type ExtractBlockOpts } from '../../block/types';
import { CardDisplay } from '../../../constants';
import { extractIsSupportTheming } from '../../common/meta/extractIsSupportTheming';
import { canShowAction } from '../../../utils/actions/can-show-action';

const getMetadataFromJsonLd = (jsonLd: JsonLd.Data.BaseData, platform?: CardPlatform) => {
	const download = extractDownloadUrl(jsonLd as JsonLd.Data.Document);
	const provider = extractProvider(jsonLd);
	const preview = extractPreview(jsonLd, platform);

	return {
		download,
		providerName: provider && provider.text,
		src: preview && preview.src,
	};
};

const getMetadataFromResolvedProps = (props: BlockCardResolvedViewProps) => ({
	/* It's fine for content to be undefined, but src is still needed for the link out, even if it's not the source for the iframing */
	link: props.link,
	title: props.title,
	details: props.details,
	icon: props.icon,
	url: props.link,
	byline: props.byline,
	isTrusted: props.isTrusted,
});

const getInvokeOpts = (
	key: string,
	action: string,
	source?: CardInnerAppearance,
): InvokeClientOpts => ({
	type: 'client' as const,
	key,
	// NB: the preview action is invoked from a block card -
	// the actions on the preview state are invoked from the
	// preview card. Hence, we have a `source` for distinguishing
	// between the two.
	source: source || CardDisplay.EmbedPreview,
	action: {
		type: action,
		promise: () => Promise.resolve(),
	},
});

export const extractPreviewAction = ({
	extensionKey = 'empty-object-provider',
	viewProps,
	jsonLd,
	handleInvoke,
	testId,
	platform,
	origin,
	source = 'block',
	analytics,
	meta,
	actionOptions,
}: ExtractBlockOpts & {
	viewProps: BlockCardResolvedViewProps;
	jsonLd: JsonLd.Data.BaseData;
	platform?: CardPlatform;
	meta?: JsonLd.Meta.BaseMeta;
}) => {
	if (!canShowAction(CardAction.PreviewAction, actionOptions)) {
		return;
	}

	// Extract metadata from view props & raw JSON-LD.
	const metadataFromJsonLd = getMetadataFromJsonLd(jsonLd, platform);
	const metadataFromViewProps = getMetadataFromResolvedProps(viewProps);
	const metadata = {
		...metadataFromJsonLd,
		...metadataFromViewProps,
	};
	// Extract preview action only if we have an iframe src.
	if (metadataFromJsonLd.src) {
		// Build action using instrumentation hooks.
		const key = extensionKey;
		const previewAction = PreviewAction({
			...metadata,
			analytics,
			extensionKey,
			origin,
			testId,
			isSupportTheming: extractIsSupportTheming(meta),
		});
		// Setup props to go through proper Redux 'invocation' flow
		// for analytics, further state management if required in future.
		const previewActionProps = getInvokeOpts(key, 'PreviewAction', source);
		// - Promise invoked by the action invocation handler; open preview.
		previewActionProps.action.promise = previewAction.promise;
		// - Promise invoked on click of `Preview` on block card; trigger above promise.
		previewAction.promise = () => handleInvoke(previewActionProps);
		return previewAction;
	}
};
