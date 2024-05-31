import transformer from '../17.0.0-update-imports-to-new-entry-points';

const defineInlineTest = require('jscodeshift/dist/testUtils').defineInlineTest;

describe('updates adf-util imports to new child entry points', () => {
	defineInlineTest(
		{ default: transformer, parser: 'tsx' },
		{},
		`
    import { traverse } from "@atlaskit/adf-utils";
    import { ADFEntity, ADFEntityMark } from "@atlaskit/adf-utils";
    import { validateAttrs, validator, ValidationErrorMap } from '@atlaskit/adf-utils';
    import type { NodeValidationResult } from '@atlaskit/adf-utils';
    import { type ValidationMode } from '@atlaskit/adf-utils';

    export default () => (
      <div>
        hello
      </div>
    );
    `,
		`
    import type { ValidationErrorMap, ValidationMode, NodeValidationResult } from "@atlaskit/adf-utils/validatorTypes";
    import type { ADFEntity, ADFEntityMark } from "@atlaskit/adf-utils/types";
    import { traverse } from "@atlaskit/adf-utils/traverse";
    import { validator, validateAttrs } from "@atlaskit/adf-utils/validator";

    export default () => (
      <div>
        hello
      </div>
    );
    `,
		'should handle migrating any combination of old entry points (including type imports and imports with type modifiers) to new child entry points',
	);

	defineInlineTest(
		{ default: transformer, parser: 'tsx' },
		{},
		`
    import { traverse, teamRocketAndMeowth, scrubAdf } from "@atlaskit/adf-utils";
    import { Pokemon, ADFEntityMark, AshKetchum } from "@atlaskit/adf-utils";
    import type { PsyDuck } from "@atlaskit/adf-utils/pokemon-types";
    import Boogeyman from "@deep/the-mariana-trench";

    export default () => (
      <div>
        hello
      </div>
    );
    `,
		`
    import type { ADFEntityMark } from "@atlaskit/adf-utils/types";
    import { traverse } from "@atlaskit/adf-utils/traverse";
    import { scrubAdf } from "@atlaskit/adf-utils/scrub";
    import { teamRocketAndMeowth } from "@atlaskit/adf-utils";
    import { Pokemon, AshKetchum } from "@atlaskit/adf-utils";
    import type { PsyDuck } from "@atlaskit/adf-utils/pokemon-types";
    import Boogeyman from "@deep/the-mariana-trench";

    export default () => (
      <div>
        hello
      </div>
    );
    `,
		'should leave unknown entry points or import specifiers untouched (and unmerged if initially unmerged)',
	);

	defineInlineTest(
		{ default: transformer, parser: 'tsx' },
		{},
		`
    import { VisitorCollection } from "@atlaskit/adf-utils/types";
    import type { Visitor } from "@atlaskit/adf-utils";

    export default () => (
      <div>
        hello
      </div>
    );
    `,
		`
    import type { VisitorCollection, Visitor } from "@atlaskit/adf-utils/types";

    export default () => (
      <div>
        hello
      </div>
    );
    `,
		'should handle migrating new child entry points with mismatched importKinds (e.g. non-type when should be type import)',
	);

	defineInlineTest(
		{ default: transformer, parser: 'tsx' },
		{},
		`
      import { scrubAdf, doc, p, link } from "@atlaskit/adf-utils";
      import { blockCard, paragraph } from "@atlaskit/adf-utils/builders";
      import { placeholder, transformDedupeMarks } from "@atlaskit/adf-utils";
      import { VisitorCollection } from "@atlaskit/adf-utils/types";
      import type { Visitor } from "@atlaskit/adf-utils";
      import { getEmptyADF } from "@atlaskit/adf-utils";

      export default () => (
        <div>
          hello
        </div>
      );
      `,
		`
      import { transformDedupeMarks } from "@atlaskit/adf-utils/transforms";
      import { getEmptyADF } from "@atlaskit/adf-utils/empty-adf";
      import { scrubAdf } from "@atlaskit/adf-utils/scrub";
      import { blockCard, paragraph, doc, link, p, placeholder } from "@atlaskit/adf-utils/builders";
      import type { VisitorCollection, Visitor } from "@atlaskit/adf-utils/types";

      export default () => (
        <div>
          hello
        </div>
      );
      `,
		'should handle migrating any combination of old and new entry points to new child entry points',
	);

	defineInlineTest(
		{ default: transformer, parser: 'tsx' },
		{},
		`
    const { scrubAdf } = require("@atlaskit/adf-utils");
    import * as adfUtils from "@atlaskit/adf-utils";

    export default () => {
        if (shouldFetchModule) {
            import("@atlaskit/adf-utils").then(module => ({
                something: "else"
            }));
            import("@atlaskit/adf-utils/traverse").then(module => {
                const traverse = module.traverse;
                traverse();
            });
        }
        return (
            <div>
                hello
            </div>
        )
      }
    `,
		`
    const { scrubAdf } = require("@atlaskit/adf-utils");
    import * as adfUtils from "@atlaskit/adf-utils";

    export default () => {
        if (shouldFetchModule) {
            import("@atlaskit/adf-utils").then(module => ({
                something: "else"
            }));
            import("@atlaskit/adf-utils/traverse").then(module => {
                const traverse = module.traverse;
                traverse();
            });
        }
        return (
            <div>
                hello
            </div>
        )
      }
    `,
		'should skip migrating other import syntaxes (namespace imports, CJS, dyamic imports)',
	);
});
