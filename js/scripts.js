"use strict";
window.addEventListener("load", main);

let variables;
function main() {
  variables = getCalculatorVariables();
  createCalculator();
  createCalculatorHTMLElement();
  addEventListenersToCalculator();
  updateCalculatorDisplay();
  addWindowKeyListener();
}

function createCalculator() {
  window.calc = new Calc();
}

function createCalculatorHTMLElement() {
  const body = document.getElementById("body");
  const calculator = document.createElement("div");
  calculator.appendChild(createCalculatorDisplay());
  calculator.appendChild(createCalculatorInputs());
  calculator.setAttribute("id", variables.ids.calc);
  body.appendChild(calculator);
}

function createCalculatorDisplay() {
  const calculator_display = document.createElement("div");
  const current_displayed_value = document.createElement("span");
  current_displayed_value.setAttribute("id", variables.ids.display_current_value);
  calculator_display.appendChild(current_displayed_value);
  calculator_display.setAttribute("id", variables.ids.display);
  return calculator_display;
}

function createCalculatorInputs() {
  const calculator_inputs = document.createElement("div");
  calculator_inputs.setAttribute("id", variables.ids.calc_inputs);
  variables.inputs_id_key_rows.forEach(function (input_list, index) {
    calculator_inputs.appendChild(createInputRow(index, input_list));
  });
  return calculator_inputs;
}

function createInputRow(index, input_list) {
  const row = document.createElement("div");
  const row_init = document.createElement("span");
  input_list.forEach(function (id_key) {
    row_init.appendChild(createButton(variables.ids[id_key]));
  });
  row_init.setAttribute("class", variables.class_names.row_init);
  row.append(row_init);
  row.setAttribute("id", `row-${index}`);
  row.setAttribute("class", variables.class_names.row);
  return row;
}

function createButton(id) {
  const button = document.createElement("span");
  const text = variables.button_values[id];
  const button_value_text = document.createTextNode(text || "?");
  button.appendChild(button_value_text);
  if (id) {
    button.setAttribute("id", id);
  }
  if (text) {
    button.setAttribute("class", variables.class_names.btn);
  } else {
    button.setAttribute("class", variables.class_names.btn + " " + variables.class_names.btn_filler);
  }
  return button;
}

function addEventListenersToCalculator() {
  variables.inputs_id_key_list.forEach(function (key) {
    let id = variables.ids[key];
    let button_value = variables.button_values[id];
    let calculator_input = variables.button_values_map[button_value];
    document.getElementById(id).addEventListener("click", function () {
      handleCalculatorInput(calculator_input);
    });
  });
}

function handleCalculatorInput(input) {
  window.calc.receiveInput(input);
  highlightKey(input);
  updateCalculatorDisplay();
}

function highlightKey(input_calc_value) {
  console.log(input_calc_value);
  let id = variables.values_to_button_id_map[input_calc_value];
  let button = document.getElementById(id);
  button.style.backgroundColor = "rgba(96,159,202,0.7)";
  setTimeout(function () {
    button.style.backgroundColor = "white";
  },100);
}

function updateCalculatorDisplay() {
  let display_html = document.getElementById(variables.ids.display_current_value);
  display_html.innerText = window.calc.getDisplayedNumber();
}

/* keyboard handler */

let key_code_map = {};
Array.apply(null, Array(10)).map(function (key, index) {
  key_code_map[48 + index] = index;
});
key_code_map[42] = Calc.OP.MULT;
key_code_map[43] = Calc.OP.PLUS;
key_code_map[45] = Calc.OP.MINUS;
key_code_map[46] = ".";
key_code_map[47] = Calc.OP.DIV;
key_code_map[61] = Calc.OP_EQ;
key_code_map[67] = Calc.OP_RES;
key_code_map[99] = Calc.OP_RES;

function addWindowKeyListener() {
  window.addEventListener("keypress", function (e) {
    let keyboard_input = key_code_map[e.charCode];
    if (keyboard_input || keyboard_input === 0) {
      handleCalculatorInput(keyboard_input);
    }
  });
  window.addEventListener("keydown", function (e) {
    if (e.code === "Enter") {
      handleCalculatorInput(Calc.OP_EQ);
    }
  });
}