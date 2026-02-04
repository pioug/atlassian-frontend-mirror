import { expect, test } from './fixtures';

const fg_combinations = [
    [],
    ['platform_ufo_enable_otel_context_manager']
]

test.describe('ReactUFO: Tracing instrumentation', () => {
    test.use({
        examplePage: 'basic',
    });

    for (const fg_set of fg_combinations) {
        test.describe(`UFO Tracing with Feature gates: ${fg_set}`, () => {
            test.use({
                featureFlags: fg_set,
            });

            test(`UFO Payload contains trace context for root experience`, async ({
                waitForReactUFOPayload,
            }) => {
                const reactUFOPayload = await waitForReactUFOPayload();
                expect(reactUFOPayload).toBeDefined();

                expect(typeof reactUFOPayload!.attributes.properties).toBe('object');
                const ufoProperties = reactUFOPayload!.attributes.properties;


                expect(typeof ufoProperties['ufo:tracingContext']).toBe('object');
                const { 'ufo:tracingContext': tracingContext } = ufoProperties;

                expect(tracingContext?.['X-B3-TraceId']).toEqual('test-traceid');
                expect(tracingContext?.['X-B3-SpanId']).toEqual('test-spandid');
                expect(tracingContext?.['browserTimeOrigin']).toBeGreaterThan(1)
            })
        })
    };
});