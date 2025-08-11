import React, { type ReactNode, useEffect } from 'react';

import { App } from './drag-and-drop/jira/entry';

const FontScaleContainer = ({ children }: { children: ReactNode }) => {
	useEffect(() => {
		const rootElement = document.querySelector('html');
		if (rootElement) {
			// Matches Chrome's "very large" font size setting
			rootElement.style.fontSize = '24px';
		}
	}, []);

	return children;
};

const AppScaled = () => {
	return (
		<FontScaleContainer>
			<App />
		</FontScaleContainer>
	);
};

export default AppScaled;
