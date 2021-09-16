import React from 'react';
import styled from 'styled-components';
import InfoIcon from '@atlaskit/icon/glyph/editor/info';
import TipIcon from '@atlaskit/icon/glyph/editor/hint';
import SuccessIcon from '@atlaskit/icon/glyph/editor/success';
import ErrorIcon from '@atlaskit/icon/glyph/editor/error';
import NoteIcon from '@atlaskit/icon/glyph/editor/note';
import WarningIcon from '@atlaskit/icon/glyph/warning';
import { PanelType } from '@atlaskit/adf-schema';
import {
  PanelSharedCssClassName,
  ProviderFactory,
} from '@atlaskit/editor-common';
import EmojiIcon from '@atlaskit/icon/glyph/editor/emoji';
import EmojiItem from './emoji';
// AFP-2532 TODO: Fix automatic suppressions below
// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import { themed } from '@atlaskit/theme';

interface PanelStyledProps {
  'data-panel-type': PanelType;
  backgroundColor?: string;
}

const PanelStyled = styled.div<PanelStyledProps>`
  ${(props) => {
    if (
      props['data-panel-type'] !== PanelType.CUSTOM ||
      !props.backgroundColor
    ) {
      return '';
    }

    const border = themed({
      light: 'none',
      dark: `1px solid rgba(255, 255, 255, 0.4)`,
    })(props);

    // Similar to mainDynamicStyles()
    return `
      &[data-panel-type=${PanelType.CUSTOM}] {
        background-color: ${props.backgroundColor};
        border: ${border};
      }
    `;
  }}
`;

export interface Props {
  children?: React.ReactNode;
  providers?: ProviderFactory;
  panelType: PanelType;

  allowCustomPanels?: boolean;
  // @stage 0
  panelIcon?: string;
  // @stage 0
  panelColor?: string;
}

const panelIcons = {
  info: InfoIcon,
  success: SuccessIcon,
  note: NoteIcon,
  tip: TipIcon,
  warning: WarningIcon,
  error: ErrorIcon,
  custom: EmojiIcon,
};

const Panel = (props: Props) => {
  const {
    allowCustomPanels,
    panelType: type,
    panelColor,
    panelIcon,
    providers,
    children,
  } = props;
  // only allow custom panel type if flag is set
  // otherwise fall back to info if custom panel is given
  const panelType = allowCustomPanels
    ? type
    : type === PanelType.CUSTOM
    ? PanelType.INFO
    : type;

  const getIcon = () => {
    if (panelType === PanelType.CUSTOM) {
      if (panelIcon && providers) {
        return <EmojiItem shortName={panelIcon} providers={providers} />;
      }

      return null;
    }

    const Icon = panelIcons[panelType];
    return <Icon label={`Panel ${panelType}`} />;
  };

  const renderIcon = () => {
    const icon = getIcon();

    if (icon) {
      return <span className={PanelSharedCssClassName.icon}>{icon}</span>;
    }
  };

  return (
    <PanelStyled
      className={PanelSharedCssClassName.prefix}
      data-panel-type={panelType}
      data-panel-color={panelColor}
      data-panel-icon={panelIcon}
      backgroundColor={panelColor}
    >
      {renderIcon()}
      <div className={PanelSharedCssClassName.content}>{children}</div>
    </PanelStyled>
  );
};

export default Panel;
