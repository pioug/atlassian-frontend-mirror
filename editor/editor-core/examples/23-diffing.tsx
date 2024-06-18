/** @jsx jsx */
import type { ReactNode } from 'react';
import React from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import type { Change } from 'diff';
import { diffLines } from 'diff';

import Button from '@atlaskit/button/new';
import TextArea from '@atlaskit/textarea';
import { G75, N10, N40, N900, R75 } from '@atlaskit/theme/colors';
import { codeFontFamily } from '@atlaskit/theme/constants';
import { token } from '@atlaskit/tokens';

const container = css({
	display: 'flex',
	flexDirection: 'column',
	margin: token('space.100', '8px'),
	height: 'calc(100% - 30px)',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'> *': {
		margin: `${token('space.100', '8px')} 0`,
	},
});

const textContainer = css({
	flex: '1 1 auto',
	display: 'flex',
});

const diffContainer = css({
	flex: '1 1 auto',
	height: '100%',
	whiteSpace: 'pre',
	fontFamily: codeFontFamily(),
	color: N900,
	backgroundColor: N10,
	border: `2px solid ${token('color.border', N40)}`,
	borderRadius: '3px',
	boxSizing: 'border-box',
	fontSize: '14px',
	lineHeight: '16px',
	overflow: 'auto',
	wordWrap: 'break-word',
	padding: `${token('space.075', '6px')} ${token('space.075', '6px')}`,
});

const buttonContainer = css({
	flex: '0 0 auto',
	display: 'flex',
	justifyContent: 'flex-end',
});

const lineStyle = css({
	margin: 0,
});

const addedLineStyle = css({
	backgroundColor: G75,
});

const removedLineStyle = css({
	backgroundColor: R75,
});

type LineProps = {
	children: React.ReactNode;
};

const Line = ({ children }: LineProps) => <p css={lineStyle}>{children}</p>;
const AddedLine = ({ children }: LineProps) => <p css={[lineStyle, addedLineStyle]}>{children}</p>;
const RemovedLine = ({ children }: LineProps) => (
	<p css={[lineStyle, removedLineStyle]}>{children}</p>
);

const label = css({
	width: '100%',
	textAlign: 'center',
	borderTop: `1px solid ${token('color.border', N40)}`,
	fontSize: '16px',
	paddingTop: token('space.200', '16px'),
});

type State = {
	editMode: boolean;
	diffs: Change[];
	documentOne: string;
	documentTwo: string;
};

export default class DiffingExample extends React.Component<null, State> {
	state = {
		editMode: true,
		diffs: [],
		documentOne: '',
		documentTwo: '',
	};

	onBtnClick = () => {
		const { documentOne, documentTwo, editMode } = this.state;
		if (editMode) {
			this.setState({
				diffs: diffLines(documentOne, documentTwo),
				editMode: false,
			});
		} else {
			this.setState({ editMode: true });
		}
	};

	onDocumentOneChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		this.setState({ documentOne: e.target.value });
	};

	onDocumentTwoChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		this.setState({ documentTwo: e.target.value });
	};

	renderDiff = (diffs: Change[]): ReactNode[] =>
		diffs.map((diff, idx) => {
			let LineComponent = Line;
			if (diff.added) {
				LineComponent = AddedLine;
			} else if (diff.removed) {
				LineComponent = RemovedLine;
			}
			return <LineComponent key={idx}>{diff.value}</LineComponent>;
		});

	render() {
		const { editMode, diffs, documentOne, documentTwo } = this.state;
		return (
			<div css={container}>
				<p>Use this example to help diff document structures</p>
				<p>Paste any text into the fields and click Compare to see the difference</p>
				{editMode ? (
					<div css={textContainer}>
						<TextArea
							value={documentOne}
							isMonospaced
							maxHeight="inherit"
							onChange={this.onDocumentOneChange}
						/>
						<TextArea
							value={documentTwo}
							isMonospaced
							maxHeight="inherit"
							onChange={this.onDocumentTwoChange}
						/>
					</div>
				) : diffs.length === 1 ? (
					<div css={textContainer}>
						<p css={label}>No differences found</p>
					</div>
				) : (
					<div css={diffContainer}>{this.renderDiff(diffs)}</div>
				)}
				<div css={buttonContainer}>
					<Button appearance="primary" onClick={this.onBtnClick}>
						{editMode ? 'Compare' : 'Edit'}
					</Button>
				</div>
			</div>
		);
	}
}
