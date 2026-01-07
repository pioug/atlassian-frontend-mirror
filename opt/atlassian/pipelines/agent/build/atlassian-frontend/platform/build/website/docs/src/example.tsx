/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import React, { useCallback, useState } from 'react';
import { token } from '@atlaskit/tokens';
import CodeBlock from '@atlaskit/code/block';
import type { SupportedLanguages } from '@atlaskit/code/types';
import ToggleIcon from '@atlaskit/icon/core/angle-brackets';
import { ErrorBoundary } from './error-boundary';
import { replaceSrc } from './replace-src';
import { cssMap, jsx } from '@compiled/react';
import { Pressable, Text } from '@atlaskit/primitives/compiled';

const wrapperStyles = cssMap({
	root: {
		backgroundColor: token('color.background.neutral'),
		borderRadius: token('radius.medium'),
		boxSizing: 'border-box',
		color: token('color.text.subtle'),
		marginBlockStart: token('space.250'),
		maxWidth: 'calc(100vw - 4rem)',
		display: 'flex',
		flexDirection: 'column',
	},
});

const contentWrapperStyles = cssMap({
	root: {
		display: 'flex',
		flexDirection: 'column',
		gap: token('space.100'),
		paddingBlockStart: token('space.100'),
		paddingBlockEnd: token('space.100'),
		paddingInlineStart: token('space.100'),
		paddingInlineEnd: token('space.100'),
	},
	hidden: {
		display: 'none',
	},
});

const toggleStyles = cssMap({
	root: {
		alignItems: 'center',
		cursor: 'pointer',
		display: 'flex',
		justifyContent: 'space-between',
		paddingBlockStart: token('space.100'),
		paddingBlockEnd: token('space.100'),
		paddingInlineStart: token('space.100'),
		paddingInlineEnd: token('space.100'),
		backgroundColor: token('color.background.neutral'),
		borderRadius: token('radius.small'),
		'&:hover': {
			backgroundColor: token('color.background.neutral.hovered'),
		},
		'&:active': {
			backgroundColor: token('color.background.neutral.pressed'),
		},
	},
});

const showcaseWrapperStyles = cssMap({
	root: {
		backgroundColor: token('color.background.neutral'),
		borderRadius: token('radius.small'),
		boxShadow: '0 0 0 1px rgba(0, 0, 0, 0.1)',
		paddingBlockStart: token('space.100'),
		paddingBlockEnd: token('space.100'),
		paddingInlineStart: token('space.100'),
		paddingInlineEnd: token('space.100'),
	},
});

type Props = {
	/**
	 * The component to render in the example.
	 */
	Component: React.ComponentType;
	/**
	 * The source code for the component.
	 */
	source: string;
	/**
	 * The language of the source code, for syntax highlighting.
	 */
	language?: SupportedLanguages;
	/**
	 * The title of the example. Used as the label for the source codetoggle button.
	 */
	title?: string;
	/**
	 * The name of the package demonstrated in the example. Used to replace relative references
	 * in the example code.
	 */
	packageName?: string;
	/**
	 * The `@atlaskit/code` CodeBlock highlight prop.
	 *
	 * @see https://atlassian.design/components/code/code-block/code#highlight
	 */
	highlight?: string;
	/**
	 * Whether the source code is visible by default.
	 * Defaults to `false`.
	 */
	isDefaultSourceVisible?: boolean;
	/**
	 * Controls what content can be visible. Note that the source code can still be toggled
	 * by clicking the toggle button, or through controlling the `sourceVisible` prop.
	 *
	 * Default is `showcase-and-source` which shows both the showcase and source code.
	 * `source-only` only shows the source code.
	 */
	appearance?: 'showcase-and-source' | 'source-only';
	onToggleSource?: () => void;
};

export function Example({
	Component,
	source,
	language = 'javascript',
	title,
	packageName,
	highlight = '',
	isDefaultSourceVisible = false,
	appearance = 'showcase-and-source',
	onToggleSource,
}: Props) {
	const [isSourceVisible, setIsSourceVisible] = useState(isDefaultSourceVisible);

	const handleToggleSource = useCallback(() => {
		if (onToggleSource) {
			onToggleSource();
		} else {
			setIsSourceVisible(!isSourceVisible);
		}
	}, [onToggleSource, isSourceVisible]);

	const onError = (error: Error, info: React.ErrorInfo) => {
		console.error(error);
		console.error(info);
	};

	const isContentVisible = appearance === 'source-only' ? isSourceVisible : true;

	return (
		<div css={wrapperStyles.root}>
			<Pressable
				xcss={toggleStyles.root}
				onClick={handleToggleSource}
				aria-expanded={isSourceVisible}
			>
				<Text weight="semibold">{title}</Text>
				<ToggleIcon spacing="spacious" label="" />
			</Pressable>

			<div css={[contentWrapperStyles.root, !isContentVisible && contentWrapperStyles.hidden]}>
				{isSourceVisible ? (
					<CodeBlock
						text={packageName ? replaceSrc(source, packageName) : source}
						language={language}
						showLineNumbers={false}
						highlight={highlight}
					/>
				) : null}

				{appearance === 'showcase-and-source' ? (
					<div css={showcaseWrapperStyles.root}>
						<ErrorBoundary onError={onError}>
							<Component />
						</ErrorBoundary>
					</div>
				) : null}
			</div>
		</div>
	);
}
