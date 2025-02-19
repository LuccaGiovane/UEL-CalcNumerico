/*************************************************************
 * Função para arredondar qualquer número para 6 casas decimais
 * e retornar como número (parseFloat).
 *************************************************************/
function round6(value) {
  var val = parseFloat(value);
  return parseFloat(val.toFixed(6));
}

/*************************************************************
 * Avalia f(x) cujos coeficientes estão na ordem decrescente.
 * Exemplo:
 *   coeffs = [1, 0, 0] => f(x) = 1*x^2 + 0*x^1 + 0*x^0 = x^2
 *************************************************************/
function polynomialValue(coeffs, x) {
  var result = 0.0;
  var degree = coeffs.length - 1;  // Se length=3, degree=2
  for (var k = 0; k <= degree; k++) {
    // coeffs[k] corresponde ao termo x^(degree - k)
    var c = round6(coeffs[k]);
    var exponent = degree - k;
    var term = round6(c * round6(Math.pow(x, exponent)));
    result = round6(result + term);
  }
  return result;
}

/*************************************************************
 * RIEMANN_SUM
 *  - Lê os coeficientes (ordem decrescente) em coeffRange
 *  - Calcula a Soma de Riemann no intervalo [a,b] usando n
 *    subintervalos (ponto médio).
 *  - Retorna uma "tabela" (array 2D) contendo:
 *    1) "Soma de Riemann" e o valor
 *    2) "Valor da norma" e o valor (||P||)
 *    3) Uma mini-tabela com "Delta i" e "Resultado" para cada
 *       subintervalo i (i=1..n).
 *************************************************************/
function RIEMANN_SUM(coeffRange, a, b, n) {
  // 1) Converte a, b, n para formato numérico/decimais
  a = round6(a);
  b = round6(b);
  n = parseInt(n, 10);

  // 2) Lê coeficientes do polinômio (ordem decrescente)
  var coeffs = [];
  if (!Array.isArray(coeffRange[0])) {
    // Se for 1D
    for (var i = 0; i < coeffRange.length; i++) {
      coeffs.push(round6(coeffRange[i]));
    }
  } else {
    // Se for 2D
    for (var r = 0; r < coeffRange.length; r++) {
      for (var c = 0; c < coeffRange[r].length; c++) {
        coeffs.push(round6(coeffRange[r][c]));
      }
    }
  }

  // 3) Cálculo de deltaX (partição uniforme)
  var deltaX = round6((b - a) / n);

  // 4) Soma de Riemann (ponto médio)
  var sum = 0.0;
  var areas = []; // armazena f(εi)*deltaX de cada subintervalo

  for (var k = 0; k < n; k++) {
    // x_inicial do subintervalo k
    var x_k = round6(a + round6(k * deltaX));
    // ponto médio
    var mid = round6(x_k + round6(deltaX / 2.0));
    // valor do polinômio em mid
    var fMid = polynomialValue(coeffs, mid);
    // área do subintervalo
    var area = round6(fMid * deltaX);
    areas.push(area);
    sum = round6(sum + area);
  }

  // 5) Montar a tabela (matriz 2D) de saída
  // Primeiro bloco: "Soma de Riemann" + valor
  // Segundo bloco: "Valor da norma" + valor
  // Terceiro bloco: cabeçalho ["Delta", "Resultado"]
  // Quarto bloco: para cada subintervalo, ["Delta i", area]

  var resultTable = [];

  // (i) Soma de Riemann
  resultTable.push(["Soma de Riemann"]);
  resultTable.push([sum.toFixed(6)]);

  // (ii) Valor da norma (deltaX em partição uniforme)
  resultTable.push(["Valor da norma"]);
  resultTable.push([deltaX.toFixed(6)]);

  // (iii) Cabeçalho da mini-tabela
  resultTable.push(["Delta", "Resultado"]);

  // (iv) Para cada subintervalo, mostramos "Delta 1", "Delta 2", etc.
  for (var m = 0; m < n; m++) {
    resultTable.push([
      "Delta " + (m+1),
      areas[m].toFixed(6)
    ]);
  }

  return resultTable;
}
