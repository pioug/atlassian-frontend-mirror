/** @jsx jsx */
import { css, Global, jsx } from '@emotion/react';

const globalStyles = css({
	'.ProseMirror-widget:first-child + *': {
		marginTop: '0 !important',
	},
});

export const GlobalStylesWrapper = () => {
	return <Global styles={globalStyles} />;
};
