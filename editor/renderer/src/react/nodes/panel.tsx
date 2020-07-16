import React from 'react';
import { PureComponent } from 'react';
import InfoIcon from '@atlaskit/icon/glyph/editor/info';
import TipIcon from '@atlaskit/icon/glyph/editor/hint';
import SuccessIcon from '@atlaskit/icon/glyph/editor/success';
import ErrorIcon from '@atlaskit/icon/glyph/editor/error';
import NoteIcon from '@atlaskit/icon/glyph/editor/note';
import WarningIcon from '@atlaskit/icon/glyph/warning';
import { PanelType } from '@atlaskit/adf-schema';
import { PanelSharedCssClassName } from '@atlaskit/editor-common';

export interface Props {
  panelType: PanelType;
}

const panelIcons = {
  info: InfoIcon,
  success: SuccessIcon,
  note: NoteIcon,
  tip: TipIcon,
  warning: WarningIcon,
  error: ErrorIcon,
};

export default class Panel extends PureComponent<Props, {}> {
  render() {
    const { panelType, children } = this.props;
    return (
      <div
        className={PanelSharedCssClassName.prefix}
        data-panel-type={panelType}
      >
        <span className={PanelSharedCssClassName.icon}>{this.getIcon()}</span>
        <div className={PanelSharedCssClassName.content}>{children}</div>
      </div>
    );
  }

  getIcon() {
    const { panelType } = this.props;

    const Icon = panelIcons[panelType];
    return <Icon label={`Panel ${panelType}`} />;
  }
}
