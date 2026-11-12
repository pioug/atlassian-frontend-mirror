import { snapshot } from '@af/visual-regression';

import RadioExample from '../../../examples/02-form-example.vr.ap';

snapshot(RadioExample, {
	description: 'Base',
});

snapshot(RadioExample, {
	description: 'Unchecked - hover',
	states: [
		{
			state: 'hovered',
			selector: {
				byTestId: 'color-red--radio-input',
			},
		},
	],
});

snapshot(RadioExample, {
	description: 'Unchecked - focused',
	states: [
		{
			state: 'focused',
			selector: {
				byTestId: 'color-red--radio-input',
			},
		},
	],
});

snapshot(RadioExample, {
	description: 'Unchecked - hovered and focused',
	states: [
		{
			state: 'hovered',
			selector: {
				byTestId: 'color-red--radio-input',
			},
		},
		{
			state: 'focused',
			selector: {
				byTestId: 'color-red--radio-input',
			},
		},
	],
});

snapshot(RadioExample, {
	description: 'Checked - hover',
	states: [
		{
			state: 'hovered',
			selector: {
				byTestId: 'color-blue--radio-input',
			},
		},
	],
});

snapshot(RadioExample, {
	description: 'Checked - focused',
	states: [
		{
			state: 'focused',
			selector: {
				byTestId: 'color-blue--radio-input',
			},
		},
	],
});

snapshot(RadioExample, {
	description: 'Checked - hovered and focused',
	states: [
		{
			state: 'hovered',
			selector: {
				byTestId: 'color-blue--radio-input',
			},
		},
		{
			state: 'focused',
			selector: {
				byTestId: 'color-blue--radio-input',
			},
		},
	],
});

snapshot(RadioExample, {
	description: 'Unchecked - disabled',
	states: [
		{
			state: 'focused',
			selector: {
				byTestId: 'weather-cloudy--radio-input',
			},
		},
	],
});

snapshot(RadioExample, {
	description: 'Checked - disabled',
	states: [
		{
			state: 'focused',
			selector: {
				byTestId: 'weather-sunny--radio-input',
			},
		},
	],
});

snapshot(RadioExample, {
	description: 'Checked - disabled - hovered',
	states: [
		{
			state: 'hovered',
			selector: {
				byTestId: 'weather-sunny--radio-input',
			},
		},
	],
});

snapshot(RadioExample, {
	description: 'Checked - disabled - hovered and focused',
	states: [
		{
			state: 'hovered',
			selector: {
				byTestId: 'weather-sunny--radio-input',
			},
		},
		{
			state: 'focused',
			selector: {
				byTestId: 'weather-sunny--radio-input',
			},
		},
	],
});
