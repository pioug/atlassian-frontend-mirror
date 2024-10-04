import type { ReactElement, Ref } from 'react';
import React, { PureComponent } from 'react';

import type { WrappedComponentProps } from 'react-intl-next';
import { injectIntl } from 'react-intl-next';

import { useSharedPluginState } from '@atlaskit/editor-common/hooks';
import { tasksAndDecisionsMessages } from '@atlaskit/editor-common/messages';
import { ProviderFactory, WithProviders } from '@atlaskit/editor-common/provider-factory';
import type { Providers } from '@atlaskit/editor-common/provider-factory';
import { type ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { fg } from '@atlaskit/platform-feature-flags';
import type { ContentRef, TaskDecisionProvider } from '@atlaskit/task-decision';

import { type TaskAndDecisionsSharedState, type TasksAndDecisionsPlugin } from '../../types';

import TaskItemWithProviders from './task-item-with-providers';

export interface TaskProps {
	taskId: string;
	isDone: boolean;
	isFocused?: boolean;
	contentRef?: ContentRef;
	onChange?: (taskId: string, isChecked: boolean) => void;
	onClick?: () => void;
	showPlaceholder?: boolean;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	children?: ReactElement<any>;
	providers?: ProviderFactory;
	disabled?: boolean;
	disableOnChange?: boolean;
	inputRef?: Ref<HTMLInputElement>;
	api: ExtractInjectionAPI<TasksAndDecisionsPlugin> | undefined;
}

type TaskItemProps = TaskProps &
	WrappedComponentProps & {
		taskDecisionState: TaskAndDecisionsSharedState | undefined;
	};

// eslint-disable-next-line @repo/internal/react/no-class-components
export class TaskItem extends PureComponent<TaskItemProps, {}> {
	static displayName = 'TaskItem';

	private providerFactory: ProviderFactory;

	constructor(props: TaskItemProps) {
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

	private renderWithProvider = (providers: Providers) => {
		const {
			providers: _providerFactory,
			intl: { formatMessage },
			api,
			...otherProps
		} = this.props;
		const { contextIdentifierProvider } = providers;
		const placeholder = formatMessage(tasksAndDecisionsMessages.taskPlaceholder);
		const getTaskDecisionProvider = (): Promise<TaskDecisionProvider> | undefined => {
			if (fg('platform_editor_td_provider_from_plugin_config')) {
				return this.props.taskDecisionState?.taskDecisionProvider
					? Promise.resolve(this.props.taskDecisionState.taskDecisionProvider)
					: undefined;
			}
			return providers.taskDecisionProvider;
		};

		return (
			<TaskItemWithProviders
				{...otherProps}
				placeholder={placeholder}
				taskDecisionProvider={getTaskDecisionProvider()}
				contextIdentifierProvider={contextIdentifierProvider}
			/>
		);
	};

	render() {
		const providers: (keyof Providers)[] = ['contextIdentifierProvider'];
		if (!fg('platform_editor_td_provider_from_plugin_config')) {
			providers.push('taskDecisionProvider');
		}

		return (
			<WithProviders
				providers={providers}
				providerFactory={this.providerFactory}
				renderNode={this.renderWithProvider}
			/>
		);
	}
}

const TaskItemWrapper = (props: TaskProps & WrappedComponentProps) => {
	const { taskDecisionState } = useSharedPluginState(props.api, ['taskDecision']);
	return <TaskItem taskDecisionState={taskDecisionState} {...props} />;
};

export default injectIntl(TaskItemWrapper);
