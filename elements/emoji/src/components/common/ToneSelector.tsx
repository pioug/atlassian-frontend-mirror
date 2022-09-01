import React, { FC, useEffect, useMemo, useRef } from 'react';
import {
  EmojiDescription,
  EmojiDescriptionWithVariations,
  OnToneSelected,
  ToneValueType,
} from '../../types';
import EmojiButton from './EmojiButton';
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

export interface Props {
  emoji: EmojiDescriptionWithVariations;
  onToneSelected: OnToneSelected;
  previewEmojiId?: string;
}

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
  const { createAnalyticsEvent, emoji, previewEmojiId, onToneSelected } = props;
  const isMounted = useRef(false);
  const firstToneButtonRef = useRef<HTMLButtonElement>(null);
  const emojiToneCollection = useMemo(() => {
    return extractAllTones(emoji).map((tone, index) => ({
      ...tone,
      focused: tone.id !== previewEmojiId,
      label: setSkinToneAriaLabelText(tone.name),
      toneId: index,
    }));
  }, [emoji, previewEmojiId]);

  useEffect(() => {
    if (firstToneButtonRef.current) {
      firstToneButtonRef.current.focus();
    }
  }, [firstToneButtonRef]);

  const fireAnalyticsEvent = (event: AnalyticsEventPayload) => {
    if (createAnalyticsEvent) {
      createAndFireEventInElementsChannel(event)(createAnalyticsEvent);
    }
  };

  const onToneSelectedHandler = (toneValue: ToneValueType) => () => {
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
    <div>
      {emojiToneCollection.map((tone) => {
        return (
          <EmojiButton
            ref={tone.focused ? firstToneButtonRef : null}
            shouldHideButton={tone.id === previewEmojiId}
            ariaLabelText={tone.label}
            key={`${tone.id}`}
            onSelected={onToneSelectedHandler(tone.toneId)}
            emoji={tone}
            selectOnHover
          />
        );
      })}
    </div>
  );
};

const ToneSelector = withAnalyticsEvents()(ToneSelectorInternal);

export default ToneSelector;
