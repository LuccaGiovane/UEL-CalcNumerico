## Como usar os scripts:
1. **Abra o google sheets [Link](https://docs.google.com/spreadsheets/)**
<img src="https://github.com/LuccaGiovane/UEL-CalcNumerico/blob/main/img-tutorial/passo%201.png" alt="Passo 1" width="800">

2. **Clique em** *Extensões > Apps Scripts*
<img src="https://github.com/LuccaGiovane/UEL-CalcNumerico/blob/main/img-tutorial/passo%202.png" alt="Passo 2" width="800">

3. **Cole o código do arquivo escolhido**
<img src="https://github.com/LuccaGiovane/UEL-CalcNumerico/blob/main/img-tutorial/passo%203.png" alt="Passo 3" width="800">

4. **Caso queira por mais arquivos basta criar mais clicando em:** *+ > Script*
<img src="https://github.com/LuccaGiovane/UEL-CalcNumerico/blob/main/img-tutorial/passo%204.png" alt="Passo 4" width="800">

## Prova 1
### [Fatoração LU](https://github.com/LuccaGiovane/UEL-CalcNumerico/blob/main/Prova%201/LU.gs)
=LU(intervalo NxN)

- **Parâmetros**<br>
  - matriz: Intervalo ou array representando uma matriz quadrada (NxN) com valores numéricos.

- **Saída**<br> 
  - A Matriz L (à esquerda) com os multiplicadores da Eliminação de Gauss na parte inferior e 1's na diagonal principal.
  - A Matriz U (à direita) com os coeficientes resultantes da eliminação na parte superior.
  - Todos os valores são arredondados para 6 casas decimais.


## Prova 2

### [CAUCHY_COTA](https://github.com/LuccaGiovane/UEL-CalcNumerico/blob/main/Prova%202/Cauchy.gs)
=CAUCHY_COTA(polinomio; iteracoes)<br>

- **Parâmetros**<br>
  - polinomio: Intervalo ou array contendo os coeficientes do polinômio em ordem decrescente de grau.
    - Exemplo: {1, 1, 5, -4, -4} representa o polinômio 1x⁴ + 1x³ + 5x² - 4x - 4.
    - Deve ter pelo menos dois coeficientes.
  -iteracoes: Número inteiro maior ou igual a 1, indicando quantas iterações serão feitas para calcular a cota de Cauchy.<br>

- **Saída**<br>
A função retorna uma tabela com duas colunas:<br>
  - i: O índice da iteração (começando de 0).
  - x: O valor calculado para a Cota de Cauchy na iteração correspondente.
 
### [CHEBYSHEV](https://github.com/LuccaGiovane/UEL-CalcNumerico/blob/main/Prova%202/Chebyshev.gs)
=CHEBYSHEV(polinomio; x0; iteracoes)<br>

- **Parâmetros**
  - polinomio: Intervalo ou array contendo os coeficientes do polinômio em ordem decrescente de grau.
    - Exemplo: {2, -5, 3} representa o polinômio 2x² - 5x + 3.
    - Deve ter pelo menos dois coeficientes.
  - x0: Chute inicial para o método iterativo.
    - Deve ser um número real.
  - iteracoes: Número inteiro maior ou igual a 1, indicando quantas iterações do método devem ser executadas.<br>

- **Saída**
  - A função retorna uma tabela com cinco colunas:

    - i: O índice da iteração (começando de 0).
    - x: O valor da aproximação na iteração correspondente.
    - f(x): O valor do polinômio avaliado em x.
    - f'(x): O valor da derivada primeira do polinômio avaliada em x.
    - f''(x): O valor da derivada segunda do polinômio avaliada em x.
   
### [FALSE POSITION](https://github.com/LuccaGiovane/UEL-CalcNumerico/blob/main/Prova%202/False%20position.gs)
=FALSE_POSITION(polinomio; a; b; iteracoes)<br>

- **Parâmetros**
  - polinomio: Intervalo ou array contendo os coeficientes do polinômio em ordem decrescente de grau.
    - Exemplo: {1, -5, 6} representa o polinômio 1x² - 5x + 6.
    - Deve ter pelo menos dois coeficientes.
  - a: Extremo esquerdo do intervalo [a, b].
    - Deve ser um número real.
    - Importante: f(a) * f(b) deve ser menor que 0, ou seja, a e b devem conter uma raiz entre eles.
  - b: Extremo direito do intervalo [a, b].
    - Deve ser um número real.
    - Deve satisfazer a condição f(a) * f(b) < 0.
  - iteracoes: Número inteiro maior ou igual a 1, indicando quantas iterações do método devem ser executadas.<br>

- **Saída**
  - A função retorna uma tabela com sete colunas:
  
    - i: O índice da iteração.
    - a: Valor atual do extremo esquerdo do intervalo.
    - f(a): O valor do polinômio avaliado em a.
    - b: Valor atual do extremo direito do intervalo.
    - f(b): O valor do polinômio avaliado em b.
    - xm: Ponto médio calculado pela Regula Falsi.
    - f(xm): O valor do polinômio avaliado em xm.

### [FORWARD DIFFERENCES](https://github.com/LuccaGiovane/UEL-CalcNumerico/blob/main/Prova%202/Finite%20diff.gs)
=FORWARD_DIFFERENCES(rng)<br>

- **Parâmetros**
  - rng: Intervalo contendo duas colunas:
    - Coluna 1 (x): Valores de x igualmente espaçados.
    - Coluna 2 (f(x)): Valores correspondentes da função f(x).
    - Deve haver pelo menos dois pontos.
   
- **Saída**
  - A função retorna uma matriz contendo:
    
    - A tabela de diferenças finitas, organizada no formato triangular.
    - Uma linha final com o polinômio interpolador expandido.
   
### [LAGRANGE INTERP](https://github.com/LuccaGiovane/UEL-CalcNumerico/blob/main/Prova%202/Lagrange%20interp.gs)
=LAGRANGE_INTERP(pontos; iter)<br>

- **Parâmetros**
  - pontos: Intervalo contendo duas colunas:
    - Coluna 1 (x): Valores de x.
    - Coluna 2 (y): Valores correspondentes de f(x).
    - Deve haver pelo menos dois pontos.
  - iter (opcional): Este parâmetro não é utilizado na função, mas é mantido para compatibilidade com outras funções.

- **Saída**
  - A função retorna uma matriz contendo:

    - Os polinômios base de Lagrange L_k(x), mostrando:
    - O multiplicador Mult = (y_k / PROD_{j!=k}(x_k - x_j)) como um valor decimal.
    - O numerador Numerador_k em formato expandido, antes da divisão pelo denominador.
    - Uma linha final com o polinômio interpolador P(x), expandido na forma padrão.
   
### [NEWTON RAPHSON](https://github.com/LuccaGiovane/UEL-CalcNumerico/blob/main/Prova%202/Newton%20Raphson.gs)
=NEWTON_RAPHSON(polinomio; x0; iteracoes)<br>

- **Parâmetros**
  - polinomio: Intervalo ou array contendo os coeficientes do polinômio em ordem decrescente de grau.
    - Exemplo: {1, -5, 6} representa o polinômio 1x² - 5x + 6.
    - Deve ter pelo menos dois coeficientes.
  - x0: Chute inicial para o método iterativo.
    - Deve ser um número real.
  - iteracoes: Número inteiro maior ou igual a 1, indicando quantas iterações do método devem ser executadas.

- **Saída**
  - A função retorna uma tabela com quatro colunas:

    - i: O índice da iteração (começando de 0).
    - x: O valor da aproximação na iteração correspondente.
    - f(x): O valor do polinômio avaliado em x.
    - f'(x): O valor da derivada do polinômio avaliada em x.

### [AITKEN](https://github.com/LuccaGiovane/UEL-CalcNumerico/blob/main/Prova%202/aitken.gs)
=AITKEN(INTERVALO:x; INTERVALO:Y)
- **Parâmetros**
  - Coluna 1 (x): valores de x.
  - Coluna 2 (y): Valores correspondentes de f(x).
- **Saída**
  - A função retorna uma matriz contendo:

    - Os polinômios intermediários p0j, p01j, p012j etc:
    - O polinômio final da interpolação na ultima coluna da tabela.


## Prova 3

### [RIEMANN](https://github.com/LuccaGiovane/UEL-CalcNumerico/blob/main/Prova%203/Riemann.gs)
=RIEMANN_SUM(INDICES; LIM INFERIOR; LIM SUPERIOR; NUM PARTIÇOES)
- **Parâmetros**
  - INTERVALO: indices do polinomio ex: x^3 - x + 3 => 1 0 -1 3 (um numero por célula).
  - LIM INFERIOR: limite inferior da integral.
  - LIM SUPERIOR: limite superior da integral.
  - NUM PARTIÇÕES: número de partições desejadas.

- **Saída**
  - A função retorna:
    - Soma de Riemann.
    - Valor da norma.
    - Largura de cada subintervalo.

### [NORMA](https://github.com/LuccaGiovane/UEL-CalcNumerico/blob/main/Prova%203/PartitionNorm.gs)
=PARTITION_NORM(PONTOS)
- **Parâmetros**
  - PONTOS: conjunto de N pontos para calcular

- **Saída**
  - A função retorna:
    - a norma da partição
    - o valor de delta para cada um dos pontos fornecidos

### [SIMPSON 1/3](https://github.com/LuccaGiovane/UEL-CalcNumerico/blob/main/Prova%203/Simpson%201-3.gs)
=SIMPSON_13(POLINOMIO; LIM INF; LIM SUP; INTERVALO)
- **Parâmetros**
  - POLINOMIO: polinomio dentro da integral que o professor der ex: "e^(2*x) * cos(x^2) / (sen(x) + 1)"
  - LIM INF: limite inferior da integral
  - LIM SUP: limite superior da integral
  - INTERVALO: numero de subintervalos (deve ser par)

- **Saída**
  - A função retorna:
    - O valor da Simpson 1/3

### [SIMPSON 3/8](https://github.com/LuccaGiovane/UEL-CalcNumerico/blob/main/Prova%203/Simpson%203-8.gs)
=SIMPSON_38(POLINOMIO; LIM INF; LIM SUP; INTERVALO)
- **Parâmetros**
  - POLINOMIO: polinomio dentro da integral que o professor der ex: "e^(2*x) * cos(x^2) / (sen(x) + 1)"
  - LIM INF: limite inferior da integral
  - LIM SUP: limite superior da integral
  - INTERVALO: numero de subintervalos (deve ser multiplo de 3)

- **Saída**
  - A função retorna:
    - O valor da Simpson 3/8  

### [ERRO ABSOLUTO](https://github.com/LuccaGiovane/UEL-CalcNumerico/blob/main/Prova%203/AbsError.gs)
=ERRO_ABSOLUTO(V1;V2)
- **Parâmetros**
  -V1: valor da solução EXATA!!! (sempre escrito a esquerda ou acima nas celulas)
  -V2: valor da solução APROXIMADA!!! (sempre escrito a direita ou abaixo nas celulas)
    - **A ordem de v1 v2 importa !!**, caso nao tenha entendido ex:
    - Valor exato: 3.5 ; Valor aproximado: 2,452371 ; na criação das celulas, o exato sempre acima ou a esquerda do aproximado: 
    Ex1 caso insira em uma linha: | 3.5 | 2,452371 | (V1 a "esquerda")
    Ex2 caso insira em uma coluna:
    | 3.5 |
    | :---- |
    | 2,452371 |
    - Valor exato nesse caso sempre acima!!

- **Saída**
  - A função retorna:
    - o valor do erro absoluto calculado pela formula:
    - Ea = abs[ (Ve - Va)/Ve]