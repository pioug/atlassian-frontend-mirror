import React from 'react';
import { IntlProvider } from 'react-intl-next';

import Page, { Grid, GridColumn } from '@atlaskit/page';
import Form, { Field, FormHeader } from '@atlaskit/form';
import { Box, xcss } from '@atlaskit/primitives';
import Textfield from '@atlaskit/textfield';
import { CardClient as SmartCardClient } from '@atlaskit/link-provider';
import { CheckboxSelect } from '@atlaskit/select';
import { Provider } from '../src';
import { Checkbox } from '@atlaskit/checkbox';
import { ufologger } from '@atlaskit/ufo';
import { token } from '@atlaskit/tokens';
import { HoverCard } from '../src/hoverCard';
import { CodeBlock } from '@atlaskit/code';
import { toComponentProps } from './utils/common';
import { type CardActionOptions, CardAction } from '../src/view/Card/types';
import { type MultiValue } from 'react-select';
import Heading from '@atlaskit/heading';

ufologger.enable();

const params =
	typeof URLSearchParams !== 'undefined' ? new URLSearchParams(location.search.slice(1)) : null;
const param = params ? params.get('url') : null;
const defaultURL = param
	? param
	: 'https://pug.jira-dev.com/wiki/spaces/~712020144e46c6280746719ae82d63fbc6c91d/pages/453328568380/Hovercard+Redesign+Testing+Links';

const codeStyles = xcss({
	display: 'inline-grid',
	tabSize: 2,
});

type RenderHoverCardProps = {
	url: string;
	closeOnChildClick: boolean;
	canOpen: boolean;
	id: string;
	actionOptions: CardActionOptions;
};

const headingStyles = xcss({
	paddingTop: 'space.150',
	cursor: 'pointer',
	display: 'inline-block',
});

const hoverCardBoxStyle = xcss({
	margin: `space.250`,
	minHeight: '180px',
	borderBottom: `1px solid ${token('color.border', '#eee')}`,
	textAlign: 'center',
});

const RenderHoverCard = ({
	url,
	closeOnChildClick,
	canOpen,
	id,
	actionOptions,
}: RenderHoverCardProps) => {
	if (!url) {
		return <></>;
	}
	return (
		<HoverCard
			url={url}
			closeOnChildClick={closeOnChildClick}
			canOpen={canOpen}
			id={id}
			actionOptions={actionOptions}
		>
			<Box xcss={headingStyles}>
				<Heading size="xxlarge">Hover over me!</Heading>
			</Box>
		</HoverCard>
	);
};

const generateActionOptions = (hide: boolean, excludeActions: CardAction[]): CardActionOptions => {
	if (hide) {
		return {
			hide: true,
		};
	}
	return {
		hide: false,
		exclude: excludeActions,
	};
};

const listOfActions = Object.values(CardAction).map((action) => {
	return { value: action, label: action };
});

const Example = (): JSX.Element => {
	const [url, setUrl] = React.useState(defaultURL);
	const [canOpen, setCanOpen] = React.useState(true);
	const [id, setId] = React.useState('NULL');
	const [closeOnChildClick, setCloseOnChildClick] = React.useState(false);
	const [hideActions, setHideActions] = React.useState(false);
	const [excludeActions, setExcludeActions] = React.useState<CardAction[]>([]);

	const handleUrlChange = React.useCallback((event: React.FormEvent<HTMLInputElement>) => {
		setUrl(event.currentTarget.value);
	}, []);

	const handleIdChange = React.useCallback((event: React.FormEvent<HTMLInputElement>) => {
		setId(event.currentTarget.value);
	}, []);

	const handleCloseOnChildClickChange = React.useCallback(
		(event: React.FormEvent<HTMLInputElement>) => {
			setCloseOnChildClick(event.currentTarget.checked);
		},
		[],
	);

	const handleCanOpen = React.useCallback((event: React.FormEvent<HTMLInputElement>) => {
		setCanOpen(event.currentTarget.checked);
	}, []);

	const handleHideActions = React.useCallback((event: React.FormEvent<HTMLInputElement>) => {
		setHideActions(event.currentTarget.checked);
	}, []);

	const handleExcludeActions = React.useCallback(
		(
			e: MultiValue<{
				value: CardAction;
				label: CardAction;
			}>,
		) => {
			setExcludeActions(e.map((action) => action.value));
		},
		[],
	);

	const actionOptions = React.useMemo(
		() => generateActionOptions(hideActions, excludeActions),
		[hideActions, excludeActions],
	);

	const code = React.useMemo(() => {
		return `<HoverCard ${toComponentProps({
			url,
			id,
			closeOnChildClick,
			canOpen,
			actionOptions,
		})}\n>\n\t\t{yourComponent}\n</HoverCard>`;
	}, [url, id, closeOnChildClick, canOpen, actionOptions]);

	return (
		<IntlProvider locale="en">
			<Provider client={new SmartCardClient('staging')}>
				<Page>
					<Grid>
						<GridColumn medium={12} key={url}>
							<Box xcss={hoverCardBoxStyle}>
								<RenderHoverCard
									url={url}
									closeOnChildClick={closeOnChildClick}
									canOpen={canOpen}
									id={id}
									actionOptions={actionOptions}
								/>
							</Box>
						</GridColumn>
						<GridColumn medium={6}>
							<Form onSubmit={() => {}}>
								{() => (
									<>
										<FormHeader title="Hover Card options" />
										<Field name="url" label="Url">
											{() => <Textfield onChange={handleUrlChange} value={url} autoFocus />}
										</Field>
										<Field name="id" label="Id used for analytics">
											{() => <Textfield onChange={handleIdChange} value={id} autoFocus />}
										</Field>
										<Field name="excludeActions" label="Actions to exclude">
											{() => (
												<CheckboxSelect
													inputId="checkbox-select-example"
													classNamePrefix="select"
													options={listOfActions}
													onChange={handleExcludeActions}
													isDisabled={hideActions}
												/>
											)}
										</Field>
										<Checkbox
											isChecked={hideActions}
											onChange={handleHideActions}
											label="Hide Actions"
											value="hideActions"
											name="hideActions"
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
									</>
								)}
							</Form>
						</GridColumn>
						<GridColumn medium={6}>
							<Box xcss={codeStyles}>
								<CodeBlock language="jsx" text={code} />
							</Box>
						</GridColumn>
					</Grid>
				</Page>
			</Provider>
		</IntlProvider>
	);
};

export default Example;
