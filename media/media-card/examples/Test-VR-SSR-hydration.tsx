import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import Loadable from 'react-loadable';
import { type MediaClientConfig } from '@atlaskit/media-core';
import { type SSR } from '@atlaskit/media-common';
import {
	createStorybookMediaClientConfig,
	imageFileId,
	videoFileId,
} from '@atlaskit/media-test-helpers';
import { token } from '@atlaskit/tokens';
import { Card } from '../src/card';
import ReactDOMServer from 'react-dom/server';

import { MainWrapper, SSRAnalyticsWrapper } from '../example-helpers';

const dimensions = { width: 300, height: 200 };

const getMediaClientConfig = async () => {
	const mediaClientConfig = createStorybookMediaClientConfig();
	const initialAuth = await mediaClientConfig.authProvider();
	return {
		...mediaClientConfig,
		initialAuth,
	};
};

const modes = {
	single: {
		resizeMode: 'stretchy-fit' as const,
		disableOverlay: true,
	},
	video: {
		resizeMode: 'stretchy-fit' as const,
		disableOverlay: true,
	},
	group: {
		disableOverlay: false,
	},
};

const Page = ({
	ssr,
	title,
	mode,
	mediaClientConfig,
}: {
	ssr: SSR;
	title: string;
	mode: 'single' | 'video' | 'group';
	mediaClientConfig: MediaClientConfig;
}) => {
	return (
		<SSRAnalyticsWrapper>
			<h3>{title}</h3>
			<Card
				mediaClientConfig={mediaClientConfig}
				identifier={mode === 'video' ? videoFileId : imageFileId}
				dimensions={dimensions}
				ssr={ssr}
				useInlinePlayer={true}
				shouldOpenMediaViewer={true}
				{...modes[mode]}
			/>
		</SSRAnalyticsWrapper>
	);
};

const runSSR = async (
	containerId: string,
	mode: 'single' | 'video' | 'group',
	hydrate?: boolean,
) => {
	const mediaClientConfig = await getMediaClientConfig();
	const txt = ReactDOMServer.renderToString(
		<Page ssr="server" title={'SSR Only'} mode={mode} mediaClientConfig={mediaClientConfig} />,
	);
	const elem = document.querySelector(`#${containerId}`);

	if (elem) {
		elem.innerHTML = txt;
		hydrate &&
			ReactDOM.hydrate(
				<Page
					ssr="client"
					title={'SSR + Hydration'}
					mode={mode}
					mediaClientConfig={mediaClientConfig}
				/>,
				elem,
			);
	}
};

const rowStyle = {
	display: 'flex',
	flexDirection: 'row',
	marginBottom: token('space.250', '20px'),
} as const;

export default (): React.JSX.Element => {
	const serverOnlySingleId = 'container-ssr-single';
	const serverOnlyVideoId = 'container-ssr-video';
	const serverOnlyGroupId = 'container-ssr-group';
	const hydrationSingleId = 'container-hydration-single';
	const hydrationVideoId = 'container-hydration-video';
	const hydrationGroupId = 'container-hydration-group';
	useEffect(() => {
		Loadable.preloadAll().then(() => {
			runSSR(serverOnlySingleId, 'single');
			runSSR(hydrationSingleId, 'single', true);
			runSSR(serverOnlyVideoId, 'video');
			runSSR(hydrationVideoId, 'video', true);
			runSSR(serverOnlyGroupId, 'group');
			runSSR(hydrationGroupId, 'group', true);
		});
	}, []);

	return (
		<div
			style={{
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				maxWidth: 1300,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				margin: 'auto',
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				marginTop: token('space.250', '20px'),
			}}
		>
			<MainWrapper developmentOnly>
				<h2>Media Single</h2>
				{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
				<div style={rowStyle}>
					<div
						// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
						style={{ marginRight: token('space.250', '20px') }}
						id={serverOnlySingleId}
					></div>
					<div
						// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
						style={{ marginRight: token('space.250', '20px') }}
						id={hydrationSingleId}
					></div>
				</div>
				<hr role="presentation" />
				<h2>Media Video</h2>
				{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
				<div style={rowStyle}>
					<div
						// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
						style={{ marginRight: token('space.250', '20px') }}
						id={serverOnlyVideoId}
					></div>
					<div
						// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
						style={{ marginRight: token('space.250', '20px') }}
						id={hydrationVideoId}
					></div>
				</div>
				<hr role="presentation" />
				<h2>Media Group</h2>
				{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
				<div style={rowStyle}>
					<div
						// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
						style={{ marginRight: token('space.250', '20px') }}
						id={serverOnlyGroupId}
					></div>
					<div
						// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
						style={{ marginRight: token('space.250', '20px') }}
						id={hydrationGroupId}
					></div>
				</div>
			</MainWrapper>
		</div>
	);
};
