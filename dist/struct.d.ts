export interface Struct {
    [name: string]: any;
}
export declare type StructLayout<TStruct extends Struct> = {
    [name in keyof TStruct]: Field<TStruct[name]>;
};
export declare enum Endianess {
    little = 0,
    big = 1
}
export interface Field<TValue> {
    length: number;
    getValue(view: DataView, offset: number): TValue;
    setValue(view: DataView, offset: number, value: TValue): void;
}
