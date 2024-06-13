/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { Prop, Props } from '@atlaskit/docs';

export const TabName = {
	Examples: 'Examples',
	Reference: 'Reference',
};

export const toAbsolutePath = (path?: string) => {
	if (path?.startsWith('./')) {
		const current = window.location.href;
		const parent = current.slice(0, current.lastIndexOf('/'));
		return path.replace(path[0], parent);
	}
	return path;
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
