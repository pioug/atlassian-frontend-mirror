/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx, css } from '@emotion/react';
import type { ReactNode } from 'react';
import type { CodeBlockButtonContainerProps } from './codeBlockButtonContainer';

import { N20 } from '@atlaskit/theme/colors';
import { CodeBlockSharedCssClassName } from '@atlaskit/editor-common/styles';

import { fg } from '@atlaskit/platform-feature-flags';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';
import { token } from '@atlaskit/tokens';

import CodeBlockButtonContainer from './codeBlockButtonContainer';

const codeBlockStyleOverrides = css({
	tabSize: 4,
	backgroundColor: token('elevation.surface.raised', N20),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	button: {
		opacity: 0,
		transition: 'opacity 0.2s ease 0s',
	},
	'&:hover': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		button: {
			opacity: 1,
		},
	},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values
	[`${CodeBlockSharedCssClassName.DS_CODEBLOCK}`]: {
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
		fontSize: `${14 / 16}rem`,
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
		lineHeight: '1.5rem',
		backgroundImage: `linear-gradient(
			to right,
			${token('color.background.neutral')} ${token('space.300', '24px')},
			transparent ${token('space.300', '24px')}
			),linear-gradient(
			to right,
			${token('elevation.surface.raised')} ${token('space.300', '24px')},
			transparent ${token('space.300', '24px')}
			),linear-gradient(
			to left,
			${token('color.background.neutral')} ${token('space.100', '8px')},
			transparent ${token('space.100', '8px')}
			),linear-gradient(
			to left,
			${token('elevation.surface.raised')} ${token('space.100', '8px')},
			transparent ${token('space.100', '8px')}
			),linear-gradient(
			to left,
			${token('elevation.shadow.overflow.spread')} 0,
			${token('utility.UNSAFE.transparent')}  ${token('space.100', '8px')}
			),linear-gradient(
			to left,
			${token('elevation.shadow.overflow.perimeter')} 0,
			${token('utility.UNSAFE.transparent')}  ${token('space.100', '8px')}
			),linear-gradient(
			to right,
			${token('elevation.shadow.overflow.spread')} 0,
			${token('utility.UNSAFE.transparent')}  ${token('space.100', '8px')}
			),linear-gradient(
			to right,
			${token('elevation.shadow.overflow.perimeter')} 0,
			${token('utility.UNSAFE.transparent')}  ${token('space.100', '8px')}
			)`,
		backgroundAttachment: 'local, local, local, local, scroll, scroll, scroll, scroll',
		backgroundPosition: '0 0, 0 0, 100% 0, 100% 0, 100% 0, 100% 0, 0 0, 0 0',
	},
});

const denseModeOverrides = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values
	[`${CodeBlockSharedCssClassName.DS_CODEBLOCK}`]: {
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
		fontSize: '0.875em',
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
		lineHeight: '1.5em',
	},
});

interface ContainerProps extends CodeBlockButtonContainerProps {
	children: ReactNode;
	className?: string;
	localId?: string;
}

const CodeBlockContainer = ({
	allowCopyToClipboard,
	allowWrapCodeBlock,
	children,
	className,
	localId,
	setWrapLongLines,
	text,
	wrapLongLines,
}: ContainerProps) => {
	return (
		<div
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
			className={className}
			data-local-id={localId}
			css={[
				codeBlockStyleOverrides,
				(expValEquals('confluence_compact_text_format', 'isEnabled', true) ||
					(expValEquals('cc_editor_ai_content_mode', 'variant', 'test') &&
						fg('platform_editor_content_mode_button_mvp'))) &&
					denseModeOverrides,
			]}
		>
			<CodeBlockButtonContainer
				allowCopyToClipboard={allowCopyToClipboard}
				allowWrapCodeBlock={allowWrapCodeBlock}
				setWrapLongLines={setWrapLongLines}
				text={text}
				wrapLongLines={wrapLongLines}
			/>
			{children}
		</div>
	);
};

export default CodeBlockContainer;
