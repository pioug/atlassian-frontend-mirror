/** @jsx jsx */
import React from 'react';
import { css, jsx } from '@emotion/react';
import TipIcon from '@atlaskit/icon/glyph/editor/hint';
import { PanelType } from '@atlaskit/adf-schema';
import type { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import {
  panelSharedStylesWithoutPrefix,
  PanelSharedCssClassName,
} from '@atlaskit/editor-common/panel';
import { hexToEditorBackgroundPaletteColor } from '@atlaskit/editor-palette';
import EmojiIcon from '@atlaskit/icon/glyph/editor/emoji';
import EmojiItem from './emoji';
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
  hasIcon?: boolean;
}

const PanelStyled = ({
  backgroundColor,
  hasIcon,
  ...props
}: React.PropsWithChildren<
  PanelStyledProps & React.HTMLAttributes<HTMLDivElement>
>) => {
  // eslint-disable-next-line @atlaskit/design-system/no-css-tagged-template-expression -- nested css mixins are violations
  let styles = css`
    &.${PanelSharedCssClassName.prefix} {
      ${panelSharedStylesWithoutPrefix()}

      &[data-panel-type=${PanelType.CUSTOM}] {
        ${hasIcon ? '' : 'padding-left: 12px;padding-right: 12px;'}
      }
    }
  `;

  if (props['data-panel-type'] === PanelType.CUSTOM && backgroundColor) {
    // eslint-disable-next-line @atlaskit/design-system/no-css-tagged-template-expression -- nested css mixins are violations
    styles = css`
      &.${PanelSharedCssClassName.prefix} {
        ${panelSharedStylesWithoutPrefix()}
      }

      &[data-panel-type=${PanelType.CUSTOM}] {
        background-color: ${hexToEditorBackgroundPaletteColor(
          backgroundColor,
        ) || backgroundColor};
        ${hasIcon ? '' : 'padding-left: 12px;padding-right: 12px;'}
      }
    `;
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
  [key in PanelType]: React.ComponentType<
    React.PropsWithChildren<{ label: string }>
  >;
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

  const icon = getIcon();

  const renderIcon = () => {
    if (icon) {
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
      return <div className={PanelSharedCssClassName.icon}>{icon}</div>;
    }
  };

  return (
    <PanelStyled
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
      className={PanelSharedCssClassName.prefix}
      data-panel-type={panelType}
      data-panel-color={panelColor}
      data-panel-icon={panelIcon}
      data-panel-icon-id={panelIconId}
      data-panel-icon-text={panelIconText}
      backgroundColor={panelColor}
      hasIcon={Boolean(icon)}
    >
      {renderIcon()}
{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766  */}
      <div className={PanelSharedCssClassName.content}>{children}</div>
    </PanelStyled>
  );
};

export default Panel;
