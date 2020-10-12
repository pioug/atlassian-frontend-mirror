import React from 'react';
import { PureComponent } from 'react';

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

export interface Props {
  emoji: EmojiDescriptionWithVariations;
  onToneSelected: OnToneSelected;
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

  public UNSAFE_componentWillMount() {
    this.fireEvent(toneSelectorOpenedEvent({}));
  }

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
    const { emoji } = this.props;
    const toneEmojis: EmojiDescription[] = extractAllTones(emoji);

    return (
      <div>
        {toneEmojis.map((tone, i) => (
          <EmojiButton
            key={`${tone.id}`}
            onSelected={() => this.onToneSelectedHandler(i)}
            emoji={tone}
            selectOnHover={true}
          />
        ))}
      </div>
    );
  }
}

const ToneSelector = withAnalyticsEvents()(ToneSelectorInternal);

export default ToneSelector;
