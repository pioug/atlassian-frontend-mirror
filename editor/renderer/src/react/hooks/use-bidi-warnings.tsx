import React, { type ReactNode } from 'react';
import { useIntl } from 'react-intl-next';

import CodeBidiWarning from '@atlaskit/code/bidi-warning';
import { codeBidiWarningMessages } from '@atlaskit/editor-common/messages';
import codeBidiWarningDecorator from '@atlaskit/code/bidi-warning-decorator';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

interface Config {
	enableWarningTooltip: boolean;
}

interface Result {
	renderBidiWarnings: (text: string) => ReactNode;
	warningLabel: string;
}

export const useBidiWarnings = ({ enableWarningTooltip = true }: Config): Result => {
	const intl = useIntl();
	const warningLabel = intl.formatMessage(codeBidiWarningMessages.label);
	const renderBidiWarnings = (text: string): ReactNode => {
		if (expValEquals('platform_editor_remove_bidi_char_warning', 'isEnabled', true)) {
			return text;
		}

		return codeBidiWarningDecorator<ReactNode>(text, ({ bidiCharacter, index }) => (
			<CodeBidiWarning
				bidiCharacter={bidiCharacter}
				key={index}
				label={warningLabel}
				tooltipEnabled={enableWarningTooltip}
			/>
		));
	};
	return { renderBidiWarnings, warningLabel };
};
