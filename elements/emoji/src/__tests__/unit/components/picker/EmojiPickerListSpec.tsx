import React from 'react';
import { screen, act, fireEvent } from '@testing-library/react';
import { matchers } from '@emotion/jest';
import { mountWithIntl } from '@atlaskit/editor-test-helpers/enzyme';
import { List as VirtualList } from 'react-virtualized/dist/commonjs/List';
import { RENDER_EMOJI_DELETE_BUTTON_TESTID } from '../../../../components/common/DeleteButton';
import { RENDER_EMOJI_PICKER_CATEGORY_HEADING_TESTID } from '../../../../components/picker/EmojiPickerCategoryHeading';
import EmojiPickerList, {
  Props as EmojiPickerListProps,
  RENDER_EMOJI_PICKER_LIST_TESTID,
} from '../../../../components/picker/EmojiPickerList';
import { messages } from '../../../../components/i18n';
import { deleteEmojiLabel } from '../../../../util/constants';
import { EmojiDescription } from '../../../../types';
import {
  mockReactDomWarningGlobal,
  renderWithIntl,
} from '../../_testing-library';
import {
  atlassianEmojis,
  emojis as allEmojis,
  imageEmoji,
  onRowsRenderedArgs,
  siteEmojiFoo,
  siteEmojiWtf,
} from '../../_test-data';

expect.extend(matchers);

