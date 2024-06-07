import { token } from '@atlaskit/tokens';
import React from 'react';
import { IntlProvider } from 'react-intl-next';
import { HttpError } from '../src/api/MentionResource';
import MentionList from '../src/components/MentionList';

const resourceError = new Error('monkey trousers');
const error401 = new HttpError(401, 'not used');
const error403 = new HttpError(403, 'not used');

export interface State {
	error: Error;
}

export default class DemoMentionList extends React.Component<any, State> {
	constructor(props: any) {
		super(props);
		this.state = {
			error: resourceError,
		};
	}

	private setGenericError = () => {
		this.setState({
			error: resourceError,
		});
	};

	private set401Error = () => {
		this.setState({
			error: error401,
		});
	};

	private set403Error = () => {
		this.setState({
			error: error403,
		});
	};

	render() {
		const mentionList = <MentionList mentions={[]} resourceError={this.state.error} />;

		return (
			<div style={{ paddingLeft: `${token('space.150', '12px')}` }}>
				<div style={{ paddingBottom: `${token('space.150', '12px')}` }}>
					<button
						onClick={this.setGenericError}
						style={{
							height: `${token('space.400', '32px')}`,
							marginRight: `${token('space.150', '12px')}`,
						}}
					>
						Generic
					</button>
					<button
						onClick={this.set401Error}
						style={{
							height: `${token('space.400', '32px')}`,
							marginRight: `${token('space.150', '12px')}`,
						}}
					>
						401
					</button>
					<button
						onClick={this.set403Error}
						style={{
							height: `${token('space.400', '32px')}`,
							marginRight: `${token('space.150', '12px')}`,
						}}
					>
						403
					</button>
				</div>
				<IntlProvider locale="en">
					<div data-testid="vr-tested">{mentionList}</div>
				</IntlProvider>
			</div>
		);
	}
}
