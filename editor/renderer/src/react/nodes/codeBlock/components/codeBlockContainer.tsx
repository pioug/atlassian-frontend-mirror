/** @jsx jsx */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx, css } from '@emotion/react';
import type { ReactNode } from 'react';
import type { CodeBlockButtonContainerProps } from './codeBlockButtonContainer';

import { overflowShadow, relativeFontSizeToBase16 } from '@atlaskit/editor-shared-styles';
import { N20 } from '@atlaskit/theme/colors';
import { fontSize } from '@atlaskit/theme/constants';
import { CodeBlockSharedCssClassName } from '@atlaskit/editor-common/styles';

import { token } from '@atlaskit/tokens';

import CodeBlockButtonContainer from './codeBlockButtonContainer';

// eslint-disable-next-line @atlaskit/design-system/no-css-tagged-template-expression, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
const codeBlockStyleOverrides = css`
	tab-size: 4;
	background-color: ${token('elevation.surface.raised', N20)};

	&:hover {
		button {
			opacity: 1;
		}
	}

	button {
		opacity: 0;
		transition: opacity 0.2s ease 0s;
	}

	${CodeBlockSharedCssClassName.DS_CODEBLOCK} {
		font-size: ${relativeFontSizeToBase16(fontSize())};
		line-height: 1.5rem;
		background-image: ${overflowShadow({
			leftCoverWidth: token('space.300', '24px'),
		})};
		background-attachment: local, local, local, local, scroll, scroll, scroll, scroll;
		background-position:
			0 0,
			0 0,
			100% 0,
			100% 0,
			100% 0,
			100% 0,
			0 0,
			0 0;
	}
`;

interface ContainerProps extends CodeBlockButtonContainerProps {
	children: ReactNode;
	className?: string;
}

const CodeBlockContainer = ({
	allowCopyToClipboard,
	allowWrapCodeBlock,
	children,
	className,
	setWrapLongLines,
	text,
	wrapLongLines,
}: ContainerProps) => {
	return (
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
		<div className={className} css={codeBlockStyleOverrides}>
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
