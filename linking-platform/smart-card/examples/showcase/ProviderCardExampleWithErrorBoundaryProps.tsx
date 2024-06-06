import React, { type ErrorInfo } from 'react';
import { token } from '@atlaskit/tokens';
import { Card } from '../../src';
import { type ExampleUIConfig } from './types';

interface ProviderCardExampleWithErrorBoundaryProps {
	url: string;
	config: ExampleUIConfig;
}
interface ProviderCardExampleWithErrorBoundaryState {
	error: Error | null;
	errorInfo: ErrorInfo | null;
}
export class ProviderCardExampleWithErrorBoundary extends React.Component<
	ProviderCardExampleWithErrorBoundaryProps,
	ProviderCardExampleWithErrorBoundaryState
> {
	state: ProviderCardExampleWithErrorBoundaryState = {
		error: null,
		errorInfo: null,
	};

	componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		this.setState({ error, errorInfo });
	}

	render() {
		if (this.state.error) {
			console.error(this.props.url, this.state.error);
			return (
				<span
					style={{
						// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
						color: token('color.text.danger', 'red'),
						// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
						fontWeight: 'bolder',
					}}
				>
					Something went wrong rendering: {this.props.url}, reason:{' '}
					{typeof this.state.error.message === 'string'
						? this.state.error.message
						: JSON.stringify(this.state.error)}
				</span>
			);
		}
		return <Card appearance={this.props.config.appearance} url={this.props.url} />;
	}
}
