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
 * Converte a string da expressão para uma expressão JavaScript,
 * tolerando espaços extras e tratando:
 *  - sen, cos, tan, ln
 *  - e^(x) para Math.exp(x)
 *  - O operador de potência (^) para Math.pow()
 *
 * Essa versão assume que o expoente é uma expressão simples, 
 * possivelmente envolvida por parênteses.
 *************************************************************/
function parseExpression(exprString) {
  let jsExpr = exprString;

  // Substituir funções trigonométricas e logaritmo (permitindo espaços)
  jsExpr = jsExpr.replace(/sen\s*\(/gi, "Math.sin(");
  jsExpr = jsExpr.replace(/cos\s*\(/gi, "Math.cos(");
  jsExpr = jsExpr.replace(/tan\s*\(/gi, "Math.tan(");
  jsExpr = jsExpr.replace(/\bln\s*\(/gi, "Math.log(");
  
  // Substituir exponencial: "e^(x)" ou "e^ ( x )" por Math.exp(x)
  jsExpr = jsExpr.replace(/e\^\s*\(/gi, "Math.exp(");
  
  // Converter o operador de potência ^ para Math.pow().
  // A regex a seguir captura:
  //   - Grupo 1: uma sequência de dígitos, letras, pontos, ou parêntese fechado.
  //   - "^" com possíveis espaços ao redor.
  //   - Grupo 2: uma expressão simples, que pode estar entre parênteses.
  jsExpr = jsExpr.replace(/([0-9a-zA-Z\)\.]+)\s*\^\s*(\(?[0-9a-zA-Z\+\-\*\/\.]+\)?)/g, "Math.pow($1,$2)");
  
  return jsExpr;
}

/*************************************************************
 * evaluateAt(exprString, xVal)
 * Substitui todas as ocorrências de "x" na expressão (já convertida)
 * pelo valor numérico xVal e avalia com eval().
 *************************************************************/
function evaluateAt(exprString, xVal) {
  // Cuidado: a substituição simples de "x" pode interferir em nomes de funções.
  // Para evitar problemas, substituímos "x" quando ela aparece como variável isolada.
  let safeExpr = exprString.replace(/\bx\b/g, "(" + xVal + ")");
  
  let result = eval(safeExpr);
  return round6(result);
}

/*************************************************************
 * SIMPSONS_13(expr, a, b, n)
 *
 * - expr: string com a expressão f(x), por exemplo, "sen(x^2) + e^(x)"
 * - a, b: limites de integração
 * - n: número de subintervalos (deve ser PAR)
 *
 * Retorna a aproximação da integral de f(x) no intervalo [a,b]
 * via Regra de Simpson 1/3, com 6 casas decimais.
 *
 * Exemplo de uso:
 *   =SIMPSONS_13("sen(x^2) + e^(x)", 0, 1, 6)
 *************************************************************/
function SIMPSON_13(expr, a, b, n) {
  // Converter os parâmetros
  a = round6(a);
  b = round6(b);
  n = parseInt(n, 10);

  // Verificar se n é par
  if (n % 2 !== 0) {
    return "Erro: n deve ser par para Simpson 1/3!";
  }

  // Converter a expressão para JavaScript
  let jsExpr = parseExpression(expr);

  // Calcular h
  let h = round6((b - a) / n);

  // Aplicar a fórmula de Simpson 1/3:
  // S = f(x0) + 4*f(x1) + 2*f(x2) + 4*f(x3) + ... + f(xn)
  let sum = 0.0;
  let x0 = a;
  sum = round6(sum + evaluateAt(jsExpr, x0));

  for (let k = 1; k < n; k++) {
    let xk = round6(a + round6(k * h));
    let fk = evaluateAt(jsExpr, xk);

    if (k % 2 === 1) {
      sum = round6(sum + round6(4.0 * fk));
    } else {
      sum = round6(sum + round6(2.0 * fk));
    }
  }

  let xn = b;
  sum = round6(sum + evaluateAt(jsExpr, xn));

  let result = round6(round6(h / 3.0) * sum);
  return parseFloat(result.toFixed(6));
}
