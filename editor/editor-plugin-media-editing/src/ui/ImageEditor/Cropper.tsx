/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import React, {
	forwardRef,
	useImperativeHandle,
	useRef,
	type CSSProperties,
	useCallback,
	useEffect,
	useState,
} from 'react';

import { jsx } from '@compiled/react';
import { bind } from 'bind-event-listener';

import {
	type CropperCanvasElement,
	type CropperSelectionElement,
	type CropperEventHandler,
	type CropperImageElement,
	type CropperBounds,
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
	/** Whether to render as circular crop (1:1 aspect ratio constraint) */
	isCircle?: boolean;
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

type CropperShadeProps = React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
	height?: number;
	width?: number;
	x?: number;
	y?: number;
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
const CropperShade = 'cropper-shade' as unknown as (props: CropperShadeProps) => React.ReactElement;
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
	fitStencilToImage: () => void;
	getCanvas: () => CropperCanvasElement | null;
	getCroppedCanvas: (options?: GetCroppedCanvasOptions) => Promise<HTMLCanvasElement | null>;
	getImage: () => CropperImageElement | null;
	getSelection: () => CropperSelectionElement | null;
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
			isCircle = false,
		},
		ref,
	) => {
		const canvasRef = useRef<CropperCanvasElement>(null);
		const selectionRef = useRef<CropperSelectionElement>(null);
		const imageRef = useRef<CropperImageElement>(null);
		const previousSelectionRef = useRef<{ height: number; width: number } | null>(null);
		const [isImageReady, setIsImageReady] = useState(false);
		const [isCropperLoaded, setIsCropperLoaded] = useState(false);
		const getCanvas = useCallback(() => canvasRef.current, []);
		const getImage = useCallback(() => imageRef.current, []);
		const getSelection = useCallback(() => selectionRef.current, []);

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

				// If circular crop, we need to apply a circular mask
				if (isCircle) {
					// For circular crops, force square dimensions to maintain perfect circle
					const squareOptions = {
						...options,
						height: options?.width, // Make height equal to width for a perfect circle
					};

					return selection.$toCanvas({
						...squareOptions,
						beforeDraw: (context: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
							// For circles, ensure we have a square canvas
							const size = Math.min(canvas.width, canvas.height);
							const radius = size / 2;
							const centerX = size / 2;
							const centerY = size / 2;

							// Enable high-quality image rendering
							context.imageSmoothingEnabled = true;
							context.imageSmoothingQuality = 'high';

							// Create a circular clipping path with anti-aliasing
							context.beginPath();
							context.arc(centerX, centerY, radius, 0, Math.PI * 2);
							context.clip();
						},
					});
				}

				return selection.$toCanvas(options);
			},
			[isCircle],
		);

		const fitStencilToImage = useCallback(() => {
			const canvas = canvasRef.current;
			const image = imageRef.current;
			const selection = selectionRef.current;

			if (canvas && image && selection) {
				// Get the real time positions
				const canvasRect = canvas.getBoundingClientRect();
				const imageRect = image.getBoundingClientRect();

				// Calculate coordinates relative to the canvas
				requestAnimationFrame(() => {
					const x = imageRect.left - canvasRect.left;
					const y = imageRect.top - canvasRect.top;
					const width = imageRect.width;
					const height = imageRect.height;

					// Apply these to the selection (the stencil)
					if (typeof selection.$change === 'function') {
						selection.$change(Math.floor(x), Math.floor(y), Math.floor(width), Math.floor(height));
					}
				});
			}
		}, []);

		// Clamp position to keep crop area within image boundaries
		const clampPosition = useCallback(
			(current: { height: number; width: number; x: number; y: number }) => {
				const canvas = canvasRef.current;
				const image = imageRef.current;
				if (!canvas || !image) {
					return null;
				}

				const canvasRect = canvas.getBoundingClientRect();
				const imageRect = image.getBoundingClientRect();

				const imageX = imageRect.left - canvasRect.left;
				const imageY = imageRect.top - canvasRect.top;
				const imageWidth = imageRect.width;
				const imageHeight = imageRect.height;

				let clampedX = current.x;
				let clampedY = current.y;

				// Clamp left/right
				if (clampedX < imageX) {
					clampedX = imageX;
				} else if (clampedX + current.width > imageX + imageWidth) {
					clampedX = imageX + imageWidth - current.width;
				}

				// Clamp top/bottom
				if (clampedY < imageY) {
					clampedY = imageY;
				} else if (clampedY + current.height > imageY + imageHeight) {
					clampedY = imageY + imageHeight - current.height;
				}

				return { x: clampedX, y: clampedY };
			},
			[],
		);

		// Correct dimensions when resizing with aspect ratio constraints
		const correctResizeDimensions = useCallback(
			(
				current: { height: number; width: number; x: number; y: number },
				selection: CropperSelectionElement,
			) => {
				const canvas = canvasRef.current;
				const image = imageRef.current;
				if (!canvas || !image) {
					return null;
				}

				const canvasRect = canvas.getBoundingClientRect();
				const imageRect = image.getBoundingClientRect();

				const imageX = imageRect.left - canvasRect.left;
				const imageY = imageRect.top - canvasRect.top;
				const imageWidth = imageRect.width;
				const imageHeight = imageRect.height;

				const maxWidthAvailable = imageX + imageWidth - current.x;
				const maxHeightAvailable = imageY + imageHeight - current.y;

				let correctedWidth = current.width;
				let correctedHeight = current.height;

				const hasAspectRatio = selection.aspectRatio && selection.aspectRatio > 0;

				if (hasAspectRatio) {
					const aspectRatio = selection.aspectRatio;
					const heightIfMaxWidth = maxWidthAvailable / aspectRatio;
					const widthIfMaxHeight = maxHeightAvailable * aspectRatio;

					// Determine which axis is the limiting factor
					if (heightIfMaxWidth <= maxHeightAvailable) {
						correctedWidth = maxWidthAvailable;
						correctedHeight = heightIfMaxWidth;
					} else {
						correctedHeight = maxHeightAvailable;
						correctedWidth = widthIfMaxHeight;
					}
				} else {
					correctedWidth = Math.min(correctedWidth, maxWidthAvailable);
					correctedHeight = Math.min(correctedHeight, maxHeightAvailable);
				}

				// Ensure positive dimensions
				correctedWidth = Math.max(1, correctedWidth);
				correctedHeight = Math.max(1, correctedHeight);

				return { width: correctedWidth, height: correctedHeight };
			},
			[],
		);

		// Handle move operation (position changed but size stayed same)
		const handleMove = useCallback(() => {
			requestAnimationFrame(() => {
				const selection = selectionRef.current;
				if (!selection) {
					return;
				}

				const current = {
					x: selection.x || 0,
					y: selection.y || 0,
					width: selection.width || 0,
					height: selection.height || 0,
				};

				const clamped = clampPosition(current);
				if (!clamped) {
					return;
				}

				if (typeof selection.$change === 'function') {
					selection.$change(
						Math.floor(clamped.x),
						Math.floor(clamped.y),
						Math.floor(current.width),
						Math.floor(current.height),
					);
				}

				previousSelectionRef.current = { width: current.width, height: current.height };
			});
		}, [clampPosition]);

		// Handle resize operation (size changed, may need aspect ratio correction)
		const handleResize = useCallback(() => {
			requestAnimationFrame(() => {
				const selection = selectionRef.current;
				if (!selection) {
					return;
				}

				const current = {
					x: selection.x || 0,
					y: selection.y || 0,
					width: selection.width || 0,
					height: selection.height || 0,
				};

				const corrected = correctResizeDimensions(current, selection);
				if (!corrected) {
					return;
				}

				const canvas = canvasRef.current;
				const image = imageRef.current;
				if (!canvas || !image) {
					return;
				}

				const canvasRect = canvas.getBoundingClientRect();
				const imageRect = image.getBoundingClientRect();
				const imageX = imageRect.left - canvasRect.left;
				const imageY = imageRect.top - canvasRect.top;

				const correctedX = Math.max(imageX, current.x);
				const correctedY = Math.max(imageY, current.y);

				if (typeof selection.$change === 'function') {
					selection.$change(
						Math.floor(correctedX),
						Math.floor(correctedY),
						Math.floor(corrected.width),
						Math.floor(corrected.height),
					);
				}

				previousSelectionRef.current = { width: corrected.width, height: corrected.height };
			});
		}, [correctResizeDimensions]);

		// Check if selection is within image boundaries
		const isSelectionOutOfBounds = useCallback(
			(
				imageX: number,
				imageY: number,
				imageWidth: number,
				imageHeight: number,
				selection: CropperBounds,
			) => {
				const tolerance = 1;
				return (
					selection.x < imageX - tolerance ||
					selection.y < imageY - tolerance ||
					selection.x + selection.width > imageX + imageWidth + tolerance ||
					selection.y + selection.height > imageY + imageHeight + tolerance
				);
			},
			[],
		);

		// Detect if operation is a move or resize based on dimension change
		const isMovingSelection = useCallback(() => {
			const prev = previousSelectionRef.current;
			const curr = selectionRef.current;
			if (!prev || !curr) {
				return false;
			}
			return prev.width === curr.width && prev.height === curr.height;
		}, []);

		const handleSelectionChange = useCallback(
			(event: Event) => {
				const canvas = canvasRef.current;
				const image = imageRef.current;
				const customEvent = event as CustomEvent<CropperBounds>;
				const selection = customEvent.detail;

				if (!canvas || !image || !selection) {
					return;
				}

				const canvasRect = canvas.getBoundingClientRect();
				const imageRect = image.getBoundingClientRect();

				const imageX = imageRect.left - canvasRect.left;
				const imageY = imageRect.top - canvasRect.top;
				const imageWidth = imageRect.width;
				const imageHeight = imageRect.height;

				if (!isSelectionOutOfBounds(imageX, imageY, imageWidth, imageHeight, selection)) {
					previousSelectionRef.current = { width: selection.width, height: selection.height };
					return;
				}

				if (isMovingSelection()) {
					handleMove();
				} else {
					handleResize();
				}
			},
			[isSelectionOutOfBounds, isMovingSelection, handleMove, handleResize],
		);

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
					const timer = setTimeout(() => {
						fitStencilToImage();
						setIsImageReady(true);
						onImageReady?.(true);
					}, 500); // Adding a small timeout as there is a rendering issue with webkit
					return () => clearTimeout(timer);
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
		}, [src, isCropperLoaded, onImageReady, fitStencilToImage]);

		// Attach selection change listener to enforce boundaries (only after image is ready)
		useEffect(() => {
			if (!isImageReady) {
				return;
			}

			const selection = selectionRef.current;
			if (!selection) {
				return;
			}

			return bind(selection, {
				type: 'change',
				listener: handleSelectionChange,
			});
		}, [isImageReady, handleSelectionChange]);

		useEffect(() => {
			if (!canvasRef.current || !imageRef.current) {
				return;
			}

			const observer = new ResizeObserver(() => {
				// This forces the image to recalculate its "contain" logic
				// whenever the canvas wrapper changes size
				if (typeof imageRef.current?.$center === 'function') {
					imageRef.current?.$center('contain');
				}
			});

			observer.observe(canvasRef.current);

			return () => observer.disconnect();
		}, [canvasRef, imageRef]);

		useEffect(() => {
			if (!canvasRef.current) {
				return;
			}

			const observer = new ResizeObserver(() => {
				selectionRef.current?.removeAttribute('aspect-ratio');
				fitStencilToImage();
			});

			observer.observe(canvasRef.current);

			return () => observer.disconnect();
		}, [fitStencilToImage]);

		useImperativeHandle(
			ref,
			() => ({
				fitStencilToImage,
				getCanvas,
				getCroppedCanvas,
				getImage,
				isImageReady,
				getSelection,
			}),
			[getCanvas, getCroppedCanvas, getImage, isImageReady, fitStencilToImage, getSelection],
		);

		// Inject global styles for cropper handles
		useEffect(() => {
			const style = document.createElement('style');
			const circularStyle = isCircle
				? `
			cropper-selection {
				outline: none;
				border-top: 1px solid #0052CC;
				border-right: 1px solid #0052CC;
				border-bottom: 1px solid #0052CC;
				border-left: 1px solid #0052CC;
				box-sizing: border-box;
				border-radius: 50%;
				box-shadow: 0 0 0 9999px rgba(255, 255, 255, 0.6);
			}
		`
				: `
			cropper-selection {
				outline: none;
				border-top: 1px solid #0052CC;
				border-right: 1px solid #0052CC;
				border-bottom: 1px solid #0052CC;
				border-left: 1px solid #0052CC;
				box-sizing: border-box; 
			}
		`;

			style.textContent = `
				cropper-canvas {
					background-color: #F8F8F8;
					background-image: none;
				}
				cropper-shade {
					outline-color: rgba(255,255,255,0.5);
				}
				cropper-handle[action="move"] {
					opacity: 0;
				}
				cropper-handle[action="ne-resize"] {
					border-radius: 7px 4px 4px 4px;
					border-right: 7px solid rgba(255,255,255,0.6);
					border-top: 7px solid rgba(255,255,255,0.6);
					height: 15px;
					width: 15px;
					background-color: transparent;
					transform: translate(-4px, 4px); 
				}
				cropper-handle[action="ne-resize"]::after {
					border-radius: 5px 4px 4px 4px;
					border-right: 5px solid #0052CC;
					border-top: 5px solid #0052CC;
					height: 15px;
					width: 15px;
					background-color: transparent;
					transform: translate(-7px, -14px); 
				}
				cropper-handle[action="nw-resize"] {
					border-radius: 4px 7px 4px 4px;
					border-left: 7px solid rgba(255,255,255,0.6);
					border-top: 7px solid rgba(255,255,255,0.6);
					height: 15px;
					width: 15px;
					background-color: transparent;
					transform: translate(4px, 4px); 
				}
				cropper-handle[action="nw-resize"]::after {
					border-radius: 4px 5px 4px 4px;
					border-left: 5px solid #0052CC;
					border-top: 5px solid #0052CC;
					height: 15px;
					width: 15px;
					background-color: transparent;
					transform: translate(-14px, -14px); 
				}
				cropper-handle[action="se-resize"] {
					border-radius: 4px 4px 7px 4px;
					border-right: 7px solid rgba(255,255,255,0.6);
					border-bottom: 7px solid rgba(255,255,255,0.6);
					height: 15px;
					width: 15px;
					background-color: transparent;
					transform: translate(-4px, -4px); 
				}
				cropper-handle[action="se-resize"]::after {
					border-radius: 4px 4px 5px 4px;
					border-right: 5px solid #0052CC;
					border-bottom: 5px solid #0052CC;
					height: 15px;
					width: 15px;
					background-color: transparent;
					transform: translate(-7px, -7px); 
				}
				cropper-handle[action="sw-resize"] {
					border-radius: 4px 4px 4px 7px;
					border-left: 7px solid rgba(255,255,255,0.6);
					border-bottom: 7px solid rgba(255,255,255,0.6);
					height: 15px;
					width: 15px;
					background-color: transparent;
					transform: translate(4px, -4px); 
				}
				cropper-handle[action="sw-resize"]::after {
					border-radius: 4px 4px 4px 5px;
					border-left: 5px solid #0052CC;
					border-bottom: 5px solid #0052CC;
					height: 15px;
					width: 15px;
					background-color: transparent;
					transform: translate(-14px, -7px); 
				}
				${circularStyle}
			`;
			document.head.appendChild(style);
			return () => style.remove();
		}, [isCircle]);
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
				<CropperShade x={240} y={5} width={160} height={90} />
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
					<CropperGrid role="grid" hidden />
					<CropperCrosshair hidden />
					<CropperHandle action="move" />
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
