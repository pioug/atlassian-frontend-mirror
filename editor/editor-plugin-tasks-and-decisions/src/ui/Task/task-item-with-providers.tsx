import type { ReactElement } from 'react';
import React, { Component } from 'react';

import { FabricElementsAnalyticsContext } from '@atlaskit/analytics-namespaced-context';
import type { ContextIdentifierProvider } from '@atlaskit/editor-common/provider-factory';
import type { ContentRef, TaskDecisionProvider } from '@atlaskit/task-decision';
import { ResourcedTaskItem } from '@atlaskit/task-decision';

export interface Props {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	children?: ReactElement<any>;
	contentRef?: ContentRef;
	contextIdentifierProvider?: Promise<ContextIdentifierProvider>;
	inputRef?: React.Ref<HTMLInputElement>;
	isDone: boolean;
	isFocused?: boolean;
	onChange?: (taskId: string, isChecked: boolean) => void;
	placeholder?: string;
	showPlaceholder?: boolean;
	taskDecisionProvider?: Promise<TaskDecisionProvider>;
	taskId: string;
}

export interface State {
	resolvedContextProvider?: ContextIdentifierProvider;
}
// eslint-disable-next-line @repo/internal/react/no-class-components
export default class TaskItemWithProviders extends Component<Props, State> {
	static displayName = 'TaskItemWithProviders';

	state: State = { resolvedContextProvider: undefined };

	// Storing the mounted state is an anti-pattern, however the asynchronous state
	// updates via `updateContextIdentifierProvider` means we may be dismounted before
	// it receives a response.
	// Since we can't cancel the Promise we store the mounted state to avoid state
	// updates when no longer suitable.
	private mounted = false;

	componentDidMount() {
		this.mounted = true;
		this.updateContextIdentifierProvider(this.props);
	}

	componentDidUpdate(prevProps: Props) {
		if (this.props.contextIdentifierProvider !== prevProps.contextIdentifierProvider) {
			this.updateContextIdentifierProvider(this.props);
		}
	}

	componentWillUnmount() {
		this.mounted = false;
	}

	private async updateContextIdentifierProvider(props: Props) {
		if (props.contextIdentifierProvider) {
			try {
				const resolvedContextProvider = await props.contextIdentifierProvider;
				if (this.mounted) {
					this.setState({ resolvedContextProvider });
				}
			} catch (err) {
				if (this.mounted) {
					this.setState({ resolvedContextProvider: undefined });
				}
			}
		} else {
			this.setState({ resolvedContextProvider: undefined });
		}
	}

	render(): React.JSX.Element {
		const { contextIdentifierProvider, ...otherProps } = this.props;
		const { objectId } = this.state.resolvedContextProvider || ({} as ContextIdentifierProvider);
		const userContext = objectId ? 'edit' : 'new';

		return (
			<FabricElementsAnalyticsContext
				data={{
					userContext,
				}}
			>
				<ResourcedTaskItem
					// Ignored via go/ees005
					// eslint-disable-next-line react/jsx-props-no-spreading
					{...otherProps}
					objectAri={objectId}
				/>
			</FabricElementsAnalyticsContext>
		);
	}
}
