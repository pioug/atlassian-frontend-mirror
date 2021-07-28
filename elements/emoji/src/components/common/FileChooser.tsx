import React from 'react';
import { ChangeEventHandler, PureComponent } from 'react';

import AkButton from '@atlaskit/button/custom-theme-button';

export interface Props {
  label: string;
  ariaDescribedBy?: string;
  onChange?: ChangeEventHandler<any>;
  onClick?: () => void;
  accept?: string;
  isDisabled?: boolean;
}

export default class FileChooser extends PureComponent<Props, {}> {
  onChooseFile = () => {
    if (this.props.onClick) {
      this.props.onClick();
    }

    const chooseFile = this.refs['chooseFile'] as HTMLInputElement;
    if (chooseFile) {
      chooseFile.click();
    }
  };

  render() {
    const { accept, ariaDescribedBy, isDisabled, label, onChange } = this.props;
    return (
      <span>
        <AkButton
          onClick={this.onChooseFile}
          isDisabled={isDisabled}
          aria-describedby={ariaDescribedBy}
        >
          {label}
        </AkButton>
        <input
          className="emojiUploadFileInput"
          ref="chooseFile"
          onChange={onChange}
          type="file"
          accept={accept}
          style={{ display: 'none' }}
        />
      </span>
    );
  }
}
