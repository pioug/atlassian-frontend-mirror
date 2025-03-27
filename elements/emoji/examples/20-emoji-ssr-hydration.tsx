import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import Loadable from 'react-loadable';
import ReactDOMServer from 'react-dom/server';
import { renderEmoji } from './00-simple-emoji';
import EmojiPickerWithUpload from './05-standard-emoji-picker-with-upload';
import { getRealEmojiProvider } from '../example-helpers/demo-resource-control';
import { ResourcedEmoji } from '../src';

const Page = ({ title, children }: React.PropsWithChildren<{ title: string }>) => {
	return (
		<div>
			<h3>{title}</h3>
			{children}
		</div>
	);
};

const rowStyle: React.CSSProperties = {
	display: 'flex',
	flexDirection: 'row',
	marginBottom: 20,
};

export default () => {
	const serverOnlyResourceId = 'container-ssr-resource';
	const hydrationResourceId = 'container-hydration-resource';
	const serverOnlySingleId = 'container-ssr-simple';
	const hydrationSingleId = 'container-hydration-simple';
	const serverOnlyPickerId = 'container-ssr-picker';
	const hydrationPickerId = 'container-hydration-picker';

	const runSSR = async (containerId: string, node: React.ReactNode, hydrate?: boolean) => {
		try {
			const txt = ReactDOMServer.renderToString(<Page title={'SSR Only'}>{node}</Page>);

			const elem = document.querySelector(`#${containerId}`);

			if (elem) {
				elem.innerHTML = txt;
				hydrate && ReactDOM.hydrate(<Page title={'SSR + Hydration'}>{node}</Page>, elem);
			}
		} catch (e) {
			console.error(containerId, e);
		}
	};

	useEffect(() => {
		Loadable.preloadAll().then(() => {
			runSSR(
				serverOnlyResourceId,
				<ResourcedEmoji
					emojiId={{ shortName: ':grimacing:', id: '1f603' }}
					emojiProvider={getRealEmojiProvider()}
					optimisticImageURL="https://pf-emoji-service--cdn.us-east-1.staging.public.atl-paas.net/standard/a51a7674-8d5d-4495-a2d2-a67c090f5c3b/64x64/1f603.png"
				/>,
			);
			runSSR(
				hydrationResourceId,
				<ResourcedEmoji
					emojiId={{ shortName: ':grimacing:', id: '1f603' }}
					emojiProvider={getRealEmojiProvider()}
				/>,
				true,
			);
		});
		runSSR(serverOnlySingleId, renderEmoji(40));
		runSSR(hydrationSingleId, renderEmoji(40), true);
		runSSR(serverOnlyPickerId, <EmojiPickerWithUpload />);
		runSSR(hydrationPickerId, <EmojiPickerWithUpload />, true);
	}, []);

	return (
		<div
			style={{
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				maxWidth: 1300,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				margin: 'auto',
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				marginTop: 20,
			}}
		>
			<div>
				<h2>Emoji Image and Resourced Emoji</h2>
				{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
				<div style={rowStyle}>
					{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
					<div style={{ marginRight: 20 }} id={serverOnlyResourceId}></div>
					{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
					<div style={{ marginRight: 20 }} id={hydrationResourceId}></div>
				</div>
				<hr role="presentation" />
				<h2>Simple Emoji</h2>
				{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
				<div style={rowStyle}>
					{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
					<div style={{ marginRight: 20 }} id={serverOnlySingleId}></div>
					{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
					<div style={{ marginRight: 20 }} id={hydrationSingleId}></div>
				</div>
				<hr role="presentation" />
				<h2>Emoji Picker</h2>
				{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
				<div style={rowStyle}>
					{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
					<div style={{ marginRight: 20 }} id={serverOnlyPickerId}></div>
					{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
					<div style={{ marginRight: 20 }} id={hydrationPickerId}></div>
				</div>
				<hr role="presentation" />
			</div>
		</div>
	);
};
