// Simple component which wraps stories and creates a styled list out of it
import React from 'react';
import { token } from '@atlaskit/tokens';
import { Component, type ReactNode, type CSSProperties } from 'react';

interface UnitStyle {
	statesWrapper: CSSProperties;
	stateItem: CSSProperties;
	stateTitle: CSSProperties;
}

const styles: {
	column: UnitStyle;
	row: UnitStyle;
} = {
	column: {
		statesWrapper: {
			listStyle: 'none',
			padding: '10px',
			margin: '10px',
			borderRadius: '3px',
			display: 'inline-block',
		},
		stateItem: {
			// TODO: From AK2 migration – TypeScript error, doesn't make sense
			flexDirection: 'column' as any,
			borderRadius: '3px',
			padding: '10px',
			margin: '10px',
		},
		stateTitle: {
			borderBottom: `1px solid ${token('color.border', '#ccc')}`,
			marginBottom: '7px',
			color: token('color.text', '#606369'),
			width: '100%',
			textTransform: 'capitalize',
		},
	},
	row: {
		statesWrapper: {
			listStyle: 'none',
			padding: '10px',
			margin: '10px',
			borderRadius: '3px',
		},
		stateItem: {
			display: 'inline-flex',
			// TODO: From AK2 migration – TypeScript error, doesn't make sense
			flexDirection: 'column' as any,
			borderRadius: '3px',
			padding: '10px',
			margin: '10px',
		},
		stateTitle: {
			borderBottom: `1px solid ${token('color.border', '#ccc')}`,
			marginBottom: '7px',
			color: token('color.text', '#606369'),
			width: '100%',
			textTransform: 'capitalize',
		},
	},
};

export type StoryListItem = {
	readonly title: string;
	readonly content: ReactNode;
};

export interface StoryListProps {
	readonly display?: 'row' | 'column';
	readonly children?: StoryListItem[];
}

export class StoryList extends Component<StoryListProps, {}> {
	render() {
		const { display = 'row', children = [] }: StoryListProps = this.props;
		const listStyles = display === 'column' ? styles.column : styles.row;
		const listContent = children.map((child, index) => {
			return (
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				<li style={listStyles.stateItem} key={index}>
					{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
					<div style={listStyles.stateTitle}>{child.title}</div>
					{child.content}
				</li>
			);
		});

		// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
		return <ul style={listStyles.statesWrapper}>{listContent}</ul>;
	}
}
