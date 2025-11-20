/**
 * Development use only
 * The purpose of this example is to explore on edge cases for this component's
 * feature. Some ways of using the component in here might not be the standard
 * way. It is discouraged to use this code as a base for consumers.
 */
import React, { useEffect, useMemo } from 'react';
import ReactDOM from 'react-dom';
import { tallImage } from '@atlaskit/media-test-helpers';
import { createStorybookMediaClientConfig } from '@atlaskit/media-test-helpers';
import { MediaClient } from '@atlaskit/media-client';
import { type SSR } from '@atlaskit/media-common';
import { token } from '@atlaskit/tokens';
import { Card, type CardBaseProps } from '../src/card/card';
import ReactDOMServer from 'react-dom/server';
import { imageFileId } from '@atlaskit/media-test-helpers';
import { MediaClientContext } from '@atlaskit/media-client-react';
import { MainWrapper, SSRAnalyticsWrapper } from '../example-helpers';

const dimensions = { width: 250, height: 150 };

//An edge case found in MEX-1237: Media single and media group will fetch the same
//image from cache in Errored DataURI case if using same card dimensions.
//In order to avoid this edge case, use a different dimension for media single.
const fullFitDimensions = { width: 250, height: 152 };

const createMediaClient = ({
	throwError,
}: {
	throwError?: 'getImageUrlSync' | 'dataURI';
} = {}) => {
	const mediaClientConfig = createStorybookMediaClientConfig();
	const mediaClient = new MediaClient(mediaClientConfig);
	const dataURI = throwError === 'dataURI' ? 'http://broken-data-uri' : tallImage;
	mediaClient.getImageUrlSync = () => {
		if (throwError === 'getImageUrlSync') {
			throw new Error('something really bad happened');
		}
		return dataURI;
	};

	return mediaClient;
};

const modes = {
	single: {
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
	throwError,
	additionalProps,
}: {
	ssr: SSR;
	title: string;
	mode: 'single' | 'group';
	throwError?: 'getImageUrlSync' | 'dataURI';
	additionalProps?: Partial<CardBaseProps>;
}) => {
	const client = createMediaClient({ throwError });

	return (
		<SSRAnalyticsWrapper>
			<h3>{title}</h3>
			<MediaClientContext.Provider value={client}>
				<Card
					mediaClient={createMediaClient()}
					identifier={imageFileId}
					dimensions={mode === 'single' ? fullFitDimensions : dimensions}
					ssr={ssr}
					shouldOpenMediaViewer={true}
					{...modes[mode]}
					{...additionalProps}
				/>
			</MediaClientContext.Provider>
		</SSRAnalyticsWrapper>
	);
};

type RunSSRParams = {
	containerId: string;
	mode: 'single' | 'group';
	hydrate?: boolean;
	throwError?: 'getImageUrlSync' | 'dataURI';
};
const runSSR = ({ containerId, mode, hydrate, throwError }: RunSSRParams) => {
	const title = !!throwError ? `Error ${throwError}` : 'Success';
	const win = window.parent || window;
	const urlParams = new URLSearchParams(win.document.location.search);
	const additionalPropsJson = urlParams.get('additionalProps');
	const additionalProps = additionalPropsJson ? JSON.parse(additionalPropsJson) : {};

	const txt = ReactDOMServer.renderToString(
		<Page
			ssr="server"
			title={title}
			mode={mode}
			throwError={throwError}
			additionalProps={additionalProps}
		/>,
	);
	const elem = document.querySelector(`#${containerId}`);
	if (elem) {
		elem.innerHTML = txt;
		hydrate &&
			ReactDOM.hydrate(
				<Page
					ssr="client"
					title={title}
					mode={mode}
					throwError={throwError}
					additionalProps={additionalProps}
				/>,
				elem,
			);
	}
};

type Scenario = [string, () => void];
type ScenarioLabel =
	| 'media-single-server'
	| 'media-single-hydration'
	| 'media-group-server'
	| 'media-group-hydration';
type Scenarios = Record<ScenarioLabel, Scenario[]>;
const createScenarios = (): Scenarios => {
	const createScenario = ({
		mode,
		hydrate,
		throwError,
	}: Omit<RunSSRParams, 'containerId'>): Scenario => {
		const containerId = `${mode}-${hydrate ? 'client' : 'server'}-${throwError || 'success'}`;
		return [containerId, () => runSSR({ containerId, mode, hydrate, throwError })];
	};
	return {
		'media-single-server': (
			[
				{ mode: 'single' },
				{ mode: 'single', throwError: 'getImageUrlSync' },
				{ mode: 'single', throwError: 'dataURI' },
			] as const
		).map(createScenario),
		'media-single-hydration': (
			[
				{ mode: 'single', hydrate: true },
				{ mode: 'single', hydrate: true, throwError: 'getImageUrlSync' },
				{ mode: 'single', hydrate: true, throwError: 'dataURI' },
			] as const
		).map(createScenario),
		'media-group-server': (
			[
				{ mode: 'group' },
				{ mode: 'group', throwError: 'getImageUrlSync' },
				{ mode: 'group', throwError: 'dataURI' },
			] as const
		).map(createScenario),
		'media-group-hydration': (
			[
				{ mode: 'group', hydrate: true },
				{ mode: 'group', hydrate: true, throwError: 'getImageUrlSync' },
				{ mode: 'group', hydrate: true, throwError: 'dataURI' },
			] as const
		).map(createScenario),
	};
};

const runScenarios = (scenarios: Scenarios) => {
	Object.entries(scenarios).map(([, collection]) => collection.map(([, runSSR]) => runSSR()));
};

const rowStyle = {
	display: 'flex',
	flexDirection: 'row',
	marginBottom: token('space.250', '20px'),
} as const;

const ScenariosComponent: React.FC<{ scenarios: Scenarios }> = ({ scenarios }) => (
	<>
		{Object.entries(scenarios).map(([label, collection]) => (
			<React.Fragment key={label}>
				<h2>{label}</h2>
				{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
				<div style={rowStyle}>
					{collection.map(([id]) => (
						<div
							key={id}
							// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
							style={{ marginRight: token('space.250', '20px') }}
							id={id}
						></div>
					))}
				</div>
			</React.Fragment>
		))}
	</>
);

export default (): React.JSX.Element => {
	const scenarios = useMemo(() => createScenarios(), []);
	useEffect(() => {
		runScenarios(scenarios);
	}, [scenarios]);

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
				<ScenariosComponent scenarios={scenarios} />
			</MainWrapper>
		</div>
	);
};
