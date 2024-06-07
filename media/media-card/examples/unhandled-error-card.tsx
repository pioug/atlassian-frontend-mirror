/**@jsx jsx */
import { jsx } from '@emotion/react';
import React, { Component, useState } from 'react';
import { unhandledErrorCardWrapperStyles } from '../example-helpers/styles';
import { MainWrapper } from '../example-helpers';
import MediaCardAnalyticsErrorBoundary from '../src/card/media-card-analytics-error-boundary';

class MockComponentThrown extends Component {
	componentDidMount() {
		throw new Error('whatever');
	}
	render(): React.ReactNode {
		return <div>Mock Component</div>;
	}
}

const Example = () => {
	const [width, setWidth] = useState<string | number>(500);
	const [height, setHeight] = useState<string | number>(300);

	return (
		<MainWrapper>
			<h1>Unhandled error card with different dimension</h1>
			<div css={unhandledErrorCardWrapperStyles}>
				<div>
					<label>
						Width:
						<input value={width} onChange={(e) => setWidth(e.target.value)} />
					</label>
					<label>
						Height:
						<input value={height} onChange={(e) => setHeight(e.target.value)} />
					</label>
				</div>
				<div>
					<h2>{`${width} x ${height}`}</h2>
					<MediaCardAnalyticsErrorBoundary dimensions={{ width, height }}>
						<MockComponentThrown />
					</MediaCardAnalyticsErrorBoundary>
				</div>
			</div>
		</MainWrapper>
	);
};

export default () => <Example />;
