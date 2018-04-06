"use strict";

class Calc {
  constructor() {
    this._setToBaseState();
  }

  _setToBaseState() {
    // find static methods at end of Calc class
    this.__FIRST = "0";
    this.__OP1 = Calc.OP.PLUS;
    this.__SECOND = "0";
    this.__OP2 = Calc.OP.PLUS;
    this.__TRAILING = "0";
    this.__DISPLAY = Calc.DISP.FIRST;
    this.__STATE = Calc.STATE.INITIAL;
  }

  /**
   * getDisplayedNumber
   * this method returns the number currently displayed on the
   * calculator. use this to display the element in the calculator
   * after receiving an input. */
  getDisplayedNumber() {
    switch (this.__DISPLAY) {
      case Calc.DISP.FIRST:
        return this.__FIRST;
      case Calc.DISP.SECOND:
        return this.__SECOND;
      case Calc.DISP.TRAILING:
        return this.__TRAILING;
    }
    throw new Error("Invalid display! BAD.");
  }

  /**
   * receiveInput
   * give an input the the calculator so that it can make computations.
   * this will be the way to communicate with the calculator what the
   * user has inputted. Make sure to only give valid inputs. Here are
   * the valid inputs:
   * - NUMBERS: [0,1,2,3,4,5,6,7,8,9,'.'] (the dot is considered a number)
   * - OPERATIONS: use Calc.OP.<operation>. e.g.: Calc.OP.PLUS, Calc.OP.MINUS
   * - EQUAL: Calc.OP_EQ
   * - RESET: Calc.OP_RES
   * - To be added: SpecialOperations (such as sin, cos, floor, etc) <- this could be a fun addition
   * */
  receiveInput(input) {
    input = input.toString();
    if (input.length > 2) {
      throw new Error("Invalid input received");
    } else if (Calc._isNumberInput(input)) {
      this._handleNumberInput(input);
    } else if (Calc._isEqualInput(input)) {
      this._handleEqual();
    } else if (Calc._isResetInput(input)) {
      this._handleReset();
    } else if (Calc._isOperationInput(input)) {
      this._handleOperationInput(input);
    } else {
      throw new Error("Invalid input received");
    }
  }

  /** input checking methods */

  static _isNumberInput(input) {
    return Calc.NUMBERS[input] === Calc.VALID;
  }

  static _isDecimalPointInput(input) {
    return input === ".";
  }

  static _isEqualInput(input) {
    return parseInt(input) === Calc.OP_EQ;
  }

  static _isResetInput(input) {
    return parseInt(input) === Calc.OP_RES;
  }

  static _isOperationInput(input) {
    let operation = Calc.OP.input_to_operation_map[input];
    let input_operation = Calc.OP[operation];
    return input_operation !== undefined;
  }

  /** input handling methods */

  _handleNumberInput(input) {
    switch (this.__STATE) {
      case Calc.STATE.INITIAL:
        this.__FIRST = Calc._isDecimalPointInput(input) ? "0" + input : input;
        this.__STATE = Calc.STATE.TRANSITION_FROM_INITIAL;
        break;
      case Calc.STATE.TRANSITION:
        this.__SECOND = Calc._isDecimalPointInput(input) ? "0" + input : input;
        this.__DISPLAY = Calc.DISP.SECOND;
        this.__STATE = Calc.STATE.TRANSITION_FROM_TRANSITION;
        break;
      case Calc.STATE.TRAILING:
        this.__TRAILING = Calc._isDecimalPointInput(input) ? "0" + input : input;
        this.__DISPLAY = Calc.DISP.TRAILING;
        this.__STATE = Calc.STATE.TRANSITION_FROM_TRAILING;
        break;
      case Calc.STATE.EQUAL:
        this.__FIRST = Calc._isDecimalPointInput(input) ? "0" + input : input;
        this.__STATE = Calc.STATE.TRANSITION_FROM_INITIAL;
        break;
      case Calc.STATE.TRANSITION_FROM_INITIAL:
        this.__FIRST = Calc.getResultingDisplay(this.__FIRST, input);
        break;
      case Calc.STATE.TRANSITION_FROM_TRANSITION:
        this.__SECOND = Calc.getResultingDisplay(this.__SECOND, input);
        break;
      case Calc.STATE.TRANSITION_FROM_TRAILING:
        this.__TRAILING = Calc.getResultingDisplay(this.__TRAILING, input);
        break;
      default:
        throw new Error("Invalid State! BAD.");
    }
  }

