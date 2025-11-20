import React, { lazy, useCallback } from 'react';

import { FormattedMessage } from 'react-intl-next';

import { useAnalyticsEvents } from '../../../../../common/analytics/generated/use-analytics-events';
import { messages } from '../../../../../messages';
import { useFlexibleUiContext } from '../../../../../state/flexible-ui-context';
import { useSmartLinkModal } from '../../../../../state/modal';
import Action from '../action';

import RelatedLinksActionIcon from './related-links-action-icon';
import { type ViewRelatedLinksActionProps } from './types';

const RelatedLinksModal = lazy(
	() =>
		import(
			/* webpackChunkName: "@atlaskit-internal_smartcard-RelatedLinksModal" */ '../../../../RelatedLinksModal'
		),
);

const ViewRelatedLinksAction = ({
	onClick: onClickCallback,
	...props
}: ViewRelatedLinksActionProps): React.JSX.Element | null => {
	const modal = useSmartLinkModal();
	const context = useFlexibleUiContext();
	const actionData = context?.actions?.ViewRelatedLinksAction;
	const { fireEvent } = useAnalyticsEvents();

	const onClick = useCallback(() => {
		const ari = actionData?.ari;
		if (ari) {
			modal.open(<RelatedLinksModal ari={ari} showModal={true} onClose={() => modal.close()} />);
		}

		fireEvent('ui.button.clicked.relatedLinks', {});

		onClickCallback?.();
	}, [actionData?.ari, fireEvent, modal, onClickCallback]);

	return actionData ? (
		<Action
			content={<FormattedMessage {...messages.related_links_view_related_links} />}
			icon={<RelatedLinksActionIcon />}
			onClick={onClick}
			testId="smart-action-view-related-links-action"
			ariaLabel="View most recent pages or content types coming from or found on this link"
			{...props}
		/>
	) : null;
};

export default ViewRelatedLinksAction;
