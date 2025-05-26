import React from 'react';

import { ElementName } from '../../../../../constants';
import { useFlexibleUiContext } from '../../../../../state/flexible-ui-context';
import { BaseDateTimeElement, type BaseDateTimeElementProps, toDateTimeProps } from '../common';

export type SentOnProps = BaseDateTimeElementProps;

const SentOnElement = (props: SentOnProps): JSX.Element | null => {
	const context = useFlexibleUiContext();
	const data = context ? toDateTimeProps('sent', context.sentOn) : null;

	return data ? <BaseDateTimeElement {...data} {...props} name={ElementName.SentOn} /> : null;
};

export default SentOnElement;
