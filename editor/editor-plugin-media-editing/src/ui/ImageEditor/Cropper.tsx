import React, {
	forwardRef,
	useImperativeHandle,
	useRef,
	type CSSProperties,
	useCallback,
	useEffect,
	useState,
} from 'react';

import {
	type CropperCanvasElement,
	type CropperSelectionElement,
	type CropperEventHandler,
	type CropperImageElement,
} from './types';

const isSSRRender = (): boolean =>
	typeof document === 'undefined' || process.env.REACT_SSR === 'true';

/**
 * Props for the Cropper component
 */
export interface CropperProps {
	/** Alt text for the image */
	alt?: string;
	/** Aspect ratio for the crop selection (e.g., 16/9, 1, 4/3) */
	aspectRatio?: number;
	/** Enable background rendering */
	background?: boolean;
	/** Custom class name */
	className?: string;
	/** CORS setting for the image */
	crossOrigin?: 'anonymous' | 'use-credentials' | '';
	/** Initial aspect ratio */
	initialAspectRatio?: number;
	/** Initial coverage of the image (0-1) */
	initialCoverage?: number;
	/** Enable selection movement */
	movable?: boolean;
	/** Enable multiple selections */
	multiple?: boolean;
	/** Callback when crop area changes */
	onChange?: CropperEventHandler;
	/** Callback when crop action ends */
	onCropEnd?: CropperEventHandler;
	/** Callback when crop action moves */
	onCropMove?: CropperEventHandler;
	/** Callback when crop action starts */
	onCropStart?: CropperEventHandler;
	/** Callback when image is ready */
	onImageReady?: (isReady: boolean) => void;
	/** Callback when cropper is ready */
	onReady?: (canvas: CropperCanvasElement) => void;
	/** Show outlined selection */
	outlined?: boolean;
	/** Enable selection resizing */
	resizable?: boolean;
	/** Enable rotation */
	rotatable?: boolean;
	/** Enable scaling */
	scalable?: boolean;
	/** Image source URL */
	src: string;
	/** Custom styles */
	style?: CSSProperties;
	/** Enable translation */
	translatable?: boolean;
	/** Enable zooming */
	zoomable?: boolean;
}

// Type-safe intrinsic element types for CropperJS web components (local to this file)
type CropperCanvasProps = React.DetailedHTMLProps<
	React.HTMLAttributes<HTMLElement>,
	HTMLElement
> & {
	background?: boolean;
	class?: string;
	ref?: React.Ref<CropperCanvasElement>;
};

type CropperImageProps = React.DetailedHTMLProps<
	React.HTMLAttributes<HTMLImageElement>,
	HTMLImageElement
> & {
	alt?: string;
	crossorigin?: string;
	'initial-center-size'?: string;
	ref?: React.Ref<CropperImageElement>;
	rotatable?: boolean;
	scalable?: boolean;
	src?: string;
	translatable?: boolean;
};

type CropperSelectionProps = React.DetailedHTMLProps<
	React.HTMLAttributes<HTMLElement>,
	HTMLElement
> & {
	'aspect-ratio'?: number;
	'initial-aspect-ratio'?: number;
	'initial-coverage'?: number;
	movable?: boolean;
	multiple?: boolean;
	outlined?: boolean;
	ref?: React.Ref<CropperSelectionElement>;
	resizable?: boolean;
	zoomable?: boolean;
};

type CropperGridProps = React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
	bordered?: boolean;
	covered?: boolean;
	role?: string;
};

type CropperCrosshairProps = React.DetailedHTMLProps<
	React.HTMLAttributes<HTMLElement>,
	HTMLElement
> & {
	centered?: boolean;
};

type CropperHandleProps = React.DetailedHTMLProps<
	React.HTMLAttributes<HTMLElement>,
	HTMLElement
> & {
	action?: string;
};

// Helper to create web component elements with proper typing
const CropperCanvas = 'cropper-canvas' as unknown as (
	props: CropperCanvasProps,
) => React.ReactElement;
const CropperImage = 'cropper-image' as unknown as (props: CropperImageProps) => React.ReactElement;
const CropperSelection = 'cropper-selection' as unknown as (
	props: CropperSelectionProps,
) => React.ReactElement;
const CropperGrid = 'cropper-grid' as unknown as (props: CropperGridProps) => React.ReactElement;
const CropperCrosshair = 'cropper-crosshair' as unknown as (
	props: CropperCrosshairProps,
) => React.ReactElement;
const CropperHandle = 'cropper-handle' as unknown as (
	props: CropperHandleProps,
) => React.ReactElement;

/**
 * Options for getting the cropped canvas
 */
