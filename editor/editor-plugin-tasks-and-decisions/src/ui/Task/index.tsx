import type { ReactElement, Ref } from 'react';
import React, { PureComponent } from 'react';

import type { WrappedComponentProps } from 'react-intl-next';
import { injectIntl } from 'react-intl-next';

import { tasksAndDecisionsMessages } from '@atlaskit/editor-common/messages';
import { ProviderFactory, WithProviders } from '@atlaskit/editor-common/provider-factory';
import type { Providers } from '@atlaskit/editor-common/provider-factory';
import { type ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { useSharedPluginStateSelector } from '@atlaskit/editor-common/use-shared-plugin-state-selector';
import type { ContentRef } from '@atlaskit/task-decision';

import type { TasksAndDecisionsPlugin } from '../../tasksAndDecisionsPluginType';
import { type TaskAndDecisionsSharedState } from '../../types';

import TaskItemWithProviders from './task-item-with-providers';

export interface TaskProps {
	api: ExtractInjectionAPI<TasksAndDecisionsPlugin> | undefined;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	children?: ReactElement<any>;
	contentRef?: ContentRef;
	disabled?: boolean;
	disableOnChange?: boolean;
	inputRef?: Ref<HTMLInputElement>;
	isDone: boolean;
	isFocused?: boolean;
	onChange?: (taskId: string, isChecked: boolean) => void;
	onClick?: () => void;
	placeholder?: string;
	providers?: ProviderFactory;
	showPlaceholder?: boolean;
	taskId: string;
}

type TaskItemProps = TaskProps &
	WrappedComponentProps & {
		taskDecisionProvider: TaskAndDecisionsSharedState['taskDecisionProvider'] | undefined;
	};

// eslint-disable-next-line @repo/internal/react/no-class-components
export class TaskItem extends PureComponent<TaskItemProps, Object> {
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
			taskDecisionProvider,
			api,
			placeholder,
			...otherProps
		} = this.props;
		const { contextIdentifierProvider } = providers;

		return (
			<TaskItemWithProviders
				// Ignored via go/ees005
				// eslint-disable-next-line react/jsx-props-no-spreading
				{...otherProps}
				placeholder={placeholder ?? formatMessage(tasksAndDecisionsMessages.taskPlaceholder)}
				taskDecisionProvider={
					taskDecisionProvider ? Promise.resolve(taskDecisionProvider) : undefined
				}
				contextIdentifierProvider={contextIdentifierProvider}
			/>
		);
	};

	render() {
		const providers: (keyof Providers)[] = ['contextIdentifierProvider'];

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
	const provider = useSharedPluginStateSelector(props.api, 'taskDecision.taskDecisionProvider');
	// Ignored via go/ees005
	// eslint-disable-next-line react/jsx-props-no-spreading
	return <TaskItem taskDecisionProvider={provider} {...props} />;
};

export default injectIntl(TaskItemWrapper);
