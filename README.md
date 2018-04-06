# README

Here's a simple calculator implemented using FSM logic. Although the system (implmeneted in `Calc.js`) may look complicated, the logic with using it is very simple. Initialize a new instance of the calculator with:

```javascript
let calc = new Calc();
```

Use is as follow: 

Give one input to the calculator with

```javascript
calc.receiveInput(input);
```

An input can be:
- a number, one of `[0,1,2,3,4,5,6,7,8,9,'.']` (the dot is considered a number)
- an operation, one of `Calc.OP.PLUS, Calc.OP.MINUS, Calc.OP.MULT, Calc.OP.DIV`
- an equal operation using `Calc.OP_EQ`
- a reset operation (i.e. clear or clear all) using `Calc.OP_RES`

To get the current display on the calculator, use:

```javascript
calc.getDisplayedNumber();
```

That's it! 


# LICENSE

[LICENSE](LICENSE)