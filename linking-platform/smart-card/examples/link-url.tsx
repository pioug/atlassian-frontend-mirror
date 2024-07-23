/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import LinkUrl from '../src/view/LinkUrl';
import { token } from '@atlaskit/tokens';

export default () => {
	return (
		<div
			// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
			css={{
				margin: `${token('space.600', '48px')} auto`,
				width: '50%',
			}}
		>
			<h1>{`<LinkURL />`}</h1>
			<p>
				<a
					href={'https://atlaskit.atlassian.com/packages/linking-platform/smart-card/docs/LinkUrl'}
					title={'LinkUrl documentation'}
				>
					Documentation
				</a>
			</p>
			<h2>Link safety warning</h2>
			<ul>
				<li>
					Link description is a URL and it's different from a destination.
					<br />
					<LinkUrl href="https://www.google.com/">atlassian.com</LinkUrl>
				</li>
			</ul>
			<h2>No link safety warning</h2>
			<ul>
				<li>
					Link description is a plain text.
					<br />
					<LinkUrl href="https://www.google.com/">Here is a google link</LinkUrl>
				</li>
				<li>
					Link description is a URL identical to a destination.
					<br />
					<LinkUrl href="https://www.atlassian.com/solutions/devops">
						https://www.atlassian.com/solutions/devops
					</LinkUrl>
				</li>
				<li>
					Link is a multi-line URL.
					<br />
					<LinkUrl href="https://www.atlassian.com/solutions/devops">
						<p>Help</p>
						<a>https://www.atlassian.com/solutions/devops</a>
					</LinkUrl>
				</li>
				<li>
					Link is a multi-line URL.
					<br />
					<LinkUrl href="https://hello.atlassian.com/wiki">
						<div>Help</div>
						<span>https://hello.atlas...</span>
					</LinkUrl>
				</li>
			</ul>
		</div>
	);
};
