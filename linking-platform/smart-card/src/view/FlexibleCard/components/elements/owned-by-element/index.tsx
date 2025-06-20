import React, { useEffect } from 'react';

import { fg } from '@atlaskit/platform-feature-flags';

import { ElementName } from '../../../../../constants';
import { messages } from '../../../../../messages';
import { useFlexibleUiContext } from '../../../../../state/flexible-ui-context';
import { BaseTextElement, type BaseTextElementProps, toFormattedTextProps } from '../common';

export type OwnedByElementProps = BaseTextElementProps & {
	onRender?: (hasData: boolean) => void;
};

const OwnedByElement = (props: OwnedByElementProps): JSX.Element | null => {
	const context = useFlexibleUiContext();
	const data = context ? toFormattedTextProps(messages.owned_by, context.ownedBy) : null;

	const { onRender, ...restProps } = props || {};
	// eslint-disable-next-line @atlaskit/platform/ensure-feature-flag-prefix
	if (fg('platform-linking-additional-flexible-element-props')) {
		// eslint-disable-next-line react-hooks/rules-of-hooks
		useEffect(() => {
			onRender?.(!!data);
		}, [data, onRender]);
	}

	return data ? <BaseTextElement {...data} {...restProps} name={ElementName.OwnedBy} /> : null;
};

export default OwnedByElement;
