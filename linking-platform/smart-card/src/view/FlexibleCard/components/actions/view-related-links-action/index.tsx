/**
 * @jsxRuntime classic
 * @jsx jsx
 */
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
import { useAnalyticsEvents } from '../../../../../common/analytics/generated/use-analytics-events';

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
