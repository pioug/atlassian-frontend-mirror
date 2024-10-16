/**
 * @jsxRuntime classic
 * @jsx jsx
 */

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

import Button, { Theme as ButtonTheme } from '@atlaskit/button';

import { modalButtonTheme, spotlightButtonTheme } from '../src';

export default () => {
	return (
		<div>
			<ButtonTheme.Provider value={modalButtonTheme}>
				<h3>Default modal</h3>
				<Button>default</Button>
				<Button isSelected>isSelected</Button>
				<Button isDisabled>isDisabled</Button>
				<h3>Primary modal</h3>
				<Button appearance="primary">primary</Button>
				<Button appearance="primary" isSelected>
					isSelected
				</Button>
				<Button appearance="primary" isDisabled>
					isDisabled
				</Button>
				<h3>Subtle modal</h3>
				<Button appearance="subtle">subtle</Button>
				<Button appearance="subtle" isSelected>
					isSelected
				</Button>
				<Button appearance="subtle" isDisabled>
					isDisabled
				</Button>
				<h3>Subtle-link modal</h3>
				<Button appearance="subtle-link">subtle-link</Button>
				<Button appearance="subtle-link" isSelected>
					isSelected
				</Button>
				<Button appearance="subtle-link" isDisabled>
					isDisabled
				</Button>
			</ButtonTheme.Provider>
			<ButtonTheme.Provider value={spotlightButtonTheme}>
				<h3>Default modal</h3>
				<Button>default</Button>
				<Button isSelected>isSelected</Button>
				<Button isDisabled>isDisabled</Button>
				<h3>Primary spotlight</h3>
				<Button appearance="primary">primary</Button>
				<Button appearance="primary" isSelected>
					isSelected
				</Button>
				<Button appearance="primary" isDisabled>
					isDisabled
				</Button>
				<h3>Subtle spotlight</h3>
				<Button appearance="subtle" isSelected>
					isSelected
				</Button>
				<Button appearance="subtle" isDisabled>
					isDisabled
				</Button>
				<h3>Subtle-link spotlight</h3>
				<Button appearance="subtle-link">subtle-link</Button>
				<Button appearance="subtle-link" isSelected>
					isSelected
				</Button>
				<Button appearance="subtle-link" isDisabled>
					isDisabled
				</Button>
			</ButtonTheme.Provider>
		</div>
	);
};
