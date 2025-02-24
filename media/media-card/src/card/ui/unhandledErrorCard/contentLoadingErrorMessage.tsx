import React from 'react';

type ContentLoadingErrorMessageProps = {
	isHidden?: boolean;
};

export const ContentLoadingErrorMessage = ({ isHidden }: ContentLoadingErrorMessageProps) => (
	// eslint-disable-next-line @atlaskit/design-system/use-primitives-text
	<p style={{ display: isHidden ? 'none' : 'block' }}>We couldn't load this content</p>
);
