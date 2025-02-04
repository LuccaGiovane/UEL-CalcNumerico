/**
 * Faz a decomposição LU (sem pivotamento) de uma matriz NxN,
 * reproduzindo passo a passo o método de Eliminação de Gauss:
 *    R_k <- R_k - m * R_i
 *  onde m = A[k][i] / A[i][i].
 *
 * Recebe um intervalo do Sheets (NxN) e retorna (n+1)x(2n):
 *  - Linha 0 = rótulos "Matriz L" e "Matriz U"
 *  - Linhas 1..n = valores de L (à esquerda) e U (à direita)
 *    com 6 casas decimais
 *
 * Exemplo de uso: =LU(A1:C3)
 */
function LU(inputRange) {
  // Converte o intervalo em array 2D
  var A = inputRange;
  var n = A.length;
  
  // Verifica se é quadrada
  if (n === 0 || A[0].length !== n) {
    return [["ERRO: a matriz deve ser quadrada"]];
  }
  
  // Cria uma cópia de A para U (será modificada) e L como identidade
  var U = copiaMatriz(A);
  var L = identidade(n);
  
  // Eliminação de Gauss
  // Loop sobre colunas de 0..n-2
  for (var i = 0; i < n - 1; i++) {
    // Pivô é U[i][i]
    var pivô = U[i][i];
    // Se pivô for zero, não conseguimos prosseguir sem pivotar
    if (Math.abs(pivô) < 1e-15) {
      return [["ERRO: pivô nulo (necessário pivotamento), col " + (i+1)]];
    }
    
    // Para cada linha abaixo de i
    for (var k = i + 1; k < n; k++) {
      // Multiplicador
      var m = U[k][i] / pivô;
      // Guarda esse multiplicador em L
      L[k][i] = m;
      
      // Rk <- Rk - m * Ri
      for (var j = i; j < n; j++) {
        U[k][j] = U[k][j] - m * U[i][j];
      }
    }
  }
  
  // Monta a matriz de saída (n+1) x (2n)
  // Linha 0: rótulos
  // Linhas 1..n: L e U, cada valor com 6 casas decimais
  var resultado = [];
  
  // Primeira linha com rótulos
  var linhaRotulos = [];
  linhaRotulos[0] = "Matriz L";
  // Preenche até a coluna n-1 com vazio
  for (var c = 1; c < n; c++) {
    linhaRotulos[c] = "";
  }
  // A coluna n recebe "Matriz U"
  linhaRotulos[n] = "Matriz U";
  // Preenche até 2n-1 com vazio
  for (var c = n + 1; c < 2 * n; c++) {
    linhaRotulos[c] = "";
  }
  resultado.push(linhaRotulos);
  
  // Linhas de 1..n (em 0-based => 0..n-1)
  for (var r = 0; r < n; r++) {
    var linha = [];
    // Parte L (colunas 0..n-1)
    for (var c = 0; c < n; c++) {
      if (r === c) {
        // Diagonal = 1
        linha[c] = 1.0;
      } else if (r > c) {
        // Abaixo da diagonal => multiplicador
        linha[c] = L[r][c];
      } else {
        // Acima da diagonal => 0
        linha[c] = 0.0;
      }
    }
    // Parte U (colunas n..2n-1)
    for (var c = 0; c < n; c++) {
      // Se r <= c, valor de U
      if (r <= c) {
        linha[n + c] = U[r][c];
      } else {
        // Abaixo da diagonal => 0
        linha[n + c] = 0.0;
      }
    }
    
    // Arredonda cada valor a 6 casas decimais
    for (var c = 0; c < 2*n; c++) {
      linha[c] = Number(linha[c].toFixed(6));
    }
    
    resultado.push(linha);
  }
  
  return resultado;
}

/**
 * Retorna a matriz identidade n x n
 */
function identidade(n) {
  var M = [];
  for (var i = 0; i < n; i++) {
    M[i] = [];
    for (var j = 0; j < n; j++) {
      M[i][j] = (i === j) ? 1 : 0;
    }
  }
  return M;
}

/**
 * Faz uma cópia (array 2D) de uma matriz (evita alterar a original).
 */
function copiaMatriz(A) {
  var n = A.length;
  var copia = [];
  for (var i = 0; i < n; i++) {
    copia[i] = A[i].slice();
  }
  return copia;
}
