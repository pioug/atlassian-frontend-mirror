import React, { useContext } from 'react';

import { useIntl } from 'react-intl-next';

import { IconType } from '../../../../../constants';
import { messages } from '../../../../../messages';
import { FlexibleUiContext } from '../../../../../state/flexible-ui-context';
import Badge from '../badge';
import type { BadgeProps } from '../badge/types';

const AppliedToComponentsCount = (props: BadgeProps) => {
	const { formatMessage } = useIntl();
	const context = useContext(FlexibleUiContext);

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

	return <Badge icon={IconType.Component} label={label} {...props} />;
};

export default AppliedToComponentsCount;
