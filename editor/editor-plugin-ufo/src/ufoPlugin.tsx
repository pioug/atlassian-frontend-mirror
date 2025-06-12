// import { abortUFOMeasurementOnFirstUserInteraction } from './pm-plugins/abortUFOMeasurementOnFirstUserInteraction';
import type { UfoPlugin } from './ufoPluginType';

export const ufoPlugin: UfoPlugin = () => ({
	name: 'ufo',

	pmPlugins() {
		return [];

		// This experimental plugin has been abandoned as per ED-27989
		/*
		return [
			{
				name: 'abortUFOMeasurementOnFirstUserInteraction',
				plugin: abortUFOMeasurementOnFirstUserInteraction,
			},
		];
		*/
	},
});
