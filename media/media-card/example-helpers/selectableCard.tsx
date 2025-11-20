import React from 'react';
import { Component } from 'react';
import { type MediaClientConfig } from '@atlaskit/media-core';
import { type Identifier } from '@atlaskit/media-client';
import { Card } from '../src';

export interface SelectableCardProps {
	mediaClientConfig: MediaClientConfig;
	identifier: Identifier;
}

export class SelectableCard extends Component<SelectableCardProps, { selected: boolean }> {
	constructor(props: SelectableCardProps) {
		super(props);
		this.state = { selected: false };
	}

	render(): React.JSX.Element | null {
		const { mediaClientConfig, identifier } = this.props;
		const { selected } = this.state;

		if (!mediaClientConfig) {
			return null;
		}

		return (
			<Card
				mediaClientConfig={mediaClientConfig}
				identifier={identifier}
				appearance="image"
				selectable={true}
				selected={selected}
				onClick={this.onClick}
				actions={[{ label: 'add', handler: () => {} }]}
			/>
		);
	}

	private onClick = (): void => {
		this.setState((prevState) => {
			return {
				selected: !prevState.selected,
			};
		});
	};
}
