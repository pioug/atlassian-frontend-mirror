/** @jsx jsx */
import { useLayoutEffect, useRef, useState } from 'react';

import { jsx } from '@emotion/react';

import Button from '@atlaskit/button/new';
import CopyIcon from '@atlaskit/icon/glyph/copy';
import Tooltip from '@atlaskit/tooltip';

const copyMessages = {
	prompt: 'Copy to clipboard',
	success: 'Copied!',
};

const CopyButton = ({ content, label }: { content: string | (() => string); label: string }) => {
	const [isCopied, setIsCopied] = useState<boolean>(false);

	function onCopy() {
		// Ensure focus is on iFrame
		const iframe = window.parent.document.querySelector('iframe');
		if (!iframe) {
			return;
		}
		iframe.contentWindow?.focus();

		navigator.clipboard.writeText(typeof content === 'string' ? content : content());

		// Show success message
		setIsCopied(true);
		setTimeout(() => setIsCopied(false), 1000);
	}

	// There is a bug with tooltip where it doesn't center correctly
	// when the text is changed.
	const updateTooltip = useRef<() => void>();
	useLayoutEffect(() => {
		updateTooltip.current?.();
	}, [isCopied]);
	return (
		<Tooltip
			content={({ update }) => {
				updateTooltip.current = update;
				return isCopied ? copyMessages.success : copyMessages.prompt;
			}}
			position="top"
			delay={0}
		>
			{({ onClick, ...tooltipProps }) => (
				<Button
					iconBefore={CopyIcon}
					onClick={(e) => {
						onClick(e);
						onCopy();
					}}
					{...tooltipProps}
				>
					{label}
				</Button>
			)}
		</Tooltip>
	);
};

export default CopyButton;
