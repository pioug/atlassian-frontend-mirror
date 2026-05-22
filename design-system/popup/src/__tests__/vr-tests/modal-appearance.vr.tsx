import { Device, snapshot } from '@af/visual-regression';

import {
	default as ModalPopupClassicAPI,
	ModalPopupClassicAPILong,
} from '../../../examples/22-modal-popup';
import {
	default as ModalPopupCompositionalAPI,
	ModalPopupCompositionalAPILong,
} from '../../../examples/22-modal-popup-composition';

snapshot(ModalPopupClassicAPI, {
	drawsOutsideBounds: true,
	description: 'modal below small with legacy api',
	variants: [
		{
			device: Device.MOBILE_CHROME,
			name: 'mobile',
		},
		{
			device: Device.DESKTOP_CHROME,
			name: 'desktop',
		},
	],
});

snapshot(ModalPopupClassicAPILong, {
	drawsOutsideBounds: true,
	description: 'modal below small with legacy api and long content',
	variants: [
		{
			device: Device.MOBILE_CHROME,
			name: 'mobile',
		},
		{
			device: Device.DESKTOP_CHROME,
			name: 'desktop',
		},
	],
});

snapshot(ModalPopupCompositionalAPI, {
	drawsOutsideBounds: true,
	description: 'modal below small with compositional api',
	variants: [
		{
			device: Device.MOBILE_CHROME,
			name: 'mobile',
		},
		{
			device: Device.DESKTOP_CHROME,
			name: 'desktop',
		},
	],
});

snapshot(ModalPopupCompositionalAPILong, {
	drawsOutsideBounds: true,
	description: 'modal below small with compositional api and long content',
	variants: [
		{
			device: Device.MOBILE_CHROME,
			name: 'mobile',
		},
		{
			device: Device.DESKTOP_CHROME,
			name: 'desktop',
		},
	],
});
