/*************************************************************
 * round6(value)
 * Arredonda qualquer número para 6 casas decimais e retorna
 * como Number (parseFloat).
 *************************************************************/
function round6(value) {
  var val = parseFloat(value);
  return parseFloat(val.toFixed(6));
}

/*************************************************************
 * parseExpression(exprString)
 * Converte a string da expressão para JavaScript, tolerando
 * espaços extras e tratando:
 *   - sen, cos, tan, ln
 *   - e^(x) => Math.exp(x)
 *   - operador de potência ^ => Math.pow(...)
 *************************************************************/
function parseExpression(exprString) {
  let jsExpr = exprString;

  // Substituir funções trigonométricas e log
  jsExpr = jsExpr.replace(/sen\s*\(/gi, "Math.sin(");
  jsExpr = jsExpr.replace(/cos\s*\(/gi, "Math.cos(");
  jsExpr = jsExpr.replace(/tan\s*\(/gi, "Math.tan(");
  jsExpr = jsExpr.replace(/\bln\s*\(/gi, "Math.log(");

  // Substituir e^(...) por Math.exp(...)
  jsExpr = jsExpr.replace(/e\^\s*\(/gi, "Math.exp(");

  // Converter ^ para Math.pow(...)
  jsExpr = jsExpr.replace(
    /([0-9a-zA-Z\)\.]+)\s*\^\s*(\(?[0-9a-zA-Z\+\-\*\/\.]+\)?)/g,
    "Math.pow($1,$2)"
  );

  return jsExpr;
}

/*************************************************************
 * evaluateAt(exprString, xVal)
 * Substitui "x" pelo valor xVal e avalia a expressão via eval().
 *************************************************************/
function evaluateAt(exprString, xVal) {
  // Substituir x isolado
  let safeExpr = exprString.replace(/\bx\b/g, "(" + xVal + ")");
  let result = eval(safeExpr);
  return round6(result);
}

/*************************************************************
 * SIMPSONS_38(expr, a, b, n)
 *
 * - expr: string com a expressão f(x), p. ex.: "sen(x^2) + e^(x)"
 * - a, b: limites de integração
 * - n: número de subintervalos (DEVE ser múltiplo de 3)
 *
 * Retorna a aproximação da integral de f(x) no intervalo [a,b]
 * via Regra de Simpson 3/8, com 6 casas decimais.
 *
 * Exemplo de uso:
 *   =SIMPSONS_38("sen(x^2) + e^(x)"; 0; 1; 6)
 *************************************************************/
function SIMPSON_38(expr, a, b, n) {
  // 1) Converter parâmetros
  a = round6(a);
  b = round6(b);
  n = parseInt(n, 10);

  // 2) Verificar se n é múltiplo de 3
  if (n % 3 !== 0) {
    return "Erro: n deve ser múltiplo de 3 para Simpson 3/8!";
  }

  // 3) Converter a expressão para JS
  let jsExpr = parseExpression(expr);

  // 4) Calcular h
  let h = round6((b - a) / n);

  // 5) Soma principal:
  //    S = f(x0) + Σ [ coeficiente(i)*f(xi) ] + f(xn)
  // Onde coeficiente(i) = 3 se i % 3 != 0, caso contrário 2,
  // e x0=a, xn=b.
  let sum = 0.0;
  let x0 = a;
  sum = round6(sum + evaluateAt(jsExpr, x0));

  for (let k = 1; k < n; k++) {
    let xk = round6(a + round6(k * h));
    let fk = evaluateAt(jsExpr, xk);

    // Se k % 3 == 0 => coef = 2
    // senão => coef = 3
    let coef = (k % 3 === 0) ? 2.0 : 3.0;
    sum = round6(sum + round6(coef * fk));
  }

  let xn = b;
  sum = round6(sum + evaluateAt(jsExpr, xn));

  // 6) Multiplica por 3h/8
  let result = round6(round6(3.0 * h / 8.0) * sum);

  // Retorna com 6 casas decimais
  return parseFloat(result.toFixed(6));
}
