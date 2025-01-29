/**
 * Interpolação de Lagrange, mostrando na tabela:
 *  - Para cada k:
 *    - Linha "Lk": rótulo e o fator multiplicador [y_k/Denominador_k].
 *    - Linha "N": polinômio "Numerador_k" (coeficientes inteiros, sem divisão).
 *    - Linha "D": valor do Denominador_k.
 *  - Linha final "P(x)": soma efetiva em decimal dos termos parciais.
 *
 * @param {A2:B?} pontos    Intervalo com duas colunas: (X, Y).
 * @param {number} iter     (opcional, sem uso real aqui, só para manter padrão).
 * @return {Array<Array<any>>} Tabela expandida (linhas x colunas).
 *
 * Exemplo (PT-BR):
 *   =LAGRANGE_INTERP(A1:B4; 4)
 * Ou (EN-US):
 *   =LAGRANGE_INTERP(A1:B4, 4)
 */
function LAGRANGE_INTERP(pontos, iter) {
  //------------------------------------------------------------------
  // 1) Ler os pontos (x_i, y_i) do intervalo bidimensional.
  //------------------------------------------------------------------
  if (!Array.isArray(pontos) || pontos.length === 0) {
    throw new Error("Informe pelo menos uma linha e duas colunas (x,y).");
  }

  const xs = [];
  const ys = [];
  for (let i = 0; i < pontos.length; i++) {
    if (pontos[i].length < 2) {
      throw new Error("Cada linha deve ter ao menos 2 colunas (x,y).");
    }
    xs.push(Number(pontos[i][0]));
    ys.push(Number(pontos[i][1]));
  }

  const n = xs.length;       // número de pontos
  const grau = n - 1;        // grau do polinômio = n - 1

  //------------------------------------------------------------------
  // 2) Funções para manipular polinômios em formato de array
  //    (ordem DECRESCENTE de grau).
  //------------------------------------------------------------------
  // Ex.: [2, -1, 3] => 2x^2 - x + 3

  // Cria polinômio nulo de grau g => array de tamanho g+1
  function polyZero(g) {
    return Array(g + 1).fill(0);
  }

  // Soma polinômios P e Q do mesmo tamanho
  function polyAdd(P, Q) {
    const R = [];
    for (let i = 0; i < P.length; i++) {
      R.push(parseFloat((P[i] + Q[i]).toFixed(6)));
    }
    return R;
  }

  // Multiplica dois polinômios P, Q
  // Grau final = (p-1)+(q-1) = p+q-2 => array de tamanho (p+q-1).
  function polyMul(P, Q) {
    const R = Array(P.length + Q.length - 1).fill(0);
    for (let i = 0; i < P.length; i++) {
      for (let j = 0; j < Q.length; j++) {
        R[i + j] += P[i] * Q[j];
      }
    }
    // Arredondar para 6 casas
    return R.map(x => parseFloat(x.toFixed(6)));
  }

  // Multiplica polinômio P por escalar c
  function polyScale(P, c) {
    return P.map(co => parseFloat((co * c).toFixed(6)));
  }

  // Ajusta tamanho do polinômio (ordem decrescente) para "tam"
  // (adicione zeros à esquerda, se necessário)
  function polyResize(P, tam) {
    const diff = tam - P.length;
    if (diff > 0) {
      // insere zeros no início
      const zeros = Array(diff).fill(0);
      return zeros.concat(P);
    }
    return P;
  }

  //------------------------------------------------------------------
  // 3) Calcular e montar a tabela
  //------------------------------------------------------------------
  // L_k(x) = (y_k / Denominador_k) * [ PROD_{j!=k}(x - x_j) ]
  // Mas iremos exibir também o Numerador_k (sem dividir) e o Denominador_k,
  // para ficar claro como cada termo é construído.
  //------------------------------------------------------------------

  // Polinômio final (soma dos termos)
  let P_final = polyZero(grau);

  // Cabeçalho: [" ", "Mult", "x^grau", ..., "x^0"]
  const header = [" ", "Mult"];
  for (let e = grau; e >= 0; e--) {
    if (e === 0) header.push("ind");  // ou "x^0"
    else header.push(`x^${e}`);
  }
  const tabela = [header];

  // Para cada k:
  for (let k = 0; k < n; k++) {
    // 3.1) Constrói Numerador_k como polinômio expandido inteiro
    //      (sem dividir por nada).
    let numerador = [1]; // polinômio = 1 no início
    for (let j = 0; j < n; j++) {
      if (j === k) continue;
      // fator (x - x_j)
      const fator = [1, -xs[j]]; // => x + (-x_j)
      numerador = polyMul(numerador, fator); // expande
    }

    // 3.2) Denominador_k = PROD_{j!=k} (x_k - x_j)
    let denom = 1;
    for (let j = 0; j < n; j++) {
      if (j === k) continue;
      denom *= (xs[k] - xs[j]);
    }

    // 3.3) "Mult" = y_k / denom (decimal, arredondado para 6 casas)
    const mult = parseFloat((ys[k] / denom).toFixed(6));
    denom = parseFloat(denom.toFixed(6)); // idem para exibir na tabela

    // Ajusta tamanho do numerador p/ grau = "n - 1"
    const numerResized = polyResize(numerador, grau + 1);

    // 3.4) Adiciona 3 linhas à tabela:
    //      [Lk, mult, "", "", ...]
    //      [N,  "",   numerResized...]
    //      [D,  denom, "", "", ...]
    {
      // Linha Lk
      const rowL = [`L${k}`, mult];
      // completa com "" até o número de colunas
      for (let c = 0; c < (grau + 1); c++) {
        rowL.push("");
      }
      tabela.push(rowL);

      // Linha N
      const rowN = ["N", ""];
      for (let c = 0; c < numerResized.length; c++) {
        rowN.push(numerResized[c]);
      }
      tabela.push(rowN);

      // Linha D
      const rowD = ["D", denom];
      for (let c = 0; c < grau + 1; c++) {
        rowD.push("");
      }
      tabela.push(rowD);
    }

    // 3.5) Para formar P(x), somamos "mult * numerador"
    const parcial = polyScale(numerResized, mult);
    P_final = polyAdd(P_final, parcial);
  }

  //------------------------------------------------------------------
  // 4) Linha final: "P(x)" e seus coeficientes
  //------------------------------------------------------------------
  const sumRow = ["P(x)", ""];
  for (let i = 0; i < P_final.length; i++) {
    sumRow.push(P_final[i]);
  }
  tabela.push(sumRow);

  //------------------------------------------------------------------
  // 5) Retorna a tabela (linhas x colunas)
  //------------------------------------------------------------------
  return tabela;
}
