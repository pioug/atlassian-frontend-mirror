import React from 'react';
import { HeaderComponentProps } from '@atlaskit/modal-dialog';
import EditorCloseIcon from '@atlaskit/icon/glyph/editor/close';
import Button from '@atlaskit/button';

export interface HeaderProps extends HeaderComponentProps {
  title: string;
  label: string;
}
export const Header = ({ onClose, title, label }: HeaderProps) => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline',
    }}
  >
    <div style={{ width: '28px' }} />
    <div>{title}</div>
    <div>
      <Button
        appearance="subtle"
        iconBefore={<EditorCloseIcon label={label} />}
        onClick={onClose}
      />
    </div>
  </div>
);
