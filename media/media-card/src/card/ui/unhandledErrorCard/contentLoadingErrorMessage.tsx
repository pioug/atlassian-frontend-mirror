import React from 'react';

type ContentLoadingErrorMessageProps = {
	isHidden?: boolean;
};

export const ContentLoadingErrorMessage = ({
	isHidden,
}: ContentLoadingErrorMessageProps): React.JSX.Element => (
	// eslint-disable-next-line @atlaskit/design-system/use-primitives-text, @atlassian/i18n/no-literal-string-in-jsx
	<p style={{ display: isHidden ? 'none' : 'block' }}>We couldn't load this content</p>
);
