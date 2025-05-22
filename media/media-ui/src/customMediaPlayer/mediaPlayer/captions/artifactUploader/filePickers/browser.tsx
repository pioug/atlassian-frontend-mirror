import React, { useEffect, useRef } from 'react';
import { type ArtifactSupportedType, artifactUploadTypes } from '../types';

export interface BrowserPickerProps {
	type: ArtifactSupportedType;
	isOpen?: boolean;
	onClose?: () => void;
	onFilesPicked?: (file: FileList) => void;
}

export const BrowserPicker = ({ isOpen, type, onFilesPicked, onClose }: BrowserPickerProps) => {
	const browserRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (isOpen) {
			browserRef.current?.click();
		}
	}, [isOpen]);

	useEffect(() => {
		browserRef.current?.addEventListener('cancel', () => {
			onClose?.();
		});
	}, [onClose]);

	const onFilesPickedInternal = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (!event.target) {
			return;
		}
		const { files } = event.target;
		if (files) {
			onFilesPicked?.(files);
			if (browserRef.current) {
				// Clear the input value to allow picking the same file again
				browserRef.current.value = '';
			}
		}
	};

	return (
		<input
			data-testid="media-picker-artifact-input"
			ref={browserRef}
			type="file"
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
			style={{ display: 'none' }}
			multiple={false}
			accept={artifactUploadTypes[type].join(',')}
			onChange={onFilesPickedInternal}
		/>
	);
};
