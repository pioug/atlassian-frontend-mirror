import React, { PureComponent } from 'react';
import type { ReactNode } from 'react';
import { ProviderFactory, WithProviders } from '@atlaskit/editor-common/provider-factory';
import TaskItemWithProviders from './task-item-with-providers';
import type { RendererContext, NodeProps } from '../types';
import { FabricElementsAnalyticsContext } from '@atlaskit/analytics-namespaced-context';
import {
	TaskItemsFormatProvider,
	TaskItemsFormatConsumer,
} from '../../ui/TaskItemsFormatContext/TaskItemsFormatContext';

export interface Props {
	children?: ReactNode;
	disabled?: boolean;
	disableOnChange?: boolean;
	localId: string;
	providers?: ProviderFactory;
	rendererContext?: RendererContext;
	state?: string;
}

// Ignored via go/ees005
// eslint-disable-next-line @repo/internal/react/no-class-components
export default class TaskItem extends PureComponent<NodeProps<Props>, Object> {
	private providerFactory: ProviderFactory;

	constructor(props: NodeProps<Props>) {
		super(props);
		this.providerFactory = props.providers || new ProviderFactory();
	}

	componentWillUnmount(): void {
		if (!this.props.providers) {
			// new ProviderFactory is created if no `providers` has been set
			// in this case when component is unmounted it's safe to destroy this providerFactory
			this.providerFactory.destroy();
		}
	}

	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	private renderWithProvider = (providers: any) => {
		const { taskDecisionProvider, contextIdentifierProvider } = providers;
		const { children, localId, state, rendererContext, disabled, dataAttributes, disableOnChange } =
			this.props;
		let objectAri = '';
		if (rendererContext) {
			objectAri = rendererContext.objectAri || '';
		}

		return (
			<FabricElementsAnalyticsContext
				// eslint-disable-next-line @atlassian/perf-linting/no-unstable-inline-props -- Ignored via go/ees017 (to be fixed)
				data={{
					userContext: 'document',
				}}
			>
				<TaskItemsFormatProvider>
					<TaskItemsFormatConsumer>
						{([, dispatch]) => (
							<TaskItemWithProviders
								objectAri={objectAri}
								taskId={localId}
								isDone={state === 'DONE'}
								isRenderer
								disabled={disabled}
								disableOnChange={disableOnChange}
								taskDecisionProvider={taskDecisionProvider}
								contextIdentifierProvider={contextIdentifierProvider}
								dataAttributes={dataAttributes}
								// eslint-disable-next-line @atlassian/perf-linting/no-unstable-inline-props -- Ignored via go/ees017 (to be fixed)
								onChange={(_, isChecked) => {
									dispatch(isChecked);
								}}
							>
								{children}
							</TaskItemWithProviders>
						)}
					</TaskItemsFormatConsumer>
				</TaskItemsFormatProvider>
			</FabricElementsAnalyticsContext>
		);
	};

	render(): React.JSX.Element {
		return (
			<WithProviders
				// eslint-disable-next-line @atlassian/perf-linting/no-unstable-inline-props -- Ignored via go/ees017 (to be fixed)
				providers={['taskDecisionProvider', 'contextIdentifierProvider']}
				providerFactory={this.providerFactory}
				renderNode={this.renderWithProvider}
			/>
		);
	}
}
