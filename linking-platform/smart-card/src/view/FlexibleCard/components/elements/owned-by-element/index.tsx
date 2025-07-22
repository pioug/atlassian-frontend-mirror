import React, { useEffect } from 'react';

import { fg } from '@atlaskit/platform-feature-flags';

import { ElementName } from '../../../../../constants';
import { messages } from '../../../../../messages';
import { useFlexibleUiContext } from '../../../../../state/flexible-ui-context';
import { BaseTextElement, type BaseTextElementProps, toFormattedTextProps } from '../common';

export type OwnedByElementProps = BaseTextElementProps & {
	textPrefix?: keyof Pick<typeof messages, 'owned_by' | 'owned_by_override'>;
	onRender?: (hasData: boolean) => void;
};

const OwnedByElement = (props: OwnedByElementProps): JSX.Element | null => {
	const context = useFlexibleUiContext();
	const { onRender, textPrefix = 'owned_by', ...restProps } = props || {};
	const data = context
		? toFormattedTextProps(
				fg('bandicoots-smart-card-teamwork-context') ? messages[textPrefix] : messages.owned_by,
				context?.ownedBy,
			)
		: null;

	useEffect(() => {
		onRender?.(!!data);
	}, [data, onRender]);

	return data ? <BaseTextElement {...data} {...restProps} name={ElementName.OwnedBy} /> : null;
};

export default OwnedByElement;
