import React from 'react';
import { screen, act, fireEvent } from '@testing-library/react';
import { matchers } from '@emotion/jest';
import { mountWithIntl } from '../../_enzyme';
import { VirtualList } from '../../../../components/picker/VirtualList';
import { RENDER_EMOJI_DELETE_BUTTON_TESTID } from '../../../../components/common/DeleteButton';
import { RENDER_EMOJI_PICKER_CATEGORY_HEADING_TESTID } from '../../../../components/picker/EmojiPickerCategoryHeading';
import EmojiPickerList, {
  Props as EmojiPickerListProps,
  RENDER_EMOJI_PICKER_LIST_TESTID,
} from '../../../../components/picker/EmojiPickerList';
import { messages } from '../../../../components/i18n';
import {
  defaultEmojiPickerSize,
  deleteEmojiLabel,
  EMOJI_LIST_COLUMNS,
} from '../../../../util/constants';
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
  standardEmojis,
} from '../../_test-data';
import EmojiPickerVirtualList from '../../../../components/picker/EmojiPickerList';
import * as helperTestingLibrary from './_emoji-picker-helpers-testing-library';
import * as constants from '../../../../util/constants';

expect.extend(matchers);

/**
 * TODO: found mixed usage of enzyme and react-testing-library, needs to clean up
 * ticket: COLLAB-1769
 */

