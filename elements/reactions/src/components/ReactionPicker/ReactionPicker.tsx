/** @jsx jsx */
import React, {
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { jsx } from '@emotion/react';
import { FormattedMessage } from 'react-intl-next';
import { EmojiId, PickerSize } from '@atlaskit/emoji/types';
import { EmojiPicker } from '@atlaskit/emoji/picker';
import { EmojiProvider } from '@atlaskit/emoji/resource';
import {
  Manager,
  Popper,
  Reference,
  PopperProps,
  PopperChildrenProps,
} from '@atlaskit/popper';
import { layers } from '@atlaskit/theme/constants';
import { Selector, SelectorProps } from '../Selector';
import { Trigger, TriggerProps } from '../Trigger';
import { UFO } from '../../analytics';
import { i18n } from '../../shared';
import { useClickAway } from '../../hooks';
import { ReactionSource } from '../../types';
import * as styles from './styles';

/**
 * Test id for wrapper ReactionPicker div
 */
export const RENDER_REACTIONPICKER_TESTID = 'reactionPicker-testid';

/**
 * Emoji Picker Controller Id for Accessibility Labels
 */
const PICKER_CONTROL_ID = 'emoji-picker';

const popperModifiers: PopperProps<{}>['modifiers'] = [
  /**
   Removing this applyStyle modifier as it throws client errors ref:
  https://popper.js.org/docs/v1/#modifiers
  https://popper.js.org/docs/v1/#modifiers..applyStyle
  { name: 'applyStyle', enabled: false },
   */
  {
    name: 'hide',
    enabled: false,
  },
  {
    name: 'offset',
    enabled: true,
    options: {
      offset: [0, 0],
    },
  },
  {
    name: 'flip',
    enabled: true,
    options: {
      flipVariations: true,
      boundariesElement: 'scrollParent',
    },
  },
  {
    name: 'preventOverflow',
    enabled: true,
  },
];

export interface ReactionPickerProps
  extends Pick<SelectorProps, 'pickerQuickReactionEmojiIds'>,
    Partial<Pick<TriggerProps, 'tooltipContent' | 'miniMode'>> {
  /**
   * Provider for loading emojis
   */
  emojiProvider: Promise<EmojiProvider>;
  /**
   * Event callback when an emoji button is selected
   * @param emojiId emoji unique id
   * @param source source where the reaction was picked (either the initial default reactions or the custom reactions picker)
   */
  onSelection: (emojiId: string, source: ReactionSource) => void;
  /**
   * Optional class name
   */
  className?: string;
  /**
   * Optional Show the "more emoji" selector icon for choosing emoji beyond the default list of emojis (defaults to false)
   */
  allowAllEmojis?: boolean;
  /**
   * Enable/Disable the button to be clickable (defaults to false)
   */
  disabled?: boolean;
  /**
   * Optional event handler when the emoji picker is opened
   */
  onOpen?: () => void;
  /**
   * Optional event handler when the emoji picker is clicked outside and closed
   */
  onCancel?: () => void;
  /**
   * Optional event handler when the custom emoji picker icon is selected
   */
  onShowMore?: () => void;
  /**
   * Optional emoji picker size to control the size of emoji picker
   */
  emojiPickerSize?: PickerSize;
}

/**
 * Picker component for adding reactions
 */
export const ReactionPicker: React.FC<ReactionPickerProps> = React.memo(
  (props) => {
    const {
      miniMode,
      className,
      emojiProvider,
      onSelection,
      allowAllEmojis,
      disabled,
      pickerQuickReactionEmojiIds,
      onShowMore = () => {},
      onOpen = () => {},
      onCancel = () => {},
      tooltipContent = <FormattedMessage {...i18n.messages.addReaction} />,
      emojiPickerSize,
    } = props;
    /**
     * Container <div /> reference (used by custom hook to detect click outside)
     */
    const wrapperRef = useRef<HTMLDivElement>(null);
    /**
     * a function you can ask Popper to recompute your tooltip's position. It will directly call the Popper#update method
     */
    const updatePopper = useRef<PopperChildrenProps['update']>();

    const [settings, setSettings] = useState({
      /**
       * Show the picker floating panel
       */
      isOpen: false,
      /**
       * Show the full custom emoji list picker or the default list of emojis
       */
      showFullPicker:
        !!allowAllEmojis &&
        Array.isArray(pickerQuickReactionEmojiIds) &&
        pickerQuickReactionEmojiIds.length === 0,
    });

    /**
     * Custom hook triggers when user clicks outside the reactions picker
     */
    useClickAway(
      wrapperRef,
      () => {
        onCancel();
        close();
      },
      'click',
      true,
      settings.isOpen,
    );

    /**
     * Event callback when the picker is closed
     * @param _id Optional id if an emoji button was selected or undefineed if was clicked outside the picker
     */
    const close = useCallback(
      (_id?: string) => {
        setSettings({
          isOpen: false,
          showFullPicker:
            !!allowAllEmojis &&
            Array.isArray(pickerQuickReactionEmojiIds) &&
            pickerQuickReactionEmojiIds.length === 0,
        });
        // ufo abort reaction experience
        UFO.PickerRender.abort({
          metadata: {
            emojiId: _id,
            source: 'ReactionPicker',
            reason: 'close dialog',
          },
        });
      },
      [allowAllEmojis, pickerQuickReactionEmojiIds],
    );

    /**
     * Event handle rwhen selecting to show the custom emoji icons picker
     * @param e event param
     */
    const onSelectMoreClick = useCallback(
      (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault();
        setSettings({
          isOpen: true,
          showFullPicker: true,
        });
        onShowMore();
      },
      [onShowMore],
    );

    /**
     * Event callback when an emoji icon is selected
     * @param item selected item
     */
    const onEmojiSelected = useCallback(
      (item: EmojiId) => {
        // no emoji was selected
        if (!item.id) {
          return;
        }

        onSelection(
          item.id,
          settings.showFullPicker ? 'emojiPicker' : 'quickSelector',
        );
        close(item.id);
      },
      [close, onSelection, settings.showFullPicker],
    );

    /**
     * Event handler when the emoji icon to open the custom picker is selected
     */
    const onTriggerClick = () => {
      // ufo start reactions picker open experience
      UFO.PickerRender.start();

      setSettings({
        isOpen: !settings.isOpen,
        showFullPicker:
          !!allowAllEmojis &&
          Array.isArray(pickerQuickReactionEmojiIds) &&
          pickerQuickReactionEmojiIds.length === 0,
      });
      onOpen();
      // ufo reactions picker opened success
      UFO.PickerRender.success();
    };

    /**
     * When picker is opened, re-calculate the picker position
     */
    useEffect(() => {
      if (settings.isOpen) {
        if (updatePopper.current) {
          updatePopper.current();
        }
      }
    }, [settings]);

    const wrapperClassName = ` ${settings.isOpen ? 'isOpen' : ''} ${
      miniMode ? 'miniMode' : ''
    } ${className}`;

    return (
      <div
        className={wrapperClassName}
        css={styles.pickerStyle}
        data-testid={RENDER_REACTIONPICKER_TESTID}
        ref={wrapperRef}
      >
        <Manager>
          <Reference>
            {({ ref: popperRef }) => (
              // Render a button to open the <Selector /> panel
              <Trigger
                ariaAttributes={{
                  'aria-expanded': settings.isOpen,
                  'aria-controls': PICKER_CONTROL_ID,
                }}
                ref={popperRef}
                onClick={onTriggerClick}
                miniMode={miniMode}
                disabled={disabled}
                tooltipContent={settings.isOpen ? null : tooltipContent}
              />
            )}
          </Reference>
          <Popper placement="bottom-start" modifiers={popperModifiers}>
            {({ ref, style, update }) => {
              updatePopper.current = update;
              return (
                <Fragment>
                  {/* Is the panel opened / hidden */}
                  {settings.isOpen && (
                    <div
                      id={PICKER_CONTROL_ID}
                      style={{ zIndex: layers.layer(), ...style }}
                      ref={ref}
                    >
                      <div css={styles.popupStyle}>
                        {settings.showFullPicker ? (
                          <EmojiPicker
                            emojiProvider={emojiProvider}
                            onSelection={onEmojiSelected}
                            size={emojiPickerSize}
                          />
                        ) : (
                          <div css={styles.contentStyle}>
                            <Selector
                              emojiProvider={emojiProvider}
                              onSelection={onEmojiSelected}
                              showMore={allowAllEmojis}
                              onMoreClick={onSelectMoreClick}
                              pickerQuickReactionEmojiIds={
                                pickerQuickReactionEmojiIds
                              }
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </Fragment>
              );
            }}
          </Popper>
        </Manager>
      </div>
    );
  },
);
