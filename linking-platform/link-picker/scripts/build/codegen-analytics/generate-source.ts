import * as ts from 'typescript';

type EventType = 'ui' | 'screen' | 'operational' | 'track';

type AttributeSpec = {
  type: 'string' | 'number';
};

type EventSpec = {
  action: string;
  actionSubject: string;
  actionSubjectId?: string;
  type: EventType;
  description: string;
  attributes: Record<string, AttributeSpec>;
};

const getEventKey = ({ action, actionSubject, actionSubjectId }: EventSpec) => {
  return ([actionSubject, action, actionSubjectId].filter(
    Boolean,
  ) as string[]).join('.');
};

const getEventPayloadTypeName = ({
  action,
  actionSubject,
  actionSubjectId,
}: EventSpec) => {
  return (
    ([actionSubject, action, actionSubjectId].filter(Boolean) as string[])
      .map(x => {
        return x.slice(0, 1).toUpperCase() + x.slice(1);
      })
      .join('') + 'AttributesType'
  );
};

const getEventAttributeType = (type: AttributeSpec['type']) => {
  switch (type) {
    case 'string':
      return ts.factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword);
    case 'number':
      return ts.factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword);
    default:
      throw new Error(`Unsupported attribute type: ${type}`);
  }
};

const getEventAttributePropertySignature = (
  name: string,
  attr: AttributeSpec,
) => {
  return ts.factory.createPropertySignature(
    undefined,
    name,
    undefined,
    getEventAttributeType(attr.type),
  );
};

export const generateSource = (spec: { events: EventSpec[] }): string => {
  const file = ts.createSourceFile(
    'source.ts',
    '',
    ts.ScriptTarget.ESNext,
    false,
    ts.ScriptKind.TS,
  );

  const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });

  const events = spec.events.map(event => {
    const typeAliasDeclaration = ts.factory.createTypeAliasDeclaration(
      undefined,
      undefined,
      getEventPayloadTypeName(event),
      undefined,
      event.attributes
        ? ts.factory.createTypeLiteralNode(
            Object.entries(event.attributes).map(([attr, spec]) => {
              return getEventAttributePropertySignature(attr, spec);
            }),
          )
        : ts.factory.createTypeLiteralNode([]),
    );

    return {
      eventKey: getEventKey(event),
      typeAliasDeclaration,
    };
  });

  const identifier = ts.factory.createIdentifier('AnalyticsEventAttributes');

  const analyticsEventAttributes = ts.factory.createTypeAliasDeclaration(
    undefined,
    undefined,
    identifier,
    undefined,
    ts.factory.createTypeLiteralNode(
      events.map(({ eventKey, typeAliasDeclaration }) => {
        return ts.factory.createPropertySignature(
          undefined,
          ts.factory.createIdentifier(`'${eventKey}'`),
          undefined,
          ts.factory.createTypeReferenceNode(typeAliasDeclaration.name),
        );
      }),
    ),
  );

  const createEventPayloadIdentifier = ts.factory.createIdentifier(
    'createEventPayload',
  );

  const eventKeyIdentifier = ts.factory.createIdentifier('eventKey');
  const attributesIdentifier = ts.factory.createIdentifier('attributes');

  const createEventPayloadDeclaration = ts.factory.createFunctionDeclaration(
    undefined,
    undefined,
    undefined,
    createEventPayloadIdentifier,
    [
      ts.factory.createTypeParameterDeclaration(
        'K',
        ts.factory.createTypeOperatorNode(
          ts.SyntaxKind.KeyOfKeyword,
          ts.factory.createTypeReferenceNode(identifier),
        ),
      ),
    ],
    [
      ts.factory.createParameterDeclaration(
        undefined,
        undefined,
        undefined,
        eventKeyIdentifier,
        undefined,
        ts.factory.createTypeReferenceNode('K'),
      ),
      ts.factory.createParameterDeclaration(
        undefined,
        undefined,
        undefined,
        attributesIdentifier,
        undefined,
        ts.factory.createIndexedAccessTypeNode(
          ts.factory.createTypeReferenceNode(identifier),
          ts.factory.createTypeReferenceNode('K'),
        ),
      ),
    ],
    undefined,
    ts.factory.createBlock([
      ts.factory.createVariableStatement(
        [],
        ts.factory.createVariableDeclarationList(
          [
            ts.factory.createVariableDeclaration(
              'event',
              undefined,
              undefined,
              ts.factory.createCallExpression(
                ts.factory.createPropertyAccessExpression(
                  eventKeyIdentifier,
                  'split',
                ),
                undefined,
                [ts.factory.createStringLiteral('.')],
              ),
            ),
          ],
          ts.NodeFlags.Const,
        ),
      ),
      ts.factory.createReturnStatement(
        ts.factory.createObjectLiteralExpression([
          ts.factory.createPropertyAssignment(
            'eventType',
            ts.factory.createStringLiteral('ui'),
          ),
          ts.factory.createPropertyAssignment(
            'actionSubject',
            ts.factory.createElementAccessExpression(
              ts.factory.createIdentifier('event'),
              0,
            ),
          ),
          ts.factory.createPropertyAssignment(
            'action',
            ts.factory.createElementAccessExpression(
              ts.factory.createIdentifier('event'),
              1,
            ),
          ),
          ts.factory.createPropertyAssignment(
            'actionSubjectId',
            ts.factory.createElementAccessExpression(
              ts.factory.createIdentifier('event'),
              2,
            ),
          ),
          ts.factory.createPropertyAssignment(
            attributesIdentifier,
            attributesIdentifier,
          ),
        ]),
      ),
    ]),
  );

  return [
    ...events.map(({ typeAliasDeclaration }) => typeAliasDeclaration),
    analyticsEventAttributes,
    createEventPayloadDeclaration,
    ts.factory.createExportDefault(createEventPayloadIdentifier),
  ]
    .map(node => printer.printNode(ts.EmitHint.Unspecified, node, file))
    .join('\n');
};
