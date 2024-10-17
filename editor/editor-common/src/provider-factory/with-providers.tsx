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

export class WithProviders extends PureComponent<Props, { providers: any }> {
	static displayName = 'WithProviders';
	mounted = false;

	constructor(props: Props) {
		super(props);
		this.mounted = false;

		const providers: Record<string, Promise<any> | undefined> = {};
		this.props.providers.forEach((name) => {
			if (fg('platform_editor_react18_phase2')) {
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

	UNSAFE_componentWillMount() {
		if (!fg('platform_editor_react18_phase2')) {
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

	handleProviderIfMounted = (name: string, provider?: Promise<any>) => {
		if (!this.mounted) {
			return;
		}
		this.handleProvider(name, provider);
	};

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
