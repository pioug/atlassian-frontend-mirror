/** @jsx jsx */
import React from 'react';
import { css, jsx } from '@emotion/react';

import {
  Popup,
  PopupPosition,
  withOuterListeners,
} from '@atlaskit/editor-common/ui';
import {
  ArrowKeyNavigationProvider,
  ArrowKeyNavigationType,
} from '@atlaskit/editor-common/ui-menu';
import { getSelectedRowAndColumnFromPalette } from '@atlaskit/editor-common/ui-color';
import Button from '@atlaskit/button';
import Tooltip from '@atlaskit/tooltip';
import { DN50, N0, N60A } from '@atlaskit/theme/colors';
import { themed } from '@atlaskit/theme/components';
import { borderRadius } from '@atlaskit/theme/constants';
import { ThemeProps } from '@atlaskit/theme/types';

import ColorPalette from '../ColorPalette';
import { DEFAULT_BORDER_COLOR } from '../ColorPalette/Palettes/common';
import { PaletteColor, PaletteTooltipMessages } from '../ColorPalette/Palettes';
import {
  withAnalyticsContext,
  withAnalyticsEvents,
  WithAnalyticsEventsProps,
} from '@atlaskit/analytics-next';
import { ColorPickerAEP } from '../../plugins/analytics/types/general-events';
import { editorAnalyticsChannel } from '../../plugins/analytics/consts';
import {
  ACTION,
  ACTION_SUBJECT,
  ACTION_SUBJECT_ID,
  EVENT_TYPE,
} from '../../plugins/analytics/types';
import { token } from '@atlaskit/tokens';

// helps adjusts position of popup
const colorPickerButtonWrapper = css`
  position: relative;
`;

// Control the size of color picker buttons and preview
// TODO: https://product-fabric.atlassian.net/browse/DSP-4134
/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
const colorPickerWrapper = (theme: ThemeProps) => css`
  border-radius: ${borderRadius()}px;
  background-color: ${themed({
    light: token('elevation.surface.overlay', N0),
    dark: token('elevation.surface.overlay', DN50),
  })(theme)};
  box-shadow: 0 4px 8px -2px ${N60A}, 0 0 1px ${N60A};
  padding: 8px 0px;
`;
/* eslint-enable @atlaskit/design-system/ensure-design-token-usage */

type Props = WithAnalyticsEventsProps & {
  currentColor?: string;
  title?: string;
  onChange?: (color: PaletteColor) => void;
  colorPalette: PaletteColor[];
  placement: string;
  cols?: number;
  alignX?: 'left' | 'right' | 'center' | 'end';
  size?: {
    width: number;
    height: number;
  };
  mountPoint?: HTMLElement;
  setDisableParentScroll?: (disable: boolean) => void;
  hexToPaletteColor?: (hexColor: string) => string | undefined;
  showSomewhatSemanticTooltips?: boolean;
  paletteColorTooltipMessages?: PaletteTooltipMessages;
};

