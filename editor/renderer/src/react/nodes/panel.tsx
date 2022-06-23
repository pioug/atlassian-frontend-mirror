/** @jsx jsx */
import React from 'react';
import { css, jsx } from '@emotion/react';
import TipIcon from '@atlaskit/icon/glyph/editor/hint';
import { PanelType } from '@atlaskit/adf-schema';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import {
  getPanelBackgroundDarkModeColors,
  panelSharedStylesWithoutPrefix,
  PanelSharedCssClassName,
} from '@atlaskit/editor-common/panel';
import EmojiIcon from '@atlaskit/icon/glyph/editor/emoji';
import EmojiItem from './emoji';
// AFP-2532 TODO: Fix automatic suppressions below
// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import { themed } from '@atlaskit/theme';
import { ThemeProps } from '@atlaskit/theme/types';
import {
  PanelInfoIcon,
  PanelSuccessIcon,
  PanelNoteIcon,
  PanelWarningIcon,
  PanelErrorIcon,
} from '@atlaskit/editor-common/icons';

interface PanelStyledProps {
  'data-panel-type': PanelType;
  backgroundColor?: string;
}

const PanelStyled: React.FC<
  PanelStyledProps & React.HTMLAttributes<HTMLDivElement>
> = (props) => {
  let styles = (theme: ThemeProps['theme']) => css`
    &.${PanelSharedCssClassName.prefix} {
      ${panelSharedStylesWithoutPrefix({ theme })}
    }
  `;

  if (props['data-panel-type'] === PanelType.CUSTOM && props.backgroundColor) {
    styles = (theme: ThemeProps['theme']) => {
      const customStyle = themed({
        dark: getPanelBackgroundDarkModeColors,
        light: `background-color: ${props.backgroundColor};`,
      })({ theme });

      return css`
        &.${PanelSharedCssClassName.prefix} {
          ${panelSharedStylesWithoutPrefix({ theme })}
        }

        &[data-panel-type=${PanelType.CUSTOM}] {
          ${customStyle};
        }
      `;
    };
  }

  return (
    <div css={styles} {...props}>
      {props.children}
    </div>
  );
};

PanelStyled.displayName = 'PanelStyled';

export interface Props {
  children?: React.ReactNode;
  providers?: ProviderFactory;
  panelType: PanelType;
  allowCustomPanels?: boolean;
  panelIcon?: string;
  panelIconId?: string;
  panelIconText?: string;
  panelColor?: string;
}

const panelIcons: {
  [key in PanelType]: React.ComponentType<{ label: string }>;
} = {
  info: PanelInfoIcon,
  success: PanelSuccessIcon,
  note: PanelNoteIcon,
  tip: TipIcon,
  warning: PanelWarningIcon,
  error: PanelErrorIcon,
  custom: EmojiIcon,
};

const Panel = (props: Props) => {
  const {
    allowCustomPanels,
    panelType: type,
    panelColor,
    panelIcon,
    panelIconId,
    panelIconText,
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
        return (
          <EmojiItem
            id={panelIconId}
            text={panelIconText}
            shortName={panelIcon}
            providers={providers}
          />
        );
      }

      return null;
    }

    const Icon = panelIcons[panelType];
    return <Icon label={`Panel ${panelType}`} />;
  };

  const renderIcon = () => {
    const icon = getIcon();

    if (icon) {
      return <div className={PanelSharedCssClassName.icon}>{icon}</div>;
    }
  };

  return (
    <PanelStyled
      className={PanelSharedCssClassName.prefix}
      data-panel-type={panelType}
      data-panel-color={panelColor}
      data-panel-icon={panelIcon}
      data-panel-icon-id={panelIconId}
      data-panel-icon-text={panelIconText}
      backgroundColor={panelColor}
    >
      {renderIcon()}
      <div className={PanelSharedCssClassName.content}>{children}</div>
    </PanelStyled>
  );
};

export default Panel;
