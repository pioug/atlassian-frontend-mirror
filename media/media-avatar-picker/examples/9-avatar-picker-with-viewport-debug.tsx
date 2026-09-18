import React from 'react';
import { Component } from 'react';

import StatefulAvatarPickerDialog from '../example-helpers/StatefulAvatarPickerDialog';
import { ViewportDebugger } from '../example-helpers/viewport-debug';
import { CONTAINER_SIZE, CONTAINER_PADDING } from '../src/avatar-picker-dialog/layout-const';

class Example extends Component<{}, {}> {
	debugView?: ViewportDebugger;

	componentDidMount = () => {
		this.debugView = new ViewportDebugger(
			{ x: 10, y: 10 },
			{ x: 10 + CONTAINER_PADDING, y: CONTAINER_SIZE + 20 },
		);
	};

	render() {
		return <StatefulAvatarPickerDialog />;
	}
}

export default (): React.JSX.Element => <Example />;
