import React, { useEffect } from 'react';
import { IntlProvider } from 'react-intl-next';
import ReactDOM from 'react-dom';
import Loadable from 'react-loadable';
import type { MediaClientConfig } from '@atlaskit/media-core';
import type { SSR } from '@atlaskit/media-common';
import { defaultSchema } from '@atlaskit/adf-schema/schema-default';
import ReactDOMServer from 'react-dom/server';
import { default as Renderer } from '../../ui/Renderer';
import { createStorybookMediaClientConfig } from '@atlaskit/media-client/test-helpers';
import { adfMediaSingleAndMediaGroupFiles } from './__fixtures__';

const getMediaClientConfig = async () => {
	const mediaClientConfig = createStorybookMediaClientConfig();
	const initialAuth = await mediaClientConfig.authProvider();
	return {
		...mediaClientConfig,
		initialAuth,
	};
};

type PageProps = {
	ssr: SSR;
	title: string;
	mediaClientConfig: MediaClientConfig;
};

const Page = ({ ssr, title, mediaClientConfig }: PageProps) => {
	return (
		// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
		<div style={{ width: 1200 }}>
			{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
			<div style={{ display: 'flex', justifyContent: 'center' }}>
				<h3>{title}</h3>
			</div>
			<IntlProvider locale="en">
				<Renderer
					document={adfMediaSingleAndMediaGroupFiles}
					schema={defaultSchema}
					appearance="full-page"
					enableSsrInlineScripts={true}
					media={{
						ssr: {
							mode: ssr,
							config: mediaClientConfig, // TODO: update example to use Media Mock https://product-fabric.atlassian.net/browse/MEX-1260
						},
					}}
				/>
			</IntlProvider>
		</div>
	);
};

const runSSR = async (containerId: string, hydrate?: boolean) => {
	const mediaClientConfig = await getMediaClientConfig();
	const txt = ReactDOMServer.renderToString(
		<Page ssr="server" title={'Renderer SSR Only'} mediaClientConfig={mediaClientConfig} />,
	);
	const elem = document.querySelector(`#${containerId}`);

	if (elem) {
		elem.innerHTML = txt;
		hydrate &&
			ReactDOM.hydrate(
				<Page
					ssr="client"
					title={'Renderer SSR + Hydration'}
					mediaClientConfig={mediaClientConfig}
				/>,
				elem,
			);
	}
};

export const MediaSSR = () => {
	const serverOnlyId = 'container-ssr';
	const hydrationId = 'container-hydration';
	useEffect(() => {
		Loadable.preloadAll().then(() => {
			runSSR(serverOnlyId);
			runSSR(hydrationId, true);
		});
	}, []);

	return (
		<div>
			<div id={serverOnlyId}></div>
			<div id={hydrationId}></div>
		</div>
	);
};
