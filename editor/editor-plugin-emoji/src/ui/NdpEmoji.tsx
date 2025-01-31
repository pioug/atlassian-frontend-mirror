/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { Fragment } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled
import { css, jsx } from '@emotion/react';
import { useIntl } from 'react-intl-next';

import { messages } from '@atlaskit/editor-common/emoji';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { type EmojiNodeDataProvider } from '@atlaskit/node-data-provider/emoji-provider';
import { useNodeDataProviderGet } from '@atlaskit/node-data-provider/plugin-hooks';

import { LoadableSimpleEmoji, LoadableSimpleEmojiPlaceholder } from './LoadableSimpleEmoji';

export function NdpEmoji(props: { node: PMNode; emojiNodeDataProvider: EmojiNodeDataProvider }) {
	const emojiNode = props.node as PMNode & {
		attrs: { readonly id: string; readonly shortName: string; readonly text: string };
	};

	const value = useNodeDataProviderGet({
		node: emojiNode,
		provider: props.emojiNodeDataProvider,
	});

	if (value.state === 'loading') {
		return (
			<EmojiCommonWrapper emojiNode={emojiNode}>
				<LoadableSimpleEmojiPlaceholder shortName={emojiNode.attrs.shortName} />
			</EmojiCommonWrapper>
		);
	}

	if (value.state === 'failed') {
		return (
			<EmojiCommonWrapper emojiNode={emojiNode}>
				<Fragment>{emojiNode.attrs.text || emojiNode.attrs.shortName}</Fragment>
			</EmojiCommonWrapper>
		);
	}

	return (
		<EmojiCommonWrapper emojiNode={emojiNode}>
			<LoadableSimpleEmoji emojiDescription={value.result} />
		</EmojiCommonWrapper>
	);
}

const clickSelectWrapperStyle = css({
	userSelect: 'all',
});

const EmojiAssistiveTextComponent = React.memo(({ emojiShortName }: { emojiShortName: string }) => {
	const intl = useIntl();
	return (
		// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop, @atlaskit/design-system/use-tokens-typography -- Ignored via go/DSP-18766
		<span style={{ fontSize: 0 }}>
			{`${intl.formatMessage(messages.emojiNodeLabel)} ${emojiShortName}`}
		</span>
	);
});

function EmojiCommonWrapper({
	emojiNode,
	children,
}: {
	emojiNode: PMNode & {
		attrs: { readonly id: string; readonly shortName: string; readonly text: string };
	};
	children: React.ReactNode;
}) {
	return (
		<Fragment>
			<EmojiAssistiveTextComponent emojiShortName={emojiNode.attrs.shortName} />
			<span>
				<span css={clickSelectWrapperStyle}>
					<span
						data-emoji-id={emojiNode.attrs.id}
						data-emoji-short-name={emojiNode.attrs.shortName}
						data-emoji-text={emojiNode.attrs.text || emojiNode.attrs.shortName}
					>
						{children}
					</span>
				</span>
			</span>
		</Fragment>
	);
}
