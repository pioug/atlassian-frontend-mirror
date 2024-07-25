import React from 'react';
import { IntlProvider } from 'react-intl-next';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import styled from '@emotion/styled';

import DownloadIconLegacy from '@atlaskit/icon/glyph/download';
import DownloadIcon from '@atlaskit/icon/core/download';
import PreviewIcon from '@atlaskit/icon/core/migration/arrow-up-right--open';
import Tooltip from '@atlaskit/tooltip';
import { token } from '@atlaskit/tokens';

import { Provider, Client, Card, CardAction } from '../src';
import { useSmartLinkActions } from '../src/hooks';

const url = 'https://www.dropbox.com/s/2mh79iuglsnmbwf/Get%20Started%20with%20Dropbox.pdf?dl=0';
const analytics = () => {};

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
const ExampleWrapper = styled.div({
	width: '80%',
	height: 'auto',
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'center',
	alignItems: 'center',
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
const ExampleToolbarWrapper = styled.div({
	boxShadow: '0 0 16px 0 #ccc',
	borderRadius: '4px',
	marginBottom: token('space.150', '12px'),
	borderRight: '1px solid #ccc',
	display: 'flex',
	margin: `${token('space.200', '16px')} 0px`,
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
const ExampleToolbarItem = styled.div({
	padding: `${token('space.100', '8px')} ${token('space.150', '12px')}`,
	textAlign: 'center',
	textTransform: 'uppercase',
	fontSize: '10px',
	borderRight: '1px solid #ccc',
	transition: '0.3s ease-in-out all',
	'&:hover': {
		cursor: 'pointer',
		backgroundColor: '#eee',
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	'&:last-child': {
		borderRight: 'none',
	},
});

const idToIcon: Record<string, JSX.Element> = {
	'download-content': <DownloadIcon label="download" LEGACY_fallbackIcon={DownloadIconLegacy} />,
	'preview-content': <PreviewIcon label="preview" />,
};

const ExampleToolbar = () => {
	const actions = useSmartLinkActions({
		url,
		appearance: 'block',
		analyticsHandler: analytics,
	});

	return (
		<ExampleToolbarWrapper>
			{actions.map((action) => (
				<Tooltip content={action.text}>
					<ExampleToolbarItem key={action.id} onClick={() => action.invoke()}>
						{idToIcon[action.id] ?? action.id}
					</ExampleToolbarItem>
				</Tooltip>
			))}
		</ExampleToolbarWrapper>
	);
};

export default () => (
	<IntlProvider locale="en">
		<Provider client={new Client('stg')}>
			<ExampleWrapper>
				<ExampleToolbar />
				<Card
					url={url}
					appearance="block"
					platform="web"
					actionOptions={{
						hide: false,
						exclude: [CardAction.DownloadAction, CardAction.PreviewAction, CardAction.ViewAction],
					}}
				/>
			</ExampleWrapper>
		</Provider>
	</IntlProvider>
);
