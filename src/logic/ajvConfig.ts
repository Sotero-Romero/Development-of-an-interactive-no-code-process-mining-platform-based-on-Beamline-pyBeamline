import Ajv from "ajv";
import {readdirSync, readFileSync} from "fs";
import {resolve} from "path";
import {ExtendedBlock} from "./Syntax.js";

function addReference(filePath:string, ajv: Ajv, reference : string) {
    const schema = JSON.parse(readFileSync(filePath, "utf8"));
    // Add schema to Ajv, using the filename (or a URL-like identifier) as the schema ID
    ajv.addSchema(schema,reference);
}

export function addAllReferences(directoryPath: string, ajv: Ajv){
    const schemasReferences=readdirSync(directoryPath)
    schemasReferences.forEach((reference) => {
        const filePath = resolve(directoryPath, reference)
        if (reference.endsWith(".json")) {
            addReference(filePath, ajv, reference)
        } else {
            addAllReferences(filePath, ajv)
        }
    })
}

export function addKeywords (ajv : Ajv){
    ajv.addKeyword({
        keyword: "validConnections",
        type: "array",
        validate: function (_, outputs: string[], __, parentSchema) {

            if (!parentSchema) return false
            if (outputs.length==0) return true

            // @ts-ignore
            const blocks: ExtendedBlock[] = parentSchema.rootData.blocks; // Get all blocks
            const currentBlock = parentSchema.parentData; // The block being validated

            return outputs.every(outputId => {

                // We find the block with the specific ID
                const targetBlock = blocks.find(block => block.id === outputId);


                //Checks if the current outputType or target inputType is any
                //if so, automatic true
                if (targetBlock !== undefined
                    && (targetBlock.descriptors.inputType?.includes("any")
                        || currentBlock.descriptors.outputType.includes("any"))) {
                    return true
                }
                // check input and output types match
                //@ts-ignore
                return targetBlock && targetBlock.descriptors.inputType.some(item => currentBlock.descriptors.outputType.includes(item));
            });
        },
        errors: false
    });
}
