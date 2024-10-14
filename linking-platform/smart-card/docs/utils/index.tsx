/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import { Prop, Props } from '@atlaskit/docs';

export const TabName = {
	Examples: 'Examples',
	FAQ: 'FAQ',
	Overview: 'Overview',
	Reference: 'Reference',
};

const sanitizeUrl = (path: string = '') => {
	try {
		const url = new URL(path);
		return url.toString();
	} catch {
		return 'about:blank';
	}
};

export const isRelativePath = (path: string = '') => path?.startsWith('./');

export const toAbsolutePath = (path: string = ''): string => {
	if (isRelativePath(path)) {
		const current = window.location.href;
		const parent = current.slice(0, current.lastIndexOf('/'));

		if (current.indexOf('/docs') === -1) {
			return sanitizeUrl(`${current}/docs/${path.replace('./', '')}`);
		}
		return sanitizeUrl(path.replace(path[0], parent));
	}
	return sanitizeUrl(path);
};

export const toExamplePath = (path: string = '') => {
	const current = window.location.href;
	const parent = current.slice(0, current.lastIndexOf('/docs'));
	const absolutePath = parent.replace('packages', 'examples') + `/${path}`;
	return sanitizeUrl(absolutePath);
};

export const navigateToUrl = (url: string) => {
	window.location.href = url;
};

export const overrideActionsProps = (props: Object) => (
	<Prop
		{...props}
		shapeComponent={() => (
			<div
				// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
				css={css({
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
					'> div, > div > div': {
						marginTop: 0,
					},
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
					h3: {
						display: 'none',
					},
				})}
			>
				<Props heading="" props={require('!!extract-react-types-loader!./props-actions')} />
			</div>
		)}
		type="arrayType"
	/>
);
