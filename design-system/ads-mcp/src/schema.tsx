import { z } from 'zod';
import zodToJsonSchema from 'zod-to-json-schema';

export const releasePhase = z
	.enum(['early_access', 'beta', 'general_availability', 'intent_to_deprecate', 'deprecated'])
	.default('general_availability').describe(`
The release phase or status of the offering, providing guidance on what you can expect at each phase and who can use them.
You should typically only use \`general_availability\` or \`beta\` components. If a release phase or status is not defined, you should assume it is \`general_availability\`.

- \`early_access\`: New experimental feature. There may be breaking changes in minor releases at versions \`0.x\`. We don't recommend using this unless you are part of an early access pilot group, as support is otherwise not available.
- \`beta\`: New and ready to use. The feature is supported and stable at versions \`1.0\`+. We are working on improvements based on customer feedback. This may include expanding feature sets, and evolving tooling, guidance, and self-service. Breaking changes will only be made in major releases, and should be infrequent.
- \`general_availability\`: Fully stable and ready to use.
- \`intent_to_deprecate\` aka Caution: This feature is being considered for deprecation. There may be some issues with this feature that need to be resolved. If you are not already using the feature, use the recommended alternative instead.
- \`deprecated\`: This feature is no longer supported and will be removed after the deprecation period ends. We have provided a recommended solution to replace it and communicated how to move to it.
`);

export type ReleasePhase = z.infer<typeof releasePhase>;

export const emptyInputSchema = zodToJsonSchema(z.object({}));
