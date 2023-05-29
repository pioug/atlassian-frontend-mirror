import React from 'react';

import { render } from '@testing-library/react';
import { axe, JestAxeConfigureOptions, toHaveNoViolations } from 'jest-axe';

import Avatar from '@atlaskit/avatar';

import RemovableTag from '../../removable-tag';
import Tag from '../../simple-tag';

expect.extend(toHaveNoViolations);

const axeRules: JestAxeConfigureOptions = {
  rules: {
    // As we're testing on the JSDOM, color-contrast testing can't run.
    'color-contrast': { enabled: false },
  },
  // The types of results fetched are limited for performance reasons
  resultTypes: ['violations', 'incomplete', 'inapplicable'],
};

describe('Tag component accessibility', () => {
  describe('Simple Tag', () => {
    it('should not fail an aXe audit', async () => {
      const { container } = render(<Tag text="Testing" />);
      const results = await axe(container, axeRules);

      expect(results).toHaveNoViolations();
    });

    it('should not fail an aXe audit when rounded', async () => {
      const { container } = render(<Tag text="Testing" appearance="rounded" />);
      const results = await axe(container, axeRules);

      expect(results).toHaveNoViolations();
    });

    it('should not fail an aXe audit when containing an href', async () => {
      const { container } = render(<Tag text="Testing" href="/test" />);
      const results = await axe(container, axeRules);

      expect(results).toHaveNoViolations();
    });

    it('should not fail an aXe audit when containing an elemBefore', async () => {
      const { container } = render(
        <Tag
          text="Testing"
          elemBefore={<Avatar borderColor="transparent" size="xsmall" />}
        />,
      );

      const results = await axe(container, axeRules);

      expect(results).toHaveNoViolations();
    });
  });

  describe('Removable Tag', () => {
    it('should not fail an aXe audit', async () => {
      const { container } = render(
        <RemovableTag text="Testing" removeButtonLabel="Remove" />,
      );
      const results = await axe(container, axeRules);

      expect(results).toHaveNoViolations();
    });

    it('should not fail an aXe audit when rounded', async () => {
      const { container } = render(
        <RemovableTag
          text="Testing"
          removeButtonLabel="Remove"
          appearance="rounded"
        />,
      );
      const results = await axe(container, axeRules);

      expect(results).toHaveNoViolations();
    });

    it('should not fail an aXe audit when containing an href', async () => {
      const { container } = render(
        <RemovableTag text="Testing" removeButtonLabel="Remove" href="/test" />,
      );
      const results = await axe(container, axeRules);

      expect(results).toHaveNoViolations();
    });

    it('should not fail an aXe audit when containing an elemBefore', async () => {
      const { container } = render(
        <RemovableTag
          text="Testing"
          removeButtonLabel="Remove"
          elemBefore={<Avatar borderColor="transparent" size="xsmall" />}
        />,
      );

      const results = await axe(container, axeRules);

      expect(results).toHaveNoViolations();
    });

    it('should not fail an aXe audit when containing removal event handlers', async () => {
      const { container } = render(
        <RemovableTag
          text="Testing"
          removeButtonLabel="Remove"
          onBeforeRemoveAction={() => true}
          onAfterRemoveAction={() => true}
        />,
      );

      const results = await axe(container, axeRules);

      expect(results).toHaveNoViolations();
    });
  });
});
