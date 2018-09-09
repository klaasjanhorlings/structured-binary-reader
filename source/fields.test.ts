import { Fields } from "./fields";
import { Endianess, StructLayout } from "./struct";

describe('Fields', () => {
    let buffer: ArrayBuffer;
    let view: DataView;

    beforeEach(() => {
        buffer = new ArrayBuffer(16);
        view = new DataView(buffer);
        for (let i = 0; i < 16; i++) {
            view.setInt8(i, i);
        }
    });

    describe('Int8Field', () => {
        test('getValue() returns number at given index', () => {
            const field = Fields.Int8();

            expect(field.getValue(view, 3)).toBe(3);
        });

        test('setValue() sets given value at given position', () => {
            const field = Fields.Int8();

            field.setValue(view, 3, -1)
            expect(field.getValue(view, 3)).toBe(-1);
        });
    });

    describe('Int16Field', () => {
        test('getValue() returns number at given index (little endian)', () => {
            const field = Fields.Int16(Endianess.little);

            expect(field.getValue(view, 3)).toBe(3 + (4 << 8));
        });

        test('getValue() returns number at given index (big endian)', () => {
            const field = Fields.Int16(Endianess.big);

            expect(field.getValue(view, 3)).toBe((3 << 8) + 4);
        });

        test('setValue() sets given value at given position', () => {
            const field = Fields.Int16();

            field.setValue(view, 3, -1)
            expect(field.getValue(view, 3)).toBe(-1);
        });
    });

    describe('Int32Field', () => {
        test('getValue() returns number at given index (little endian)', () => {
            const field = Fields.Int32(Endianess.little);

            expect(field.getValue(view, 3)).toBe(3 + (4 << 8) + (5 << 16) + (6 << 24));
        });

        test('getValue() returns number at given index (big endian)', () => {
            const field = Fields.Int32(Endianess.big);

            expect(field.getValue(view, 3)).toBe((3 << 24) + (4 << 16) + (5 << 8) + 6);
        });

        test('setValue() sets given value at given position', () => {
            const field = Fields.Int32();

            field.setValue(view, 3, -1)
            expect(field.getValue(view, 3)).toBe(-1);
        });
    });

    describe('Uint8Field', () => {
        test('getValue() returns number at given index', () => {
            const field = Fields.Uint8();

            expect(field.getValue(view, 3)).toBe(3);
        });

        test('setValue() sets given value at given position', () => {
            const field = Fields.Uint8();

            field.setValue(view, 3, 0xff)
            expect(field.getValue(view, 3)).toBe(0xff);
        });
    });

    describe('Uint16Field', () => {
        test('getValue() returns number at given index (little endian)', () => {
            const field = Fields.Uint16(Endianess.little);

            expect(field.getValue(view, 3)).toBe(3 + (4 << 8));
        });

        test('getValue() returns number at given index (big endian)', () => {
            const field = Fields.Uint16(Endianess.big);

            expect(field.getValue(view, 3)).toBe((3 << 8) + 4);
        });

        test('setValue() sets given value at given position', () => {
            const field = Fields.Uint16();

            field.setValue(view, 3, 0xffff)
            expect(field.getValue(view, 3)).toBe(0xffff);
        });
    });

    describe('Uint32Field', () => {
        test('getValue() returns number at given index (little endian)', () => {
            const field = Fields.Uint32(Endianess.little);

            expect(field.getValue(view, 3)).toBe(3 + (4 << 8) + (5 << 16) + (6 << 24));
        });

        test('getValue() returns number at given index (big endian)', () => {
            const field = Fields.Uint32(Endianess.big);

            expect(field.getValue(view, 3)).toBe((3 << 24) + (4 << 16) + (5 << 8) + 6);
        });

        test('setValue() sets given value at given position', () => {
            const field = Fields.Uint32();

            field.setValue(view, 3, 0xffffffff)
            expect(field.getValue(view, 3)).toBe(0xffffffff);
        });
    });

    describe('StringFields', () => {
        test('getValue() returns expected string at given index', () => {
            const str = "abcd";
            for (var i = 0; i < str.length; i++) {
                view.setInt8(i + 3, str.charCodeAt(i));
            }

            const field = Fields.String(4);

            expect(field.getValue(view, 3)).toBe(str);
        });

        test('setValue() sets given value at given position', () => {
            const str = "abcd";
            const field = Fields.String(4);

            field.setValue(view, 3, str)
            expect(field.getValue(view, 3)).toBe(str);
        });
    });

    describe('StructField', () => {
        interface ObjectDefinition {
            a: number;
            b: number;
            c: number;
        }

        const ObjectLayout: StructLayout<ObjectDefinition> = {
            a: Fields.Uint8(),
            b: Fields.Uint16(),
            c: Fields.Uint16()
		}
		
		test('length is correct', () => {
            const field = Fields.Struct(ObjectLayout);

			expect(field.length).toBe(5);
		})

        test('getValue() returns expected object at given index', () => {
            const expected = {
                a: 1,
                b: 2 + (3 << 8),
                c: 4 + (5 << 8)
            };

            const field = Fields.Struct(ObjectLayout);

            expect(field.getValue(view, 1)).toEqual(expected);
        });

        test('setValue() sets given value at given position', () => {
            const value = {
                a: 0xff,
                b: 0xaaaa,
                c: 0xffff
            };
            
            const field = Fields.Struct(ObjectLayout);            

            field.setValue(view, 3, value);
            expect(field.getValue(view, 3)).toEqual(value);
        });
    });

    describe('ArrayField', () => {
		interface ObjectDefinition {
            a: number;
            b: number;
        }

        const ObjectLayout: StructLayout<ObjectDefinition> = {
            a: Fields.Uint8(),
            b: Fields.Uint8(),
        }

        test('getValue() returns expected object at given index', () => {
			const entryField = Fields.Struct(ObjectLayout);
			const field = Fields.Array(entryField, 8);

			expect(field.getValue(view, 3)).toEqual([
				{ a: 3, b: 4 },
				{ a: 5, b: 6 },
				{ a: 7, b: 8 },
				{ a: 9, b: 10 },
			]);
        });

        test('setValue() sets given value at given position', () => {
			const entryField = Fields.Struct(ObjectLayout);
			const field = Fields.Array(entryField, 4);

			field.setValue(view, 3, [ { a: 5, b: 6 }, { a: 7, b: 8 } ]);

			expect(field.getValue(view, 3)).toEqual([
				{ a: 5, b: 6 },
				{ a: 7, b: 8 },
			]);
		});
		
		test('getValue() on Array of Arrays', () => {
			const entryField = Fields.Struct(ObjectLayout);
			const field = Fields.Array(Fields.Array(entryField, 4), 16);

			expect(field.getValue(view, 0)).toEqual([
				[
					{ a: 0, b: 1 },
					{ a: 2, b: 3 },
				],
				[
					{ a: 4, b: 5 },
					{ a: 6, b: 7 },
				],
				[
					{ a: 8, b: 9 },
					{ a: 10, b: 11 },
				],
				[
					{ a: 12, b: 13 },
					{ a: 14, b: 15 },
				]
			])
		})
    });
});
