import React, { PureComponent, Children } from 'react';

import { DecisionList as AkDecisionList } from '@atlaskit/task-decision';

export interface Props {
	children?: JSX.Element | JSX.Element[];
}

// Ignored via go/ees005
// eslint-disable-next-line @repo/internal/react/no-class-components
export default class DecisionList extends PureComponent<Props, Object> {
	render(): React.JSX.Element | null {
		const { children } = this.props;

		if (Children.count(children) === 0) {
			return null;
		}

		return <AkDecisionList>{children}</AkDecisionList>;
	}
}
