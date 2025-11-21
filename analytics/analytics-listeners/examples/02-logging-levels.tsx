import Button from '@atlaskit/button/new';
import { token } from '@atlaskit/tokens';
import React from 'react';
import {
	createAnalyticsWebClientMock,
	createComponentWithAnalytics,
	IncorrectEventType,
} from './helpers';
import { LOG_LEVEL } from '../src';
import FabricAnalyticsListeners from '../src/FabricAnalyticsListeners';
import { FabricChannel } from '../src/types';

const DummyElementsComponentWithAnalytics = createComponentWithAnalytics(FabricChannel.elements);
const DummyAtlaskitComponentWithAnalytics = createComponentWithAnalytics(FabricChannel.atlaskit);
const AtlaskitIncorrectEventType = IncorrectEventType(FabricChannel.atlaskit);

const myOnClickHandler = () => {
	console.log('Button clicked');
};

const logLevels = [
	{ name: 'DEBUG', level: LOG_LEVEL.DEBUG },
	{ name: 'INFO', level: LOG_LEVEL.INFO },
	{ name: 'WARN', level: LOG_LEVEL.WARN },
	{ name: 'ERROR', level: LOG_LEVEL.ERROR },
	{ name: 'OFF', level: LOG_LEVEL.OFF },
];

class Example extends React.Component {
	state = {
		loggingLevelIdx: 0,
	};

	changeLogLevel = () => {
		this.setState({
			loggingLevelIdx: (this.state.loggingLevelIdx + 1) % logLevels.length,
		});
	};

	render(): React.JSX.Element {
		const logLevel = logLevels[this.state.loggingLevelIdx];
		return (
			<FabricAnalyticsListeners client={createAnalyticsWebClientMock()} logLevel={logLevel.level}>
				<div>
					{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
					<div style={{ display: 'flex', alignItems: 'center' }}>
						<Button appearance="primary" onClick={this.changeLogLevel}>
							Change log level
						</Button>
						<div
							style={{
								padding: `${token('space.200', '16px')} ${token('space.100', '8px')}`,
							}}
						>
							Level: {logLevel.name}
						</div>
					</div>
					{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
					<div style={{ display: 'block' }}>
						<DummyElementsComponentWithAnalytics onClick={myOnClickHandler} />
					</div>
					{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
					<div style={{ display: 'block' }}>
						<DummyAtlaskitComponentWithAnalytics onClick={myOnClickHandler} />
					</div>
					{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
					<div style={{ display: 'block' }}>
						<AtlaskitIncorrectEventType onClick={myOnClickHandler} />
					</div>
				</div>
			</FabricAnalyticsListeners>
		);
	}
}

Object.assign(Example, {
	meta: {
		noListener: true,
	},
});

export default Example;
