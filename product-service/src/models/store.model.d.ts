import { FromSchema } from 'json-schema-to-ts';
declare const StoreModelSchema: {
    readonly name: "Store";
    readonly description: "Store of the books";
    readonly contentType: "application/json";
    readonly schema: {
        readonly type: "object";
        readonly properties: {
            readonly id: {
                readonly type: "string";
            };
            readonly count: {
                readonly type: "number";
            };
            readonly price: {
                readonly type: "number";
            };
        };
        readonly required: readonly ["id"];
    };
};
declare type StoreModel = FromSchema<typeof StoreModelSchema.schema>;
export { StoreModelSchema };
export type { StoreModel };
