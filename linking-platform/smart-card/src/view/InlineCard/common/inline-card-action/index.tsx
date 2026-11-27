import React, { useMemo } from 'react';

import { usePlugins } from '@atlaskit/link-provider/use-plugins';
import { fg } from '@atlaskit/platform-feature-flags/fg';

import extractRemixAction from '../../../../extractors/flexible/actions/extract-remix-action';
import useInlineTailoredAction from '../../../../state/hooks/use-inline-tailored-actions';
import { useSmartCardState } from '../../../../state/store';
import type { InternalCardActionOptions } from '../../../Card/types';
import InlineRemixAction from '../remix-action';
import { InlineRovoActionButton } from '../rovo-actions-cta';

type InlineCardActionProps = {
	actionOptions?: InternalCardActionOptions;
	id?: string;
	showHoverPreview?: boolean;
	testId?: string;
	url?: string;
};

const InlineChatAction = ({
	actionOptions,
	showHoverPreview,
	testId,
	url,
}: InlineCardActionProps) => {
	const { isEnabled } = useInlineTailoredAction(url, showHoverPreview, actionOptions);
	return isEnabled ? (
		<InlineRovoActionButton
			actionOptions={actionOptions}
			testId={`${testId}-rovo-actions-cta`}
			url={url}
		/>
	) : null;
};

const InlineCardActionWithRemix = (props: InlineCardActionProps) => {
	const { actionOptions, id, testId, url } = props;
	const { remix } = usePlugins();
	const { details } = useSmartCardState(url ?? '');
	const data = useMemo(
		() =>
			details
				? extractRemixAction({
						response: details,
						url,
						actionOptions,
						remix,
						appearance: 'inline',
						id,
					})
				: undefined,
		[details, url, actionOptions, remix, id],
	);

	// Inline cards have one action slot. Eligible Remix takes priority over chat.
	return data && remix ? (
		<InlineRemixAction data={data} remix={remix} testId={`${testId}-remix-action`} />
	) : (
		<InlineChatAction {...props} />
	);
};

export const InlineCardAction = ({
	testId = 'inline-card',
	...props
}: InlineCardActionProps): React.JSX.Element | null =>
	fg('platform_sl_3p_auth_visualize_killswitch') ? (
		<InlineCardActionWithRemix {...props} testId={testId} />
	) : (
		<InlineChatAction {...props} testId={testId} />
	);
