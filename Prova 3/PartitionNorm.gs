/*************************************************************
 * Função para arredondar qualquer número para 6 casas decimais
 *************************************************************/
function round6(value) {
  var val = parseFloat(value);
  return parseFloat(val.toFixed(6));
}

/*************************************************************
 * PartitionNormTable
 * 
 * Recebe uma partição P (intervalo de células contendo os pontos
 * da partição, em ordem crescente) e calcula:
 *  - Os deltas: Δx_i = x_i - x_{i-1} para cada subintervalo;
 *  - A norma da partição, que é o máximo dos Δx_i.
 * 
 * A saída é uma tabela (array 2D) com:
 *   Linha 1: "Norma da Partição"
 *   Linha 2: o valor da norma (6 casas decimais)
 *   Linha 3: "Tabela de Deltas"
 *   Linha 4: Cabeçalho: "Delta"
 *   Linhas seguintes: cada Δx_i (6 casas decimais)
 *************************************************************/
function PARTITION_NORM(partitionRange) {
  // 1) Lê os pontos da partição (suporta range vertical/horizontal)
  var points = [];
  if (!Array.isArray(partitionRange[0])) {
    // Caso seja 1D
    for (var i = 0; i < partitionRange.length; i++) {
      points.push(round6(partitionRange[i]));
    }
  } else {
    // Caso seja 2D
    for (var r = 0; r < partitionRange.length; r++) {
      for (var c = 0; c < partitionRange[r].length; c++) {
        points.push(round6(partitionRange[r][c]));
      }
    }
  }
  
  // 2) Verifica se há ao menos 2 pontos para formar um intervalo
  if (points.length < 2) {
    return [["Erro: a partição deve ter pelo menos 2 pontos"]];
  }
  
  // 3) Calcula os deltas (Δx_i = x_i - x_{i-1})
  var deltas = [];
  for (var i = 1; i < points.length; i++) {
    var delta = round6(points[i] - points[i-1]);
    deltas.push(delta);
  }
  
  // 4) Determina a norma da partição (máximo dos deltas)
  var norm = deltas[0];
  for (var i = 1; i < deltas.length; i++) {
    if (deltas[i] > norm) {
      norm = deltas[i];
    }
  }
  norm = round6(norm);
  
  // 5) Monta a tabela de saída
  var resultTable = [];
  resultTable.push(["Norma da Partição"]);
  resultTable.push([norm.toFixed(6)]);
  resultTable.push(["Tabela de Deltas"]);
  resultTable.push(["Delta"]);
  
  for (var i = 0; i < deltas.length; i++) {
    resultTable.push([deltas[i].toFixed(6)]);
  }
  
  return resultTable;
}
