import { Device, snapshotInformational } from '@af/visual-regression';

import DefaultModal from '../../../examples/00-default-modal';
import ExplicitFontStyles from '../../../examples/02-explicit-font-styles';
import Appearance from '../../../examples/10-appearance';
import Height from '../../../examples/30-height';
import PlaygroundExample from '../../../examples/40-multiple';
import Form from '../../../examples/45-form';
import FormAsContainer from '../../../examples/46-form-as-container';
import Width from '../../../examples/50-width';
import FullScreenModalExample from '../../../examples/51-full-screen';
import ModalBodyWithoutInlinePaddingExample from '../../../examples/53-modal-body-without-inline-padding';
import Scroll from '../../../examples/55-scroll';
import { ScrollHorizontalExample } from '../../../examples/56-scroll-horizontal';
import MultiLineTitles from '../../../examples/65-multi-line-titles';
import { WithFooterAndSelectOptionExample } from '../../../examples/80-with-footer-and-select-option';
import { WithLayeredComponentsExample } from '../../../examples/90-with-layered-components';
import WithHiddenBlanket from '../../../examples/92-with-hidden-blanket';
import { MultiColumnExample } from '../../../examples/93-multi-column';
import { ModalWithCustomChildExample } from '../../../examples/95-custom-child';
import WithCurrentSurface from '../../../examples/96-with-current-surface';

const topLayerFlag = {
	'platform-dst-top-layer': [true, false],
} as const;

snapshotInformational(DefaultModal, {
	description: 'default modal desktop',
	variants: [
		{
			name: 'desktop',
			device: Device.DESKTOP_CHROME,
		},
	],
	drawsOutsideBounds: true,
	featureFlags: topLayerFlag,
	prepare: async (page) => {
		await page.getByRole('button').click();
	},
});

snapshotInformational(DefaultModal, {
	description: 'default modal mobile',
	variants: [
		{
			name: 'mobile',
			device: Device.MOBILE_CHROME,
		},
	],
	drawsOutsideBounds: true,
	featureFlags: topLayerFlag,
	prepare: async (page) => {
		await page.getByRole('button').click();
	},
});

snapshotInformational(Width, {
	description: 'width small',
	drawsOutsideBounds: true,
	featureFlags: topLayerFlag,
	prepare: async (page) => {
		await page.getByRole('button', { name: 'small' }).click();
	},
});

snapshotInformational(Width, {
	description: 'width x-large',
	drawsOutsideBounds: true,
	featureFlags: topLayerFlag,
	prepare: async (page) => {
		await page.getByRole('button', { name: 'x-large' }).click();
	},
});

snapshotInformational(Width, {
	description: 'width custom 420px',
	drawsOutsideBounds: true,
	featureFlags: topLayerFlag,
	prepare: async (page) => {
		await page.getByRole('button', { name: '420' }).click();
	},
});

snapshotInformational(Scroll, {
	description: 'body scroll top',
	drawsOutsideBounds: true,
	featureFlags: topLayerFlag,
	prepare: async (page) => {
		await page.getByRole('button').click();
	},
});

snapshotInformational(Scroll, {
	description: 'body scroll middle',
	drawsOutsideBounds: true,
	featureFlags: topLayerFlag,
	prepare: async (page) => {
		await page.getByRole('button').click();
		await page
			.locator('[data-testid="modal--scrollable"]')
			.evaluate((element) => (element.scrollTop = 200));
	},
});

snapshotInformational(Scroll, {
	description: 'viewport scrolling',
	variants: [
		{
			name: 'desktop',
			device: Device.DESKTOP_CHROME,
		},
	],
	drawsOutsideBounds: true,
	featureFlags: topLayerFlag,
	prepare: async (page) => {
		await page.getByRole('checkbox', { name: 'Should scroll within the viewport' }).check();
		await page.getByRole('button').click();
	},
});

snapshotInformational(FullScreenModalExample, {
	description: 'full screen',
	variants: [
		{
			name: 'desktop',
			device: Device.DESKTOP_CHROME,
		},
		{
			name: 'mobile',
			device: Device.MOBILE_CHROME,
		},
	],
	drawsOutsideBounds: true,
	featureFlags: topLayerFlag,
	prepare: async (page) => {
		await page.getByRole('button').click();
	},
});

