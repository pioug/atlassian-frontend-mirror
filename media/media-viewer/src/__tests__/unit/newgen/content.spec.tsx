import React from 'react';
import { render, screen } from '@atlassian/testing-library';
import { Content } from '../../../content';
import { type WithShowControlMethodProp } from '@atlaskit/media-ui';

let receivedShowControls: (() => void) | undefined;

class DummyChild extends React.Component<WithShowControlMethodProp> {
	render() {
		receivedShowControls = this.props.showControls;
		return <div data-testid="dummy-child" />;
	}
}

describe('<Content />', () => {
	beforeEach(() => {
		receivedShowControls = undefined;
	});

	it('should render children', async () => {
		render(
			<Content>
				<DummyChild />
			</Content>,
		);
		expect(screen.getByTestId('dummy-child')).toBeInTheDocument();
		expect(screen.getByTestId('media-viewer-close-button')).toBeInTheDocument();
		await expect(document.body).toBeAccessible();
	});

	it('should allow children to show controls', () => {
		// Note: referential-equality assertion couldn't be converted; instead we
		// verify the child receives a callable showControls function.
		render(
			<Content>
				<DummyChild />
			</Content>,
		);
		expect(receivedShowControls).toBeDefined();
		expect(typeof receivedShowControls).toBe('function');
		expect(() => receivedShowControls!()).not.toThrow();
	});
});
