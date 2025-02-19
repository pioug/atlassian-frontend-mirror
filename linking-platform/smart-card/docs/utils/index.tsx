/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { css, jsx } from '@compiled/react';

import { Prop, Props } from '@atlaskit/docs';

export const TabName = {
	Examples: 'Examples',
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
	const docsIdx = current.lastIndexOf('/docs');
	const parent = docsIdx === -1 ? current : current.slice(0, docsIdx);
	const absolutePath = `${parent.replace('packages', 'examples')}/${path}`;
	return sanitizeUrl(absolutePath);
};

export const toPackagePath = (group: string, packageName: string) => {
	const origin = window.location.origin;
	return sanitizeUrl(`${origin}/packages/${group}/${packageName}`);
};

export const navigateToUrl = (url: string) => {
	window.location.href = url;
};

export const openUrl = (url: string) => {
	window.open(url, '_blank');
};

const divStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'> div, > div > div': {
		marginTop: 0,
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	h3: {
		display: 'none',
	},
});

export const overrideActionsProps = (props: Object) => (
	<Prop
		{...props}
		shapeComponent={() => (
			<div css={divStyles}>
				<Props heading="" props={require('!!extract-react-types-loader!../props/props-actions')} />
			</div>
		)}
		type="arrayType"
	/>
);