describe('<EmojiPickerList />', () => {
  mockReactDomWarningGlobal();
  beforeEach(() => {
    jest
      .spyOn(EmojiPickerVirtualList.prototype, 'scrollToRow')
      .mockImplementation((index?: number) =>
        helperTestingLibrary.scrollToIndex(index || 0),
      );
  });

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
    size: defaultEmojiPickerSize,
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

    it('should not trigger onCategoryActivated in search results', async () => {
      const mockOnCategoryActivated = jest.fn();
      renderEmojiPickerList({
        emojis: allEmojis,
        onCategoryActivated: mockOnCategoryActivated,
        query: 'gr',
      });
      const virtualListWrapper = await screen.findByRole('grid');
      expect(virtualListWrapper).toBeInTheDocument();

      const wrapper = mountWithIntl(
        <EmojiPickerList
          {...defaultProps}
          emojis={allEmojis}
          onCategoryActivated={mockOnCategoryActivated}
          query="qr"
        />,
      );

      const virtualList = wrapper.find(VirtualList);
      const onRowsRendered = virtualList.prop('onRowsRendered') as Function;
      onRowsRendered(onRowsRenderedArgs(1));
      expect(mockOnCategoryActivated).not.toHaveBeenCalled();
    });

    /**
     * People       <- category heading
     * emojis row
     * emojis row
     * Nature       <- category heading
     * ...
     */
    it('should trigger onCategoryActivated when category heading rendered in picker list', async () => {
      const mockOnCategoryActivated = jest.fn();
      renderEmojiPickerList({
        emojis: allEmojis,
        onCategoryActivated: mockOnCategoryActivated,
      });
      const virtualListWrapper = await screen.findByRole('grid');
      expect(virtualListWrapper).toBeInTheDocument();
      const wrapper = mountWithIntl(
        <EmojiPickerList
          {...defaultProps}
          emojis={allEmojis}
          onCategoryActivated={mockOnCategoryActivated}
        />,
      );
      const virtualList = wrapper.find(VirtualList);
      const onRowsRendered = virtualList.prop('onRowsRendered') as Function;
      // when people category heading is rendered
      onRowsRendered(onRowsRenderedArgs(0));
      expect(mockOnCategoryActivated).toHaveBeenLastCalledWith('PEOPLE');

      // when nature category heading is rendered
      onRowsRendered(onRowsRenderedArgs(3));
      expect(mockOnCategoryActivated).toHaveBeenLastCalledWith('NATURE');
    });

    it('should trigger onCategoryActivated for your uploads category', async () => {
      const mockOnCategoryActivated = jest.fn();
      const emojisWithYourUploads = [
        ...standardEmojis,
        ...atlassianEmojis,
        ...customEmojis,
      ];
      renderEmojiPickerList({
        emojis: emojisWithYourUploads,
        onCategoryActivated: mockOnCategoryActivated,
        currentUser: { id: 'hulk' },
      });
      const virtualListWrapper = await screen.findByRole('grid');
      expect(virtualListWrapper).toBeInTheDocument();
      const wrapper = mountWithIntl(
        <EmojiPickerList
          {...defaultProps}
          emojis={emojisWithYourUploads}
          onCategoryActivated={mockOnCategoryActivated}
          currentUser={{ id: 'hulk' }}
        />,
      );
      const virtualList = wrapper.find(VirtualList);
      const onRowsRendered = virtualList.prop('onRowsRendered') as Function;
      // when row within your uploads rendered in picker list
      onRowsRendered(onRowsRenderedArgs(28));
      expect(mockOnCategoryActivated).toHaveBeenLastCalledWith('CUSTOM');
    });

    it('should trigger onCategoryActivated', async () => {
      const mockOnCategoryActivated = jest.fn();
      renderEmojiPickerList({
        emojis: allEmojis,
        onCategoryActivated: mockOnCategoryActivated,
      });
      const virtualListWrapper = await screen.findByRole('grid');
      expect(virtualListWrapper).toBeInTheDocument();

      const wrapper = mountWithIntl(
        <EmojiPickerList
          {...defaultProps}
          emojis={allEmojis}
          onCategoryActivated={mockOnCategoryActivated}
        />,
      );

      const virtualList = wrapper.find(VirtualList);
      const onRowsRendered = virtualList.prop('onRowsRendered') as Function;
      // this row is the first row of emojis under activity category heading in emoji picker list
      onRowsRendered(onRowsRenderedArgs(10));
      expect(mockOnCategoryActivated).toHaveBeenLastCalledWith('ACTIVITY');
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

      onRowsRendered(onRowsRenderedArgs(10));
      onCategoryActivated.mockReset();
      onRowsRendered(onRowsRenderedArgs(0));

      expect(onCategoryActivated.mock.calls).toHaveLength(1);
      expect(onCategoryActivated).toHaveBeenLastCalledWith('PEOPLE');
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
      onRowsRendered(onRowsRenderedArgs(28));

      // expect(onCategoryActivated.mock.calls).toHaveLength(1);
      expect(onCategoryActivated).toHaveBeenLastCalledWith('CUSTOM');
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

    /**
     * x x x x x x x x
     * x x x x x x
     * Your uploads
     * x               <- start
     * All uploads
     * x x
     */
    it('should be able to press backspace to delete', async () => {
      const mockOnDelete = jest.fn();
      renderEmojiPickerList({
        emojis: [...atlassianEmojis, ...customEmojis],
        currentUser: { id: 'hulk' },
        onEmojiDelete: mockOnDelete,
      });
      const emojisList = await screen.queryAllByRole('button');
      const firstCell = emojisList[atlassianEmojis.length];
      firstCell.focus();
      expect(firstCell.tabIndex).toEqual(0);
      act(() => {
        fireEvent.keyDown(firstCell, {
          key: 'Backspace',
        });
      });
      expect(mockOnDelete).toHaveBeenCalledTimes(1);
    });
  });

  describe('arrow keys navigation', () => {
    // the end column of grid
    const lastColumnIndex = EMOJI_LIST_COLUMNS - 1;

    beforeAll(() => {
      // change page up/down row count
      Object.defineProperty(constants, 'EMOJI_LIST_PAGE_COUNT', { value: 2 });
    });

    /**
     * S x x x x x x x   <- press arrow left, arrow up, page up, home key, or ctrl+home key won't move it
     * x x x x x x
     * All uploads
     * x x
     */
    it('should not be able to move left or top when at first cell of row', async () => {
      renderEmojiPickerList({
        emojis: standardEmojis,
        currentUser: { id: 'hulk' },
      });
      const emojisList = await screen.queryAllByRole('button');
      const emojiAtFirstCell = emojisList[0];
      const virtualList = await helperTestingLibrary.getVirtualList()
        .firstChild!;
      emojiAtFirstCell.focus();
      act(() => {
        fireEvent.keyDown(virtualList, {
          key: 'ArrowUp',
        });
        fireEvent.keyDown(virtualList, {
          key: 'ArrowLeft',
        });
        fireEvent.keyDown(virtualList, {
          key: 'PageUp',
        });
        fireEvent.keyDown(virtualList, {
          key: 'Home',
        });
        fireEvent.keyDown(virtualList, {
          key: 'Home',
          ctrlKey: true,
        });
      });
      expect(emojiAtFirstCell).toHaveFocus();
      expect(emojiAtFirstCell.tabIndex).toEqual(0);
    });

    /**
     * x x x x x x x x
     * x x x x x x
     * All uploads
     * x S                <- press arrow right, arrow down, page down, end key or ctrl+end key won't move it
     */
    it('should not be able to move to right or bottom when at last cell of row', async () => {
      renderEmojiPickerList({
        emojis: [...atlassianEmojis, ...customEmojis],
      });
      const emojisList = await screen.queryAllByRole('button');
      const emojiAtLastCell = emojisList[emojisList.length - 1];
      const virtualList = await helperTestingLibrary.getVirtualList()
        .firstChild!;
      emojiAtLastCell.focus();
      act(() => {
        fireEvent.keyDown(virtualList, {
          key: 'ArrowRight',
        });
        fireEvent.keyDown(virtualList, {
          key: 'ArrowDown',
        });
        fireEvent.keyDown(virtualList, {
          key: 'PageDown',
        });
        fireEvent.keyDown(virtualList, {
          key: 'End',
        });
        fireEvent.keyDown(virtualList, {
          key: 'End',
          ctrlKey: true,
        });
      });
      expect(emojiAtLastCell).toHaveFocus();
      expect(emojiAtLastCell.tabIndex).toEqual(0);
    });

    /**
     * x x x x x x x S    <- start from S, press arrow right to go to E
     * E x x x x x        <- press arrow left to go back to E
     */
    it('should be able to move to next availble emoji if at start/end of row', async () => {
      renderEmojiPickerList({
        emojis: atlassianEmojis,
      });
      const emojisList = await screen.queryAllByRole('button');
      const startCell = emojisList[lastColumnIndex];
      // target is next emoji which is shown at first cell of 2nd row
      const targetCell = emojisList[lastColumnIndex + 1];
      const virtualList = await helperTestingLibrary.getVirtualList()
        .firstChild!;
      startCell.focus();
      expect(startCell.tabIndex).toEqual(0);
      act(() => {
        fireEvent.keyDown(virtualList, {
          key: 'ArrowRight',
        });
      });
      expect(targetCell).toHaveFocus();
      expect(targetCell.tabIndex).toEqual(0);
      act(() => {
        fireEvent.keyDown(virtualList, {
          key: 'ArrowLeft',
        });
      });
      expect(startCell).toHaveFocus();
      expect(startCell.tabIndex).toEqual(0);
    });

    /**
     * x x x x x x x x
     * x x x x x S      <- start from S, press arrow right to go to E
     * All uploads
     * E x              <- press arrow left to go back to S
     */
    it('should be able to move to the first cell of next row if having gaps on the right, and be able to move it back', async () => {
      renderEmojiPickerList({
        emojis: [...atlassianEmojis, ...customEmojis],
      });
      const emojisList = await screen.queryAllByRole('button');
      // start is last cell of 2nd row
      const startCell = emojisList[atlassianEmojis.length - 1];
      // target is next emoji which is shown at first cell of 2nd row
      const nextCell = emojisList[atlassianEmojis.length];
      const virtualList = await helperTestingLibrary.getVirtualList()
        .firstChild!;
      startCell.focus();
      expect(startCell.tabIndex).toEqual(0);
      act(() => {
        fireEvent.keyDown(virtualList, {
          key: 'ArrowRight',
        });
      });
      expect(nextCell).toHaveFocus();
      expect(nextCell.tabIndex).toEqual(0);
      act(() => {
        fireEvent.keyDown(virtualList, {
          key: 'ArrowLeft',
        });
      });
      expect(startCell).toHaveFocus();
      expect(startCell.tabIndex).toEqual(0);
    });

    /**
     * x x x x x x x x
     * x S x x x x      <- start from S, press arrow down to go to E
     * All uploads
     * x E              <- press arrow up to go back to S
     */
    it('should be able to move up/down to the correct column of next row if having gaps in between rows', async () => {
      renderEmojiPickerList({
        emojis: [...atlassianEmojis, ...customEmojis],
      });
      const emojisList = await screen.queryAllByRole('button');
      // start is 2nd cell of 2nd row
      const startCell = emojisList[lastColumnIndex + 2];
      // target is 2nd cell of 4th row, 3rd row is category heading "All uploads"
      const nextCell = emojisList[emojisList.length - 1];
      const virtualList = await helperTestingLibrary.getVirtualList()
        .firstChild!;
      startCell.focus();
      expect(startCell.tabIndex).toEqual(0);
      act(() => {
        fireEvent.keyDown(virtualList, {
          key: 'ArrowDown',
        });
      });
      expect(nextCell).toHaveFocus();
      expect(nextCell.tabIndex).toEqual(0);
      act(() => {
        fireEvent.keyDown(virtualList, {
          key: 'ArrowUp',
        });
      });
      expect(startCell).toHaveFocus();
      expect(startCell.tabIndex).toEqual(0);
    });

    /**
     * A B x x x x x x   <- start from A, press arrow right to go to B, press arrow left to go to A
     * x x x x x x
     */
    it('should be able to move to right or left if have a emoji in same row', async () => {
      renderEmojiPickerList({
        emojis: atlassianEmojis,
      });
      const emojisList = await screen.queryAllByRole('button');
      const firstCell = emojisList[0];
      const secondCell = emojisList[1];
      const virtualList = await helperTestingLibrary.getVirtualList()
        .firstChild!;
      firstCell.focus();
      expect(firstCell.tabIndex).toEqual(0);
      act(() => {
        fireEvent.keyDown(virtualList, {
          key: 'ArrowRight',
        });
      });
      expect(secondCell).toHaveFocus();
      expect(secondCell.tabIndex).toEqual(0);
      act(() => {
        fireEvent.keyDown(virtualList, {
          key: 'ArrowLeft',
        });
      });
      expect(firstCell).toHaveFocus();
      expect(firstCell.tabIndex).toEqual(0);
    });

    /**
     * A x x x x x x x   <- start from A, press arrow down to go to B, press arrow down to go to A
     * B x x x x x
     */
    it('should be able to move to up or down if have emojis in same column with no gaps', async () => {
      renderEmojiPickerList({
        emojis: atlassianEmojis,
      });
      const emojisList = await screen.queryAllByRole('button');
      const firstCell = emojisList[0];
      const secondCell = emojisList[lastColumnIndex + 1];
      const virtualList = await helperTestingLibrary.getVirtualList()
        .firstChild!;
      firstCell.focus();
      expect(firstCell.tabIndex).toEqual(0);
      act(() => {
        fireEvent.keyDown(virtualList, {
          key: 'ArrowDown',
        });
      });
      expect(secondCell).toHaveFocus();
      expect(secondCell.tabIndex).toEqual(0);
      act(() => {
        fireEvent.keyDown(virtualList, {
          key: 'ArrowUp',
        });
      });
      expect(firstCell).toHaveFocus();
      expect(firstCell.tabIndex).toEqual(0);
    });

    /**
     * A x x S x x x B   <- start from A, press home key should go to A, press end key should go to B
     * x x x x x x
     */
    it('should be able to move to start or end of row', async () => {
      renderEmojiPickerList({
        emojis: atlassianEmojis,
      });
      const emojisList = await screen.queryAllByRole('button');
      const firstCell = emojisList[0];
      const midCell = emojisList[3];
      const lastCell = emojisList[lastColumnIndex];
      const virtualList = await helperTestingLibrary.getVirtualList()
        .firstChild!;
      midCell.focus();
      expect(midCell.tabIndex).toEqual(0);
      act(() => {
        fireEvent.keyDown(virtualList, {
          key: 'Home',
        });
      });
      expect(firstCell).toHaveFocus();
      expect(firstCell.tabIndex).toEqual(0);
      act(() => {
        fireEvent.keyDown(virtualList, {
          key: 'End',
        });
      });
      expect(lastCell).toHaveFocus();
      expect(lastCell.tabIndex).toEqual(0);
    });

    /**
     * x x x x x x x x   <- start from A, press home key should go to A, press end key should go to B
     * A x S x x B
     * All uploads
     * x x
     */
    it('should be able to move to start or end of row', async () => {
      renderEmojiPickerList({
        emojis: [...atlassianEmojis, ...customEmojis],
      });
      const emojisList = await screen.queryAllByRole('button');
      const startCell = emojisList[lastColumnIndex + 1];
      const midCell = emojisList[lastColumnIndex + 3];
      const endCell = emojisList[atlassianEmojis.length - 1];
      const virtualList = await helperTestingLibrary.getVirtualList()
        .firstChild!;
      midCell.focus();
      expect(midCell.tabIndex).toEqual(0);
      act(() => {
        fireEvent.keyDown(virtualList, {
          key: 'Home',
        });
      });
      expect(startCell).toHaveFocus();
      expect(startCell.tabIndex).toEqual(0);
      act(() => {
        fireEvent.keyDown(virtualList, {
          key: 'End',
        });
      });
      expect(endCell).toHaveFocus();
      expect(endCell.tabIndex).toEqual(0);
    });

    /**
     * A x x x x x x x   <- press ctrl + home key should go to A
     * x S x x x x       <- start
     * All uploads
     * x B               <- press ctrl + end key should go to B
     */
    it('should be able to move to first cell of first row, or the last cell of last row', async () => {
      jest.useFakeTimers();
      renderEmojiPickerList({
        emojis: [...atlassianEmojis, ...customEmojis],
      });
      const emojisList = await screen.queryAllByRole('button');
      // first cell of first row
      const firstCell = emojisList[0];
      // 2nd cell of 2nd row
      const midCell = emojisList[lastColumnIndex + 2];
      // last cell of last row
      const lastCell = emojisList[emojisList.length - 1];
      const virtualList = await helperTestingLibrary.getVirtualList()
        .firstChild!;
      midCell.focus();
      expect(midCell.tabIndex).toEqual(0);
      act(() => {
        fireEvent.keyDown(virtualList, {
          key: 'Home',
          ctrlKey: true,
        });
      });
      jest.runAllTimers();
      expect(firstCell).toHaveFocus();
      expect(firstCell.tabIndex).toEqual(0);

      jest.useFakeTimers();
      act(() => {
        fireEvent.keyDown(virtualList, {
          key: 'End',
          ctrlKey: true,
        });
      });
      jest.runAllTimers();
      expect(lastCell).toHaveFocus();
      expect(lastCell.tabIndex).toEqual(0);
    });

    /**
     * x x x x x x x x
     * S x x x x x     <- start from here, page up 3 rows, or page down 3 rows won't make it move
     * All uploads
     * x x
     */
    it('should not be able to page up/down if target row is out side of grid', async () => {
      Object.defineProperty(constants, 'EMOJI_LIST_PAGE_COUNT', { value: 3 });
      jest.useFakeTimers();
      renderEmojiPickerList({
        emojis: [...atlassianEmojis, ...customEmojis],
      });
      const emojisList = await screen.queryAllByRole('button');
      const firstCell = emojisList[lastColumnIndex + 1];
      const virtualList = await helperTestingLibrary.getVirtualList()
        .firstChild!;
      firstCell.focus();
      expect(firstCell.tabIndex).toEqual(0);
      act(() => {
        fireEvent.keyDown(virtualList, {
          key: 'PageDown',
        });
      });
      jest.runAllTimers();
      expect(firstCell).toHaveFocus();
      expect(firstCell.tabIndex).toEqual(0);
      jest.useFakeTimers();
      act(() => {
        fireEvent.keyDown(virtualList, {
          key: 'PageUp',
        });
      });
      jest.runAllTimers();
      expect(firstCell).toHaveFocus();
      expect(firstCell.tabIndex).toEqual(0);
    });

    /**
     * S x x x x x x x <- start, and page down 2 rows
     * x x x x x x
     * All uploads    <- target, but will skip due to no emoji, and look up to find closest
     * E x             <- expect
     */
    it('should still be able to page down if no emoji in the target row, and move to the next row of the target row', async () => {
      jest.useFakeTimers();
      renderEmojiPickerList({
        emojis: [...atlassianEmojis, ...customEmojis],
      });
      const emojisList = await screen.queryAllByRole('button');
      const firstCell = emojisList[0];
      const nextCell = emojisList[atlassianEmojis.length];
      const virtualList = await helperTestingLibrary.getVirtualList()
        .firstChild!;
      firstCell.focus();
      expect(firstCell.tabIndex).toEqual(0);
      act(() => {
        fireEvent.keyDown(virtualList, {
          key: 'PageDown',
        });
      });
      jest.runAllTimers();
      expect(nextCell).toHaveFocus();
      expect(nextCell.tabIndex).toEqual(0);
    });

    /**
     * x x x x x x x x
     * E x x x x x     <- expect
     * Your uploads    <- target, but will skip due to no emoji, and look down till find available row
     * x
     * All uploads
     * S x             <- start
     */
    it('should still be able to page up if no emoji in the target row, and move to the upper row to the target row', async () => {
      Object.defineProperty(constants, 'EMOJI_LIST_PAGE_COUNT', { value: 3 });
      jest.useFakeTimers();
      renderEmojiPickerList({
        emojis: [...atlassianEmojis, ...customEmojis],
        currentUser: { id: 'hulk' },
      });
      const emojisList = await screen.queryAllByRole('button');
      const firstCell = emojisList[emojisList.length - 2];
      const nextCell = emojisList[lastColumnIndex + 1];
      const virtualList = await helperTestingLibrary.getVirtualList()
        .firstChild!;
      firstCell.focus();
      expect(firstCell.tabIndex).toEqual(0);
      act(() => {
        fireEvent.keyDown(virtualList, {
          key: 'PageUp',
        });
      });
      jest.runAllTimers();
      expect(nextCell).toHaveFocus();
      expect(nextCell.tabIndex).toEqual(0);
    });

    /**
     * S x x x x x x x   <- start
     * x x x x x x
     * All uploads      <- target, but will skip due to no emoji
     * E x               <- expect
     */
    it('should be able to page up/down if there is a emoji in the target row', async () => {
      Object.defineProperty(constants, 'EMOJI_LIST_PAGE_COUNT', { value: 3 });
      jest.useFakeTimers();
      renderEmojiPickerList({
        emojis: [...atlassianEmojis, ...customEmojis],
      });
      const emojisList = await screen.queryAllByRole('button');
      const firstCell = emojisList[0];
      const nextCell = emojisList[atlassianEmojis.length];
      const virtualList = await helperTestingLibrary.getVirtualList()
        .firstChild!;
      firstCell.focus();
      expect(firstCell.tabIndex).toEqual(0);
      act(() => {
        fireEvent.keyDown(virtualList, {
          key: 'PageDown',
        });
      });
      jest.runAllTimers();
      expect(nextCell).toHaveFocus();
      expect(nextCell.tabIndex).toEqual(0);
      /**
       * E x x x x x x x <- expect
       * x x x x x x
       * All uploads
       * S x             <- start
       */
      jest.useFakeTimers();
      act(() => {
        fireEvent.keyDown(virtualList, {
          key: 'PageUp',
        });
      });
      jest.runAllTimers();
      expect(firstCell).toHaveFocus();
      expect(firstCell.tabIndex).toEqual(0);
    });
  });
});
