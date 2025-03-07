import React from 'react';

/**
 * By default the Atlaskit website includes css-reset in examples
 * when implementing css-reset in your application,
 * please include the stylesheet in head as `<link href="<path to css-reset>" rel="stylesheet" />`
 * or import '@atlaskit/css-reset' in your application code
 */
export default () => (
	<div data-testid="css-reset">
		<h1>Heading h1</h1>
		<h2>Heading h2</h2>
		<h3>Heading h3</h3>
		<h4>Heading h4</h4>
		<h5>Heading h5</h5>
		<h6>Heading h6</h6>
	</div>
);
