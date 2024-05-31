import React from 'react';
import { injectIntl, type WrappedComponentProps } from 'react-intl-next';
import AkCode from '@atlaskit/code/inline';
import { codeBidiWarningMessages } from '@atlaskit/editor-common/messages';
import { type Mark } from '@atlaskit/editor-prosemirror/model';

import type { MarkProps } from '../types';

export const isCodeMark = (mark: Mark): boolean => {
	return mark && mark.type && mark.type.name === 'code';
};

export function CodeWithIntl(
	props: MarkProps<{ codeBidiWarningTooltipEnabled: boolean }> & WrappedComponentProps,
) {
	const codeBidiWarningLabel = props.intl.formatMessage(codeBidiWarningMessages.label);

	return (
		<AkCode
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
			className="code"
			codeBidiWarningLabel={codeBidiWarningLabel}
			codeBidiWarningTooltipEnabled={props.codeBidiWarningTooltipEnabled}
			{...props.dataAttributes}
		>
			{props.children}
		</AkCode>
	);
}
export default injectIntl(CodeWithIntl);
