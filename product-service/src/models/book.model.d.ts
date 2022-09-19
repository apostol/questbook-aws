import { FromSchema } from 'json-schema-to-ts';
declare const BookModelSchema: {
    readonly name: "Book";
    readonly description: "External file merge example";
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
            readonly description: {
                readonly type: "string";
            };
            readonly price: {
                readonly type: "number";
            };
            readonly title: {
                readonly type: "string";
            };
            readonly category_id: {
                readonly type: "number";
            };
        };
        readonly required: readonly ["id"];
    };
};
declare type BookModel = FromSchema<typeof BookModelSchema.schema>;
export { BookModelSchema as BookModelSchema };
export type { BookModel };
