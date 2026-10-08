import type { ShadowTokenSchema, ValueSchema } from '../../../../src/types';
import type { BaseToken } from '../../../palettes/palette';
import { dynamicColor } from '../_formulas';

const shadow: ValueSchema<ShadowTokenSchema<BaseToken>> = {
	elevation: {
		shadow: {
			raised: {
				value: [
					{
						radius: 1,
						offset: { x: 0, y: 1 },
						color: dynamicColor.foreground,
						opacity: 0.25,
					},
					{
						radius: 1,
						offset: { x: 0, y: 0 },
						color: dynamicColor.foreground,
						opacity: 0.31,
					},
				],
			},
			overflow: {
				'[default]': {
					value: [
						{
							radius: 8,
							offset: { x: 0, y: 0 },
							color: dynamicColor.foreground,
							opacity: 0.16,
						},
						{
							radius: 1,
							offset: { x: 0, y: 0 },
							color: dynamicColor.foreground,
							opacity: 0.12,
						},
					],
				},
				spread: { value: dynamicColor.foregroundHovered },
				perimeter: { value: dynamicColor.foregroundPressed },
			},
			overlay: {
				value: [
					{
						radius: 12,
						offset: { x: 0, y: 8 },
						color: dynamicColor.foreground,
						opacity: 0.15,
					},
					{
						radius: 1,
						offset: { x: 0, y: 0 },
						color: dynamicColor.foreground,
						opacity: 0.31,
					},
				],
			},
		},
	},
};

export default shadow;
