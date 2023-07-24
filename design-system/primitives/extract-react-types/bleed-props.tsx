import { ReactNode } from 'react';

import { BasePrimitiveProps } from '../src/components/types';

type Space =
  | 'space.025'
  | 'space.050'
  | 'space.100'
  | 'space.150'
  | 'space.200';

type BleedProps = {
  /**
   * Elements to be rendered inside the Flex.
   */
  children: ReactNode;

  /**
   * Bleed along both axes.
   */
  all?: Space;

  /**
   * Bleed along the inline axis.
   */
  inline?: Space;

  /**
   * Bleed along the block axis.
   */
  block?: Space;
} & BasePrimitiveProps;

export default function Bleed(_: BleedProps) {}
