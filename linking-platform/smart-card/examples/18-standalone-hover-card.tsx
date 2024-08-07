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
	: 'https://pug.jira-dev.com/wiki/spaces/~6360339afe5ff375235b4167/pages/452478435635/Sample+Pages';

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

class Example extends React.Component<{}, ExampleState> {
	state: ExampleState = {
		url: defaultURL,
		hidePreviewButton: false,
		closeOnChildClick: false,
		canOpen: true,
		id: 'NULL',
		showServerActions: false,
	};

	preventDefaultAndSetUrl(url: string) {
		return (e: React.MouseEvent<HTMLButtonElement>) => {
			e.preventDefault();
			this.setState({ url });
		};
	}

	handleUrlChange = (event: React.FormEvent<HTMLInputElement>) => {
		this.setState({ url: (event.target as HTMLInputElement).value });
	};

	handleIdChange = (event: React.FormEvent<HTMLInputElement>) => {
		this.setState({ id: (event.target as HTMLInputElement).value });
	};

	handleHidePreviewButtonChange = (event: React.FormEvent<HTMLInputElement>) => {
		this.setState({
			hidePreviewButton: (event.target as HTMLInputElement).checked,
		});
	};

	handleCloseOnChildClickChange = (event: React.FormEvent<HTMLInputElement>) => {
		this.setState({
			closeOnChildClick: (event.target as HTMLInputElement).checked,
		});
	};

	handleCanOpen = (event: React.FormEvent<HTMLInputElement>) => {
		this.setState({
			canOpen: (event.target as HTMLInputElement).checked,
		});
	};

	handleShowServerActions = (event: React.FormEvent<HTMLInputElement>) => {
		this.setState({
			showServerActions: (event.target as HTMLInputElement).checked,
		});
	};

	getCode = () => {
		return `<HoverCard ${toComponentProps(this.state)}\n>\n\t\t{yourComponent}\n</HoverCard>`;
	};

	renderHoverCard(
		url: string,
		hidePreviewButton: boolean,
		closeOnChildClick: boolean,
		canOpen: boolean,
		id: string,
		showServerActions: boolean,
	) {
		if (url) {
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
		}
		return null;
	}

	render() {
		const { url, hidePreviewButton, closeOnChildClick, canOpen, id, showServerActions } =
			this.state;

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
									{this.renderHoverCard(
										url,
										hidePreviewButton,
										closeOnChildClick,
										canOpen,
										id,
										showServerActions,
									)}
								</div>
							</GridColumn>
							<GridColumn medium={6}>
								<Form onSubmit={() => {}}>
									{() => (
										<form>
											<FormHeader title="Hover Card options" />
											<Field name="url" label="Url">
												{() => <Textfield onChange={this.handleUrlChange} value={url} autoFocus />}
											</Field>
											<Field name="id" label="Id used for analytics">
												{() => <Textfield onChange={this.handleIdChange} value={id} autoFocus />}
											</Field>
											<Checkbox
												isChecked={hidePreviewButton}
												onChange={this.handleHidePreviewButtonChange}
												label="Hide Preview Button"
												value="hidePreviewButton"
												name="hidePreviewButton"
											/>
											<Checkbox
												isChecked={closeOnChildClick}
												onChange={this.handleCloseOnChildClickChange}
												label="Close Child on Click"
												value="closeChildOnClick"
												name="closeChildOnClick"
											/>
											<Checkbox
												isChecked={canOpen}
												onChange={this.handleCanOpen}
												label="Can Open"
												value="canOpen"
												name="canOpen"
											/>
											<Checkbox
												isChecked={showServerActions}
												onChange={this.handleShowServerActions}
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
									<CodeBlock language="jsx" text={this.getCode()} />
								</div>
							</GridColumn>
						</Grid>
					</Page>
				</Provider>
			</IntlProvider>
		);
	}
}

export default () => <Example />;
