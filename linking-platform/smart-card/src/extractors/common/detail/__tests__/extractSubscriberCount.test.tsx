import React from 'react';
import { render, screen } from '@testing-library/react';

import {
  extractSubscriberCount,
  type LinkSubscriberType,
} from '../extractSubscriberCount';
import { TEST_BASE_DATA } from '../../__mocks__/jsonld';

const BASE_DATA = TEST_BASE_DATA as LinkSubscriberType;

describe('extractors.detail.SubscriberCount', () => {
  it('returns undefined when no subscriber count present', () => {
    expect(extractSubscriberCount(BASE_DATA)).toBe(undefined);
  });

  it('returns number and icon when subscriber count present', async () => {
    const detail = extractSubscriberCount({
      ...BASE_DATA,
      'atlassian:subscriberCount': 40,
    });
    expect(detail).toBeDefined();
    expect(detail!.text).toBe('40');
    render(<>{detail!.icon}</>);
    const icon = await screen.findByRole('img');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute('aria-label', 'subscribers');
  });
});
