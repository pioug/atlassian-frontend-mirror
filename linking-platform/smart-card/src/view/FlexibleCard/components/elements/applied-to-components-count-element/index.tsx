import React, { useContext } from 'react';

import { useIntl } from 'react-intl-next';

import { fg } from '@atlaskit/platform-feature-flags';

import { IconType } from '../../../../../constants';
import { messages } from '../../../../../messages';
import { FlexibleUiContext, useFlexibleUiContext } from '../../../../../state/flexible-ui-context';
import { BaseBadgeElement, type BaseBadgeElementProps } from '../common';

export type AppliedToComponentsCountElementProps = BaseBadgeElementProps;

const AppliedToComponentsCountElement = (
	props: AppliedToComponentsCountElementProps,
): JSX.Element | null => {
	const { formatMessage } = useIntl();
	const context = fg('platform-linking-flexible-card-context')
		? // eslint-disable-next-line react-hooks/rules-of-hooks
			useFlexibleUiContext()
		: // eslint-disable-next-line react-hooks/rules-of-hooks
			useContext(FlexibleUiContext);

	if (
		// Check for null and undefined, render if it's 0.
		context?.appliedToComponentsCount === null ||
		context?.appliedToComponentsCount === undefined
	) {
		return null;
	}

	const label = formatMessage(messages.compass_applied_components_count, {
		numberOfComponents: context.appliedToComponentsCount,
	});

	return <BaseBadgeElement icon={IconType.Component} label={label} {...props} />;
};

export default AppliedToComponentsCountElement;
