import {
  layoutSection,
  layoutColumn,
  p,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { PresetLayout } from '../../types';

export const layouts: { name: PresetLayout; widths: number[] }[] = [
  { name: 'two_equal', widths: [50, 50] },
  { name: 'three_equal', widths: [33.33, 33.33, 33.33] },
  { name: 'two_left_sidebar', widths: [33.33, 66.66] },
  { name: 'two_right_sidebar', widths: [66.66, 33.33] },
  { name: 'three_with_sidebars', widths: [25, 50, 25] },
];

export const buildLayoutForWidths = (
  widths: number[],
  setSelection: boolean | string = false,
) => {
  const selection = typeof setSelection === 'string' ? setSelection : '{<>}';
  return layoutSection(
    ...widths.map((w, idx) =>
      layoutColumn({ width: w })(p(setSelection && idx === 0 ? selection : '')),
    ),
  );
};
