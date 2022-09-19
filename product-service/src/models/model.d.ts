import { FromSchema } from 'json-schema-to-ts';
declare const ModelSchema: {
    readonly name: "Model";
    readonly description: "External file merge example";
    readonly contentType: "application/json";
    readonly schema: {
        readonly type: "object";
        readonly properties: {
            readonly id: {
                readonly type: "string";
            };
        };
        readonly required: readonly ["id"];
    };
};
declare type Model = FromSchema<typeof ModelSchema.schema>;
export { ModelSchema };
export type { Model };
