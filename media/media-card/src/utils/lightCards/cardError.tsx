import React from 'react';
import { Component } from 'react';
import { ErrorIcon } from './errorIcon';
import { Wrapper } from './lightCardWrappers';
import { type StaticCardProps } from './types';
import { getDimensionsWithDefault } from './getDimensionsWithDefault';

export class CardError extends Component<StaticCardProps, {}> {
	render(): React.JSX.Element {
		const dimensions = getDimensionsWithDefault(this.props.dimensions);
		return <Wrapper dimensions={dimensions}>{this.icon}</Wrapper>;
	}

	get icon(): React.JSX.Element {
		return <ErrorIcon />;
	}
}
