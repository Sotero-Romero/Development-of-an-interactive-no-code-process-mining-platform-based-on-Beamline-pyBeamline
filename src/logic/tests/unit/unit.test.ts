import { generateCode } from "../../codeGenerator.ts";
import { expect, test } from '@jest/globals';


//Initial setup
let pathToTests : string = "src/logic/tests/unit/";





//  ########
//  Test 1 : [source] -> [sink]
//  ########

test("Test 1: Source -> Sink", () => {
    expect(generateCode(pathToTests + "unit1.json"))
            .toBe(
                `source_0 = string_test_source(iterable = ['A', 'B', 'C'])\nsource_0.pipe(\n).subscribe(on_next = lambda x : print(str(x)))\n`)
})



//  ########
//  Test 2 : [source] -> [filter] -> [sink]
//  ########

test("Test 2: Source -> Filter -> Sink", () => {
    expect(generateCode(pathToTests + "unit2.json"))
        .toBe(
            `source_0 = string_test_source(iterable = ['x', 'y', 'z'])\nsource_0.pipe( \nretains_activity_filter(activity_names = {'x', 'z'})\n).subscribe(on_next = lambda x : print(str(x)))\n`)
})

/*
//  ########
//  Test 3 : [sink]  ERROR
//  ########

test("Test 3: Sink", () => {
    expect(generateCode(pathToTests + "unit3.json"))
        .toBe("User diagram is not valid")
})


//  ########
//  Test 4 : [source]  ERROR
//  ########

test("Test 4: Source", () => {
    expect(generateCode(pathToTests + "unit4.json"))
        .toBe("User diagram is not valid")
})
*/


//  ########
//  Test 5 : [source0] -> [sink0]  (disconnected diagram)
//           [source1] -> [sink1]
//  ########

test("Test 5: source -> sink, source1 -> sink1", () => {
    expect(generateCode(pathToTests + "unit5.json"))
        .toBe("source_0 = string_test_source(iterable = 'x')\nsource_0.pipe(\n).subscribe(on_next = lambda x : print(str(x)))\nsource_1 = string_test_source(iterable = 'y')\nsource_1.pipe(\n).subscribe(on_next = lambda x : print(str(x)))\n")
})


/*
TODO: Test 6 :
TODO:            ->  filter0 -> sink0
TODO:   source0
TODO:            ->  filter1 -> sink1
*/

/*
TODO: Test 7 :
TODO:   source0  ->
TODO:                (merge/concat) => sink0
TODO:   source1  ->
*/

/*
TODO: Test 8 :
TODO:   source0  ->  filter0 ->
TODO:                        (merge/concat) => sink0
TODO:   source1  ->  filter1 ->
*/