import React, { type FC, useRef, type ChangeEventHandler } from 'react';

import AkButton from '@atlaskit/button/standard-button';

export interface Props {
  label: string;
  ariaDescribedBy?: string;
  onChange?: ChangeEventHandler<any>;
  onClick?: () => void;
  accept?: string;
  isDisabled?: boolean;
}

export const chooseFileButtonTestId = 'choose-file-button';
export const fileUploadInputTestId = 'file-upload';

const FileChooser: FC<Props> = (props) => {
  const { accept, ariaDescribedBy, isDisabled, label, onChange, onClick } =
    props;
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
      <AkButton
        onClick={handleOnChooseFile}
        isDisabled={isDisabled}
        aria-describedby={ariaDescribedBy}
        testId={chooseFileButtonTestId}
        ref={fileButtonRef}
      >
        {label}
      </AkButton>
      <input
        className="emojiUploadFileInput"
        ref={filePickerRef}
        onChange={onChange}
        type="file"
        accept={accept}
        style={{ display: 'none' }}
        data-testid={fileUploadInputTestId}
      />
    </span>
  );
};

export default FileChooser;
