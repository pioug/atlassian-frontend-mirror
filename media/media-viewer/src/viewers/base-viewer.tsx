import React, { Fragment } from 'react';

import deepEqual from 'deep-equal';
import { FormattedMessage } from 'react-intl';

import { type MediaClient, type FileState, globalMediaEventEmitter } from '@atlaskit/media-client';
import { type MediaTraceContext } from '@atlaskit/media-common';
import { messages } from '@atlaskit/media-ui/messages';

import type { Outcome } from '../domain/outcome';
import ErrorMessage from '../errorMessageWithAnalytics';
import { ErrorViewDownloadButton } from '../ErrorViewDownloadButton';
import { Spinner } from '../loading';
import type { MediaViewerError } from '../MediaViewerError';

export type BaseProps = {
	mediaClient: MediaClient;
	item: FileState;
	collectionName?: string;
	traceContext: MediaTraceContext;
};

export type BaseState<Content> = {
	content: Outcome<Content, MediaViewerError>;
};

export abstract class BaseViewer<
	Content,
	Props extends BaseProps,
	State extends BaseState<Content> = BaseState<Content>,
> extends React.Component<Props, State> {
	state: State = this.getInitialState();
	protected mounted: boolean = false;

	componentDidMount(): void {
		this.mounted = true;
		this.init();
	}

	componentWillUnmount(): void {
		this.mounted = false;
		this.release();
	}

	protected safeSetState(newState: Partial<State>): void {
		if (this.mounted) {
			this.setState({ ...this.state, ...newState });
		}
	}

	componentDidUpdate(prevProps: Props): void {
		if (this.needsReset(prevProps, this.props)) {
			this.release();
			this.setState(this.initialState);
			this.init();
		}
	}

	render(): React.JSX.Element {
		return this.state.content.match({
			pending: () => <Spinner />,
			successful: (content) => <Fragment>{this.renderSuccessful(content)}</Fragment>,
			failed: (error) => {
				const { item } = this.props;
				return (
					<ErrorMessage
						fileId={item.id}
						fileState={item}
						error={error}
						supressAnalytics={true} // item-viewer.tsx will send
					>
						{/* eslint-disable-next-line @atlaskit/design-system/use-primitives-text */}
						<p>
							<FormattedMessage {...messages.try_downloading_file} />
						</p>
						{this.renderDownloadButton(error)}
					</ErrorMessage>
				);
			},
		});
	}

	// Accessing abstract getters in a constructor is not allowed
	private getInitialState() {
		return this.initialState;
	}

	private renderDownloadButton(error: MediaViewerError) {
		const { item, mediaClient, collectionName, traceContext } = this.props;
		return (
			<ErrorViewDownloadButton
				fileState={item}
				mediaClient={mediaClient}
				error={error}
				collectionName={collectionName}
				traceContext={traceContext}
			/>
		);
	}

	protected onMediaDisplayed = (): void => {
		const { item } = this.props;
		globalMediaEventEmitter.emit('media-viewed', {
			fileId: item.id,
			viewingLevel: 'full',
		});
	};

	protected needsReset(propsA: Props, propsB: Props): boolean {
		return !deepEqual(propsA.item, propsB.item) || propsA.collectionName !== propsB.collectionName;
	}

	protected abstract init(): void;
	protected abstract release(): void;
	protected abstract get initialState(): State;
	protected abstract renderSuccessful(content: Content): React.ReactNode;
}