  static getResultingDisplay(display, input) {
    let resulting_display = "";
    if (Calc._isDecimalPointInput(input)) {
      if (!Calc._displayContainsDecimalPoint(display)) {
        resulting_display = display + input;
      } else {
        resulting_display = display;
      }
    } else {
      resulting_display = ( display === "0" ? "" : display ) + input;
    }
    return resulting_display;
  }

  static _displayContainsDecimalPoint(display) {
    return display.search(/\./) !== -1;
  }

  _handleEqual() {
    let resultFOp1S = Calc._getOperationResult(this.__FIRST, this.__OP1, this.__SECOND);
    let resultSOp2T = Calc._getOperationResult(this.__SECOND, this.__OP2, this.__TRAILING);
    let resultFOp1SOp2T = Calc._getOperationResult(this.__FIRST, this.__OP1, resultSOp2T);
    switch (this.__STATE) {
      case Calc.STATE.TRAILING:
        this.__FIRST = resultFOp1SOp2T;
        break;
      case Calc.STATE.TRANSITION_FROM_TRAILING:
        this.__FIRST = resultFOp1SOp2T;
        break;
      default:
        this.__FIRST = resultFOp1S;
        break;
    }
    this.__DISPLAY = Calc.DISP.FIRST;
    this.__STATE = Calc.STATE.EQUAL;
  }

  static _getOperationResult(a, op, b) {
    switch (parseInt(op)) {
      case Calc.OP.PLUS:
        return parseFloat(a) + parseFloat(b);
      case Calc.OP.MINUS:
        return parseFloat(a) - parseFloat(b);
      case Calc.OP.MULT:
        return parseFloat(a) * parseFloat(b);
      case Calc.OP.DIV:
        return parseFloat(a) / parseFloat(b);
      default:
        throw new Error("Invalid operation for results! BAD");
    }
  }

  _handleReset() {
    switch (this.__STATE) {
      case Calc.STATE.INITIAL:
        this._setToBaseState();
        return;
      case Calc.STATE.TRANSITION_FROM_INITIAL:
        if (this.__FIRST !== "0") {
          this.__FIRST = "0";
        } else {
          this._setToBaseState();
        }
        break;
      case Calc.STATE.TRANSITION:
        this.__FIRST = "0";
        this.__STATE = Calc.STATE.TRANSITION_FROM_INITIAL;
        break;
      case Calc.STATE.TRANSITION_FROM_TRANSITION:
        if (this.__SECOND !== "0") {
          this.__SECOND = "0";
        } else {
          this._setToBaseState();
        }
        break;
      case Calc.STATE.TRAILING:
        this.__TRAILING = "0";
        this.__STATE = Calc.STATE.TRANSITION_FROM_TRAILING;
        break;
      case Calc.STATE.TRANSITION_FROM_TRAILING:
        if (this.__TRAILING !== "0") {
          this.__TRAILING = "0";
        } else {
          this._setToBaseState();
        }
        break;
      case Calc.STATE.EQUAL:
        this.__FIRST = "0";
        this.__STATE = Calc.STATE.TRANSITION_FROM_INITIAL;
        break;
      default:
        throw new Error("Invalid state! BAD.");
    }
  }

