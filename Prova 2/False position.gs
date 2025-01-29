/**
 * Aplica o Método da Falsa Posição (Regula Falsi) a um polinômio dado
 * por coeficientes em ordem decrescente de grau.
 * 
 * @param {range or Array} polinomio   Intervalo ou array [a_n, a_{n-1}, ..., a_0].
 * @param {number} a                   Extremo esquerdo do intervalo (f(a)*f(b) < 0).
 * @param {number} b                   Extremo direito do intervalo (f(a)*f(b) < 0).
 * @param {number} iteracoes           Número de iterações do método.
 * @return {Array<Array<any>>}         Tabela [i, a, f(a), b, f(b), xm, f(xm)].
 *
 * Exemplo de uso (planilha em PT-BR):
 *   =FALSE_POSITION(A1:A5; 0; 1; 5)
 * Para planilha em EN-US (vírgulas):
 *   =FALSE_POSITION(A1:A5, 0, 1, 5)
 */
function FALSE_POSITION(polinomio, a, b, iteracoes) {
  // 1) Converte os coeficientes do polinômio para array unidimensional de números
  const coefs = Array.isArray(polinomio)
    ? polinomio.flat().map(Number)
    : [Number(polinomio)];

  if (coefs.length < 2) {
    throw new Error("Forneça ao menos 2 coeficientes em ordem decrescente (ex.: [1, -5, 6]).");
  }
  if (typeof a !== "number" || typeof b !== "number") {
    throw new Error("a e b devem ser números.");
  }
  if (typeof iteracoes !== "number" || iteracoes < 1) {
    throw new Error("O número de iterações deve ser inteiro e >= 1.");
  }

  // 2) Define f(x): avalia o polinômio no ponto x
  //    coefs[0] = a_n, coefs[1] = a_{n-1}, ..., coefs[n] = a_0
  function f(x) {
    const grau = coefs.length - 1;
    let soma = 0;
    for (let i = 0; i <= grau; i++) {
      const expo = grau - i; // expoente
      soma += coefs[i] * Math.pow(x, expo);
    }
    return soma;
  }

  // 3) Checa se f(a)*f(b) < 0
  if (f(a) * f(b) >= 0) {
    throw new Error("f(a)*f(b) não é < 0; escolha outro intervalo [a,b] que contenha mudança de sinal.");
  }

  // 4) Monta a tabela de saída com cabeçalho
  const tabela = [["i", "a", "f(a)", "b", "f(b)", "xm", "f(xm)"]];

  // 5) Realiza as iterações
  let A = parseFloat(a.toFixed(6));
  let B = parseFloat(b.toFixed(6));

  for (let i = 1; i <= iteracoes; i++) {
    const fa = parseFloat(f(A).toFixed(6));
    const fb = parseFloat(f(B).toFixed(6));

    // Fórmula da Falsa Posição:
    //   x_m = [ a*f(b) - b*f(a) ] / [ f(b) - f(a) ]
    const xm = parseFloat(((A * fb - B * fa) / (fb - fa)).toFixed(6));
    const fxm = parseFloat(f(xm).toFixed(6));

    // Grava uma linha [i, a, f(a), b, f(b), xm, f(xm)]
    tabela.push([i, A, fa, B, fb, xm, fxm]);

    // Atualiza a ou b para manter f(a)*f(b) < 0
    if (fa * fxm < 0) {
      // Nova faixa é [a, xm]
      B = xm;
    } else {
      // Nova faixa é [xm, b]
      A = xm;
    }
  }

  // 6) Retorna a tabela resultante
  return tabela;
}
