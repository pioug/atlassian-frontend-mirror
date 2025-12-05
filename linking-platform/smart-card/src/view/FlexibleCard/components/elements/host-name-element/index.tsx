import React from 'react';

import { ElementName } from '../../../../../constants';
import { useFlexibleCardContext } from '../../../../../state/flexible-ui-context';
import { BaseTextElement, type BaseTextElementProps } from '../common';

export type HostNameElementProps = BaseTextElementProps;

const HostNameElement = (props: HostNameElementProps): JSX.Element | null => {
	const context = useFlexibleCardContext();
	const hostName = context?.data?.hostName;
	return hostName ? (
		<BaseTextElement content={hostName} {...props} name={ElementName.HostName} />
	) : null;
};

export default HostNameElement;
