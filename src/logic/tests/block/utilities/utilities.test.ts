import { generateCode } from "../../../codeGenerator.ts";
import {beforeAll, expect, test} from 'vitest';
import {readFileSync} from "fs";
import AjvManager from "../../../AjvManager.js";
import {Compiler} from "../../../Compiler.js";


//Initial setup
let pathToTests : string = "src/logic/tests/block/utilities/";
const compiler : Compiler = new Compiler()
let importString : string = compiler.getHeadString() + compiler.getHeadClosingString();


beforeAll(async () => {
    // This code runs once before all tests
    await AjvManager.getInstance().manageReferences()
});


test("union (concat)", () => {
    expect(generateCode( JSON.parse(readFileSync(pathToTests + "concat.test.json", "utf-8"))))
        .toBe( importString +
`source_0 = string_test_source(iterable = ['A', 'B', 'C'])
pipe_0 = source_0.pipe()

source_1 = string_test_source(iterable = ['x', 'y', 'z'])
pipe_1 = source_1.pipe()

union_0 = concat(pipe_0, pipe_1)

union_0.pipe(
).subscribe(on_next = lambda x : print(str(x)))

`
)})



test("union (merge)", () => {
    expect(generateCode( JSON.parse(readFileSync(pathToTests + "merge.test.json", "utf-8"))))
        .toBe(importString +
            `source_0 = string_test_source(iterable = ['A', 'B', 'C'])
pipe_0 = source_0.pipe()

source_1 = string_test_source(iterable = ['x', 'y', 'z'])
pipe_1 = source_1.pipe()

union_0 = merge(pipe_0, pipe_1)

union_0.pipe(
).subscribe(on_next = lambda x : print(str(x)))

`
)})


test("custom (as source) - Should fail", () => {
    expect(generateCode( JSON.parse(readFileSync(pathToTests + "customSource.test.json", "utf-8"))))
        .toBe(`Error at block custom: Invalid /inputType
`
)})


test("custom (as sink) - Should fail", () => {
    expect(generateCode( JSON.parse(readFileSync(pathToTests + "customSink.test.json", "utf-8"))))
        .toBe(`Error at block custom: Invalid /outputType
`
        )})

test("custom (as filter)", () => {
    expect(generateCode( JSON.parse(readFileSync(pathToTests + "customFilter.test.json", "utf-8"))))
        .toBe(
            compiler.getHeadString() +
            `example_function_body
\toperation1
\toperation2
\treturn ans

`
+ compiler.getHeadClosingString() +
`source_0 = string_test_source(iterable = ['x', 'y', 'z'])
source_0.pipe( 
\tuser_made_function_as_filter()
).subscribe(on_next = lambda x : print(str(x)))

`
)})


test("lambda_operator", () => {
    expect(generateCode( JSON.parse(readFileSync(pathToTests + "lambda_operator.test.json", "utf-8"))))
        .toBe(
        compiler.getHeadString() +
        `example_function_body
\toperation1
\toperation2
\treturn ans

` + compiler.getHeadClosingString() +
`source_0 = string_test_source(iterable = ['x', 'y', 'z'])
source_0.pipe( 
\tlambda_operator(user_made_function_as_filter)
).subscribe(on_next = lambda x : print(str(x)))

`
        )})


test("custom (as miner)", () => {
    expect(generateCode( JSON.parse(readFileSync(pathToTests + "customMiner.test.json", "utf-8"))))
        .toBe(compiler.getHeadString() +
`example_function_body
\toperation1
\toperation2
\treturn ans

`
+ compiler.getHeadClosingString() +
            `source_0 = string_test_source(iterable = ['x', 'y', 'z'])
source_0.pipe( 
\tuser_made_function_as_miner()
).subscribe(on_next = lambda x : print(str(x)))

`
        )})


test("custom (as union)", () => {
    expect(generateCode( JSON.parse(readFileSync(pathToTests + "customUnion.test.json", "utf-8"))))
        .toBe(compiler.getHeadString() +
        `example_function_body
\toperation1
\toperation2
\treturn ans

`
        + compiler.getHeadClosingString() +
`source_0 = string_test_source(iterable = ['x', 'y', 'z'])
pipe_0 = source_0.pipe()

source_1 = string_test_source(iterable = ['A', 'B', 'C'])
pipe_1 = source_1.pipe()

union_0 = user_made_function_as_merger(pipe_0, pipe_1)

union_0.pipe(
).subscribe(on_next = lambda x : print(str(x)))

`
)})
