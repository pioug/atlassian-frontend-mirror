/* eslint-disable @atlaskit/design-system/ensure-design-token-usage, @atlaskit/ui-styling-standard/enforce-style-prop, @atlaskit/design-system/use-primitives-text, @atlaskit/design-system/use-heading, @atlaskit/design-system/no-html-anchor -- Legacy analytics-next docs intentionally use plain HTML prose, links, and inline styles after the docs helper cleanup. */
import React from 'react';

const warningStyles: React.CSSProperties = {
	backgroundColor: '#fffae6',
	border: '1px solid #f5cd47',
	borderRadius: 3,
	marginBottom: 16,
	padding: 16,
};

export default function Intro(): React.JSX.Element {
	return (
		<div>
			<div style={warningStyles}>
				<strong>Maintaince Mode: @atlaskit/analytics is in maintenance mode.</strong>
				<p>
					This package is officially in maintenance mode, which means only bugfixes or VULN fixes
					are currently being accepted and no known breaking changes will be approved in the PR
					process.
				</p>
				<p>
					Please refer to this{' '}
					<a
						href="https://hello.atlassian.net/wiki/spaces/APD/pages/2470435075/DACI+analytics-next+in+a+maintenance+mode"
						target="_blank"
						rel="noreferrer"
					>
						DACI
					</a>{' '}
					for more details.
				</p>
			</div>

			<p>
				This package aims to help assist consumers track the way their React components are being
				used.
			</p>

			<h3>Contents</h3>
			<ul>
				<li>
					<a href="./analytics-next/docs/concepts">Concepts</a> (Read first!)
				</li>
				<li>
					<a href="./analytics-next/docs/usage-with-presentational-components">
						Usage with presentational components
					</a>
				</li>
				<li>
					<a href="./analytics-next/docs/usage-for-container-components">
						Usage with container components
					</a>
				</li>
				<li>
					<a href="./analytics-next/docs/listeners">Listeners</a>
				</li>
				<li>
					<a href="./analytics-next/docs/error-boundary">Error Boundary</a>
				</li>
				<li>
					<a href="./analytics-next/docs/events">Events</a>
				</li>
				<li>
					<a href="./analytics-next/docs/advanced-usage">Advanced usage</a>
				</li>
				<li>
					<a href="./analytics-next/docs/upgrade-guide">Ugprade guide</a>
				</li>
			</ul>
		</div>
	);
}
