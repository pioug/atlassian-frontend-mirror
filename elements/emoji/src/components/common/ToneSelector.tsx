import React, { createRef, PureComponent } from 'react';

import {
  EmojiDescription,
  EmojiDescriptionWithVariations,
  OnToneSelected,
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

export class ToneSelectorInternal extends PureComponent<
  Props & WithAnalyticsEventsProps,
  {}
> {
  private fireEvent(event: AnalyticsEventPayload) {
    const { createAnalyticsEvent } = this.props;

    if (createAnalyticsEvent) {
      createAndFireEventInElementsChannel(event)(createAnalyticsEvent);
    }
  }

  componentDidMount() {
    this.firstToneButtonRef?.current?.focus();
  }

  public UNSAFE_componentWillMount() {
    this.fireEvent(toneSelectorOpenedEvent({}));
  }

  firstToneButtonRef = createRef<HTMLButtonElement>();

  private onToneSelectedHandler = (skinTone: number) => {
    const { onToneSelected } = this.props;
    onToneSelected(skinTone);

    const toneList = [
      'default',
      'light',
      'mediumLight',
      'medium',
      'mediumDark',
      'dark',
    ];
    this.fireEvent(
      toneSelectedEvent({
        skinToneModifier: toneList[skinTone],
      }),
    );
  };

  render() {
    const { emoji, previewEmojiId } = this.props;
    const toneEmojis: EmojiDescription[] = extractAllTones(emoji);
    let isRefAlreadySet = false;

    return (
      <div>
        {toneEmojis.map((tone, i) => {
          const shouldSetRef = !isRefAlreadySet && tone.id !== previewEmojiId;
          if (shouldSetRef) {
            isRefAlreadySet = true;
          }

          return (
            <EmojiButton
              ref={shouldSetRef ? this.firstToneButtonRef : null}
              shouldHideButton={tone.id === previewEmojiId}
              ariaLabelText={setSkinToneAriaLabelText(tone.name as string)}
              key={`${tone.id}`}
              onSelected={() => this.onToneSelectedHandler(i)}
              emoji={tone}
              selectOnHover={true}
            />
          );
        })}
      </div>
    );
  }
}

const ToneSelector = withAnalyticsEvents()(ToneSelectorInternal);

export default ToneSelector;