snapshotInformational(PlaygroundExample, {
	description: 'nested modals body scroll',
	drawsOutsideBounds: true,
	featureFlags: topLayerFlag,
	prepare: async (page) => {
		await page.getByRole('checkbox', { name: 'Should scroll within the viewport' }).uncheck();

		await page.getByRole('button', { name: 'Open' }).click();
		await page.getByText('Modal: large').waitFor({ state: 'visible' });

		await page.getByRole('button', { name: 'Open: medium' }).click();
		await page.getByText('Modal: medium').waitFor({ state: 'visible' });

		await page.getByRole('button', { name: 'Open: small' }).click();
		await page.getByText('Modal: small').waitFor({ state: 'visible' });
	},
});

snapshotInformational(PlaygroundExample, {
	description: 'nested modals viewport scroll',
	drawsOutsideBounds: true,
	featureFlags: topLayerFlag,
	prepare: async (page) => {
		await page.getByRole('checkbox', { name: 'Should scroll within the viewport' }).check();

		await page.getByRole('button', { name: 'Open' }).click();
		await page.getByText('Modal: large').waitFor({ state: 'visible' });

		await page.getByRole('button', { name: 'Open: medium' }).click();
		await page.getByText('Modal: medium').waitFor({ state: 'visible' });

		await page.getByRole('button', { name: 'Open: small' }).click();
		await page.getByText('Modal: small').waitFor({ state: 'visible' });
	},
});

snapshotInformational(Appearance, {
	description: 'appearance warning',
	drawsOutsideBounds: true,
	featureFlags: topLayerFlag,
	prepare: async (page) => {
		await page.getByRole('button', { name: 'Open: warning' }).click();
	},
});

snapshotInformational(Appearance, {
	description: 'appearance danger',
	drawsOutsideBounds: true,
	featureFlags: topLayerFlag,
	prepare: async (page) => {
		await page.getByRole('button', { name: 'Open: danger' }).click();
	},
});

snapshotInformational(WithHiddenBlanket, {
	description: 'hidden blanket',
	drawsOutsideBounds: true,
	featureFlags: topLayerFlag,
	prepare: async (page) => {
		await page.getByRole('button').click();
	},
});

snapshotInformational(Form, {
	description: 'form content',
	drawsOutsideBounds: true,
	featureFlags: topLayerFlag,
	prepare: async (page) => {
		await page.getByRole('button').click();
	},
});

snapshotInformational(FormAsContainer, {
	description: 'form as container',
	drawsOutsideBounds: true,
	featureFlags: topLayerFlag,
	prepare: async (page) => {
		await page.getByRole('button').click();
	},
});

snapshotInformational(MultiLineTitles, {
	description: 'multi-line titles',
	drawsOutsideBounds: true,
	featureFlags: topLayerFlag,
	prepare: async (page) => {
		await page.getByRole('button').click();
	},
});

// ── Width variants (missing from original top-layer coverage) ──

snapshotInformational(Width, {
	description: 'width medium',
	drawsOutsideBounds: true,
	featureFlags: topLayerFlag,
	prepare: async (page) => {
		await page.getByRole('button', { name: 'medium' }).click();
	},
});

snapshotInformational(Width, {
	description: 'width large',
	drawsOutsideBounds: true,
	featureFlags: topLayerFlag,
	prepare: async (page) => {
		await page.getByRole('button', { name: 'large', exact: true }).click();
	},
});

snapshotInformational(Width, {
	description: 'width 42%',
	drawsOutsideBounds: true,
	featureFlags: topLayerFlag,
	prepare: async (page) => {
		await page.getByRole('button', { name: '42%' }).click();
	},
});

snapshotInformational(Width, {
	description: 'width 42em',
	drawsOutsideBounds: true,
	featureFlags: topLayerFlag,
	prepare: async (page) => {
		await page.getByRole('button', { name: '42em' }).click();
	},
});

snapshotInformational(Width, {
	description: 'width 100%',
	drawsOutsideBounds: true,
	featureFlags: topLayerFlag,
	prepare: async (page) => {
		await page.getByRole('button', { name: '100%' }).click();
	},
});

// ── Height variants ──

snapshotInformational(Height, {
	description: 'height 420',
	drawsOutsideBounds: true,
	featureFlags: topLayerFlag,
	prepare: async (page) => {
		await page.getByRole('button', { name: '420' }).click();
	},
});

snapshotInformational(Height, {
	description: 'height 42em',
	drawsOutsideBounds: true,
	featureFlags: topLayerFlag,
	prepare: async (page) => {
		await page.getByRole('button', { name: '42em' }).click();
	},
});

snapshotInformational(Height, {
	description: 'height 100%',
	drawsOutsideBounds: true,
	featureFlags: topLayerFlag,
	prepare: async (page) => {
		await page.getByRole('button', { name: '100%' }).click();
	},
});

// ── Scroll variants ──

