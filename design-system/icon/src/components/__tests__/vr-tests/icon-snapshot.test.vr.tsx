import { snapshot } from '@af/visual-regression';
import SsrIcons from '../../../../examples/13-ssr-icons';
import {
	IconSizeSmall,
	IconSizeMedium,
	IconSizeLarge,
	IconSizeXLarge,
} from '../../../../examples/02-size-example';
import UsingCustomGlyph from '../../../../examples/08-using-custom-glyph';

// Flaky Test https://bitbucket.org/atlassian/atlassian-frontend/pipelines/results/2942609/steps/%7Bac78f1de-835e-489a-b103-ecfa94d2d44e%7D
snapshot.skip(SsrIcons);

snapshot(IconSizeSmall);
snapshot(IconSizeMedium);
snapshot(IconSizeLarge);
snapshot(IconSizeXLarge);
snapshot(UsingCustomGlyph);
