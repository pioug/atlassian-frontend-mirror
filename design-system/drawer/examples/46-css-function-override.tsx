/** @jsx jsx */

import { Component, type SyntheticEvent } from 'react';

import { css, type CSSObject, jsx } from '@emotion/react';

import Button from '@atlaskit/button/new';
import ArrowLeftIcon from '@atlaskit/icon/glyph/arrow-left';
import { token } from '@atlaskit/tokens';

import Drawer from '../src';

interface State {
	isDrawerOpen: boolean;
}

const sidebarOverrideCssFn = (defaultStyles: CSSObject): CSSObject => ({
	color: token('color.text.inverse'),
	position: 'absolute',
	top: token('space.300', '24px'),
	left: token('space.150', '12px'),
});

const contentOverrideCssFn = (defaultStyles: CSSObject): CSSObject => ({
	...defaultStyles,
	display: 'flex',
	marginTop: 0,
	flexDirection: 'column',
});

const sections = [
	[token('color.background.accent.red.bolder'), 'Full'],
	[token('color.background.accent.yellow.bolder'), 'Layout'],
	[token('color.background.accent.green.bolder'), 'Drawer'],
	[token('color.background.accent.blue.bolder'), 'Through'],
	[token('color.background.accent.teal.bolder'), 'CSS'],
	[token('color.background.accent.purple.bolder'), 'Override'],
];

const sectionStyles = css({
	flex: 1,
	flexDirection: 'column',
	color: token('color.text.inverse'),
	textAlign: 'center',
});

const sectionHeaderStyles = css({
	maxWidth: '50%',
	margin: '0 auto',
	position: 'relative',
	color: token('color.text.inverse'),
	insetBlockStart: '50%',
	transform: 'translate(0, -50%)',
});

export default class DrawersExample extends Component<{}, State> {
	state = {
		isDrawerOpen: false,
	};

	openDrawer = () =>
		this.setState({
			isDrawerOpen: true,
		});

	onClose = (...args: [SyntheticEvent, any]) => {
		console.log('onClose', args);
		this.setState({
			isDrawerOpen: false,
		});
	};

	onCloseComplete = (args: any) => console.log('onCloseComplete', args);

	render() {
		return (
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
			<div style={{ padding: token('space.400', '2rem') }}>
				<Drawer
					onClose={this.onClose}
					onCloseComplete={this.onCloseComplete}
					isOpen={this.state.isDrawerOpen}
					width="full"
					label="Drawer with css custom overrides"
					icon={() => (
						<ArrowLeftIcon primaryColor={token('color.icon.inverse')} label="Close drawer" />
					)}
					// eslint-disable-next-line @repo/internal/react/no-unsafe-overrides
					overrides={{
						Sidebar: {
							cssFn: sidebarOverrideCssFn,
						},
						Content: {
							cssFn: contentOverrideCssFn,
						},
					}}
				>
					{sections.map(([backgroundColor, word]) => {
						return (
							<div key={word} style={{ backgroundColor }} css={sectionStyles}>
								<h1 css={sectionHeaderStyles}>{word}</h1>
							</div>
						);
					})}
				</Drawer>
				<Button id="open-drawer" type="button" onClick={this.openDrawer}>
					Open drawer
				</Button>
			</div>
		);
	}
}
