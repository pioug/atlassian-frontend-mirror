/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import React from 'react';
import { IntlProvider } from 'react-intl-next';

import Page, { Grid, GridColumn } from '@atlaskit/page';
import Form, { Field, FormHeader } from '@atlaskit/form';
import Textfield from '@atlaskit/textfield';
import { CardClient as SmartCardClient } from '@atlaskit/link-provider';
import { Provider } from '../src';
import { Checkbox } from '@atlaskit/checkbox';
import { ufologger } from '@atlaskit/ufo';
import { token } from '@atlaskit/tokens';
import { HoverCard } from '../src/hoverCard';
import { CodeBlock } from '@atlaskit/code';
import { toComponentProps } from './utils/common';

ufologger.enable();

const params =
	typeof URLSearchParams !== 'undefined' ? new URLSearchParams(location.search.slice(1)) : null;
const param = params ? params.get('url') : null;
const defaultURL = param
	? param
	: 'https://pug.jira-dev.com/wiki/spaces/~712020144e46c6280746719ae82d63fbc6c91d/pages/453328568380/Hovercard+Redesign+Testing+Links';

const codeStyles = css({
	display: 'inline-grid',
	tabSize: 2,
});

export interface ExampleState {
	url: string;
	hidePreviewButton: boolean;
	closeOnChildClick: boolean;
	canOpen: boolean;
	showServerActions: boolean;
	id: string;
}

type RenderHoverCardProps = {
	url: string;
	hidePreviewButton: boolean;
	closeOnChildClick: boolean;
	canOpen: boolean;
	id: string;
	showServerActions: boolean;
};

const RenderHoverCard = ({
	url,
	hidePreviewButton,
	closeOnChildClick,
	canOpen,
	id,
	showServerActions,
}: RenderHoverCardProps) => {
	if (!url) {
		return <div></div>;
	}
	return (
		<HoverCard
			url={url}
			hidePreviewButton={hidePreviewButton}
			closeOnChildClick={closeOnChildClick}
			canOpen={canOpen}
			id={id}
			showServerActions={showServerActions}
		>
			<h1
				style={{
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					paddingTop: token('space.150', '12px'),
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					cursor: 'pointer',
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					display: 'inline-block',
				}}
			>
				Hover over me!
			</h1>
		</HoverCard>
	);
};

const Example = (): JSX.Element => {
	const [url, setUrl] = React.useState(defaultURL);
	const [hidePreviewButton, setHidePreviewButton] = React.useState(false);
	const [canOpen, setCanOpen] = React.useState(true);
	const [id, setId] = React.useState('NULL');
	const [showServerActions, setShowServerActions] = React.useState(false);
	const [closeOnChildClick, setCloseOnChildClick] = React.useState(false);

	const handleUrlChange = React.useCallback((event: React.FormEvent<HTMLInputElement>) => {
		setUrl(event.currentTarget.value);
	}, []);

	const handleIdChange = React.useCallback((event: React.FormEvent<HTMLInputElement>) => {
		setId(event.currentTarget.value);
	}, []);

	const handleHidePreviewButtonChange = React.useCallback(
		(event: React.FormEvent<HTMLInputElement>) => {
			setHidePreviewButton(event.currentTarget.checked);
		},
		[],
	);
	const handleCloseOnChildClickChange = React.useCallback(
		(event: React.FormEvent<HTMLInputElement>) => {
			setCloseOnChildClick(event.currentTarget.checked);
		},
		[],
	);
	const handleCanOpen = React.useCallback((event: React.FormEvent<HTMLInputElement>) => {
		setCanOpen(event.currentTarget.checked);
	}, []);

	const handleShowServerActions = React.useCallback((event: React.FormEvent<HTMLInputElement>) => {
		setShowServerActions(event.currentTarget.checked);
	}, []);

	const code = React.useMemo(() => {
		return `<HoverCard ${toComponentProps({
			url,
			id,
			hidePreviewButton,
			closeOnChildClick,
			canOpen,
			showServerActions,
		})}\n>\n\t\t{yourComponent}\n</HoverCard>`;
	}, [url, id, hidePreviewButton, closeOnChildClick, canOpen, showServerActions]);

	return (
		<IntlProvider locale="en">
			<Provider client={new SmartCardClient('staging')}>
				<Page>
					<Grid>
						<GridColumn medium={12} key={url}>
							<div
								style={{
									margin: `${token('space.250', '20px')} 0`,
									// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
									minHeight: 180,
									borderBottom: `1px solid ${token('color.border', '#eee')}`,
									// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
									textAlign: 'center',
								}}
							>
								{
									<RenderHoverCard
										url={url}
										hidePreviewButton={hidePreviewButton}
										closeOnChildClick={closeOnChildClick}
										canOpen={canOpen}
										id={id}
										showServerActions={showServerActions}
									/>
								}
							</div>
						</GridColumn>
						<GridColumn medium={6}>
							<Form onSubmit={() => {}}>
								{() => (
									<form>
										<FormHeader title="Hover Card options" />
										<Field name="url" label="Url">
											{() => <Textfield onChange={handleUrlChange} value={url} autoFocus />}
										</Field>
										<Field name="id" label="Id used for analytics">
											{() => <Textfield onChange={handleIdChange} value={id} autoFocus />}
										</Field>
										<Checkbox
											isChecked={hidePreviewButton}
											onChange={handleHidePreviewButtonChange}
											label="Hide Preview Button"
											value="hidePreviewButton"
											name="hidePreviewButton"
										/>
										<Checkbox
											isChecked={closeOnChildClick}
											onChange={handleCloseOnChildClickChange}
											label="Close Child on Click"
											value="closeChildOnClick"
											name="closeChildOnClick"
										/>
										<Checkbox
											isChecked={canOpen}
											onChange={handleCanOpen}
											label="Can Open"
											value="canOpen"
											name="canOpen"
										/>
										<Checkbox
											isChecked={showServerActions}
											onChange={handleShowServerActions}
											label="Show server actions"
											value="showServerActions"
											name="showServerActions"
										/>
									</form>
								)}
							</Form>
						</GridColumn>
						<GridColumn medium={6}>
							<div css={codeStyles}>
								<CodeBlock language="jsx" text={code} />
							</div>
						</GridColumn>
					</Grid>
				</Page>
			</Provider>
		</IntlProvider>
	);
};

export default Example;
