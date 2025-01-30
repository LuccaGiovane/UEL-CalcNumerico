/************************************************************
 * 1) Funções auxiliares para manipulação de polinômios
 ************************************************************/
function polyAdd(a, b) {
  var m = Math.max(a.length, b.length);
  var result = new Array(m).fill(0);
  for (var i = 0; i < m; i++) {
    result[i] = (i < a.length ? a[i] : 0) + (i < b.length ? b[i] : 0);
  }
  return result;
}

function polySub(a, b) {
  var m = Math.max(a.length, b.length);
  var result = new Array(m).fill(0);
  for (var i = 0; i < m; i++) {
    result[i] = (i < a.length ? a[i] : 0) - (i < b.length ? b[i] : 0);
  }
  return result;
}

function polyMul(a, b) {
  var result = new Array(a.length + b.length - 1).fill(0);
  for (var i = 0; i < a.length; i++) {
    for (var j = 0; j < b.length; j++) {
      result[i + j] += a[i] * b[j];
    }
  }
  return result;
}

function polyScale(a, c) {
  return a.map(coef => coef * c);
}

function polyXMinus(alpha) {
  return [-alpha, 1];
}

/************************************************************
 * 2) Função principal: Construção da tabela com polinômios intermediários
 ************************************************************/
function AITKEN(xVals, yVals) {
  var n = xVals.length;
  if (n !== yVals.length) {
    throw new Error("xVals e yVals devem ter o mesmo tamanho!");
  }

  // Criamos uma tabela para armazenar os polinômios intermediários
  var P = [];
  for (var i = 0; i < n; i++) {
    P.push(new Array(n).fill(null));
  }

  // Diagonal principal: P[i,i] = polinômio constante = y_i
  for (var i = 0; i < n; i++) {
    P[i][i] = [yVals[i]]; // Polinômio constante: apenas o termo independente
  }

  // Construção da tabela de Aitken
  for (var length = 1; length < n; length++) {
    for (var i = 0; i < n - length; i++) {
      var j = i + length;
      
      var term1 = polyMul(polyXMinus(xVals[j]), P[i][j-1]);
      var term2 = polyMul(polyXMinus(xVals[i]), P[i+1][j]);
      var numerator = polySub(term1, term2);
      var denominator = (xVals[i] - xVals[j]);
      
      P[i][j] = polyScale(numerator, 1 / denominator);
    }
  }

  // Montar saída da tabela com os polinômios intermediários
  var table = [];
  
  // Cabeçalho
  var header = ["i", "x_j", "y_j"];
  for (var j = 1; j < n; j++) {
    header.push("P_" + Array.from({length: j+1}, (_, k) => k).join("") + "(x)");
  }
  header.push("P(x) Final");
  table.push(header);
  
  // Preenchendo a tabela
  for (var i = 0; i < n; i++) {
    var row = [i, xVals[i], yVals[i]];
    
    for (var j = 1; j < n - i; j++) {
      row.push(polynomialToString(P[i][i + j]));
    }

    if (i === 0) {
      row.push(polynomialToString(P[0][n-1])); // Última célula do primeiro i contém o polinômio final
    }

    table.push(row);
  }

  return table;
}

/************************************************************
 * 3) Converter coeficientes do polinômio para string
 ************************************************************/
function polynomialToString(coeffs) {
  var strParts = [];
  for (var i = 0; i < coeffs.length; i++) {
    var c = coeffs[i].toFixed(4); // Ajuste de casas decimais
    if (i === 0) {
      strParts.push(c);
    } else {
      var sign = (coeffs[i] >= 0) ? "+" : "-";
      var absVal = Math.abs(coeffs[i]).toFixed(4);
      strParts.push(sign + " " + absVal + "x" + (i > 1 ? "^" + i : ""));
    }
  }
  return strParts.join(" ");
}

/************************************************************
 * 4) Função customizada para uso no Google Sheets
 ************************************************************/
function aitkenPolynomialTableInSheets(xRange, yRange) {
  var xVals = Array.isArray(xRange) ? xRange.map(r => parseFloat(r[0])) : [parseFloat(xRange)];
  var yVals = Array.isArray(yRange) ? yRange.map(r => parseFloat(r[0])) : [parseFloat(yRange)];

  return aitkenPolynomialTable(xVals, yVals);
}
