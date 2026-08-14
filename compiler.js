const commandInstructions = {
    ":P": (args) => {
        console.log(args.inputs[0]);
    },
    ":3": (args)=>{
        args.varDict[args.inputs[0]]=args.inputs[1]
    },
};
const reporterInstructions={
    "X3":(args)=>{
        return args.varDict[args.inputs[0]]
    },
    ":O":(args)=>{
        return args.inputs.join('')//so the test can include the slanted braces
    },
    "T_T":(args)=>{//technically doesnt need args, but just to be safe we put it here
        return true
    },
    "T~T":(args)=>{//technically doesnt need args, but just to be safe we put it here
        return false
    }
}
const mathOperators={
    "+":(val1,val2)=>{
        return val1+val2
    },
    "-":(val1,val2)=>{
        return val1-val2
    },
    "*":(val1,val2)=>{
        return val1*val2
    },
    "/":(val1,val2)=>{
        return val1/val2
    }
}
class Token {
    constructor(code, type, args) {
        this.code = code;
        this.type = type;
        this.args = args;
        this.indentation = 0;
        this.children = [];
    }
    executeToken(varDict,funcDict){
        if (this.type=="start"){
            if (this.code=="UWU"){
                this.children.forEach(child=>{
                    child.executeToken(varDict,funcDict);
                })
            }
            if (this.code=="?w?"){
                const condition=this.children[0]
                if (condition&&condition.type=="reporter"&&condition.executeToken(varDict,funcDict)===true){
                    this.children.forEach(child=>{
                        child.executeToken(varDict,funcDict)
                    })  
                }
            }
            if (this.code=="#w#"){
                let result=0
                if (this.children.length===3){
                    const val1= Number(this.children[0].executeToken(varDict,funcDict))
                    const val2= Number(this.children[2].executeToken(varDict,funcDict))
                    const operator=this.children[1].executeToken(varDict,funcDict)
                    result=mathOperators[operator](val1,val2)
                }
                return result    
            }
            if (this.code==":P"){
                let completeText=""
                this.children.forEach(child=>{
                    const resp=child.executeToken(varDict,funcDict)
                    completeText=`${completeText}${resp}`
                })
                console.log(completeText)
            }
            if (this.code==":3"){
                let completeText=""
                this.children.forEach(child=>{
                    const resp=child.executeToken(varDict,funcDict)
                    completeText=`${completeText}${resp}`
                })
                //console.log(completeText)
                varDict[this.args[0]]=completeText
            }
            return;
        }
        if (this.type=="command"){
            if (this.code==="OWO"){
                funcDict[this.args[0]].executeToken(varDict,funcDict)
                return;
            }else{
            commandInstructions[this.code]({"inputs":this.args,"varDict":varDict})
            }
        }
        if (this.type=="reporter"){
            return reporterInstructions[this.code]({"inputs":this.args,"varDict":varDict})
        }
        
    }
}
function splitTokens(code) {
    const tokens = [];
    let current = "";
    let depth = 0;
    let mode = null;
    for (const char of code) {
        if (
            (char === "<" || char === "[" || char === "(") &&
            depth === 0
        ) {
            if (current) {
                tokens.push(current);
                current = "";
            }
            current = char;
            if (char === "<") mode = ">";
            if (char === "[") mode = "]";
            if (char === "(") mode = ")";
            depth = 1;
            continue;
        }
        if (depth > 0) {
            current += char;
            if (char === mode) {
                depth--;
                if (depth === 0) {
                    tokens.push(current);
                    current = "";
                    mode = null;
                }
            }
            if (
                (mode === ")" && char === "(") ||
                (mode === "]" && char === "[") ||
                (mode === ">" && char === "<")
            ) {
                depth++;
            }
            continue;
        }
        current += char;
    }

    if (current) {
        tokens.push(current);
    }

    return tokens;
}
function tokenizeCodeRaw(rawCode){
    const rawArray=rawCode.replace(/[\r\n\t]/g, "").split(/(<[^>]*>|\[[^\]]*\]|\([^)]*\))/).filter(Boolean);
    let rawTokens = [];

    rawArray.forEach(token => {
        if (token[0] === "<") {
            const parsedToken = token.slice(1, -1).split("/");
            const isStart = parsedToken[0][0] !== "\\";

            rawTokens.push(
                new Token(
                    isStart? parsedToken[0] : parsedToken[0].slice(1),
                    isStart ? "start" : "end",
                    parsedToken.slice(1)
                )
            );
        } else {
            const parsedToken = token.slice(1, -1).split("/");
            const type=token[0] === "["?"command":(token[0] === "("?"reporter":"body")
            rawTokens.push(
                new Token(
                    parsedToken[0],
                    type,
                    parsedToken.slice(1)
                )
            );
        }
    });
    return rawTokens
}
function parseIndentations(tokens) {
    const parsedTokens = tokens.map(token =>
        new Token(token.code, token.type, [...token.args])
    );

    for (let index = 0; index < parsedTokens.length; index++) {
        const token = parsedTokens[index];
        if (token.type === "start") {
            let counter = 1;
            while (index + counter < parsedTokens.length) {
                const currentToken = parsedTokens[index + counter];
                if (currentToken.type === "end" &&currentToken.code === token.code
                ) {break;}
                currentToken.indentation++;
                counter++;
            }
        }
    }
    return parsedTokens;
}
function toTree(tokens) {
    const root = [];
    const stack = [
        {indentation: -1,children: root}
    ];
    for (const token of tokens) {
        if (token.type === "end") {
            while (stack.length > 1 &&stack[stack.length - 1].indentation >=token.indentation){
                stack.pop();
            }
            continue;
        }
        while (stack[stack.length - 1].indentation >=token.indentation) {
            stack.pop();
        }
        const parent = stack[stack.length - 1];
        parent.children.push(token);
        if (token.type === "start") {
            stack.push(token);
        }
    }
    return root;
}
class parsedScript{
    constructor(tree,tokenize){
        this.functions={}
        this.variables={}
        this.tokens=tokenize?toTree(parseIndentations(tokenizeCodeRaw(tree))):tree
        this.tokens.forEach((token, index) => {
            if (token.type === "start" && token.code === "UWU") {
                const functionName = token.args[0];
                let counter = 0
                // Find matching </UWU>
                const endIndex = this.tokens.findIndex(
                    (t, i) =>
                        i > index &&t.type === "end" &&t.code === "UWU"
                );
                this.functions[functionName] = this.tokens[index]
            }
        });
    }
    report(value){//debug func
        console.dir(this[{"funcs":"functions","tree":"tokens"}[value]], {depth: null});
    }
    run(){
        this.tokens.forEach(token=>{
            if (token.type==="command"&&token.code==="OWO"){
                token.executeToken(this.variables,this.functions)
            }
        })
    }
}
function runUWUscript(script){
    const parsed=new parsedScript(script,true)
    //parsed.report("tree")
    parsed.run()
}
module.exports = { runUWUscript, parsedScript };
