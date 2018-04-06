function getCalculatorVariables() {
  let variables = {
    ids: {
      calc: "calculator",
      display: "display",
      display_current_value: "d-curr-val",
      calc_inputs: "c-inputs",
      btn_clear: "btn-clear",
      btn_seven: "btn-seven",
      btn_eight: "btn-eight",
      btn_nine: "btn-nine",
      btn_div: "btn-div",
      btn_four: "btn-four",
      btn_five: "btn-five",
      btn_six: "btn-six",
      btn_mul: "btn-mul",
      btn_one: "btn-one",
      btn_two: "btn-two",
      btn_three: "btn-three",
      btn_minus: "btn-minus",
      btn_zero: "btn-zero",
      btn_dot: "btn-dot",
      btn_eq: "btn-eq",
      btn_plus: "btn-plus",
    },
    class_names: {
      row: "input-row",
      row_init: "input-row-init",
      btn: "input-btn",
      btn_filler: "input-btn-filler"
    },
    button_values: {
      // todo - change "/" to two dot bar, "x" to a cross
      "btn-clear": "C",
      "btn-seven": "7",
      "btn-eight": "8",
      "btn-nine": "9",
      "btn-div": "/",
      "btn-four": "4",
      "btn-five": "5",
      "btn-six": "6",
      "btn-mul": "x",
      "btn-one": "1",
      "btn-two": "2",
      "btn-three": "3",
      "btn-minus": "-",
      "btn-zero": "0",
      "btn-dot": ".",
      "btn-eq": "=",
      "btn-plus": "+"
    },
    button_values_map: {
      "C": Calc.OP_RES,
      "7": 7,
      "8": 8,
      "9": 9,
      "/": Calc.OP.DIV,
      "4": 4,
      "5": 5,
      "6": 6,
      "x": Calc.OP.MULT,
      "1": 1,
      "2": 2,
      "3": 3,
      "-": Calc.OP.MINUS,
      "0": 0,
      ".": ".",
      "=": Calc.OP_EQ,
      "+": Calc.OP.PLUS
    },
    // this gets filled below
    values_to_button_id_map: {},
    inputs_id_key_rows: [
      ["btn_clear", "btn_seven", "btn_eight", "btn_nine", "btn_div"],
      [null, "btn_four", "btn_five", "btn_six", "btn_mul"],
      [null, "btn_one", "btn_two", "btn_three", "btn_minus"],
      [null, "btn_zero", "btn_dot", "btn_eq", "btn_plus"],
    ],
    inputs_id_key_list: [
      "btn_clear", "btn_seven", "btn_eight", "btn_nine", "btn_div",
      "btn_four", "btn_five", "btn_six", "btn_mul",
      "btn_one", "btn_two", "btn_three", "btn_minus",
      "btn_zero", "btn_dot", "btn_eq", "btn_plus"
    ]
  };

  Object.keys(variables.button_values_map).forEach(function (key) {
    let value = variables.button_values_map[key];
    variables.values_to_button_id_map[value] = key;
  });
  Object.keys(variables.button_values).forEach(function (key) {
    let value = variables.button_values[key];
    let key_in_map = variables.button_values_map[value];
    variables.values_to_button_id_map[key_in_map] = key;
  });

  return variables;
}