export interface GetCroppedCanvasOptions {
	/** Callback before drawing the image onto the canvas */
	beforeDraw?: (context: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => void;
	/** Height of the output canvas */
	height?: number;
	/** Width of the output canvas */
	width?: number;
}

/**
 * Methods exposed via ref
 */
export interface CropperRef {
	getCanvas: () => CropperCanvasElement | null;
	getCroppedCanvas: (options?: GetCroppedCanvasOptions) => Promise<HTMLCanvasElement | null>;
	getImage: () => CropperImageElement | null;
	isImageReady: boolean;
}

/**
 * Cropper component - A React wrapper for CropperJS 2.x web components
 *
 * @example
 * ```tsx
 * const cropperRef = useRef<CropperRef>(null);
 *
 * <Cropper
 *   ref={cropperRef}
 *   src="/image.jpg"
 *   aspectRatio={16/9}
 *   onReady={(canvas) => console.log('Ready!')}
 *   onChange={(e) => console.log(e.detail.bounds)}
 * />
 * ```
 */
export const Cropper = forwardRef<CropperRef, CropperProps>(
	(
		{
			src,
			alt = '',
			crossOrigin,
			aspectRatio,
			initialAspectRatio,
			initialCoverage = 1,
			background = true,
			rotatable = true,
			scalable = true,
			translatable = true,
			movable = true,
			resizable = true,
			zoomable = true,
			multiple = false,
			outlined = true,
			className,
			onImageReady,
		},
		ref,
	) => {
		const canvasRef = useRef<CropperCanvasElement>(null);
		const selectionRef = useRef<CropperSelectionElement>(null);
		const imageRef = useRef<CropperImageElement>(null);
		const [isImageReady, setIsImageReady] = useState(false);
		const [isCropperLoaded, setIsCropperLoaded] = useState(false);

		const getCanvas = useCallback(() => canvasRef.current, []);
		const getImage = useCallback(() => imageRef.current, []);

		const getCroppedCanvas = useCallback(
			(options?: GetCroppedCanvasOptions): Promise<HTMLCanvasElement | null> => {
				const selection = selectionRef.current;
				if (!selection) {
					return Promise.resolve(null);
				}
				// Check if the $toCanvas method exists (web component might not be fully initialized)
				if (typeof selection.$toCanvas !== 'function') {
					return Promise.resolve(null);
				}
				return selection.$toCanvas(options);
			},
			[],
		);

		const fitStencilToImage = () => {
			const canvas = canvasRef.current;
			const image = imageRef.current;
			const selection = selectionRef.current;

			if (canvas && image && selection) {
				// Get the real time positions
				const canvasRect = canvas.getBoundingClientRect();
				const imageRect = image.getBoundingClientRect();

				// Calculate coordinates relative to the canvas
				const x = imageRect.left - canvasRect.left;
				const y = imageRect.top - canvasRect.top;
				const width = imageRect.width;
				const height = imageRect.height;

				// Apply these to the selection (the stencil)
				if (typeof selection.$change === 'function') {
					selection.$change(x, y, width, height);
				}
			}
		};

		// Lazy load cropperjs only on the client to avoid SSR side effects
		useEffect(() => {
			if (!isSSRRender()) {
				import('cropperjs')
					.then(() => setIsCropperLoaded(true))
					.catch(() => {
						setIsCropperLoaded(false);
					});
			}
		}, []);
		// Auto-fit stencil to image on mount and when src changes
		// Only run after cropperjs has loaded (client-side only, post-hydration)
		useEffect(() => {
			if (!isCropperLoaded) {
				return;
			}

			setIsImageReady(false); // Hide canvas while repositioning
			const image = imageRef.current;
			if (!image) {
				return;
			}

			// Wait for the image to be fully loaded
			if (typeof image.$ready === 'function') {
				image.$ready(() => {
					fitStencilToImage();
					setIsImageReady(true); // Show canvas after positioning
					onImageReady?.(true);
				});
			} else {
				// Fallback to timeout if $ready is not available
				const timer = setTimeout(() => {
					fitStencilToImage();
					setIsImageReady(true);
					onImageReady?.(true);
				}, 2000);
				return () => clearTimeout(timer);
			}
		}, [src, isCropperLoaded, onImageReady]); 
		useImperativeHandle(
			ref,
			() => ({
				getCanvas,
				getCroppedCanvas,
				getImage,
				isImageReady,
			}),
			[getCanvas, getCroppedCanvas, getImage, isImageReady],
		);

		return (
			<CropperCanvas
				ref={canvasRef}
				class={className}
				background={background}
				style={{ opacity: isImageReady ? 1 : 0 }}
			>
				<CropperImage
					ref={imageRef}
					src={src}
					alt={alt}
					crossorigin={crossOrigin}
					rotatable={rotatable}
					scalable={scalable}
					translatable={translatable}
					initial-center-size="contain"
				/>
				<CropperSelection
					ref={selectionRef}
					initial-coverage={initialCoverage}
					aspect-ratio={aspectRatio}
					initial-aspect-ratio={initialAspectRatio}
					movable={movable}
					resizable={resizable}
					zoomable={zoomable}
					multiple={multiple}
					outlined={outlined}
				>
					<CropperGrid role="grid" bordered covered />
					<CropperCrosshair centered />
					<CropperHandle action="move" />
					<CropperHandle action="n-resize" />
					<CropperHandle action="e-resize" />
					<CropperHandle action="s-resize" />
					<CropperHandle action="w-resize" />
					<CropperHandle action="ne-resize" />
					<CropperHandle action="nw-resize" />
					<CropperHandle action="se-resize" />
					<CropperHandle action="sw-resize" />
				</CropperSelection>
			</CropperCanvas>
		);
	},
);

Cropper.displayName = 'Cropper';
