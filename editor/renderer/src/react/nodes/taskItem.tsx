import React, { PureComponent, type ReactNode } from 'react';
import { ProviderFactory, WithProviders } from '@atlaskit/editor-common/provider-factory';
import TaskItemWithProviders from './task-item-with-providers';
import { type RendererContext, type NodeProps } from '../types';
import { FabricElementsAnalyticsContext } from '@atlaskit/analytics-namespaced-context';
import { TaskItemsFormatProvider, TaskItemsFormatConsumer } from '../../ui/TaskItemsFormatContext';

export interface Props {
	localId: string;
	rendererContext?: RendererContext;
	state?: string;
	providers?: ProviderFactory;
	children?: ReactNode;
	disabled?: boolean;
}

export default class TaskItem extends PureComponent<NodeProps<Props>, {}> {
	private providerFactory: ProviderFactory;

	constructor(props: NodeProps<Props>) {
		super(props);
		this.providerFactory = props.providers || new ProviderFactory();
	}

	componentWillUnmount() {
		if (!this.props.providers) {
			// new ProviderFactory is created if no `providers` has been set
			// in this case when component is unmounted it's safe to destroy this providerFactory
			this.providerFactory.destroy();
		}
	}

	private renderWithProvider = (providers: any) => {
		const { taskDecisionProvider, contextIdentifierProvider } = providers;
		const { children, localId, state, rendererContext, disabled, dataAttributes } = this.props;
		let objectAri = '';
		if (rendererContext) {
			objectAri = rendererContext.objectAri || '';
		}

		return (
			<FabricElementsAnalyticsContext
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
								taskDecisionProvider={taskDecisionProvider}
								contextIdentifierProvider={contextIdentifierProvider}
								dataAttributes={dataAttributes}
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

	render() {
		return (
			<WithProviders
				providers={['taskDecisionProvider', 'contextIdentifierProvider']}
				providerFactory={this.providerFactory}
				renderNode={this.renderWithProvider}
			/>
		);
	}
}
