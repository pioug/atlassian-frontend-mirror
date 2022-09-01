/** @jsx jsx */
import React, { Fragment, useCallback, useRef, useState } from 'react';
import { jsx } from '@emotion/core';
import { EmojiId } from '@atlaskit/emoji/types';
import { EmojiPicker } from '@atlaskit/emoji/picker';
import { EmojiProvider } from '@atlaskit/emoji/resource';
import { Manager, Popper, Reference, PopperProps } from '@atlaskit/popper';
import { layers } from '@atlaskit/theme/constants';
import { Selector, SelectorProps } from '../Selector';
import { Trigger } from '../Trigger';
import { UFO } from '../../analytics';
import { useClickAway } from '../../hooks';
import { ReactionSource } from '../../types';
import * as styles from './styles';

/**
 * Test id for wrapper ReactionPicker div
 */
export const RENDER_REACTIONPICKER_TESTID = 'reactionPicker-testid';

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
  extends Pick<SelectorProps, 'pickerQuickReactionEmojiIds'> {
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
   * apply "miniMode" className to the <ReactionPicker /> component
   */
  miniMode?: boolean;
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
      onShowMore,
      onOpen,
      onCancel,
    } = props;
    /**
     * Container <div /> reference (used by custom hook to detect click outside)
     */
    const wrapperRef = useRef<HTMLDivElement>(null);
    /**
     * a function you can ask Popper to recompute your tooltip's position. It will directly call the Popper#update method
     */
    const updatePopper = useRef<() => Promise<any>>(() => Promise.resolve());

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
    useClickAway(wrapperRef, () => {
      if (onCancel) {
        onCancel();
      }
      close();
    });

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
            source: 'Reaction-Picker',
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
    const onSelectMoreClick: (
      e: React.MouseEvent<HTMLElement>,
    ) => Promise<void> = useCallback(
      async (e) => {
        e.preventDefault();

        await updatePopper.current();
        // Update popper position
        setSettings({
          isOpen: true,
          showFullPicker: true,
        });
        if (onShowMore) {
          onShowMore();
        }
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
      if (onOpen) {
        onOpen();
      }
      // ufo reactions picker opened success
      UFO.PickerRender.success();
    };

    const wrapperClassName = ` ${settings.isOpen ? 'isOpen' : ''} ${
      miniMode ? 'miniMode' : ''
    } ${className}`;

    return (
      <div
        className={wrapperClassName}
        css={styles.pickerStyle}
        ref={wrapperRef}
        data-testid={RENDER_REACTIONPICKER_TESTID}
      >
        <Manager>
          <Reference>
            {({ ref: popperRef }) => (
              // Render a button to open the <Selector /> panel
              <Trigger
                ref={popperRef}
                onClick={onTriggerClick}
                miniMode={miniMode}
                disabled={disabled}
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
                    <div style={{ zIndex: layers.layer(), ...style }} ref={ref}>
                      <div css={styles.popupStyle}>
                        {settings.showFullPicker ? (
                          <EmojiPicker
                            emojiProvider={emojiProvider}
                            onSelection={onEmojiSelected}
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
