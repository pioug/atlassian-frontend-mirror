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
const DropdownItemCheckboxGroup = (props: DropdownItemCheckboxGroupProps) => {
  const { children, id } = props;

  return (
    <CheckboxGroupContext.Provider value={id}>
      {/* eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props */}
      <Section {...props}>{children}</Section>
    </CheckboxGroupContext.Provider>
  );
};

export default DropdownItemCheckboxGroup;