snapshotInformational(Scroll, {
	description: 'body scroll bottom',
	drawsOutsideBounds: true,
	featureFlags: topLayerFlag,
	prepare: async (page) => {
		await page.getByRole('button').click();
		await page
			.locator('[data-testid="modal--scrollable"]')
			.evaluate((element) => (element.scrollTop = element.scrollHeight));
	},
});

snapshotInformational(Scroll, {
	description: 'scrollable modal without header and footer',
	drawsOutsideBounds: true,
	featureFlags: topLayerFlag,
	prepare: async (page) => {
		await page.getByRole('checkbox', { name: 'Header/footer shown' }).uncheck();
		await page.getByRole('button').click();
	},
});

snapshotInformational(Scroll, {
	description: 'viewport scrolling mobile',
	variants: [
		{
			name: 'mobile',
			device: Device.MOBILE_CHROME,
		},
	],
	drawsOutsideBounds: true,
	featureFlags: topLayerFlag,
	prepare: async (page) => {
		await page.getByRole('checkbox', { name: 'Should scroll within the viewport' }).check();
		await page.getByRole('button').click();
	},
});

snapshotInformational(ScrollHorizontalExample, {
	description: 'modal body scroll after horizontal scroll',
	drawsOutsideBounds: true,
	featureFlags: topLayerFlag,
	prepare: async (page) => {
		await page.getByRole('button', { name: 'Scroll trigger into view' }).click();
		await page.getByRole('button', { name: 'Open modal' }).click();
	},
});

snapshotInformational(ScrollHorizontalExample, {
	description: 'viewport scroll after horizontal scroll',
	drawsOutsideBounds: true,
	featureFlags: topLayerFlag,
	prepare: async (page) => {
		await page.getByRole('button', { name: 'Scroll trigger into view' }).click();
		await page.getByRole('checkbox', { name: 'Should scroll within the viewport' }).check();
		await page.getByRole('button', { name: 'Open modal' }).click();
	},
});

snapshotInformational(MultiColumnExample, {
	description: 'multi-column scroll',
	drawsOutsideBounds: true,
	featureFlags: topLayerFlag,
	prepare: async (page) => {
		await page.getByRole('button', { name: 'Open modal' }).click();
		await page.getByRole('button', { name: 'Scroll to bottom' }).click();
	},
});

// ── Full screen variants ──

snapshotInformational(PlaygroundExample, {
	description: 'full screen with shouldScrollInViewport={false}',
	drawsOutsideBounds: true,
	featureFlags: topLayerFlag,
	prepare: async (page) => {
		await page.getByRole('checkbox', { name: 'Should scroll within the viewport' }).uncheck();
		await page.getByRole('checkbox', { name: 'Long content' }).check();
		await page.getByRole('checkbox', { name: 'Full screen' }).check();
		await page.getByRole('button', { name: 'Open' }).click();
	},
});

snapshotInformational(PlaygroundExample, {
	description: 'full screen with shouldScrollInViewport={true}',
	drawsOutsideBounds: true,
	featureFlags: topLayerFlag,
	prepare: async (page) => {
		await page.getByRole('checkbox', { name: 'Should scroll within the viewport' }).check();
		await page.getByRole('checkbox', { name: 'Long content' }).check();
		await page.getByRole('checkbox', { name: 'Full screen' }).check();
		await page.getByRole('button', { name: 'Open' }).click();
	},
});

snapshotInformational(PlaygroundExample, {
	description: 'full screen with nesting',
	drawsOutsideBounds: true,
	featureFlags: topLayerFlag,
	prepare: async (page) => {
		await page.getByRole('checkbox', { name: 'Full screen' }).check();
		await page.getByRole('checkbox', { name: 'Long content' }).check();
		await page.getByRole('button', { name: 'Open' }).click();
		await page.getByText('Modal: large').waitFor({ state: 'visible' });
		await page.getByRole('button', { name: 'Open: medium' }).click();
		await page.getByText('Modal: medium').waitFor({ state: 'visible' });
	},
});

// ── Content and styling variants ──

snapshotInformational(WithFooterAndSelectOptionExample, {
	description: 'footer should not overlay above select dropdown',
	drawsOutsideBounds: true,
	featureFlags: topLayerFlag,
	prepare: async (page) => {
		await page.getByRole('button', { name: 'Open Modal' }).click();
		await page.getByRole('combobox').click();
	},
});

snapshotInformational(ModalWithCustomChildExample, {
	description: 'modal with a custom child',
	drawsOutsideBounds: true,
	featureFlags: topLayerFlag,
	prepare: async (page) => {
		await page.getByRole('button', { name: 'Open Modal' }).click();
	},
});

