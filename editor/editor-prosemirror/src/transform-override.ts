import { Step } from 'prosemirror-transform';

export type MetadataStep = Step & {
	metadata: Metadata;
};

export type Metadata = {
	prevStepId?: string;
	rebased?: boolean;
	reqId?: string;
	schemaVersion?: string;
	source?: string;
	stepId?: string;
	traceId?: string;
	unconfirmedStepAfterRecovery?: boolean;
};

// Using this avoids infinite recursion, as referencing Step.fromJSON inside Step.fromJSON
// will refer to the reassigned version, not the original version
const originalFromJSON = Step.fromJSON;

Step.fromJSON = (schema, jsonStep): MetadataStep | Step => {
	const stepImplementation = originalFromJSON(schema, jsonStep);

	return new Proxy(stepImplementation, {
		get(target, prop, receiver) {
			if (prop === 'toJSON') {
				const toJSONfunc = Reflect.get(target, prop, receiver);
				// @ts-expect-error Metadata may or may not exist at this stage, depending on step type,
				// but also additions outside of the type system that others may have done.
				const classMetadata = target.metadata;

				return new Proxy(toJSONfunc, {
					apply(target, thisArg, argArray) {
						const originalResult = Reflect.apply(target, thisArg, argArray);

						const metadata = {
							...jsonStep.metadata,
							...classMetadata,
							...originalResult.metadata,
						};

						return {
							...originalResult,
							...(Object.keys(metadata).length === 0 ? {} : { metadata }),
						};
					},
				});
			}
			return Reflect.get(target, prop, receiver);
		},
	});
};

export { Step };
