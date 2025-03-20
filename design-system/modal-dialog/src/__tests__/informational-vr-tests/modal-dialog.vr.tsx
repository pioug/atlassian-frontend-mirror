import { snapshotInformational } from '@af/visual-regression';

import DefaultModal from '../../../examples/00-default-modal';
import ExplicitFontStyles from '../../../examples/02-explicit-font-styles';
import Appearance from '../../../examples/10-appearance';
import Autofocus from '../../../examples/20-autofocus';
import Form from '../../../examples/45-form';
import FormAsContainer from '../../../examples/46-form-as-container';
import Scroll from '../../../examples/55-scroll';
import MultiLineTitles from '../../../examples/65-multi-line-titles';
import WithHiddenBlanket from '../../../examples/92-with-hidden-blanket';
import WithCurrentSurface from '../../../examples/96-with-current-surface';

snapshotInformational(DefaultModal, {
	drawsOutsideBounds: true,
	prepare: async (page) => {
		await page.getByRole('button').click();
	},
});

snapshotInformational(Scroll, {
	drawsOutsideBounds: true,
	prepare: async (page) => {
		await page.getByRole('button').click();
	},
});

snapshotInformational(Form, {
	drawsOutsideBounds: true,
	prepare: async (page) => {
		await page.getByRole('button').click();
	},
});

snapshotInformational(FormAsContainer, {
	drawsOutsideBounds: true,
	prepare: async (page) => {
		await page.getByRole('button').click();
	},
});

snapshotInformational(Autofocus, {
	drawsOutsideBounds: true,
	prepare: async (page) => {
		await page.getByRole('button', { name: 'using autoFocus prop' }).click();
	},
});

snapshotInformational(Appearance, {
	description: 'Appearance - warning',
	drawsOutsideBounds: true,
	prepare: async (page) => {
		await page.getByRole('button', { name: 'Open: warning' }).click();
	},
});

snapshotInformational(Appearance, {
	description: 'Appearance - danger',
	drawsOutsideBounds: true,
	prepare: async (page) => {
		await page.getByRole('button', { name: 'Open: danger' }).click();
	},
});

snapshotInformational(MultiLineTitles, {
	drawsOutsideBounds: true,
	prepare: async (page) => {
		await page.getByRole('button').click();
	},
});

snapshotInformational(WithCurrentSurface, {
	drawsOutsideBounds: true,
	prepare: async (page) => {
		await page.getByRole('button').click();
	},
});

snapshotInformational(WithHiddenBlanket, {
	drawsOutsideBounds: true,
	prepare: async (page) => {
		await page.getByRole('button').click();
	},
});

snapshotInformational(ExplicitFontStyles, {
	drawsOutsideBounds: true,
	prepare: async (page) => {
		await page.getByRole('button').click();
	},
	featureFlags: {
		platform_ads_explicit_font_styles: [true, false],
	},
});
