import { useEffect, useRef, useState } from 'react';

import { bind } from 'bind-event-listener';
import { useIntl, type MessageDescriptor } from 'react-intl-next';

import type { ErrorReporter } from '@atlaskit/editor-common/error-reporter';

import type { CropperRef } from './Cropper';
import {
	useImageFlip,
	useImageRotate,
	useImageAspectRatio,
	type AspectRatioOption,
} from './imageEditActions';

interface UseImageEditorReturn {
	aspectRatioSelection: string;
	cropperRef: React.RefObject<CropperRef>;
	currentAspectRatio: number | undefined;
	doneButtonRef: React.RefObject<HTMLButtonElement>;
	flipHorizontal: () => void;
	flipVertical: () => void;
	formatMessage: (descriptor: MessageDescriptor) => string;
	handleSave: (
		onSave: (imageData: Blob, width: number, height: number) => void,
		onClose: () => void,
		errorReporter?: ErrorReporter,
		originalMimeType?: string,
	) => Promise<void>;
	isImageReady: boolean;
	rotateRight: () => void;
	setIsImageReady: (ready: boolean) => void;
	setSelectionArea: (selectedRatio: AspectRatioOption) => Promise<void>;
}

export const useImageEditor = (): UseImageEditorReturn => {
	const cropperRef = useRef<CropperRef>(null);
	const doneButtonRef = useRef<HTMLButtonElement>(null);
	const aspectRatioResolverRef = useRef<{ resolve: () => void; target: number | undefined } | null>(
		null,
	);
	const isInitialSetupRef = useRef(true);
	const [isImageReady, setIsImageReady] = useState(false);
	const [currentAspectRatio, setCurrentAspectRatio] = useState<number | undefined>(undefined);
	const [aspectRatioSelection, setAspectRatioSelection] = useState('custom');
	const { flipHorizontal, flipVertical } = useImageFlip(cropperRef);
	const { rotateRight } = useImageRotate(cropperRef);
	const { getAspectRatioValue } = useImageAspectRatio();
	const intl = useIntl();

	// Initialize editor state and track canvas size changes
	useEffect(() => {
		if (!isImageReady) {
			return;
		}

		// Get the canvas element to observe for size changes
		const canvas = cropperRef.current?.getCanvas();
		if (!canvas) {
			return;
		}

		// Track initial canvas dimensions before any state updates
		let lastWidth = canvas.clientWidth;
		let lastHeight = canvas.clientHeight;

		// Canvas size will change when the viewport size changes
		// Monitor canvas resizing to detect when user manually adjusts the crop area
		const observer = new ResizeObserver((entries) => {
			// Skip the first observation during setup
			if (isInitialSetupRef.current) {
				isInitialSetupRef.current = false;
				return;
			}

			const entry = entries[0];
			const { width, height } = entry.contentRect;

			// If canvas size changes, switch to custom aspect ratio mode
			if (width !== lastWidth || height !== lastHeight) {
				lastWidth = width;
				lastHeight = height;
				setAspectRatioSelection('custom');
			}
		});

		observer.observe(canvas);

		// Calculate and set the original aspect ratio based on the image dimensions
		setAspectRatioSelection('custom');

		// Focus on the done button as soon as image loads
		if (doneButtonRef.current) {
			doneButtonRef.current.focus();
		}

		return () => observer.disconnect();
	}, [isImageReady]);

	// Listen for aspect ratio selection changes and update current aspect ratio
	// This effect monitors the cropper's selection element for any changes
	// and updates the currentAspectRatio state accordingly
	useEffect(() => {
		if (isImageReady && aspectRatioSelection !== '') {
			const selection = cropperRef.current?.getSelection();
			if (!selection) {
				return;
			}

			// Update aspect ratio whenever aspect ratio selection changes
			const handleSelectionChange = () => {
				const selectionAspectRatio = selection.aspectRatio ? selection.aspectRatio : undefined;
				setCurrentAspectRatio(selectionAspectRatio);
			};

			// Call once to set initial value
			handleSelectionChange();

			// Attach change listener to selection element
			return bind(selection, {
				type: 'change',
				listener: handleSelectionChange,
			});
		}
	}, [isImageReady, aspectRatioSelection]);

	// Resolve pending aspect ratio changes
	// This effect watches for when the aspect ratio reaches its target value
	// and resolves the corresponding promise to allow animations to proceed
	useEffect(() => {
		const pending = aspectRatioResolverRef.current;
		if (pending && currentAspectRatio === pending.target) {
			// Resolve the promise stored in the ref when target is reached
			pending.resolve();
			aspectRatioResolverRef.current = null;
		}
	}, [currentAspectRatio]);

	// Calculate the original aspect ratio of the image
	// Gets the image element's dimensions and computes width/height ratio
	const calculateOriginalRatio = () => {
		const image = cropperRef.current?.getImage();
		if (image) {
			const img = image.getBoundingClientRect();
			const ratio = img.width / img.height;
			setCurrentAspectRatio(ratio);
		}
	};

	// Wait for the aspect ratio to reach a target value
	// Used to coordinate aspect ratio changes with animation frames
	// Returns a promise that resolves when the target ratio is reached
	const waitForCurrentAspectRatio = (target: number | undefined) =>
		new Promise<void>((resolve) => {
			// If already at target, resolve on next animation frame
			if (currentAspectRatio === target) {
				requestAnimationFrame(() => resolve());
				return;
			}
			// Otherwise, store resolve callback to be called when target is reached
			aspectRatioResolverRef.current = { resolve, target };
		});

	// Change the aspect ratio selection and animate the transition
	// This function handles smooth transitions between different aspect ratios
	const setSelectionArea = async (selectedRatio: AspectRatioOption) => {
		// Custom ratio mode: free-form selection without constraints
		if (selectedRatio === 'custom') {
			setAspectRatioSelection(selectedRatio);
			setCurrentAspectRatio(undefined);
			await waitForCurrentAspectRatio(undefined);
			return;
		}

		const selection = cropperRef.current?.getSelection();
		const canvas = cropperRef.current?.getCanvas();
		const shade = canvas?.querySelector('cropper-shade') as HTMLElement | null;

		// Fade out selection and shade during transition for smooth animation
		if (selection) {
			selection.style.opacity = '0';
		}
		if (shade) {
			shade.style.opacity = '0';
		}

		// Reset aspect ratio and wait for the crop area to clear
		setCurrentAspectRatio(undefined);
		await waitForCurrentAspectRatio(undefined);
		cropperRef.current?.fitStencilToImage();

		// Wait for DOM to update
		await new Promise((resolve) => requestAnimationFrame(resolve));

		// Set the new aspect ratio
		if (selectedRatio === 'original') {
			calculateOriginalRatio();
		} else {
			const ratioVal = getAspectRatioValue(selectedRatio);
			setCurrentAspectRatio(ratioVal);
			await waitForCurrentAspectRatio(ratioVal);
		}

		setAspectRatioSelection(selectedRatio);

		// Allow time for the new crop area to be positioned and rendered
		await new Promise((resolve) => setTimeout(resolve, 300));

		// Center the selection and fade back in
		if (selection) {
			selection.$center();
			selection.style.opacity = '1';
		}
		if (shade) {
			shade.style.opacity = '1';
		}
	};

	// Extract the cropped image and save it
	// Converts the cropped canvas to a blob and calls the onSave callback
	const handleSave = async (
		onSave: (imageData: Blob, width: number, height: number) => void,
		onClose: () => void,
		errorReporter?: ErrorReporter,
	) => {
		try {
			// Get the selection to determine the crop size relative to original image
			const selection = cropperRef.current?.getSelection();
			const image = cropperRef.current?.getImage();

			let canvasWidth: number | undefined;

			if (selection && image) {
				// Try to get the actual <img> from shadow DOM
				const actualImg = image.shadowRoot?.querySelector('img') || null;

				if (actualImg) {
					// Get the natural (original) image dimensions
					const naturalWidth = actualImg.naturalWidth;

					// Get the displayed image dimensions
					const displayedRect = image.getBoundingClientRect();
					const displayedWidth = displayedRect.width;

					// Calculate the scale factor between displayed and original image
					const scaleX = naturalWidth / displayedWidth;

					// Get selection dimensions in displayed coordinates
					const selectionWidth = selection.width || 0;

					// Calculate the crop width in original image coordinates
					const cropWidthInOriginal = selectionWidth * scaleX;

					// Use the crop width from original image, capped at a reasonable maximum
					canvasWidth = Math.min(cropWidthInOriginal, 1500);
				}
			}

			// Get the cropped canvas with calculated width
			// Fallback to width = 1500 (a reasonable size for keeping high quality images relatively high quality)
			const canvas = await cropperRef.current?.getCroppedCanvas(
				canvasWidth ? { width: canvasWidth } : { width: 1500 },
			);

			if (canvas) {
				const outWidth = canvas.width;
				const outHeight = canvas.height;
				// Convert canvas to blob (defaults to png)
				canvas.toBlob((blob) => {
					if (blob) {
						onSave?.(blob, outWidth, outHeight);
						// Don't close here - let the upload completion handle closing
					}
				});
			}
		} catch (error) {
			// Report any errors to the error reporter
			if (errorReporter) {
				errorReporter.captureException(error instanceof Error ? error : new Error(String(error)));
			}
		}
	};

	return {
		cropperRef,
		doneButtonRef,
		isImageReady,
		setIsImageReady,
		currentAspectRatio,
		aspectRatioSelection,
		flipHorizontal,
		flipVertical,
		rotateRight,
		setSelectionArea,
		handleSave,
		formatMessage: intl.formatMessage,
	};
};
