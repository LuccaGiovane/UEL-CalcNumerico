/**
 * Interpolação de Lagrange, mostrando na tabela:
 *  - As linhas Lk com:
 *    1) Col. "Mult" = ( y_k / PROD_{j!=k}(x_k - x_j) ) [decimal].
 *    2) Col. x^... = polinômio inteiro (x - x_j)(x - x_j)... (sem dividir).
 *  - Linha final "P(x)" = soma efetiva dos parciais em decimal.
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

  // Multiplica dois polinômios P, Q (tamanhos p, q).
  // Grau final = (p-1)+(q-1)=p+q-2 => array de tamanho (p+q-1).
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
  // 3) Construir cada L_k: primeiramente só o "numerador" (x-x_j)...
  //------------------------------------------------------------------
  // L_k(x) = Numerador / Denominador
  // Numerador_k = PROD_{j!=k} [x - x_j]
  // Denominador_k = PROD_{j!=k} [x_k - x_j]
  // Depois multiplica por y_k.
  // Mas aqui, na tabela, mostraremos:
  //   * "Mult" = ( y_k / Denominador_k )
  //   * colunas x^... = "Numerador_k" (ainda inteiro, sem dividir)
  // E no final, somamos de fato "Mult" * Numerador_k em decimal, gerando P(x).
  //------------------------------------------------------------------

  let P_final = polyZero(grau); // soma final dos parciais (em decimal)

  // Cabeçalho: [" ", "Mult", "x^3", "x^2", "x", "ind"], se grau=3
  const header = [" ", "Mult"];
  for (let e = grau; e >= 0; e--) {
    if (e === 0) header.push("ind");
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
      const fator = [1, -xs[j]]; // => x^1 + (-x_j)*x^0
      numerador = polyMul(numerador, fator); // expande
    }

    // 3.2) Denominador_k = PROD_{j!=k} (x_k - x_j)
    let denom = 1;
    for (let j = 0; j < n; j++) {
      if (j === k) continue;
      denom *= (xs[k] - xs[j]);
    }

    // 3.3) "Mult" = y_k / denom (decimal)
    const mult = parseFloat((ys[k] / denom).toFixed(6));

    // 3.4) Monta a linha de tabela: 
    //      "Lk", <mult>, <numerador x^grau ... x^0> (inteiro, sem divisão)
    const row = [];
    row.push(`L${k}`);  // rótulo
    row.push(mult);     // "Mult" => y_k/denom
    // Ajustar numerador para ter grau=grau => length=grau+1
    const numerResized = polyResize(numerador, grau + 1);
    // Adiciona colunas x^grau..ind
    for (let c = 0; c < numerResized.length; c++) {
      row.push(numerResized[c]);
    }
    tabela.push(row);

    // 3.5) Para formar P(x), somamos "Mult * numerador"
    const parcial = polyScale(numerResized, mult);
    P_final = polyAdd(P_final, parcial);
  }

  // 4) Linha final: "P(x)" e seus coeficientes
  const sumRow = ["P(x)", ""];
  for (let i = 0; i < P_final.length; i++) {
    sumRow.push(P_final[i]);
  }
  tabela.push(sumRow);

  //------------------------------------------------------------------
  // Retorna tabela
  //------------------------------------------------------------------
  return tabela;
}
