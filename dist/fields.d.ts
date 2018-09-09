import { Endianess, Field, StructLayout } from "./struct";
export declare const Fields: {
    Int8: () => Field<number>;
    Int16: (endianness?: Endianess) => Field<number>;
    Int32: (endianness?: Endianess) => Field<number>;
    Uint8: () => Field<number>;
    Uint16: (endianness?: Endianess) => Field<number>;
    Uint32: (endianness?: Endianess) => Field<number>;
    String: (length: number) => Field<string>;
    Struct: <TStruct>(layout: StructLayout<TStruct>) => Field<TStruct>;
    Array: <TStruct>(field: Field<TStruct>, bufferLength: number) => Field<TStruct[]>;
};
