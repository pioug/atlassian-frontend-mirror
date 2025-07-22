import React, { useEffect } from 'react';

import { ElementName } from '../../../../../constants';
import { useFlexibleUiContext } from '../../../../../state/flexible-ui-context';
import { BaseDateTimeElement, type BaseDateTimeElementProps, toDateTimeProps } from '../common';

export type ModifiedOnProps = BaseDateTimeElementProps & {
	onRender?: (hasData: boolean) => void;
};

const ModifiedOnElement = (props: ModifiedOnProps): JSX.Element | null => {
	const context = useFlexibleUiContext();
	const data = context ? toDateTimeProps('modified', context.modifiedOn) : null;
	const { onRender, ...restProps } = props || {};

	useEffect(() => {
		onRender?.(!!data);
	}, [data, onRender]);

	return data ? (
		<BaseDateTimeElement {...data} {...restProps} name={ElementName.ModifiedOn} />
	) : null;
};

export default ModifiedOnElement;
