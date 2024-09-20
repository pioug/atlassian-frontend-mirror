import type { ReactElement, Ref } from 'react';
import React, { PureComponent } from 'react';

import type { WrappedComponentProps } from 'react-intl-next';
import { injectIntl } from 'react-intl-next';

import { tasksAndDecisionsMessages } from '@atlaskit/editor-common/messages';
import { ProviderFactory, WithProviders } from '@atlaskit/editor-common/provider-factory';
import type { Providers } from '@atlaskit/editor-common/provider-factory';
import type { ContentRef } from '@atlaskit/task-decision';

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
}

// eslint-disable-next-line @repo/internal/react/no-class-components
export class TaskItem extends PureComponent<TaskProps & WrappedComponentProps, {}> {
	static displayName = 'TaskItem';

	private providerFactory: ProviderFactory;

	constructor(props: TaskProps & WrappedComponentProps) {
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
			...otherProps
		} = this.props;
		const { taskDecisionProvider, contextIdentifierProvider } = providers;
		const placeholder = formatMessage(tasksAndDecisionsMessages.taskPlaceholder);

		return (
			<TaskItemWithProviders
				{...otherProps}
				placeholder={placeholder}
				taskDecisionProvider={taskDecisionProvider}
				contextIdentifierProvider={contextIdentifierProvider}
			/>
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

export default injectIntl(TaskItem);
