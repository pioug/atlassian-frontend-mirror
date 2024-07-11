import React, { type ReactNode } from 'react';
import type { ContextIdentifierProvider } from '@atlaskit/editor-common/provider-factory';
import {
	type ContentRef,
	type TaskDecisionProvider,
	ResourcedTaskItem,
} from '@atlaskit/task-decision';

export interface Props {
	taskId: string;
	objectAri: string;
	isDone: boolean;
	isRenderer?: boolean;
	contentRef?: ContentRef;
	onChange?: (taskId: string, isChecked: boolean) => void;
	showPlaceholder?: boolean;
	children?: ReactNode;
	taskDecisionProvider?: Promise<TaskDecisionProvider>;
	contextIdentifierProvider?: Promise<ContextIdentifierProvider>;
	disabled?: boolean;
	dataAttributes?: { [key: string]: string | number };
}

export interface State {
	resolvedContextProvider?: ContextIdentifierProvider;
}

export default function TaskItemWithProviders(props: Props) {
	const { contextIdentifierProvider, objectAri, isRenderer, ...otherProps } = props;

	const [resolvedContextProvider, setResolvedContextProvider] = React.useState<
		ContextIdentifierProvider | undefined
	>(undefined);

	const updateContextIdentifierProvider = React.useCallback(
		async (contextIdentifierProvider: Promise<ContextIdentifierProvider> | undefined) => {
			if (contextIdentifierProvider) {
				try {
					const resolvedContextProvider = await contextIdentifierProvider;
					setResolvedContextProvider(resolvedContextProvider);
					return;
				} catch (err) {}
			}

			setResolvedContextProvider(undefined);
		},
		[],
	);

	React.useMemo(() => {
		updateContextIdentifierProvider(props.contextIdentifierProvider);
	}, [props.contextIdentifierProvider, updateContextIdentifierProvider]);

	const resolvedObjectId =
		(resolvedContextProvider && resolvedContextProvider.objectId) || objectAri;

	return <ResourcedTaskItem {...otherProps} objectAri={resolvedObjectId} isRenderer={isRenderer} />;
}
