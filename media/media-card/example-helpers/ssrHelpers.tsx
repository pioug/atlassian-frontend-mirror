import React, { useEffect, useMemo } from 'react';
import { hydrateRoot } from 'react-dom/client';
import ReactDOMServer from 'react-dom/server';
import { SSRAnalyticsWrapper } from '.';

export interface SimulateSsrParams extends React.DetailedHTMLProps<
	React.HTMLAttributes<HTMLDivElement>,
	HTMLDivElement
> {
	serverPage: React.ReactNode;
	hydratePage?: React.ReactNode;
}

const randomStr = () => Math.random().toString(36).substr(2, 9);
const generateSsrPageId = () => `media-ssr-page-${randomStr()}-${randomStr()}`;

export const SimulateSsr = ({
	serverPage,
	hydratePage,
	...divProps
}: SimulateSsrParams): React.JSX.Element => {
	const id = useMemo(generateSsrPageId, []);

	useEffect(() => {
		const txt = ReactDOMServer.renderToString(
			<SSRAnalyticsWrapper>{serverPage}</SSRAnalyticsWrapper>,
		);
		const elem = document.querySelector(`#${id}`);
		if (elem) {
			elem.innerHTML = txt;
			if (hydratePage) {
				hydrateRoot(elem, <SSRAnalyticsWrapper>{hydratePage}</SSRAnalyticsWrapper>);
			}
		}
	}, [id, hydratePage, serverPage]);

	// eslint-disable-next-line @atlaskit/design-system/prefer-primitives
	return <div id={id} {...divProps}></div>;
};
