import React, { useEffect } from 'react';

import { fg } from '@atlaskit/platform-feature-flags';

import { ElementName, IconType } from '../../../../../constants';
import { useFlexibleUiContext } from '../../../../../state/flexible-ui-context';
import { BaseBadgeElement, type BaseBadgeElementProps, toBadgeProps } from '../common';

export type ReactCountElementProps = BaseBadgeElementProps & {
	onRender?: (hasData: boolean) => void;
};

const ReactCountElement = (props: ReactCountElementProps): JSX.Element | null => {
	const context = useFlexibleUiContext();
	const data = context ? toBadgeProps(context.reactCount?.toString()) : null;

	const { onRender, ...restProps } = props || {};
	// eslint-disable-next-line @atlaskit/platform/ensure-feature-flag-prefix
	if (fg('platform-linking-additional-flexible-element-props')) {
		// eslint-disable-next-line react-hooks/rules-of-hooks
		useEffect(() => {
			onRender?.(!!data);
		}, [data, onRender]);
	}

	return data ? (
		<BaseBadgeElement
			icon={IconType.React}
			{...data}
			{...restProps}
			name={ElementName.ReactCount}
		/>
	) : null;
};

export default ReactCountElement;
