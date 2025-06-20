import React from 'react';

/**
 * Adds a responsive viewport meta tag. Useful for examples that need to be responsive based on viewport size.
 * https://developer.mozilla.org/en-US/docs/Web/HTML/Viewport_meta_tag
 *
 * This can be cleaned up once the Gemini platform is updated to support responsive scaling - https://hello.jira.atlassian.cloud/browse/UTEST-1686
 */
export const WithResponsiveViewport = ({ children }: { children: React.ReactNode }) => (
	<>
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		{children}
	</>
);
