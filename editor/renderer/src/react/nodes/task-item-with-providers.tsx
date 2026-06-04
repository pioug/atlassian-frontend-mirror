import React from 'react';
import type { ReactNode } from 'react';
import type { ContextIdentifierProvider } from '@atlaskit/editor-common/provider-factory';
import { ResourcedTaskItem } from '@atlaskit/task-decision';
import type { ContentRef, TaskDecisionProvider } from '@atlaskit/task-decision';

interface Props {
	children?: ReactNode;
	contentRef?: ContentRef;
	contextIdentifierProvider?: Promise<ContextIdentifierProvider>;
	dataAttributes?: { [key: string]: string | number };
	disabled?: boolean;
	disableOnChange?: boolean;
	isDone: boolean;
	isRenderer?: boolean;
	objectAri: string;
	onChange?: (taskId: string, isChecked: boolean) => void;
	showPlaceholder?: boolean;
	taskDecisionProvider?: Promise<TaskDecisionProvider>;
	taskId: string;
}

export default function TaskItemWithProviders(props: Props): React.JSX.Element {
	const { objectAri, isRenderer, ...otherProps } = props;

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
				} catch {}
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

	return (
		<div data-task-local-id={props.taskId || ''}>
			{/* eslint-disable-next-line react/jsx-props-no-spreading */}
			<ResourcedTaskItem {...otherProps} objectAri={resolvedObjectId} isRenderer={isRenderer} />
		</div>
	);
}
