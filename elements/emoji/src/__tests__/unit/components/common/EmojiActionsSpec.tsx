import React from 'react';
import EmojiActionsWithIntl from '../../../../components/common/EmojiActions';
import { EmojiDescriptionWithVariations } from '../../../../types';
import { generateSkinVariation, imageEmoji } from '../../_test-data';
import { renderWithIntl } from '../../_testing-library';
import userEvent from '@testing-library/user-event';
import { fireEvent } from '@testing-library/react';
import { screen } from '@testing-library/dom';

const baseToneEmoji = {
  ...imageEmoji,
  id: 'raised_back_of_hand',
  shortName: ':raised_back_of_hand:',
  name: 'Raised back of hand',
};

const toneEmoji: EmojiDescriptionWithVariations = {
  ...baseToneEmoji,
  skinVariations: [
    generateSkinVariation(baseToneEmoji, 1),
    generateSkinVariation(baseToneEmoji, 2),
    generateSkinVariation(baseToneEmoji, 3),
    generateSkinVariation(baseToneEmoji, 4),
    generateSkinVariation(baseToneEmoji, 5),
  ],
};

const props = {
  onUploadCancelled: jest.fn(),
  onUploadEmoji: jest.fn(),
  onCloseDelete: jest.fn(),
  onDeleteEmoji: jest.fn(),
  uploading: false,
  uploadEnabled: false,
  onOpenUpload: () => {},
  onChange: () => {},
  onToneSelected: jest.fn(),
};

describe('<EmojiActions />', () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup();
  });

  describe('tone', () => {
    it('should display tone selector after clicking on the tone button', async () => {
      await renderWithIntl(
        <EmojiActionsWithIntl {...props} toneEmoji={toneEmoji} />,
      );

      // Open Skin Tone UI
      const toneSelectorButton = await screen.findByLabelText(
        'Select skin tone',
        { exact: false },
      );
      await user.click(toneSelectorButton);
      expect(
        await screen.findByLabelText('Select skin tone', { exact: false }),
      ).toHaveAttribute('aria-expanded', 'true');
    });

    it('button should show current selected tone if provided', async () => {
      await renderWithIntl(
        <EmojiActionsWithIntl
          {...props}
          toneEmoji={toneEmoji}
          selectedTone={3}
        />,
      );

      expect(
        await screen.findByLabelText(toneEmoji!.skinVariations![2].shortName),
      ).toBeInTheDocument();
    });

    it('button should show default tone if selected tone is not specified', async () => {
      await renderWithIntl(
        <EmojiActionsWithIntl {...props} toneEmoji={toneEmoji} />,
      );

      expect(
        await screen.findByLabelText(toneEmoji.shortName),
      ).toBeInTheDocument();
    });

    it('should be able to select a different tone', async () => {
      await renderWithIntl(
        <EmojiActionsWithIntl {...props} toneEmoji={toneEmoji} />,
      );

      // Open Skin Tone UI
      const toneSelectorButton = await screen.findByLabelText(
        'Select skin tone',
        { exact: false },
      );
      await user.click(toneSelectorButton);
      expect(
        await screen.findByLabelText('Select skin tone', { exact: false }),
      ).toHaveAttribute('aria-expanded', 'true');

      // Click a Different Tone
      const toneSelectorToneOption = await screen.findByLabelText(
        ':raised_back_of_hand-2:',
      );
      fireEvent.mouseDown(toneSelectorToneOption);

      // Automatically close tone ui
      expect(
        await screen.findByLabelText('Select skin tone', { exact: false }),
      ).toHaveAttribute('aria-expanded', 'false');

      // Validate the correct tone id was selected
      expect(props.onToneSelected).toHaveBeenCalled();
      expect(props.onToneSelected).toHaveBeenCalledWith(2);
    });

    it('should stop selecting tone on mouse leave', async () => {
      await renderWithIntl(
        <EmojiActionsWithIntl {...props} toneEmoji={toneEmoji} />,
      );

      // Open tone
      const toneSelectorButton = await screen.findByLabelText(
        'Select skin tone',
        { exact: false },
      );
      await user.click(toneSelectorButton);
      expect(
        await screen.findByLabelText('Select skin tone', { exact: false }),
      ).toHaveAttribute('aria-expanded', 'true');

      // Move the mouse out of the ui
      fireEvent.mouseLeave(toneSelectorButton);

      // Validate the tone ui is closed
      expect(
        await screen.findByLabelText('Select skin tone', { exact: false }),
      ).toHaveAttribute('aria-expanded', 'false');
    });
  });

  describe('Add custom emoji', () => {
    describe('Upload not supported', () => {
      it('"Add custom emoji" button should not appear when uploadEnabled is false', async () => {
        await renderWithIntl(
          <EmojiActionsWithIntl {...props} toneEmoji={toneEmoji} />,
        );

        expect(
          await screen.queryByText('Add your own emoji'),
        ).not.toBeInTheDocument();
      });
    });

    describe('Upload supported', () => {
      it('"Add custom emoji" button should appear as default', async () => {
        await renderWithIntl(
          <EmojiActionsWithIntl
            {...props}
            toneEmoji={toneEmoji}
            uploadEnabled
          />,
        );

        expect(
          await screen.queryByText('Add your own emoji'),
        ).toBeInTheDocument();
      });
    });
  });

  describe('EmojiPickerListSearch', () => {
    it('should render EmojiPickerListSearch by default', async () => {
      await renderWithIntl(
        <EmojiActionsWithIntl {...props} toneEmoji={toneEmoji} />,
      );

      expect(await screen.findByLabelText('Search emoji')).toBeInTheDocument();
    });

    it('should hide EmojiPickerListSearch when ToneSelector is open', async () => {
      await renderWithIntl(
        <EmojiActionsWithIntl {...props} toneEmoji={toneEmoji} />,
      );

      // Open tone
      const toneSelectorButton = await screen.findByLabelText(
        'Select skin tone',
        { exact: false },
      );
      await user.click(toneSelectorButton);
      expect(
        await screen.findByLabelText('Select skin tone', { exact: false }),
      ).toHaveAttribute('aria-expanded', 'true');

      // Validate search bar does not exist
      expect(screen.queryByLabelText('Search emoji')).toBeNull();
    });

    it('should stop selecting tone and show EmojiPickerListSearch on mouse leave', async () => {
      await renderWithIntl(
        <EmojiActionsWithIntl {...props} toneEmoji={toneEmoji} />,
      );

      // Open tone
      const toneSelectorButton = await screen.findByLabelText(
        'Select skin tone',
        { exact: false },
      );
      await user.click(toneSelectorButton);
      expect(
        await screen.findByLabelText('Select skin tone', { exact: false }),
      ).toHaveAttribute('aria-expanded', 'true');

      // Move the mouse out of the ui
      fireEvent.mouseLeave(toneSelectorButton);

      // Validate the tone ui is closed
      expect(
        await screen.findByLabelText('Select skin tone', { exact: false }),
      ).toHaveAttribute('aria-expanded', 'false');

      // Validate search bar does exist
      expect(await screen.findByLabelText('Search emoji')).toBeInTheDocument();
    });
  });
});
