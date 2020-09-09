import { Props } from '../group/DropdownItemGroup';
import { WithDropdownItemSelectionManagerProps } from '../hoc/withItemSelectionManager';

interface SelectionProps extends Props, WithDropdownItemSelectionManagerProps {}

export default function (_: SelectionProps) {}
