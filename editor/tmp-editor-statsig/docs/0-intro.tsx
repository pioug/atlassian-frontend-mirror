import { code, md } from '@atlaskit/docs';

export default md`

Temp plugin to ease use of statsig experiment until a platform solution is available.

**Warning:** This is a temporary solution and will be removed once there is a platform solution for statsig experiments.

**Warning:** This requires per product setup via the \`setupEditorExperiments\` api (products without this setup will receive the
default value setup for experiments).

## Usage

### Experiments

All experiments must be registered in the \`editorExperimentsConfig\` object in the experiments.ts file.

Once they are registered, they can be accessed using the \`editorExperiment\` function from \`@atlaskit/tmp-editor-statsig/experiments\`.

#### Boolean experiments

${code`
import { editorExperiment } from '@atlaskit/editor-statsig-tmp/experiments';

if (editorExperiment('editor_inline_comments_on_inline_nodes', true)) {
	// do something
} else {
 	// do something else
}
`}

#### Multivariate experiments

${code`
import { editorExperiment } from '@atlaskit/editor-statsig-tmp/experiments';

switch (true) {
	case editorExperiment('editor_new_control_variants', 'variant-one'): {
		// do something for variant one
		return
	}
	case editorExperiment('editor_new_control_variants', 'variant-two'): {
		// do something for variant two
		return
	}
	case editorExperiment('editor_new_control_variants', 'variant-three'): {
		// do something for variant three
		return
	}
}
`}


### Testing experiments

#### Atlaskit examples

Not yet supported.

#### Jest tests
##### Boolean experiments

${code`
import { eeTest } from '@atlaskit/tmp-editor-statsig/test-runner';

eeTest('example-boolean', {
	true: () => {
		expect(editorExperiment('example-boolean', true)).toBe(true);
	},
	false: () => {
		expect(editorExperiment('example-boolean', false)).toBe(false);
	},
});
`}

##### Multivariate experiments

${code`
import { eeTest } from '@atlaskit/tmp-editor-statsig/test-runner';

eeTest('example-multivariate', {
	one: () => {
		expect(editorExperiment('example-boolean')).toBe('variant-one');
	},
	two: () => {
		expect(editorExperiment('example-boolean')).toBe('variant-two');
	},
	three: () => {
		expect(editorExperiment('example-boolean')).toBe('variant-three');
	},
});
`}

#### Playwright tests

Editor Experiments are setup similar to platformFeatureFlags.

${code`
test.use({
	adf: exampleAdf,
	platformFeatureFlags: {
		// ...
	},
	editorExperiments: {
		'example-boolean': true,
		'example-multivariate': 'variant',
	},
});
`}

## Configuration

${code`
import { setupEditorExperiments } from '@atlaskit/tmp-editor-statsig/experiments';

// Example confluence setup
setupEditorExperiments('confluence');

// Example dev util setup -- takes overrides as a second param (and otherwise defaults all experiments to their default values)
setupEditorExperiments('test', { 'example-boolean': true });
`}

`;
