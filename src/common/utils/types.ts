export type IPatchRequestBody<T> = Readonly<Partial<Omit<T, "id">>>;
