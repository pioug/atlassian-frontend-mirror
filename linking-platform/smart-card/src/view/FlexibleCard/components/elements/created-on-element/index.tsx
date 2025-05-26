import React from 'react';

import { ElementName } from '../../../../../constants';
import { useFlexibleUiContext } from '../../../../../state/flexible-ui-context';
import { BaseDateTimeElement, type BaseDateTimeElementProps, toDateTimeProps } from '../common';

export type CreatedOnProps = BaseDateTimeElementProps;

const CreatedOnElement = (props: CreatedOnProps): JSX.Element | null => {
	const context = useFlexibleUiContext();
	const data = context ? toDateTimeProps('created', context.createdOn) : null;

	return data ? <BaseDateTimeElement {...data} {...props} name={ElementName.CreatedOn} /> : null;
};

export default CreatedOnElement;
