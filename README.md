# Moescript
The most kawaii esolang!<br>
It has a "unique" (totally not difficult to type) script, built on a special JavaScript interpreter
## Installation
```bash
npm install -g @hyperlotl/moescript
```

## Usage
```bash
moe foo.OwO
moerun bar.OwO
```

## documentation
Moescript has a unique coding style, to call a function use the `[OWO/funcname]`. Note that all OWO calls are run in the main root, and only OWO calls are run
functions are defined with `<UWU/funcname>`.
So, for instance, to define a function main that runs on project open, you do:
```moescript
[OWO/funcname]
<UWU/funcname>
your code here, keep in mind moescript does not support comments as of current version
</UWU>
```
"blocks" are defined with `<>` tags, and are used for dynamic multiargument commands, loops and more.
other functions:
`<#w#>...<\#w#>`: takes **EXACTLY** 3 inputs (any more or less and it returns 0) and runs an operation. Inputs in the order `operand`,`operator`,`operand`. acceptible operators are `(:O/+)`(add),`(:O/-)`(subtract),`(:O/*)`(multiply),`(:O/%)`(divide),`(:O/=)`(equality)
`<nya~>...<\nya~>`: takes any amount of inputs, and concats them before printing them out, unlike `[~nya]` which can only print static text
`<?w?></?w?>`: the first command/input in this block is a boolean output. If it returns true, execute everything in <?w?> sequentially.
`[nya~/foo]`: prints the argument
`(:O/foo)`: returns the argument, used in things like `<nya~>` or `<#w#>` (data types do not exist)

`[:3/foo/val]`: sets variable foo to a certain value (i.e val)
`(X3/foo)`: returns variable foo

## Example
```moescript
[OWO/main]
<UWU/main>
<nya~>
(:O/Hello )
(:O/World!)
<\nya~>
<\UWU>
```
## Trivia
Moescript went through many name changes :3

It was originally known as UWUscript before I started coding it. Shortly after I started coding it, its name was changed to OwOscript. In production, it was changed to the current "moescript" as the name "owoscript"(different capitalization) was already taken by an esolang.