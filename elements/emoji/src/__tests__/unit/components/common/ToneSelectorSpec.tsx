import React from 'react';
import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import ToneSelector from '../../../../components/common/ToneSelector';
import {
  EmojiDescription,
  EmojiDescriptionWithVariations,
} from '../../../../types';
import { imageEmoji, generateSkinVariation } from '../../_test-data';
import { AnalyticsListener } from '@atlaskit/analytics-next';
import {
  toneSelectedEvent,
  toneSelectorOpenedEvent,
} from '../../../../util/analytics';

const baseHandEmoji: EmojiDescription = {
  ...imageEmoji,
  id: 'raised_back_of_hand',
  shortName: ':raised_back_of_hand:',
};

const handEmoji: EmojiDescriptionWithVariations = {
  ...baseHandEmoji,
  skinVariations: [
    generateSkinVariation(baseHandEmoji, 1),
    generateSkinVariation(baseHandEmoji, 2),
    generateSkinVariation(baseHandEmoji, 3),
    generateSkinVariation(baseHandEmoji, 4),
    generateSkinVariation(baseHandEmoji, 5),
  ],
};

describe('<ToneSelector />', () => {
  it('should display one emoji per skin variations + default', async () => {
    await render(<ToneSelector emoji={handEmoji} onToneSelected={() => {}} />);

    expect((await screen.findAllByRole('button')).length).toEqual(6);
  });

  it('should call onToneSelected on click', async () => {
    const handleToneSelectedMock = jest.fn();

    await render(
      <ToneSelector
        emoji={handEmoji}
        onToneSelected={handleToneSelectedMock}
      />,
    );

    const toneButton = await screen.findByLabelText(':raised_back_of_hand-4:');
    userEvent.click(toneButton);

    expect(handleToneSelectedMock).toHaveBeenCalled();
    expect(handleToneSelectedMock).toHaveBeenCalledWith(4);
  });

  it('should fire all relevant analytics', async () => {
    const handleOnEventMock = jest.fn();
    const handleToneSelectedMock = jest.fn();

    const component = await render(
      <AnalyticsListener channel="fabric-elements" onEvent={handleOnEventMock}>
        <ToneSelector
          emoji={handEmoji}
          onToneSelected={handleToneSelectedMock}
        />
      </AnalyticsListener>,
    );

    expect(handleOnEventMock).toHaveBeenCalledWith(
      expect.objectContaining({
        payload: toneSelectorOpenedEvent({}),
      }),
      'fabric-elements',
    );

    const toneButton = await screen.findByLabelText(':raised_back_of_hand-4:');
    userEvent.click(toneButton);

    expect(handleOnEventMock).toHaveBeenCalledWith(
      expect.objectContaining({
        payload: toneSelectedEvent({ skinToneModifier: 'mediumDark' }),
      }),
      'fabric-elements',
    );

    component.unmount();
    expect(handleOnEventMock).toHaveBeenCalledTimes(2);
  });
});
