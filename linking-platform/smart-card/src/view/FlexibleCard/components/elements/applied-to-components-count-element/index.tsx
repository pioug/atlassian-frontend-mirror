import React from 'react';

import { useIntl } from 'react-intl-next';

import { IconType } from '../../../../../constants';
import { messages } from '../../../../../messages';
import { useFlexibleUiContext } from '../../../../../state/flexible-ui-context';
import { BaseBadgeElement, type BaseBadgeElementProps } from '../common';

export type AppliedToComponentsCountElementProps = BaseBadgeElementProps;

const AppliedToComponentsCountElement = (
	props: AppliedToComponentsCountElementProps,
): JSX.Element | null => {
	const { formatMessage } = useIntl();
	const context = useFlexibleUiContext();

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
