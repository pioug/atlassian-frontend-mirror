import React from 'react';

const CustomGlyph = () => (
	<svg width="24" height="24" fill="none" viewBox="0 0 24 24">
		<g fill="currentColor" clipPath="url(#clip0_654_431)">
			<path
				d="M20 4h-1v16h1V4ZM3 8a1 1 0 0 1 1-1h9.5a4.5 4.5 0 1 1 0 9h-2.086l.293.293a1 1 0 0 1-1.414 1.414l-2-2a1 1 0 0 1 0-1.414l2-2a1 1 0 0 1 1.414 1.414l-.293.293H13.5a2.5 2.5 0 0 0 0-5H4a1 1 0 0 1-1-1Z"
				clipRule="evenodd"
				fillRule="evenodd"
			/>
		</g>
	</svg>
);

export const WrapIcon = (): React.JSX.Element => {
	// eslint-disable-next-line @atlassian/i18n/no-literal-string-in-jsx
	return <CustomGlyph aria-label="wrapIcon" />;
};
