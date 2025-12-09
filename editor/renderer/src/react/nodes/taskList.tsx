import React, { PureComponent, Children, type ReactNode } from 'react';

import { TaskList as AkTaskList } from '@atlaskit/task-decision';

export interface Props {
	children?: ReactNode;
	localId?: string;
}

// Ignored via go/ees005
// eslint-disable-next-line @repo/internal/react/no-class-components
export default class TaskList extends PureComponent<Props, Object> {
	render(): React.JSX.Element | null {
		const { children, localId } = this.props;

		if (Children.count(children) === 0) {
			return null;
		}

		return <AkTaskList listId={localId}>{children}</AkTaskList>;
	}
}
