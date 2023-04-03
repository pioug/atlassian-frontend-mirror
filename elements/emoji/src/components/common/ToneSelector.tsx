/** @jsx jsx */
import { jsx } from '@emotion/react';
import { FC, memo, useEffect, useMemo, useRef } from 'react';
import {
  EmojiDescription,
  EmojiDescriptionWithVariations,
  OnToneSelected,
  ToneSelection,
  ToneValueType,
} from '../../types';
import {
  withAnalyticsEvents,
  WithAnalyticsEventsProps,
  AnalyticsEventPayload,
} from '@atlaskit/analytics-next';
import {
  createAndFireEventInElementsChannel,
  toneSelectedEvent,
  toneSelectorOpenedEvent,
} from '../../util/analytics';
import { setSkinToneAriaLabelText } from './setSkinToneAriaLabelText';
import EmojiRadioButton from './EmojiRadioButton';
import { useIntl } from 'react-intl-next';
import { messages } from '../i18n';
import { hidden } from './styles';

export interface Props {
  emoji: EmojiDescriptionWithVariations;
  isVisible: boolean;
  onToneSelected: OnToneSelected;
  onToneClose?: () => void;
  selectedTone?: ToneSelection;
}

export const toneSelectorTestId = 'tone-selector';

const extractAllTones = (
  emoji: EmojiDescriptionWithVariations,
): EmojiDescription[] => {
  if (emoji.skinVariations) {
    return [emoji, ...emoji.skinVariations];
  }
  return [emoji];
};

type PropsWithAnalyticsEventsPropsType = Props & WithAnalyticsEventsProps;
export const ToneSelectorInternal: FC<PropsWithAnalyticsEventsPropsType> = (
  props,
) => {
  const {
    createAnalyticsEvent,
    emoji,
    onToneSelected,
    onToneClose,
    selectedTone,
    isVisible,
  } = props;
  const isMounted = useRef(false);
  const selectedToneRadioRef = useRef<HTMLInputElement>(null);
  const { formatMessage } = useIntl();

  const emojiToneCollection = useMemo(() => {
    var selectedToneIndex: number = -1;
    const toneColletion = extractAllTones(emoji).map((tone, index) => {
      const isSelected = index === selectedTone;
      if (isSelected) {
        selectedToneIndex = index;
      }
      return {
        ...tone,
        isSelected: isSelected,
        label: setSkinToneAriaLabelText(tone.name),
        toneIndex: index,
      };
    });

    // push description of selected tone to the end of the array
    // so that it gets rendered last/rightmost
    toneColletion.push(toneColletion.splice(selectedToneIndex, 1)[0]);

    return toneColletion;
  }, [emoji, selectedTone]);

  useEffect(() => {
    if (isVisible) {
      selectedToneRadioRef.current?.focus();
    }
  }, [isVisible, selectedToneRadioRef]);

  const fireAnalyticsEvent = (event: AnalyticsEventPayload) => {
    if (createAnalyticsEvent) {
      createAndFireEventInElementsChannel(event)(createAnalyticsEvent);
    }
  };

  const onToneSelectedHandler = (toneValue: ToneValueType) => () => {
    if (selectedTone === toneValue && onToneClose) {
      onToneClose();
      return;
    }

    onToneSelected(toneValue);

    const toneList = [
      'default',
      'light',
      'mediumLight',
      'medium',
      'mediumDark',
      'dark',
    ];

    fireAnalyticsEvent(
      toneSelectedEvent({
        skinToneModifier: toneList[toneValue],
      }),
    );
  };

  if (!isMounted.current) {
    fireAnalyticsEvent(toneSelectorOpenedEvent({}));
  }

  isMounted.current = true;

  return (
    <div
      role="radiogroup"
      data-testid={toneSelectorTestId}
      id="emoji-picker-tone-selector"
      aria-label={formatMessage(messages.emojiSelectSkinToneListAriaLabelText)}
      css={!isVisible && hidden}
    >
      {emojiToneCollection.map((tone) => {
        return (
          <EmojiRadioButton
            ref={tone.isSelected ? selectedToneRadioRef : null}
            defaultChecked={tone.isSelected}
            ariaLabelText={tone.label}
            key={`${tone.id}`}
            emoji={tone}
            onSelected={onToneSelectedHandler(tone.toneIndex)}
            selectOnHover
          />
        );
      })}
    </div>
  );
};

const ToneSelector = withAnalyticsEvents()(ToneSelectorInternal);

export default memo(ToneSelector);
