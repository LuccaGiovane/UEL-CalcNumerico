/**
 * Aplica a fórmula de terceira ordem (Halley/Chebyshev) a um polinômio
 * f(x) = a_n x^n + ... + a_0 em ordem decrescente de grau.
 *
 * A iteração é:
 *   x_{k+1} = x_k - [ 2 f(x_k) f'(x_k) ] / [ 2 (f'(x_k))^2 - f(x_k) f''(x_k) ].
 *
 * @param {range or Array} polinomio   Ex.: A1:A4 = [a3,a2,a1,a0].
 * @param {number} x0                 Chute inicial.
 * @param {number} iteracoes          Quantas iterações executar.
 * @return {Array<Array<any>>}        Tabela [i, x, f(x), f'(x), f''(x)].
 *
 * Exemplo (PT-BR):
 *   =CHEBYSHEV(A1:A4; -1; 5)
 * (Se a planilha for EN-US, use vírgulas).
 */
function CHEBYSHEV(polinomio, x0, iteracoes) {
  // 1) Ler coeficientes como array unidimensional:
  let coefs = Array.isArray(polinomio)
    ? polinomio.flat().map(Number)
    : [Number(polinomio)];

  if (coefs.length < 2) {
    throw new Error("Precisa pelo menos 2 coeficientes em ordem decrescente (ex.: [2, -5, 3]).");
  }
  if (typeof x0 !== "number") {
    throw new Error("x0 deve ser um número.");
  }
  if (typeof iteracoes !== "number" || iteracoes < 1) {
    throw new Error("iteracoes deve ser inteiro >= 1.");
  }

  const n = coefs.length - 1; // grau do polinômio

  // f(x)
  function f(x) {
    let s = 0;
    for (let i = 0; i <= n; i++) {
      s += coefs[i] * Math.pow(x, n - i);
    }
    return s;
  }
  // f'(x)
  function f1(x) {
    let s = 0;
    for (let i = 0; i < n; i++) {
      const expo = n - i; 
      s += expo * coefs[i] * Math.pow(x, expo - 1);
    }
    return s;
  }
  // f''(x)
  function f2(x) {
    let s = 0;
    for (let i = 0; i < n - 1; i++) {
      const expo = n - i;
      s += expo * (expo - 1) * coefs[i] * Math.pow(x, expo - 2);
    }
    return s;
  }

  // 2) Construir a tabela: [i, x, f(x), f'(x), f''(x)]
  const table = [["i", "x", "f(x)", "f'(x)", "f''(x)"]];

  let xAtual = x0;
  for (let i = 0; i <= iteracoes; i++) {
    const fx = f(xAtual);
    const f1x = f1(xAtual);
    const f2x = f2(xAtual);

    table.push([i, xAtual.toFixed(6), fx.toFixed(6), f1x.toFixed(6), f2x.toFixed(6)]);

    if (i < iteracoes) {
      // Evitar divisão por zero ou derivada nula
      if (Math.abs(f1x) < 1e-15) {
        throw new Error("f'(x) ~ 0; não é possível prosseguir.");
      }
      const termo1 = fx / f1x;
      const termo2 = 0.5 * (termo1 ** 2) * (f2x / f1x);
      const passo = termo1 + termo2;
      xAtual = parseFloat((xAtual - passo).toFixed(6));
    }
  }

  return table;
}
