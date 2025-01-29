/**
 * Constrói a Tabela de Diferenças Finitas para pontos igualmente espaçados
 * e exibe o polinômio resultante (em forma expandida).
 *
 * @param {A2:B?} rng   Intervalo com 2 colunas: X e f(X).
 * @return {Array[]}    Matriz (linhas × colunas) contendo:
 *    - A tabela de diferenças (em formato triangular),
 *    - Uma linha final com o polinômio expandido.
 *
 * Ex. de uso (PT-BR):  =FORWARD_DIFFERENCES(A1:B4)
 * Se estiver em planilha EN-US use vírgula: =FORWARD_DIFFERENCES(A1:B4)
 */
function FORWARD_DIFFERENCES(rng) {
  //-----------------------------------------------------------
  // 1) Ler pontos (x_i, f_i) e checar espaçamento constante
  //-----------------------------------------------------------
  if (!Array.isArray(rng) || rng.length === 0) {
    throw new Error("Informe pelo menos uma linha e duas colunas (x,y).");
  }
  const xs = [];
  const ys = [];
  for (let i = 0; i < rng.length; i++) {
    if (rng[i].length < 2) {
      throw new Error("Cada linha deve ter ao menos 2 colunas (x,f(x)).");
    }
    xs.push(Number(rng[i][0]));
    ys.push(Number(rng[i][1]));
  }
  const n = xs.length;
  if (n < 2) {
    throw new Error("São necessários pelo menos 2 pontos.");
  }

  // Verificar se o espaçamento é constante
  const h = xs[1] - xs[0];
  for (let i = 2; i < n; i++) {
    const diff = xs[i] - xs[i - 1];
    // Toleramos alguma variação minúscula de ponto flutuante
    if (Math.abs(diff - h) > 1e-12) {
      throw new Error("Os pontos não parecem igualmente espaçados; método não se aplica.");
    }
  }

  //-----------------------------------------------------------
  // 2) Montar tabela de diferenças finitas (forward differences)
  //-----------------------------------------------------------
  // diffs[k][i] = k-ésima diferença iniciando no ponto i
  // Ex.: diffs[0][i] = f(x_i) (coluna "0"), 
  //       diffs[1][i] = diffs[0][i+1] - diffs[0][i], etc.
  const diffs = [];
  // A primeira coluna (k=0) são os próprios valores de f(x_i)
  diffs[0] = ys.map(v => parseFloat(v.toFixed(6)));

  // k = índice da coluna de diferenças
  for (let k = 1; k < n; k++) {
    diffs[k] = [];
    for (let i = 0; i < n - k; i++) {
      const val = diffs[k - 1][i + 1] - diffs[k - 1][i];
      diffs[k][i] = parseFloat(val.toFixed(6));
    }
  }

  //-----------------------------------------------------------
  // 3) Preparar a "tabela triangular" no estilo da figura
  //-----------------------------------------------------------
  // Colunas: [ x, f(x), Δ^1 y, Δ^2 y, ... Δ^(n-1) y ]
  // Cada linha i mostra: x_i, f(x_i), diffs[1][i], diffs[2][i], ...
  // Se i+k >= n, esse campo fica vazio.
  const header = ["x", "f(x)"];
  for (let k = 1; k < n; k++) {
    header.push(`Δ^${k} y`);
  }
  const tableRows = [header];

  for (let i = 0; i < n; i++) {
    const row = [];
    row.push(xs[i]);        // x_i
    row.push(diffs[0][i]);  // f(x_i) == diffs[0][i]
    for (let k = 1; k < n; k++) {
      if (i + k < n) row.push(diffs[k][i]);
      else row.push("");
    }
    tableRows.push(row);
  }

  //-----------------------------------------------------------
  // 4) Construir o polinômio de Newton (Forward) e expandi-lo
  //-----------------------------------------------------------
  // P(x) = diffs[0][0]
  //      + diffs[1][0]*( (x - x_0)/1!h )
  //      + diffs[2][0]*( (x - x_0)((x - x_0)-h) ) / (2! h^2)
  //      + ...
  //
  // Faremos a expansão em forma de polinômio: a_0 + a_1 x + a_2 x^2 + ...
  // usando operações de polinômios em arrays de coeficientes.

  // Funções auxiliares para polinômios em ordem decrescente:
  //   ex.: [2, -1, 3] => 2x^2 - 1x + 3
  function polyZero(g) {
    return Array(g + 1).fill(0);
  }
  function polyAdd(A, B) {
    return A.map((val, idx) => parseFloat((val + B[idx]).toFixed(6)));
  }
  function polyScale(A, c) {
    return A.map(val => parseFloat((val * c).toFixed(6)));
  }
  // Multiplica polinômios A e B
  function polyMul(A, B) {
    const R = Array(A.length + B.length - 1).fill(0);
    for (let i = 0; i < A.length; i++) {
      for (let j = 0; j < B.length; j++) {
        R[i + j] += A[i] * B[j];
      }
    }
    return R.map(x => parseFloat(x.toFixed(6)));
  }

  // Montar cada termo k:
  //   (x - x_0)(x - (x_0+h))...(x - (x_0+(k-1)*h))
  //   -------------------------------------------
  //         k! * (h^k)
  //
  // Em array de coef. decrescente.
  // E então multiplicar pelo diffs[k][0].
  const grauFinal = n - 1;
  let poly = polyZero(grauFinal); // soma final

  // polinômio "1" (grau 0)
  function poly1() { return [1]; }

  // constrói (x - (x0 + j*h)) em ordem decrescente: [1, -(x0+j*h)]
  function buildLinearFactor(x0, j, h) {
    return [1, - (x0 + j * h)];
  }

  // fatorial
  function factorial(m) {
    let r = 1;
    for (let i = 2; i <= m; i++) r *= i;
    return r;
  }

  const x0 = xs[0]; // primeiro ponto
  for (let k = 0; k < n; k++) {
    // diffs[k][0] não existe para k>=n => safe pois k<n
    // mas note que k=0 => Δ^0 y_0 = f(x0). Esse termo é só a constante f(x0).
    const delta = diffs[k][0]; 
    // Constrói polinômio do numerador (x - x0)(x - (x0+h))...(k fatores)
    let numeratorPoly = poly1();
    for (let j = 0; j < k; j++) {
      const factor = buildLinearFactor(x0, j, h);
      numeratorPoly = polyMul(numeratorPoly, factor);
    }
    // divide por (k! * h^k)
    const denom = factorial(k) * Math.pow(h, k);
    const scale = delta / denom;
    const termPoly = polyScale(numeratorPoly, scale);

    // somar ao polinômio final
    // Mas precisamos que poly e termPoly tenham mesmo grau (grauFinal).
    // Se 'termPoly' tem grau k, length k+1, precisamos redimensionar p/ grauFinal+1
    function polyResize(p, newLen) {
      const diff = newLen - p.length;
      if (diff > 0) {
        // insere zeros no início (ordem decrescente)
        return Array(diff).fill(0).concat(p);
      }
      return p;
    }
    const bigTerm = polyResize(termPoly, grauFinal + 1);
    poly = polyAdd(poly, bigTerm);
  }

  // poly agora é o polinômio expandido em ordem decrescente: 
  //    poly[0]*x^grauFinal + poly[1]*x^(grauFinal-1) + ...

  //-----------------------------------------------------------
  // 5) Converter esse polinômio em string (ex.: "1.000x^3 + ...")
  //-----------------------------------------------------------
  function polyToString(P) {
    const g = P.length - 1;  // grau
    let s = "";
    for (let i = 0; i < P.length; i++) {
      const coef = P[i];
      const e = g - i; // expoente
      if (Math.abs(coef) < 1e-12) continue; // pula ~0
      // Formata sinal
      let coefStr = coef.toFixed(6);
      if (coef >= 0 && s.length > 0) {
        coefStr = "+" + coefStr;
      }
      // Anexa x^e (se e>0), ou só o coef (se e=0)
      if (e > 1) {
        s += coefStr + "x^" + e + " ";
      } else if (e === 1) {
        s += coefStr + "x ";
      } else {
        s += coefStr + " ";
      }
    }
    return s.trim();
  }
  const polyStr = polyToString(poly);

  //-----------------------------------------------------------
  // 6) Acrescentar linha final à nossa tabela com o polinômio
  //-----------------------------------------------------------
  tableRows.push(["Polinômio", polyStr]);

  return tableRows;
}
