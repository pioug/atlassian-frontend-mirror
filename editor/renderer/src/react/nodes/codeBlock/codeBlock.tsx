/** @jsx jsx */
import { useState } from 'react';
import { jsx } from '@emotion/react';
import type { WrappedComponentProps } from 'react-intl-next';
import { injectIntl } from 'react-intl-next';

import { CodeBlockSharedCssClassName } from '@atlaskit/editor-common/styles';
import { CodeBlock as AkCodeBlock } from '@atlaskit/code';
import type { SupportedLanguages } from '@atlaskit/code';
import { codeBidiWarningMessages } from '@atlaskit/editor-common/messages';

import CodeBlockContainer from './components/codeBlockContainer';

export interface Props {
	text: string;
	language: SupportedLanguages;
	allowCopyToClipboard?: boolean;
	allowWrapCodeBlock?: boolean;
	codeBidiWarningTooltipEnabled: boolean;
	className?: string;
}

function CodeBlock(props: Props & WrappedComponentProps) {
	const {
		text,
		language,
		allowCopyToClipboard = false,
		allowWrapCodeBlock = false,
		codeBidiWarningTooltipEnabled,
	} = props;

	const codeBidiWarningLabel = props.intl.formatMessage(codeBidiWarningMessages.label);

	const className = [CodeBlockSharedCssClassName.CODEBLOCK_CONTAINER, props.className].join(' ');

	const [wrapLongLines, setWrapLongLines] = useState<boolean>(false);

	return (
		<CodeBlockContainer
			allowCopyToClipboard={allowCopyToClipboard}
			allowWrapCodeBlock={allowWrapCodeBlock}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
			className={className}
			setWrapLongLines={setWrapLongLines}
			text={text}
			wrapLongLines={wrapLongLines}
		>
			<AkCodeBlock
				testId="renderer-code-block"
				language={language}
				text={text}
				codeBidiWarningLabel={codeBidiWarningLabel}
				codeBidiWarningTooltipEnabled={codeBidiWarningTooltipEnabled}
				shouldWrapLongLines={allowWrapCodeBlock && wrapLongLines}
			/>
		</CodeBlockContainer>
	);
}

export default injectIntl(CodeBlock);
