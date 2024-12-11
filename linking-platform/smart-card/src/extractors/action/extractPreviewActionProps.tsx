import { ActionName } from '../../constants';
import { type InvokeClientActionProps } from '../../state/hooks/use-invoke-client-action/types';
import { openEmbedModal } from '../../view/EmbedModal/utils';
import { type ExtractActionsProps } from '../common/actions/types';
import { extractPreviewAction as extractPreviewActionData } from '../flexible/actions/extract-preview-action';

/**
 * TODO: Remove on cleanup of platform-smart-card-migrate-embed-modal-analytics
 * Replaced with platform/packages/linking-platform/smart-card/src/extractors/action/extract-invoke-preview-action.ts
 */
export const extractPreviewActionProps = ({
	response,
	analytics,
	extensionKey = 'empty-object-provider',
	source = 'block',
	actionOptions,
	origin,
}: ExtractActionsProps): InvokeClientActionProps | undefined => {
	const data = extractPreviewActionData(response, actionOptions);

	if (data?.src) {
		return {
			actionType: ActionName.PreviewAction,
			actionFn: () =>
				openEmbedModal({
					download: data?.downloadUrl,
					showModal: true,
					onClose: () => {},
					analytics,
					extensionKey,
					origin,
					...data,
				}),
			// These values have already been set in analytics context.
			// We only pass these here for ufo experience.
			display: source,
			extensionKey,
		};
	}
};
