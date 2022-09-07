import React from 'react';

import { waitFor } from '@testing-library/dom';
import { act, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import TokenExplorer from '../../index';

const TEST_ID = 'token-explorer';
const TEST_ID_GROUP = `${TEST_ID}-token-group`;
const TEST_ID_LIST = `${TEST_ID}-token-list`;
const TEST_ID_ITEM = `${TEST_ID}-token-item`;
const TEST_ID_ITEM_NAME_PREFIX = `${TEST_ID}-token-item-name-`;
const TEST_ID_ITEM_VALUE_PREFIX = `${TEST_ID}-token-item-value-`;
const TEST_ID_SEARCH = `${TEST_ID}-search`;
const TEST_ID_EXACT_CHECKBOX = `${TEST_ID}-exact-search--checkbox-label`;
const TEST_ID_FILTERS_DROPDOWN = `${TEST_ID}-filters--trigger`;
const TEST_ID_FILTERS_ACTIVE = `${TEST_ID}-filters-active`;
const TEST_ID_FILTERS_DELETED = `${TEST_ID}-filters-deleted`;

const FUSE_JS_WAIT_TIME = 5000;

const TokenExplorerTest = <TokenExplorer testId={TEST_ID} />;

describe('Token explorer', () => {
  it('should render', () => {
    const { getByTestId } = render(TokenExplorerTest);
    const tokenExplorer = getByTestId(TEST_ID);

    expect(tokenExplorer).toBeInTheDocument();
  });

  it('should render tokens in groups', () => {
    const { getAllByTestId } = render(TokenExplorerTest);

    const tokenGroup = getAllByTestId(TEST_ID_GROUP);
    expect(tokenGroup[0]).toBeInTheDocument();

    const tokenList = getAllByTestId(TEST_ID_LIST);
    expect(tokenList[0]).toBeInTheDocument();

    const tokenItem = getAllByTestId(TEST_ID_ITEM);
    expect(tokenItem[0]).toBeInTheDocument();
  });

  describe('search', () => {
    it('should render tokens in a single list', async () => {
      const { getByTestId, getAllByTestId } = render(TokenExplorerTest);

      const search = getByTestId(TEST_ID_SEARCH);
      await userEvent.type(search, 'color.text', { delay: 100 });

      // Should only be 1 token list
      const tokenList = getByTestId(TEST_ID_LIST);
      expect(tokenList).toBeInTheDocument();

      const tokenItem = getAllByTestId(TEST_ID_ITEM);
      expect(tokenItem[0]).toBeInTheDocument();
    });

    xit('should filter tokens by matching name', async () => {
      const { getByTestId } = render(TokenExplorerTest);

      const search = getByTestId(TEST_ID_SEARCH);

      act(() => {
        userEvent.type(search, 'color.text', { delay: 100 });
      });

      const matchingTokenItem = await waitFor(
        () => getByTestId(`${TEST_ID_ITEM_NAME_PREFIX}color.text.[default]`),
        { timeout: FUSE_JS_WAIT_TIME },
      );

      expect(matchingTokenItem).toBeInTheDocument();
    });

    xit('should filter tokens by matching exact name', async () => {
      const { getByTestId } = render(TokenExplorerTest);

      const search = getByTestId(TEST_ID_SEARCH);
      const exactCheckbox = getByTestId(TEST_ID_EXACT_CHECKBOX);

      act(async () => {
        await userEvent.type(search, 'color.text.brand', { delay: 100 });
        userEvent.click(exactCheckbox);
      });

      const matchingTokenItem = await waitFor(
        () => getByTestId(`${TEST_ID_ITEM_NAME_PREFIX}color.text.brand`),
        { timeout: FUSE_JS_WAIT_TIME },
      );

      expect(matchingTokenItem).toBeInTheDocument();
    });

    xit('should filter tokens by matching value', async () => {
      const { getAllByText, getByTestId } = render(TokenExplorerTest);

      const search = getByTestId(TEST_ID_SEARCH);

      act(() => {
        userEvent.type(search, 'N0');
      });

      const matchingTokenItem = await waitFor(() => getAllByText('N0'), {
        timeout: FUSE_JS_WAIT_TIME,
      });

      expect(matchingTokenItem[0]).toBeInTheDocument();
    });

    xit('should filter tokens by matching exact value', async () => {
      const { getByTestId, getAllByTestId } = render(TokenExplorerTest);

      const search = getByTestId(TEST_ID_SEARCH);
      const exactCheckbox = getByTestId(TEST_ID_EXACT_CHECKBOX);

      act(async () => {
        await userEvent.type(search, 'N0', { delay: 100 });
        userEvent.click(exactCheckbox);
      });

      const matchingTokenItem = await waitFor(
        () => getAllByTestId(`${TEST_ID_ITEM_VALUE_PREFIX}N0`),
        {
          timeout: FUSE_JS_WAIT_TIME,
        },
      );

      expect(matchingTokenItem[0]).toBeInTheDocument();
    });
  });

  describe('filters', () => {
    it('should filter tokens by state', async () => {
      const { getByTestId, getAllByTestId } = render(TokenExplorerTest, {
        container: document.body,
      });

      // Token items should be present before filtering
      const tokenItem = getAllByTestId(TEST_ID_ITEM);
      expect(tokenItem[0]).toBeInTheDocument();

      const filters = getByTestId(TEST_ID_FILTERS_DROPDOWN);
      expect(filters).toBeInTheDocument();

      // Open filter dropdown
      act(() => {
        userEvent.click(filters);
      });

      // Remove 'active' state from filter
      const filtersActive = getByTestId(TEST_ID_FILTERS_ACTIVE);
      act(() => {
        userEvent.click(filtersActive);
      });

      // Token item should be filtered out of results
      expect(tokenItem[0]).not.toBeInTheDocument();

      // Select 'deleted' state from filter
      const filtersDeleted = getByTestId(TEST_ID_FILTERS_DELETED);
      act(() => {
        userEvent.click(filtersDeleted);
      });

      // Token item should remain filtered out of results
      expect(tokenItem[0]).not.toBeInTheDocument();
    });
  });
});