  _handleOperationInput(input_operation) {
    let resultFOp1S = Calc._getOperationResult(this.__FIRST, this.__OP1, this.__SECOND);
    let resultSOp2T = Calc._getOperationResult(this.__SECOND, this.__OP2, this.__TRAILING);
    let resultFOp1SOp2T = Calc._getOperationResult(this.__FIRST, this.__OP1, resultSOp2T);

    switch (this.__STATE) {
      case Calc.STATE.INITIAL:
        this.__SECOND = this.__FIRST;
        this.__OP1 = input_operation;
        this.__STATE = Calc.STATE.TRANSITION;
        break;
      case Calc.STATE.TRANSITION_FROM_INITIAL:
        this.__SECOND = this.__FIRST;
        this.__OP1 = input_operation;
        this.__STATE = Calc.STATE.TRANSITION;
        break;
      case Calc.STATE.TRANSITION:
        this.__OP1 = input_operation;
        break;
      case Calc.STATE.TRANSITION_FROM_TRANSITION:
        if (Calc._isComplexOperation(input_operation) && Calc._isSimpleOperation(this.__OP1)) {
          // complex operation case: move to TRAILING
          this.__OP2 = input_operation;
          this.__TRAILING = this.__SECOND;
          this.__STATE = Calc.STATE.TRAILING;
        } else {
          // simple operation case: move to TRANSITION
          this.__FIRST = resultFOp1S;
          this.__OP1 = input_operation;
          this.__SECOND = resultFOp1S;
          this.__DISPLAY = Calc.DISP.FIRST;
          this.__STATE = Calc.STATE.TRANSITION;
        }
        break;
      case Calc.STATE.TRAILING:
        if (Calc._isSimpleOperation(input_operation)) {
          // simple operation case: move back to TRANSITION
          this.__FIRST = resultFOp1SOp2T;
          this.__OP1 = input_operation;
          this.__SECOND = resultFOp1SOp2T;
          this.__DISPLAY = Calc.DISP.FIRST;
          this.__STATE = Calc.STATE.TRANSITION;
        } else {
          // complex operation case: stay in TRAILING
          this.__OP2 = input_operation;
        }
        break;
      case Calc.STATE.TRANSITION_FROM_TRAILING:
        if (Calc._isSimpleOperation(input_operation)) {
          // simple operation case: move back to TRANSITION
          this.__FIRST = resultFOp1SOp2T;
          this.__OP1 = input_operation;
          this.__SECOND = resultFOp1SOp2T;
          this.__DISPLAY = Calc.DISP.FIRST;
          this.__STATE = Calc.STATE.TRANSITION;
        } else {
          // complex operation case: move back to TRAILING
          this.__SECOND = resultSOp2T;
          this.__OP2 = input_operation;
          this.__TRAILING = resultSOp2T;
          this.__DISPLAY = Calc.DISP.SECOND;
          this.__STATE = Calc.STATE.TRAILING;
        }
        break;
      case Calc.STATE.EQUAL:
        this.__OP1 = input_operation;
        this.__SECOND = this.__FIRST;
        this.__STATE = Calc.STATE.TRANSITION;
        break;
    }
  }

  static _isComplexOperation(input_operation) {
    return !Calc._isPlusOrMinusOperation(parseInt(input_operation));
  }

  static _isSimpleOperation(input_operation) {
    return Calc._isPlusOrMinusOperation(parseInt(input_operation));
  }

  static _isPlusOrMinusOperation(input_operation) {
    return input_operation === Calc.OP.PLUS || input_operation === Calc.OP.MINUS;
  }

  /**
   * static getters below
   * ====================
   * one for getting the set of operations from Calc
   * one for displays
   * one for various states
   * one for 'numbers' */

  static get OP() {
    return {
      PLUS: 90,
      MINUS: 91,
      MULT: 92,
      DIV: 93,
      input_to_operation_map: {
        90: "PLUS",
        91: "MINUS",
        92: "MULT",
        93: "DIV",
      }
    };
  }

  static get OP_EQ() {
    return 94;
  }

  static get OP_RES() {
    return 95;
  }

  static get DISP() {
    return {
      FIRST: 80,
      SECOND: 81,
      TRAILING: 82
    };
  }

  static get STATE() {
    return {
      INITIAL: 70,
      TRANSITION_FROM_INITIAL: 71,
      TRANSITION: 72,
      TRANSITION_FROM_TRANSITION: 73,
      TRAILING: 74,
      TRANSITION_FROM_TRAILING: 75,
      EQUAL: 76
    };
  }

  /** I chose an arbitrary number here */
  static get NUMBERS() {
    return {
      "0": Calc.VALID,
      "1": Calc.VALID,
      "2": Calc.VALID,
      "3": Calc.VALID,
      "4": Calc.VALID,
      "5": Calc.VALID,
      "6": Calc.VALID,
      "7": Calc.VALID,
      "8": Calc.VALID,
      "9": Calc.VALID,
      ".": Calc.VALID
    };
  }

  static get VALID() {
    return 9139;
  }
}