describe('<EmojiPickerList />', () => {
  mockReactDomWarningGlobal();

  const emojis = [imageEmoji];
  const customEmojis: EmojiDescription[] = [siteEmojiFoo, siteEmojiWtf];

  const defaultProps: EmojiPickerListProps = {
    uploading: false,
    uploadEnabled: false,
    onUploadEmoji: jest.fn(),
    onUploadCancelled: jest.fn(),
    onDeleteEmoji: jest.fn(),
    onCloseDelete: () => {},
    onOpenUpload: () => {},
    emojis,
  };

  const renderEmojiPickerList = (
    customProps: Partial<EmojiPickerListProps> = {},
  ) => renderWithIntl(<EmojiPickerList {...defaultProps} {...customProps} />);

  describe('list', () => {
    it('should contain search ', async () => {
      renderEmojiPickerList();
      const wrapper = await screen.findByTestId(
        RENDER_EMOJI_PICKER_LIST_TESTID,
      );
      expect(wrapper).toBeInTheDocument();
      expect(wrapper).toHaveStyleRule('flex', '1 1 auto');
    });

    it('should show people category first if no frequently used', async () => {
      renderEmojiPickerList();
      const peopleHeadingItem = await screen.findByText(
        messages.peopleCategory.defaultMessage,
      );
      expect(peopleHeadingItem).toBeInTheDocument();
    });

    it('should show frequently used category first if present', async () => {
      const frequentEmoji: EmojiDescription = {
        id: 'freq-1',
        shortName: ':frequent_thing:',
        name: 'Frequent',
        type: 'standard',
        category: 'FREQUENT',
        order: 1032,
        representation: {
          imagePath: 'https://path-to-image.png',
          width: 24,
          height: 24,
        },
        ascii: undefined,
        searchable: true,
      };

      const emojisWithFrequent = [...emojis, frequentEmoji];
      renderEmojiPickerList({ emojis: emojisWithFrequent });

      const headingItems = await screen.findAllByTestId(
        RENDER_EMOJI_PICKER_CATEGORY_HEADING_TESTID,
      );
      expect(headingItems).toBeDefined();
      expect(headingItems.length).toBe(2);
      expect(headingItems[0].textContent).toEqual(
        messages.frequentCategory.defaultMessage,
      );
      expect(headingItems[1].textContent).toEqual(
        messages.peopleCategory.defaultMessage,
      );
    });

    it('should order emoji inside category', async () => {
      const outOfOrderEmojis: EmojiDescription[] = [
        {
          ...atlassianEmojis[0],
          order: 10,
        },
        {
          ...atlassianEmojis[1],
          order: 0,
        },
      ];

      renderEmojiPickerList({
        emojis: outOfOrderEmojis,
      });

      const images = await screen.findAllByRole('img');
      expect(images).toBeDefined();
      expect(images.length).toEqual(outOfOrderEmojis.length);

      expect(images[0]).toHaveAttribute('alt', atlassianEmojis[1].shortName);
      expect(images[0]).toHaveAttribute('data-emoji-id', atlassianEmojis[1].id);

      expect(images[1]).toHaveAttribute('alt', atlassianEmojis[0].shortName);
      expect(images[1]).toHaveAttribute('data-emoji-id', atlassianEmojis[0].id);
    });

    it('should not order frequent category emojis', async () => {
      const frequentCategoryEmojis: EmojiDescription[] = [
        {
          ...atlassianEmojis[0],
          category: 'FREQUENT',
          order: 10,
        },
        {
          ...atlassianEmojis[1],
          category: 'FREQUENT',
          order: 0,
        },
      ];
      renderEmojiPickerList({
        emojis: frequentCategoryEmojis,
      });
      const images = await screen.findAllByRole('img');
      expect(images).toBeDefined();
      expect(images.length).toEqual(frequentCategoryEmojis.length);

      expect(images[0]).toHaveAttribute('alt', atlassianEmojis[0].shortName);
      expect(images[0]).toHaveAttribute('data-emoji-id', atlassianEmojis[0].id);

      expect(images[1]).toHaveAttribute('alt', atlassianEmojis[1].shortName);
      expect(images[1]).toHaveAttribute('data-emoji-id', atlassianEmojis[1].id);
    });
  });

  describe('custom upload display', () => {
    it('should render user custom emojis under Your Uploads', async () => {
      renderEmojiPickerList({
        emojis: customEmojis,
        currentUser: { id: 'hulk' },
      });

      // testing the categories list is correct
      const headingItems = await screen.findAllByTestId(
        RENDER_EMOJI_PICKER_CATEGORY_HEADING_TESTID,
      );
      expect(headingItems).toBeDefined();
      expect(headingItems.length).toBe(2);
      expect(headingItems[0].textContent).toEqual(
        messages.userUploadsCustomCategory.defaultMessage,
      );
      expect(headingItems[1].textContent).toEqual(
        messages.allUploadsCustomCategory.defaultMessage,
      );

      // expected 3 emojis: foo in "Your Uploads", foo/wtf in "All uploads"
      const images = await screen.findAllByRole('img');
      expect(images).toBeDefined();
      expect(images.length).toEqual(customEmojis.length + 1);

      expect(images[0]).toHaveAttribute('alt', siteEmojiFoo.shortName);
      expect(images[0]).toHaveAttribute('data-emoji-id', siteEmojiFoo.id);

      expect(images[1]).toHaveAttribute('alt', siteEmojiFoo.shortName);
      expect(images[1]).toHaveAttribute('data-emoji-id', siteEmojiFoo.id);

      expect(images[2]).toHaveAttribute('alt', siteEmojiWtf.shortName);
      expect(images[2]).toHaveAttribute('data-emoji-id', siteEmojiWtf.id);
    });

    it('should not render user custom emojis section if user has none', async () => {
      renderEmojiPickerList({
        emojis: customEmojis,
        currentUser: { id: 'alex' },
      });
      // testing the categories list is correct
      const headingItems = await screen.findAllByTestId(
        RENDER_EMOJI_PICKER_CATEGORY_HEADING_TESTID,
      );
      expect(headingItems).toBeDefined();
      expect(headingItems.length).toBe(1);
      expect(headingItems[0].textContent).toEqual(
        messages.allUploadsCustomCategory.defaultMessage,
      );

      // expected 2 custom emojis: foo and wtf
      const images = await screen.findAllByRole('img');
      expect(images).toBeDefined();
      expect(images.length).toEqual(customEmojis.length);

      expect(images[0]).toHaveAttribute('alt', siteEmojiFoo.shortName);
      expect(images[0]).toHaveAttribute('data-emoji-id', siteEmojiFoo.id);

      expect(images[1]).toHaveAttribute('alt', siteEmojiWtf.shortName);
      expect(images[1]).toHaveAttribute('data-emoji-id', siteEmojiWtf.id);
    });

    it('should not render user custom emojis section if currentUser is undefined', async () => {
      renderEmojiPickerList({
        emojis: customEmojis,
      });
      // testing the categories list is correct
      const headingItems = await screen.findAllByTestId(
        RENDER_EMOJI_PICKER_CATEGORY_HEADING_TESTID,
      );
      expect(headingItems).toBeDefined();
      expect(headingItems.length).toBe(1);
      expect(headingItems[0].textContent).toEqual(
        messages.allUploadsCustomCategory.defaultMessage,
      );

      // expected 2 custom emojis: foo and wtf
      const images = await screen.findAllByRole('img');
      expect(images).toBeDefined();
      expect(images.length).toEqual(customEmojis.length);

      expect(images[0]).toHaveAttribute('alt', siteEmojiFoo.shortName);
      expect(images[0]).toHaveAttribute('data-emoji-id', siteEmojiFoo.id);

      expect(images[1]).toHaveAttribute('alt', siteEmojiWtf.shortName);
      expect(images[1]).toHaveAttribute('data-emoji-id', siteEmojiWtf.id);
    });

    it('should trigger onCategoryActivated', async () => {
      const mockOnCategoryActivated = jest.fn();
      renderEmojiPickerList({
        emojis: allEmojis,
        onCategoryActivated: mockOnCategoryActivated,
      });
      const virtualListWrapper = await screen.findByRole('grid');
      expect(virtualListWrapper).toBeInTheDocument();

      //  TODO: NEED TO FIND A WAY TO SIMULATE INTERACTION WITH "react-virtualized" list
      const wrapper = mountWithIntl(
        <EmojiPickerList
          {...defaultProps}
          emojis={allEmojis}
          onCategoryActivated={mockOnCategoryActivated}
        />,
      );

      mockOnCategoryActivated.mockReset();
      const virtualList = wrapper.find(VirtualList);
      const onRowsRendered = virtualList.prop('onRowsRendered') as Function;
      onRowsRendered(onRowsRenderedArgs(9, 10, 15, 20));
      expect(mockOnCategoryActivated.mock.calls).toHaveLength(1);
      expect(mockOnCategoryActivated.mock.calls[0][0]).toEqual('ACTIVITY');
    });

    it('should not break while finding category in an empty list', async () => {
      const onCategoryActivated = jest.fn();
      const wrapper = mountWithIntl(
        <EmojiPickerList
          {...defaultProps}
          emojis={[]}
          onCategoryActivated={onCategoryActivated}
        />,
      );

      onCategoryActivated.mockReset();

      const virtualList = wrapper.find(VirtualList);

      const onRowsRendered = virtualList.prop('onRowsRendered') as Function;

      onRowsRendered(onRowsRenderedArgs());

      expect(onCategoryActivated.mock.calls).toHaveLength(0);
    });

    it('should trigger onCategoryActivated for first category', async () => {
      const onCategoryActivated = jest.fn();
      const wrapper = mountWithIntl(
        <EmojiPickerList
          {...defaultProps}
          emojis={allEmojis}
          onCategoryActivated={onCategoryActivated}
        />,
      );

      const virtualList = wrapper.find(VirtualList);

      const onRowsRendered = virtualList.prop('onRowsRendered') as Function;

      onRowsRendered(onRowsRenderedArgs(5, 10, 20, 25));
      onCategoryActivated.mockReset();
      onRowsRendered(onRowsRenderedArgs(0, 0, 10, 15));

      expect(onCategoryActivated.mock.calls).toHaveLength(1);
      expect(onCategoryActivated.mock.calls[0][0]).toEqual('PEOPLE');
    });

    it('should trigger onCategoryActivated for bottom category', async () => {
      const onCategoryActivated = jest.fn();
      const wrapper = mountWithIntl(
        <EmojiPickerList
          {...defaultProps}
          emojis={allEmojis}
          onCategoryActivated={onCategoryActivated}
        />,
      );

      const virtualList = wrapper.find(VirtualList);

      const onRowsRendered = virtualList.prop('onRowsRendered') as Function;

      onCategoryActivated.mockReset();
      onRowsRendered(onRowsRenderedArgs(27, 29, 29, 29));

      expect(onCategoryActivated.mock.calls).toHaveLength(1);
      expect(onCategoryActivated.mock.calls[0][0]).toEqual('CUSTOM');
    });
  });

  describe('delete', () => {
    it('should render user custom emoji with delete button', async () => {
      renderEmojiPickerList({
        emojis: customEmojis,
        currentUser: { id: 'hulk' },
      });
      // testing the categories list is correct
      const headingItems = await screen.findAllByTestId(
        RENDER_EMOJI_PICKER_CATEGORY_HEADING_TESTID,
      );
      expect(headingItems).toBeDefined();
      expect(headingItems.length).toBe(customEmojis.length);
      expect(headingItems[0].textContent).toEqual(
        messages.userUploadsCustomCategory.defaultMessage,
      );
      // expected 2 custom emojis: foo and wtf
      const images = await screen.findAllByRole('img');
      expect(images).toBeDefined();
      expect(images.length).toEqual(customEmojis.length + 1);

      // expected first to be :foo: under "Your uploads"
      expect(images[0]).toHaveAttribute('alt', siteEmojiFoo.shortName);
      expect(images[0]).toHaveAttribute('data-emoji-id', siteEmojiFoo.id);

      const deleteButton = await screen.findByTestId(
        RENDER_EMOJI_DELETE_BUTTON_TESTID,
      );
      expect(deleteButton).toBeInTheDocument();
    });

    it('should not render delete button if not user custom emoji', async () => {
      renderEmojiPickerList({
        emojis: customEmojis,
        currentUser: { id: 'alex' },
      });
      // testing the categories list is correct
      const headingItems = await screen.findAllByTestId(
        RENDER_EMOJI_PICKER_CATEGORY_HEADING_TESTID,
      );
      expect(headingItems).toBeDefined();
      expect(headingItems[0].textContent).toEqual(
        messages.allUploadsCustomCategory.defaultMessage,
      );
      // expected 2 custom emojis: foo and wtf
      const images = await screen.findAllByRole('img');
      expect(images).toBeDefined();
      expect(images.length).toEqual(customEmojis.length);

      // expected first to be :foo: under "All uploads"
      expect(images[0]).toHaveAttribute('alt', siteEmojiFoo.shortName);
      expect(images[0]).toHaveAttribute('data-emoji-id', siteEmojiFoo.id);

      const deleteButton = screen.queryByTestId(
        RENDER_EMOJI_DELETE_BUTTON_TESTID,
      );
      expect(deleteButton).toBeNull();
    });

    it('should have label "delete-emoji" on delete button', async () => {
      renderEmojiPickerList({
        emojis: customEmojis,
        currentUser: { id: 'hulk' },
      });
      // needs label of "delete-emoji" to prevent selection on click
      const deleteImages = await screen.findAllByLabelText(deleteEmojiLabel);
      expect(deleteImages).toBeDefined();
      expect(deleteImages.length).toBeGreaterThanOrEqual(1);
    });

    it('should call onEmojiDelete if delete button is clicked', async () => {
      const mockOnDelete = jest.fn();
      renderEmojiPickerList({
        emojis: customEmojis,
        currentUser: { id: 'hulk' },
        onEmojiDelete: mockOnDelete,
      });
      const deleteBtn = await screen.findByTestId(
        RENDER_EMOJI_DELETE_BUTTON_TESTID,
      );
      expect(deleteBtn).toBeInTheDocument();
      act(() => {
        fireEvent.click(deleteBtn.querySelector('button') as HTMLElement);
      });
      expect(mockOnDelete).toHaveBeenCalledTimes(1);
    });

    it('should not call onEmojiSelected if delete button is clicked', async () => {
      const mockOnEmojiSelected = jest.fn();
      renderEmojiPickerList({
        emojis: customEmojis,
        currentUser: { id: 'hulk' },
        onEmojiSelected: mockOnEmojiSelected,
      });
      const deleteBtn = await screen.findByTestId(
        RENDER_EMOJI_DELETE_BUTTON_TESTID,
      );
      expect(deleteBtn).toBeInTheDocument();
      act(() => {
        fireEvent.click(deleteBtn.querySelector('button') as HTMLElement);
      });
      expect(mockOnEmojiSelected).not.toHaveBeenCalled();
    });
  });
});
