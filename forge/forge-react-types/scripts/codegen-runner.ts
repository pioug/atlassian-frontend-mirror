import { generateComponentPropTypes } from './codegen';

if (process.argv.length < 3) {
	generateComponentPropTypes();
} else {
	// e.g yarn workspace @atlaskit/forge-react-types codegen Button
	const componentPropTypeFilter = process.argv[2];
	generateComponentPropTypes(componentPropTypeFilter);
}
