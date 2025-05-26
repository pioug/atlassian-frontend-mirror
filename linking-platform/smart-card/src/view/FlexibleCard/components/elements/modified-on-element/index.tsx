import React from 'react';

import { ElementName } from '../../../../../constants';
import { useFlexibleUiContext } from '../../../../../state/flexible-ui-context';
import { BaseDateTimeElement, type BaseDateTimeElementProps, toDateTimeProps } from '../common';

export type ModifiedOnProps = BaseDateTimeElementProps;

const ModifiedOnElement = (props: ModifiedOnProps): JSX.Element | null => {
	const context = useFlexibleUiContext();
	const data = context ? toDateTimeProps('modified', context.modifiedOn) : null;

	return data ? <BaseDateTimeElement {...data} {...props} name={ElementName.ModifiedOn} /> : null;
};

export default ModifiedOnElement;
