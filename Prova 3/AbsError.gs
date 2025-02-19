/*************************************************************
 * round6(value)
 * Arredonda qualquer número para 6 casas decimais e retorna
 * como Number (parseFloat).
 *************************************************************/
function round6(value) {
  var val = parseFloat(value);
  return parseFloat(val.toFixed(6));
}

/*************************************************************
 * ERRO_ABSOLUTO(exactValueRange, approxValueRange)
 *
 * - exactValueRange: intervalo (ou célula única) contendo o valor exato (V_e)
 * - approxValueRange: intervalo (ou célula única) contendo o valor aproximado (V_a)
 *
 * Retorna uma string:
 *   "Erro absoluto = <valor>"
 * com 6 casas decimais, seguindo a fórmula:
 *   Ea = |(V_e - V_a)/V_e|
 *************************************************************/
function ERRO_ABSOLUTO(exactValueRange, approxValueRange) {
  // 1) Lê o valor exato (V_e)
  // O Google Sheets passa o intervalo como uma matriz 2D
  // Se for só uma célula, é algo como [[valor]]
  var Ve = parseFloat(exactValueRange[0][0]);

  // 2) Lê o valor aproximado (V_a)
  var Va = parseFloat(approxValueRange[0][0]);

  // 3) Calcula Ea = |(Ve - Va) / Ve|
  var Ea = Math.abs((Ve - Va) / Ve);

  // 4) Arredonda para 6 casas decimais
  Ea = round6(Ea);

  // 5) Retorna a string "Erro absoluto = <valor>"
  return "Erro absoluto = " + Ea.toFixed(6);
}