snapshotInformational(WithCurrentSurface, {
	description: 'current surface',
	drawsOutsideBounds: true,
	featureFlags: topLayerFlag,
	prepare: async (page) => {
		await page.getByRole('button').click();
	},
});

snapshotInformational(ExplicitFontStyles, {
	description: 'explicit font styles',
	drawsOutsideBounds: true,
	featureFlags: topLayerFlag,
	prepare: async (page) => {
		await page.getByRole('button').click();
	},
});

snapshotInformational(ModalBodyWithoutInlinePaddingExample, {
	description: 'modal body without inline padding',
	drawsOutsideBounds: true,
	featureFlags: topLayerFlag,
	prepare: async (page) => {
		await page.getByRole('button').click();
	},
});

// ── Layered components ──

snapshotInformational(WithLayeredComponentsExample, {
	description: 'modal with open popup',
	drawsOutsideBounds: true,
	featureFlags: topLayerFlag,
	prepare: async (page) => {
		await page.getByRole('button', { name: 'Open modal' }).click();
		await page.getByRole('button', { name: 'Scroll to middle' }).click();
		await page.getByTestId('popup-trigger').click();
	},
});

snapshotInformational(WithLayeredComponentsExample, {
	description: 'modal with open popup select',
	drawsOutsideBounds: true,
	featureFlags: topLayerFlag,
	prepare: async (page) => {
		await page.getByRole('button', { name: 'Open modal' }).click();
		await page.getByRole('button', { name: 'Scroll to middle' }).click();
		await page.getByRole('button', { name: "I'm a pop up select, click me!" }).click();
	},
});

snapshotInformational(WithLayeredComponentsExample, {
	description: 'modal with open tooltip',
	drawsOutsideBounds: true,
	featureFlags: topLayerFlag,
	prepare: async (page) => {
		await page.getByRole('button', { name: 'Open modal' }).click();
		await page.getByRole('button', { name: 'Scroll to middle' }).click();
		await page.getByRole('button', { name: 'Hover on me to view tooltip!' }).hover();
		await page.getByRole('tooltip').waitFor();
	},
});

snapshotInformational(WithLayeredComponentsExample, {
	description:
		'modal with select (z-index: 9999, menuPortalTarget: document.body, menuPosition: fixed)',
	drawsOutsideBounds: true,
	featureFlags: topLayerFlag,
	prepare: async (page) => {
		await page.getByRole('button', { name: 'Open modal' }).click();
		await page.getByRole('button', { name: 'Scroll to middle' }).click();
		await page.getByTestId('select-zindex-fixed-select--container').click();
	},
});

snapshotInformational(WithLayeredComponentsExample, {
	description: 'modal with select (menuPosition: fixed)',
	drawsOutsideBounds: true,
	featureFlags: topLayerFlag,
	prepare: async (page) => {
		await page.getByRole('button', { name: 'Open modal' }).click();
		await page.getByRole('button', { name: 'Scroll to middle' }).click();
		await page.getByTestId('select-fixed-select--container').click();
	},
});

snapshotInformational(WithLayeredComponentsExample, {
	description: 'modal with select (menuPosition: absolute)',
	drawsOutsideBounds: true,
	featureFlags: topLayerFlag,
	prepare: async (page) => {
		await page.getByRole('button', { name: 'Open modal' }).click();
		await page.getByRole('button', { name: 'Scroll to middle' }).click();
		await page.getByTestId('select-absolute-select--container').click();
	},
});

snapshotInformational(WithLayeredComponentsExample, {
	description: 'modal with flag',
	drawsOutsideBounds: true,
	featureFlags: topLayerFlag,
	prepare: async (page) => {
		await page.getByRole('button', { name: 'Open modal' }).click();
		await page.getByRole('button', { name: 'Scroll to middle' }).click();
		await page.getByRole('button', { name: 'Add flag' }).click();
		await page.getByRole('alert').waitFor();
	},
});

snapshotInformational(WithLayeredComponentsExample, {
	description: 'modal with dropdown menu',
	drawsOutsideBounds: true,
	featureFlags: topLayerFlag,
	prepare: async (page) => {
		await page.getByRole('button', { name: 'Open modal' }).click();
		await page.getByRole('button', { name: 'Scroll to bottom' }).click();

		const scrollContainer = await page.getByTestId('modal--scrollable').elementHandle();
		await scrollContainer?.waitForElementState('stable');

		await page.getByRole('button', { name: "I'm a dropdown menu, click me!" }).click();
	},
});
