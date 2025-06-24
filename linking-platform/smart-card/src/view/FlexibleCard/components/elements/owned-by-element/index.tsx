import React, { useEffect } from 'react';

import { fg } from '@atlaskit/platform-feature-flags';

import { ElementName } from '../../../../../constants';
import { messages } from '../../../../../messages';
import { useFlexibleUiContext } from '../../../../../state/flexible-ui-context';
import { type FlexibleUiDataContext } from '../../../../../state/flexible-ui-context/types';
import { BaseTextElement, type BaseTextElementProps, toFormattedTextProps } from '../common';

export type OwnedByElementProps = BaseTextElementProps & {
	/**
	 * The text prefix to display before the owned by text.
	 * Best used when hideFormat is enabled
	 */
	textPrefix?: string;
	onRender?: (hasData: boolean) => void;
};

const getOwnedByText = (context: FlexibleUiDataContext, textPrefix: string | undefined) => {
	if (!fg('bandicoots-smart-card-teamwork-context')) {
		return context.ownedBy;
	}
	return textPrefix ? `${textPrefix} ${context.ownedBy}`.trim() : context.ownedBy;
};

const OwnedByElement = (props: OwnedByElementProps): JSX.Element | null => {
	const context = useFlexibleUiContext();
	const data = context
		? toFormattedTextProps(messages.owned_by, getOwnedByText(context, props?.textPrefix))
		: null;

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
