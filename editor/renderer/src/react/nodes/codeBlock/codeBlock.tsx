/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useState, type ComponentType, type FC } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import type { WithIntlProps, WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';

import AkCodeBlock from '@atlaskit/code/code-block';
import type { SupportedLanguages } from '@atlaskit/code/constants';
import { CodeBlockSharedCssClassName } from '@atlaskit/editor-common/styles';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import CodeBlockContainer from './components/codeBlockContainer';

export interface Props {
	allowCopyToClipboard?: boolean;
	allowDownloadCodeBlock?: boolean;
	allowWrapCodeBlock?: boolean;
	className?: string;
	codeBidiWarningTooltipEnabled: boolean;
	hideLineNumbers?: boolean;
	language: SupportedLanguages;
	localId?: string;
	text: string;
	wrap?: boolean;
}

function CodeBlock(props: Props & WrappedComponentProps) {
	const {
		text,
		language,
		allowCopyToClipboard = false,
		allowWrapCodeBlock = false,
		allowDownloadCodeBlock = false,
		codeBidiWarningTooltipEnabled,
		hideLineNumbers = false,
		localId,
		wrap,
	} = props;

	const className = [CodeBlockSharedCssClassName.CODEBLOCK_CONTAINER, props.className].join(' ');

	const [wrapLongLines, setWrapLongLines] = useState<boolean>(
		() =>
			expValEquals('platform_editor_code_block_q4_lovability', 'isEnabled', true) && Boolean(wrap),
	);

	return (
		<CodeBlockContainer
			allowCopyToClipboard={allowCopyToClipboard}
			allowWrapCodeBlock={allowWrapCodeBlock}
			allowDownloadCodeBlock={allowDownloadCodeBlock}
			language={language}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
			className={className}
			localId={localId}
			setWrapLongLines={setWrapLongLines}
			text={text}
			wrapLongLines={wrapLongLines}
		>
			<AkCodeBlock
				testId="renderer-code-block"
				language={language}
				text={text}
				codeBidiWarningTooltipEnabled={codeBidiWarningTooltipEnabled}
				shouldWrapLongLines={allowWrapCodeBlock && wrapLongLines}
				shouldShowLineNumbers={
					!(
						expValEquals('platform_editor_code_block_q4_lovability', 'isEnabled', true) &&
						hideLineNumbers
					)
				}
				hasBidiWarnings={false}
			/>
		</CodeBlockContainer>
	);
}

const _default_1: FC<WithIntlProps<Props & WrappedComponentProps>> & {
	WrappedComponent: ComponentType<Props & WrappedComponentProps>;
} = injectIntl(CodeBlock);
export default _default_1;
