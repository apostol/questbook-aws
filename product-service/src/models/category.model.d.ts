import { FromSchema } from 'json-schema-to-ts';
declare const CategoryModelSchema: {
    readonly name: "Category";
    readonly description: "Category of the product";
    readonly contentType: "application/json";
    readonly schema: {
        readonly type: "object";
        readonly properties: {
            readonly id: {
                readonly type: "string";
            };
            readonly name: {
                readonly type: "string";
            };
            readonly description: {
                readonly type: "string";
            };
        };
        readonly required: readonly ["id"];
    };
};
export declare type CategoryModel = FromSchema<typeof CategoryModelSchema.schema>;
export { CategoryModelSchema };