const ColorPickerButton = (props: Props) => {
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const [isPopupOpen, setIsPopupOpen] = React.useState(false);
  const [isPopupPositioned, setIsPopupPositioned] = React.useState(false);
  const [isOpenedByKeyboard, setIsOpenedByKeyboard] = React.useState(false);

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
    if (!isPopupOpen) {
      setIsOpenedByKeyboard(false);
      setIsPopupPositioned(false);
    }
  };

  React.useEffect(() => {
    if (props.setDisableParentScroll) {
      props.setDisableParentScroll(isPopupOpen);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPopupOpen]);

  const focusButton = () => {
    buttonRef.current?.focus();
  };
  const handleEsc = React.useCallback(() => {
    setIsOpenedByKeyboard(false);
    setIsPopupPositioned(false);
    setIsPopupOpen(false);
    focusButton();
  }, []);

  const onPositionCalculated = React.useCallback((position: PopupPosition) => {
    setIsPopupPositioned(true);
    return position;
  }, []);

  const ColorPaletteWithListeners = withOuterListeners(ColorPalette);

  const onColorSelected = (color: string, label: string) => {
    setIsOpenedByKeyboard(false);
    setIsPopupOpen(false);
    setIsPopupPositioned(false);
    if (props.onChange) {
      if (props.createAnalyticsEvent) {
        // fire analytics
        const payload: ColorPickerAEP = {
          action: ACTION.UPDATED,
          actionSubject: ACTION_SUBJECT.PICKER,
          actionSubjectId: ACTION_SUBJECT_ID.PICKER_COLOR,
          attributes: {
            color,
            label,
            placement: props.placement,
          },
          eventType: EVENT_TYPE.TRACK,
        };
        props.createAnalyticsEvent(payload).fire(editorAnalyticsChannel);
      }

      const newPalette = props.colorPalette.find(
        (colorPalette) => colorPalette.value === color,
      );
      newPalette && props.onChange(newPalette);
    }
    focusButton();
  };

  const renderPopup = () => {
    if (!isPopupOpen || !buttonRef.current) {
      return;
    }

    const selectedColor = props.currentColor || null;
    const { selectedRowIndex, selectedColumnIndex } =
      getSelectedRowAndColumnFromPalette(
        props.colorPalette,
        selectedColor,
        props.cols,
      );

    return (
      <Popup
        target={buttonRef.current}
        fitHeight={350}
        fitWidth={350}
        offset={[0, 10]}
        alignX={props.alignX}
        mountTo={props.setDisableParentScroll ? props.mountPoint : undefined}
        // Confluence inline comment editor has z-index: 500
        // if the toolbar is scrollable, this will be mounted in the root editor
        // we need an index of > 500 to display over it
        zIndex={props.setDisableParentScroll ? 600 : undefined}
        ariaLabel="Color picker popup"
        onPositionCalculated={onPositionCalculated}
      >
        <div css={colorPickerWrapper} data-test-id="color-picker-menu">
          <ArrowKeyNavigationProvider
            type={ArrowKeyNavigationType.COLOR}
            selectedRowIndex={selectedRowIndex}
            selectedColumnIndex={selectedColumnIndex}
            closeOnTab={true}
            handleClose={() => setIsPopupOpen(false)}
            isOpenedByKeyboard={isOpenedByKeyboard}
            isPopupPositioned={isPopupPositioned}
          >
            <ColorPaletteWithListeners
              cols={props.cols}
              selectedColor={selectedColor}
              onClick={onColorSelected}
              handleClickOutside={togglePopup}
              handleEscapeKeydown={handleEsc}
              paletteOptions={{
                palette: props.colorPalette,
                hexToPaletteColor: props.hexToPaletteColor,
                showSomewhatSemanticTooltips:
                  props.showSomewhatSemanticTooltips,
                paletteColorTooltipMessages: props.paletteColorTooltipMessages,
              }}
            />
          </ArrowKeyNavigationProvider>
        </div>
      </Popup>
    );
  };

  const title = props.title || '';
  const currentColor =
    props.currentColor && props.hexToPaletteColor
      ? props.hexToPaletteColor(props.currentColor)
      : props.currentColor;
  const buttonStyle = css`
    padding: 6px;
    background-color: ${token('color.background.neutral', 'transparent')};
    &:before {
      display: flex;
      justify-content: center;
      align-items: center;
      align-self: center;
      content: '';
      border: 1px solid ${DEFAULT_BORDER_COLOR};
      border-radius: ${borderRadius()}px;
      background-color: ${currentColor || 'transparent'};
      width: ${props.size?.width || 14}px;
      height: ${props.size?.height || 14}px;
      padding: 0;
    }
  `;

  return (
    <div css={colorPickerButtonWrapper}>
      <Tooltip content={title} position="top">
        <Button
          ref={buttonRef}
          aria-label={title}
          spacing="compact"
          onClick={togglePopup}
          onKeyDown={(event: React.KeyboardEvent) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              togglePopup();
              setIsOpenedByKeyboard(true);
            }
          }}
          css={buttonStyle}
        />
      </Tooltip>
      {renderPopup()}
    </div>
  );
};

export default withAnalyticsContext({ source: 'ConfigPanel' })(
  withAnalyticsEvents()(ColorPickerButton),
);
