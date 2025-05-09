import {sanityChecker} from "./sanityChecker.ts";
import {ExtendedPipeline, GuiPipeline} from "./Syntax.js";
import {Compiler} from "./Compiler.js";
import {Translator} from "./Translator.js";


function generateCode (userPipeline : GuiPipeline) {

    const compiler : Compiler = new Compiler();


    const translator : Translator = Translator.getInstance();
    let extendedPipe : ExtendedPipeline;


    try {
        extendedPipe = translator.translatePipeline(userPipeline)
    } catch (error : any) {
        return "Error when parsing pipeline."
    }
    try {
        sanityChecker(extendedPipe);
    } catch (error : any) {
        return error.message
    }

    return compiler.compilePipeline(extendedPipe);
}


export { generateCode }