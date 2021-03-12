import type { CustomItemProps } from '../src/types';

/**
 * The props definition in custom-item.tsx breaks ERT unfortunately,
 * because we had to typecast the component to make forwardRef work with generics
 * (for the custom component props).
 */
export default function (_: CustomItemProps) {}
