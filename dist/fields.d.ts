import { Endianess, Field, StructLayout } from "./struct";
export declare const Fields: {
    Int8: (options?: Partial<{
        offset: number;
    }> | undefined) => Field<number>;
    Int16: (options?: Partial<{
        offset: number;
    } & {
        endianess: Endianess;
    }> | undefined) => Field<number>;
    Int32: (options?: Partial<{
        offset: number;
    } & {
        endianess: Endianess;
    }> | undefined) => Field<number>;
    Uint8: (options?: Partial<{
        offset: number;
    }> | undefined) => Field<number>;
    Uint16: (options?: Partial<{
        offset: number;
    } & {
        endianess: Endianess;
    }> | undefined) => Field<number>;
    Uint32: (options?: Partial<{
        offset: number;
    } & {
        endianess: Endianess;
    }> | undefined) => Field<number>;
    String: (options: Partial<{
        offset: number;
    }> & {
        length: number;
    }) => Field<string>;
    Struct: <TStruct>(layout: StructLayout<TStruct>) => Field<TStruct>;
    Array: <TStruct>(field: Field<TStruct>, bufferLength: number) => Field<TStruct[]>;
};
