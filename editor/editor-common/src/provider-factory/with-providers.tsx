/* eslint-disable @repo/internal/react/no-class-components */
import { PureComponent } from 'react';

import { fg } from '@atlaskit/platform-feature-flags';

import type ProviderFactory from './provider-factory';
import { type ProviderName, type Providers } from './types';

export interface Props {
	providerFactory: ProviderFactory;
	providers: ProviderName[];
	renderNode: (providers: Providers) => JSX.Element | null;
}

// Ignored via go/ees005
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class WithProviders extends PureComponent<Props, { providers: any }> {
	static displayName = 'WithProviders';
	mounted = false;

	constructor(props: Props) {
		super(props);
		this.mounted = false;

		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const providers: Record<string, Promise<any> | undefined> = {};
		this.props.providers.forEach((name) => {
			if (fg('platform_editor_react18_phase2_v2')) {
				const providerPromise = props.providerFactory.subscribe(name, this.handleProviderIfMounted);
				providers[name] = providerPromise;
			} else {
				providers[name] = undefined;
			}
		});

		this.state = {
			providers,
		};
	}

	componentDidMount() {
		this.mounted = true;
	}

	// Ignored via go/ees005
	// eslint-disable-next-line react/no-unsafe
	UNSAFE_componentWillMount() {
		if (!fg('platform_editor_react18_phase2_v2')) {
			const { providers, providerFactory } = this.props;

			providers.forEach((name) => {
				providerFactory.subscribe(name, this.handleProvider);
			});
		}
	}

	componentWillUnmount() {
		const { providers, providerFactory } = this.props;

		providers.forEach((name) => {
			providerFactory.unsubscribe(name, this.handleProvider);
		});
	}

	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	handleProviderIfMounted = (name: string, provider?: Promise<any>) => {
		if (!this.mounted) {
			return;
		}
		this.handleProvider(name, provider);
	};

	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	handleProvider = (name: string, provider?: Promise<any>) => {
		this.setState(({ providers }) => {
			return {
				providers: {
					...providers,
					[name]: provider,
				},
			};
		});
	};

	render() {
		const { state, props } = this;
		const { renderNode } = props;

		return renderNode(state.providers);
	}
}
