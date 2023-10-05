import React from 'react';

import type { SectionProps } from '@atlaskit/menu';
import Section from '@atlaskit/menu/section';

import { CheckboxGroupContext } from '../internal/context/checkbox-group-context';

interface DropdownItemCheckboxGroupProps extends SectionProps {
  /**
   * Unique identifier for the checkbox group.
   */
  id: string;
}

/**
 * __Dropdown item checkbox group__
 *
 * A wrapping element for dropdown menu checkbox items.
 *
 */
const DropdownItemCheckboxGroup = ({
  children,
  hasSeparator,
  id,
  isList,
  isScrollable,
  overrides,
  testId,
  title,
}: DropdownItemCheckboxGroupProps) => {
  return (
    <CheckboxGroupContext.Provider value={id}>
      <Section
        hasSeparator={hasSeparator}
        id={id}
        isList={isList}
        isScrollable={isScrollable}
        // eslint-disable-next-line @repo/internal/react/no-unsafe-overrides
        overrides={overrides}
        testId={testId}
        title={title}
      >
        {children}
      </Section>
    </CheckboxGroupContext.Provider>
  );
};

export default DropdownItemCheckboxGroup;
