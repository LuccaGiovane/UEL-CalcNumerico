/**
 * Aplica o método de Newton-Raphson a um polinômio dado por coeficientes
 * em ordem decrescente de grau.
 *
 * @param {range or Array} polinomio  Intervalo ou array [a_n, a_{n-1}, ..., a_0].
 * @param {number} x0                Chute inicial de x.
 * @param {number} iteracoes         Número de iterações.
 * @return {Array<Array<any>>}       Tabela com colunas [i, x, f(x), f'(x)].
 *
 * Exemplo de uso (PT-BR):
 *   =NEWTON_RAPHSON(A1:A5; 0; 5)
 * Se a planilha estiver em inglês (EN-US), use vírgulas:
 *   =NEWTON_RAPHSON(A1:A5, 0, 5)
 */
function NEWTON_RAPHSON(polinomio, x0, iteracoes) {
  // Garante que "polinomio" seja array unidimensional de números
  const coefs = Array.isArray(polinomio)
    ? polinomio.flat().map(Number)
    : [Number(polinomio)];

  if (coefs.length < 2) {
    throw new Error(
      "Forneça ao menos 2 coeficientes em ordem decrescente (ex.: [1, -5, 6])."
    );
  }
  if (typeof x0 !== "number") {
    throw new Error("O chute inicial x0 deve ser numérico.");
  }
  if (typeof iteracoes !== "number" || iteracoes < 1) {
    throw new Error("O número de iterações deve ser inteiro e >= 1.");
  }

  // Função para avaliar f(x)
  //  coefs[0] = a_n, coefs[1] = a_{n-1}, ..., coefs[n] = a_0
  //  f(x) = a_n x^n + a_{n-1} x^(n-1) + ... + a_0
  function f(x) {
    let s = 0;
    const grau = coefs.length - 1; // n
    for (let i = 0; i <= grau; i++) {
      const potencia = grau - i;     // expoente
      s += coefs[i] * Math.pow(x, potencia);
    }
    return s;
  }

  // Função para avaliar f'(x)
  //  f'(x) = n*a_n x^(n-1) + (n-1)*a_{n-1} x^(n-2) + ... + 1*a_1
  function df(x) {
    let s = 0;
    const grau = coefs.length - 1; // n
    for (let i = 0; i < grau; i++) {
      const potencia = grau - 1 - i;  // expoente depois de derivar
      const coefDerivado = (grau - i) * coefs[i];
      s += coefDerivado * Math.pow(x, potencia);
    }
    return s;
  }

  // Construímos a tabela de saída
  // Iniciamos com um cabeçalho
  const tabela = [["i", "x", "f(x)", "f'(x)"]];

  let xAtual = x0;

  // Iteramos de i=0 até "iteracoes" (inclusivo)
  // Observação: se preferir só "iteracoes" passos, faça i = 1..iteracoes
  for (let i = 0; i <= iteracoes; i++) {
    // Calcula f(x) e f'(x) no xAtual
    const fx = f(xAtual);
    const fpx = df(xAtual);

    // Arredonda a 6 casas para exibição (sem alterar a precisão interna ainda)
    const xRounded = parseFloat(xAtual.toFixed(6));
    const fxRounded = parseFloat(fx.toFixed(6));
    const fpxRounded = parseFloat(fpx.toFixed(6));

    // Adiciona a linha na tabela
    tabela.push([i, xRounded, fxRounded, fpxRounded]);

    // Se ainda não atingimos a última iteração, atualizamos x
    if (i < iteracoes) {
      // Evitar divisão por zero
      if (Math.abs(fpx) < 1e-15) {
        throw new Error("Derivada nula ou muito próxima de zero! Interrompendo.");
      }
      // x_{k+1} = x_k - f(x_k)/f'(x_k)
      const proximo = xAtual - fx / fpx;
      // Arredonda a 6 casas logo após o cálculo
      xAtual = parseFloat(proximo.toFixed(6));
    }
  }

  return tabela;
}
