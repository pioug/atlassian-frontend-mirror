// eslint-disable-next-line import/no-extraneous-dependencies
import { snapshot } from '@af/visual-regression';
import ThemeIcons from '../../../../examples/12-theme-icons';
import SsrIcons from '../../../../examples/13-ssr-icons';
import {
  IconSizeSmall,
  IconSizeMedium,
  IconSizeLarge,
  IconSizeXLarge,
} from '../../../../examples/02-size-example';
import UsingCustomGlyph from '../../../../examples/08-using-custom-glyph';

snapshot(ThemeIcons);
snapshot(SsrIcons);
snapshot(IconSizeSmall);
snapshot(IconSizeMedium);
snapshot(IconSizeLarge);
snapshot(IconSizeXLarge);
snapshot(UsingCustomGlyph);
