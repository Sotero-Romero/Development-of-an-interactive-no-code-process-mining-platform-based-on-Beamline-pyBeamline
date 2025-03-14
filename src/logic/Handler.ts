import {Compiler} from "./Compiler.js";
import {ExtendedBlock, UnionData } from "./Syntax.js";


export class Handler {

    private compiler : Compiler;
    private counters  = {
        "source" : 0,
        "pipe" : 0,
        "union" : 0
    };
    private unionData: UnionData = {
    };
    private customDefinitions : string[] = []

    public constructor(compiler : Compiler) {
     this.compiler = compiler;
    }


    public resetCounters() {
        this.counters  = {
            "source" : 0,
            "pipe" : 0,
            "union" : 0
        };
        this.unionData = {};
        this.customDefinitions = [];
    }

    public processBlock (block : ExtendedBlock, currentString : string) : string {

        if (block.descriptors.name === "custom") {
            this.defineCustom(block, currentString)
        }

        //Checks if the block has an input property, i.e. is a union (or a custom union)
        if (block.input) {
            return this.handleUnion(block, currentString);
        }
        if (block.descriptors.inputType === null) {
            return this.handleSource(block,  currentString);
        }
        if (block.descriptors.outputType === null) {
            return this.handleSink(block, currentString)
        }

        return this.handleDefault(block,  currentString)


    }

    private handleDefault (block : ExtendedBlock, currentString : string) : string {
        return `${currentString}\t${this.addParametersToPipeline(block)},\n`
    }

    private handleSink(block : ExtendedBlock, currentString : string) :string {

        this.compiler.appendBodyString(`${currentString.slice(0, -2)}\n)${this.addParametersToPipeline(block)}\n`)
        return currentString

    }

    private handleUnion (block : ExtendedBlock, currentString : string) : string {

        let newString = "";

        //Adds the union block to the counter if not already existing
        if (!(block.id in this.unionData)) {
            const functionName =
                block.descriptors.name === "custom" ? block.parameters.functionName : block.function

            this.unionData[block.id] = {
                //@ts-ignore
                counter: block.input,
                //open the bracket of the union()
                mergeString: functionName.slice(0, -1),
                pass : false
            };
        }


        this.compiler.appendBodyString(`pipe_${this.counters.pipe} = ${currentString.slice(0, -2)})\n`);

        //@ts-ignore
        this.unionData[block.id].mergeString += `${this.unionData[block.id].counter < block.input ? ", " : ""}pipe_${this.counters.pipe}`;
        this.unionData[block.id].counter--;
        this.counters.pipe++;

        //close the function and continue with the diagram
        if (this.unionData[block.id].counter === 0) {
            this.compiler.appendBodyString("union_" + this.counters.union + " = " + this.unionData[block.id].mergeString + ")\n")
            newString = "union_" + this.counters.union + ".pipe( \n"
            this.unionData[block.id].pass = true;
            this.counters.union++;
        }

        return newString;
    }

    public tryPass( block : ExtendedBlock ) : boolean {

        if ((this.unionData[block.id] === undefined)) {
            return true
        }
        return this.unionData[block.id].pass;

    }

    private defineCustom (block : ExtendedBlock, currentString : string) : void {

        //Add the function definition to the head code
        if (!(this.customDefinitions.includes(block.id))) {
            this.compiler.appendHeadString(block.parameters.functionBody + "\n")
            this.customDefinitions.push(block.id)
        }


    }

    private handleSource (block : ExtendedBlock, currentString : string) : string {

        this.compiler.appendBodyString(`source_${this.counters.source} = ${this.addParametersToPipeline(block)}\n`)

        currentString += `source_${this.counters.source}.pipe( \n`
        this.counters.source++

        return currentString

    }

    private addParametersToPipeline (block : ExtendedBlock) : string {

        //TODO: Move this block of code to the customHandler maybe
        if (block.descriptors.name === "custom") {
            //add custom function name to pipeline
            return block.parameters.functionName
        }

        //Open bracket
        let resultString : string = block.function.slice(0, -1);

        //If there are no parameters return
        if (Object.keys(block.parameters).length == 0) {
            return resultString + ")"
        }


        // Add parameters to the result string
        for (const parameter in block.parameters) {
                resultString += `${parameter} = ${block.parameters[parameter]}, `;
        }
        // Remove the comma and space
        resultString = resultString.slice(0, -2);

        // Close the bracket and return the result
        return resultString + ")";
    }

}