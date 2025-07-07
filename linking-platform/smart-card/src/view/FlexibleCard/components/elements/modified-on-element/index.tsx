import React, { useEffect } from 'react';

import { fg } from '@atlaskit/platform-feature-flags';

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
	// eslint-disable-next-line @atlaskit/platform/ensure-feature-flag-prefix
	if (fg('platform-linking-additional-flexible-element-props')) {
		// eslint-disable-next-line react-hooks/rules-of-hooks
		useEffect(() => {
			onRender?.(!!data);
		}, [data, onRender]);
	}

	return data ? (
		<BaseDateTimeElement {...data} {...restProps} name={ElementName.ModifiedOn} />
	) : null;
};

export default ModifiedOnElement;
