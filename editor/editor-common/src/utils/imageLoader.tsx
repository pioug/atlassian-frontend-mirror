import React, { Component } from 'react';
import type { ComponentType } from 'react';

export interface ImageLoaderProps {
	imageStatus?: ImageStatus;
	onExternalImageLoaded?: (dimensions: { height: number; width: number }) => void;
	url?: string;
}

export interface ImageLoaderState {
	imageStatus: ImageStatus;
}

export type ImageStatus = 'complete' | 'loading' | 'error';

export const withImageLoaderOld = <P extends Object>(
	Wrapped: ComponentType<React.PropsWithChildren<P & ImageLoaderProps>>,
): React.ComponentClass<P & ImageLoaderProps> =>
	class WithImageLoader extends Component<P & ImageLoaderProps, ImageLoaderState> {
		state: ImageLoaderState = {
			imageStatus: 'loading',
		};

		img?: HTMLImageElement | null;

		/**
		 *
		 * @example
		 */
		componentDidMount() {
			this.fetchImage(this.props);
		}

		/**
		 *
		 * @param nextProps
		 * @example
		 */
		// Ignored via go/ees005
		// eslint-disable-next-line react/no-unsafe
		UNSAFE_componentWillReceiveProps(nextProps: ImageLoaderProps) {
			if (nextProps.url !== this.props.url) {
				this.setState({
					imageStatus: 'loading',
				});
				this.fetchImage(nextProps);
			}
		}

		/**
		 *
		 * @example
		 */
		componentWillUnmount() {
			if (this.img) {
				if (!process.env.REACT_SSR) {
					// Ignored via go/ees005
					// eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
					this.img.removeEventListener('load', this.onLoad);
					// Ignored via go/ees005
					// eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
					this.img.removeEventListener('error', this.onError);
					this.img = null;
				}
			}
		}

		/**
		 *
		 * @param root0
		 * @param root0.url
		 * @example
		 */
		fetchImage({ url }: ImageLoaderProps) {
			if (url) {
				if (!this.img) {
					this.img = new Image();

					if (!process.env.REACT_SSR) {
						// Ignored via go/ees005
						// eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
						this.img.addEventListener('load', this.onLoad);
						// Ignored via go/ees005
						// eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
						this.img.addEventListener('error', this.onError);
					}
				}

				this.img.src = url;
			}
		}

		onLoad = () => {
			this.setState({
				imageStatus: 'complete',
			});

			const { onExternalImageLoaded } = this.props;
			if (onExternalImageLoaded && this.img) {
				onExternalImageLoaded({
					width: this.img.naturalWidth,
					height: this.img.naturalHeight,
				});
			}
		};

		onError = () => {
			this.setState({
				imageStatus: 'error',
			});
		};

		/**
		 *
		 * @example
		 */
		render() {
			const { imageStatus } = this.state;
			// Ignored via go/ees005
			// eslint-disable-next-line react/jsx-props-no-spreading
			return <Wrapped {...this.props} imageStatus={imageStatus} />;
		}
	};

const withImageLoaderNew = <P extends Object>(
	Wrapped: ComponentType<React.PropsWithChildren<P & ImageLoaderProps>>,
): React.ComponentClass<P & ImageLoaderProps> =>
	class WithImageLoader extends Component<P & ImageLoaderProps, ImageLoaderState> {
		state: ImageLoaderState = {
			imageStatus: 'loading',
		};

		img?: HTMLImageElement | null;

		componentDidMount() {
			this.fetchImage(this.props);
		}

		componentDidUpdate(newProps: ImageLoaderProps) {
			if (newProps.url !== this.props.url) {
				this.setState({
					imageStatus: 'loading',
				});
				this.fetchImage(newProps);
			}
		}

		componentWillUnmount() {
			if (this.img) {
				if (!process.env.REACT_SSR) {
					// Ignored via go/ees005
					// eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
					this.img.removeEventListener('load', this.onLoad);
					// Ignored via go/ees005
					// eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
					this.img.removeEventListener('error', this.onError);
				}

				this.img = null;
			}
		}

		fetchImage({ url }: ImageLoaderProps) {
			if (url) {
				if (!this.img) {
					this.img = new Image();

					if (!process.env.REACT_SSR) {
						// Ignored via go/ees005
						// eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
						this.img.addEventListener('load', this.onLoad);
						// Ignored via go/ees005
						// eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
						this.img.addEventListener('error', this.onError);
					}
				}

				this.img.src = url;
			}
		}

		onLoad = () => {
			this.setState({
				imageStatus: 'complete',
			});

			const { onExternalImageLoaded } = this.props;
			if (onExternalImageLoaded && this.img) {
				onExternalImageLoaded({
					width: this.img.naturalWidth,
					height: this.img.naturalHeight,
				});
			}
		};

		onError = () => {
			this.setState({
				imageStatus: 'error',
			});
		};

		render() {
			const { imageStatus } = this.state;
			// Ignored via go/ees005
			// eslint-disable-next-line react/jsx-props-no-spreading
			return <Wrapped {...this.props} imageStatus={imageStatus} />;
		}
	};

export const withImageLoader = <P extends Object>(
	Wrapped: ComponentType<React.PropsWithChildren<P & ImageLoaderProps>>,
): React.ComponentClass<P & ImageLoaderProps> => {
	return withImageLoaderNew(Wrapped);
};
