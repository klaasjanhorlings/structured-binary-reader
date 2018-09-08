export interface Struct {
    [name: string]: any;
}

export type StructLayout<TStruct extends Struct> = {
    [name in keyof TStruct]: Field<TStruct[name]>
};

export enum Endianess {
    little,
    big,
}

export interface Field<TValue> {
    length: number;
    getValue(view: DataView, offset: number): TValue;
    setValue(view: DataView, offset: number, value: TValue): void;
}
