import React, { useRef, type ChangeEventHandler } from 'react';

import Button from '@atlaskit/button/new';

export interface Props {
	accept?: string;
	ariaDescribedBy?: string;
	isDisabled?: boolean;
	label: string;
	onChange?: ChangeEventHandler<any>;
	onClick?: () => void;
}

export const chooseFileButtonTestId = 'choose-file-button';
export const fileUploadInputTestId = 'file-upload';

const FileChooser = (props: Props) => {
	const { accept, ariaDescribedBy, isDisabled, label, onChange, onClick } = props;
	const filePickerRef = useRef<HTMLInputElement>(null);
	const fileButtonRef = useRef<HTMLButtonElement>(null);

	const handleOnChooseFile = () => {
		if (!filePickerRef.current) {
			return;
		}

		if (onClick) {
			onClick();
		}
		filePickerRef.current.click();
		fileButtonRef.current?.focus();
	};

	return (
		<span>
			<Button
				onClick={handleOnChooseFile}
				isDisabled={isDisabled}
				aria-describedby={ariaDescribedBy}
				testId={chooseFileButtonTestId}
				ref={fileButtonRef}
			>
				{label}
			</Button>
			<input
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
				className="emojiUploadFileInput"
				ref={filePickerRef}
				onChange={onChange}
				type="file"
				accept={accept}
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				style={{ display: 'none' }}
				data-testid={fileUploadInputTestId}
			/>
		</span>
	);
};

export default FileChooser;
