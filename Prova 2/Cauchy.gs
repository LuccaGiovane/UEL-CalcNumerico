/**
 * Itera a Cota de Cauchy de um polinômio e retorna uma tabela [i, x].
 *   polinomio: intervalo/array com coeficientes em ordem decrescente de grau
 *   iteracoes: número de iterações desejadas
 *
 * Exemplo de uso na planilha (supondo PT-BR):
 *   =CAUCHY_COTA(A1:A5; 5)
 * Se estiver em inglês (EN-US), use vírgulas:
 *   =CAUCHY_COTA(A1:A5, 5)
 */
function CAUCHY_COTA(polinomio, iteracoes) {
  // Garante que polinomio seja Array unidimensional de números
  const coefs = Array.isArray(polinomio)
    ? polinomio.flat().map(Number)
    : [Number(polinomio)];

  if (coefs.length < 2) {
    throw new Error(
      "Forneça ao menos 2 coeficientes em ordem decrescente (ex.: [1,1,5,-4,-4])."
    );
  }
  if (typeof iteracoes !== "number" || iteracoes < 1) {
    throw new Error("O número de iterações deve ser inteiro e >= 1.");
  }

  // coefs[0] = a_n  (coef. líder)
  // coefs[1] = a_{n-1}, ..., coefs[n] = a_0
  const a_n = coefs[0];
  if (a_n === 0) {
    throw new Error("O coeficiente líder (a_n) não pode ser zero.");
  }

  const n = coefs.length - 1; // grau do polinômio

  // Vetor para armazenar (i, x_i). Vamos incluir o cabeçalho também
  const tabela = [["i", "x"]];
  
  // x_0 = 0 conforme solicitado
  let xAnterior = 0;
  tabela.push([0, xAnterior]); // linha inicial

  // Itera de 1 até "iteracoes"
  for (let i = 1; i <= iteracoes; i++) {
    let soma = 0;
    // Somatório: para cada termo a_j, j=1..n => a_{n-j}, x_{i-1}^{(n-j)}
    // No array "coefs", a_j está em coefs[j].
    // Ex.: se n=4, coefs = [a4, a3, a2, a1, a0], j=1->a3, j=2->a2, j=3->a1, j=4->a0
    for (let j = 1; j <= n; j++) {
      const a_j = coefs[j];           // coeficiente a_{n-j}
      const expo = n - j;            // grau a aplicar em x_{i-1}
      soma += Math.abs(a_j / a_n) * Math.pow(Math.abs(xAnterior), expo);
    }
    // Fecha a expressão e tira a raiz n
    const xAtual = Math.pow(soma, 1 / n);

    // Arredonda para 6 casas decimais
    const xArred = parseFloat(xAtual.toFixed(6));

    // Prepara para a próxima iteração e armazena no resultado
    xAnterior = xArred;
    tabela.push([i, xArred]);
  }

  // Retorna a matriz (que o Google Sheets expande em linhas e colunas)
  return tabela;
}
