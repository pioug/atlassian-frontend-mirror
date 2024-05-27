import React from 'react';

import { render } from '@testing-library/react';

import { type TagType } from '@atlaskit/linking-types';
import { ffTest } from '@atlassian/feature-flags-test-utils';

import Tag, { TAG_TYPE_TEST_ID } from './index';

describe('Tag Type', () => {
  const setup = (tag: TagType['value']) => {
    return render(<Tag tag={tag} />);
  };

  describe('renders when all fields are given', () => {
    const TEST_TEXT = 'SIMPLE TAG';
    const TEST_COLOR_OPTION = 'teal';
    const TEST_URL = 'www.test123.com.au';

    ffTest.on(
      'platform.editor-update-tag-link-and-color_x6hcf',
      'Flag is on to add url and color property to tags',
      () => {
        it('The tag should render correctly as colored label with link if color and url are supplied', () => {
          const { queryByTestId } = setup({
            text: TEST_TEXT,
            color: TEST_COLOR_OPTION,
            url: TEST_URL,
          });
          const tag = queryByTestId(TAG_TYPE_TEST_ID);

          expect(tag).toBeInTheDocument();
          expect(tag).toHaveTextContent(TEST_TEXT);
          expect(tag).toHaveStyle(
            '--ds-cb: var(--ds-background-accent-teal-subtle, #00C7E6)',
          );

          const linkElement = tag?.firstChild as HTMLElement;
          expect(linkElement.nodeName).toEqual('A');
          expect(linkElement).toHaveAttribute('href', TEST_URL);
        });

        it('The tag should be standard color and no link property if color and url are not supplied', () => {
          const { queryByTestId } = setup({
            text: TEST_TEXT,
          });

          const tag = queryByTestId(TAG_TYPE_TEST_ID);

          expect(tag).toBeInTheDocument();
          expect(tag).toHaveTextContent(TEST_TEXT);
          expect(tag).toHaveStyle(
            '--ds-cb: var(--ds-background-neutral, #F4F5F7)',
          );

          const linkElement = tag?.firstChild as HTMLElement;
          expect(linkElement.nodeName).toEqual('SPAN');
          expect(linkElement.getAttribute('href')).toEqual(null);
        });
      },
    );

    ffTest.off(
      'platform.editor-update-tag-link-and-color_x6hcf',
      'Flag is off there should be no url and color property allowed',
      () => {
        it('Even if url and color are supplied, tag is standard color with no link properties', () => {
          const { queryByTestId } = setup({
            text: TEST_TEXT,
            color: TEST_COLOR_OPTION,
            url: TEST_URL,
          });

          const tag = queryByTestId(TAG_TYPE_TEST_ID);

          expect(tag).toBeInTheDocument();
          expect(tag).toHaveTextContent(TEST_TEXT);
          expect(tag).toHaveStyle(
            '--ds-cb: var(--ds-background-neutral, #F4F5F7)',
          );

          const linkElement = tag?.firstChild as HTMLElement;
          expect(linkElement.nodeName).toEqual('SPAN');
          expect(linkElement.getAttribute('href')).toEqual(null);
        });
      },
    );
  });

  describe('does not render when no fields are given', () => {
    async () => {
      const { queryByTestId } = setup({
        text: '',
      });
      expect(queryByTestId(TAG_TYPE_TEST_ID)).not.toBeInTheDocument();
    };
  });
});
