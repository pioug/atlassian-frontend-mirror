/** @jsx jsx */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import { type ViewRelatedLinksActionProps } from './types';
import Action from '../action';
import { FormattedMessage } from 'react-intl-next';
import { messages } from '../../../../../messages';
import { useFlexibleUiContext } from '../../../../../state/flexible-ui-context';
import RelatedLinksActionIcon from './related-links-action-icon';
import { lazy, useCallback } from 'react';
import { useSmartLinkModal } from '../../../../../state/modal';

const RelatedLinksModal = lazy(
	() =>
		import(
			/* webpackChunkName: "@atlaskit-internal_smartcard-RelatedLinksModal" */ '../../../../RelatedLinksModal'
		),
);

const ViewRelatedLinksAction = ({
	onClick: onClickCallback,
	...props
}: ViewRelatedLinksActionProps) => {
	const modal = useSmartLinkModal();
	const context = useFlexibleUiContext();
	const actionData = context?.actions?.ViewRelatedLinksAction;

	const onClick = useCallback(() => {
		const url = actionData?.url;
		if (url) {
			modal.open(<RelatedLinksModal url={url} showModal={true} onClose={() => modal.close()} />);
		}

		onClickCallback?.();
	}, [actionData?.url, modal, onClickCallback]);

	return actionData ? (
		<Action
			content={<FormattedMessage {...messages.related_links_view_related_urls} />}
			icon={<RelatedLinksActionIcon />}
			onClick={onClick}
			testId="smart-action-view-related-links-action"
			ariaLabel="View most recent pages or content types coming from or found on this link"
			{...props}
		/>
	) : null;
};

export default ViewRelatedLinksAction;
