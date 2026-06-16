/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { Fragment, lazy, memo, Suspense, useState } from 'react';
/* eslint-disable @typescript-eslint/consistent-type-imports, @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766; jsx required at runtime for @jsxRuntime classic */
import { jsx } from '@emotion/react';

import { CodeBlockSharedCssClassName } from '@atlaskit/editor-common/styles';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import { useInViewport } from '../../hooks/use-in-viewport';
import { useBidiWarnings } from '../../hooks/use-bidi-warnings';
import type { Props as CodeBlockProps } from './codeBlock';
import LightWeightCodeBlock from './components/lightWeightCodeBlock';
import CodeBlockContainer from './components/codeBlockContainer';

const LazyAkCodeBlock = lazy(
	// Ignored via go/ees005
	// eslint-disable-next-line require-await
	async () =>
		import(
			/* webpackChunkName: "@atlaskit-internal_renderer-codeBlock" */
			'@atlaskit/code/block'
		),
);

const joinWithSpaces = (...strs: (string | undefined)[]): string => strs.join(' ');

const MemoizedLightWeightCodeBlock = memo(LightWeightCodeBlock);

const WindowedCodeBlock = ({
	text,
	language,
	allowCopyToClipboard,
	allowDownloadCodeBlock,
	allowWrapCodeBlock = false,
	codeBidiWarningTooltipEnabled,
	hideLineNumbers = false,
	className: rootClassName,
	wrap,
}: CodeBlockProps): jsx.JSX.Element => {
	const { warningLabel } = useBidiWarnings({
		enableWarningTooltip: codeBidiWarningTooltipEnabled,
	});
	const { isInViewport, trackingRef } = useInViewport<HTMLDivElement>();
	const className = joinWithSpaces(CodeBlockSharedCssClassName.CODEBLOCK_CONTAINER, rootClassName);

	const memoizedLightWeightCodeBlock = (
		<MemoizedLightWeightCodeBlock
			ref={trackingRef}
			text={text}
			codeBidiWarningTooltipEnabled={codeBidiWarningTooltipEnabled}
			hideLineNumbers={
				expValEquals('platform_editor_code_block_q4_lovability', 'isEnabled', true) &&
				hideLineNumbers
			}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
			className={rootClassName}
		/>
	);

	const [wrapLongLines, setWrapLongLines] = useState<boolean>(
		() =>
			expValEquals('platform_editor_code_block_q4_lovability', 'isEnabled', true) && Boolean(wrap),
	);

	return isInViewport ? (
		<Fragment>
			<Suspense fallback={memoizedLightWeightCodeBlock}>
				<CodeBlockContainer
					allowCopyToClipboard={allowCopyToClipboard}
					allowWrapCodeBlock={allowWrapCodeBlock}
					allowDownloadCodeBlock={allowDownloadCodeBlock}
					language={language}
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
					className={className}
					setWrapLongLines={setWrapLongLines}
					text={text}
					wrapLongLines={wrapLongLines}
				>
					<LazyAkCodeBlock
						language={language}
						text={text}
						codeBidiWarningLabel={warningLabel}
						codeBidiWarningTooltipEnabled={codeBidiWarningTooltipEnabled}
						shouldWrapLongLines={allowWrapCodeBlock && wrapLongLines}
						shouldShowLineNumbers={
							!(
								expValEquals('platform_editor_code_block_q4_lovability', 'isEnabled', true) &&
								hideLineNumbers
							)
						}
						hasBidiWarnings={
							expValEquals('platform_editor_remove_bidi_char_warning', 'isEnabled', true)
								? false
								: undefined
						}
					/>
				</CodeBlockContainer>
			</Suspense>
		</Fragment>
	) : (
		memoizedLightWeightCodeBlock
	);
};

export default WindowedCodeBlock;
