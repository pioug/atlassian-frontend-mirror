import React from 'react';
import { injectIntl } from 'react-intl';
import type { WithIntlProps, WrappedComponentProps } from 'react-intl';
import AkCode from '@atlaskit/code/code';
import { codeBidiWarningMessages } from '@atlaskit/editor-common/messages';
import type { Mark } from '@atlaskit/editor-prosemirror/model';

import type { MarkMeta, MarkProps } from '../types';

export const isCodeMark = (mark: Mark): boolean => {
	return mark && mark.type && mark.type.name === 'code';
};

export function CodeWithIntl(
	props: MarkProps<{ codeBidiWarningTooltipEnabled: boolean }> & WrappedComponentProps,
): React.JSX.Element {
	const codeBidiWarningLabel = props.intl.formatMessage(codeBidiWarningMessages.label);

	return (
		<AkCode
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
			className="code"
			codeBidiWarningLabel={codeBidiWarningLabel}
			codeBidiWarningTooltipEnabled={props.codeBidiWarningTooltipEnabled}
			// Ignored via go/ees005
			// eslint-disable-next-line react/jsx-props-no-spreading
			{...props.dataAttributes}
		>
			{props.children}
		</AkCode>
	);
}
// eslint-disable-next-line @typescript-eslint/no-restricted-types
const _default_1: React.FC<
	WithIntlProps<
		{
			codeBidiWarningTooltipEnabled: boolean;
		} & MarkMeta & {
				children?: React.ReactNode | undefined;
			} & WrappedComponentProps
	>
> & {
	WrappedComponent: React.ComponentType<
		{
			codeBidiWarningTooltipEnabled: boolean;
		} & MarkMeta & {
				children?: React.ReactNode | undefined;
			} & WrappedComponentProps
	>;
} = injectIntl(CodeWithIntl);
export default _default_1;
