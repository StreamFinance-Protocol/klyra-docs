---
sidebar_position: 1
description: ¿Qué son los contratos perpetuals?
---

# Introducción a los Perpetuals

## Introductoria
Los productos financieros se pueden dividir fundamentalmente en dos categorías amplias: productos al spot y productos derivados.

### Productos al Spot
Los productos al spot tratan con el activo subyacente real: cuando posees un producto al spot, posees el activo en sí. El ejemplo más simple es un intercambio entre dos activos: si tengo BTC y quiero USDC, poseo el BTC real antes del intercambio y el USDC real después.

### Productos Derivados
Los productos derivados son herramientas financieras que derivan su valor de un activo subyacente sin requerir su propiedad. Cuando posees un producto derivado, no posees el activo subyacente. Los derivados se estructuran como un acuerdo mutuo entre dos partes. Por ejemplo, supongamos que Alice piensa que el precio de BTC aumentará y Bob piensa que caerá. Alice y Bob acuerdan que por cada aumento de \$100 en el precio de BTC, Bob le pagará a Alice \$500 (y viceversa si el precio cae). Este contrato deriva su valor del precio de BTC, pero no implica poseer BTC.

Un derivado común es un Contrato de Futuros perpetuals (o "perp" para abreviar). Los Perps permiten a los operadores usar apalancamiento, lo que significa que pueden controlar una posición más grande de lo que su capital disponible normalmente permitiría. Al operar un perp, un operador puede estar en una posición larga o corta:

1. **Larga**: El operador obtiene ganancias cuando el precio del activo subyacente aumenta.
2. **Corta**: El operador obtiene ganancias cuando el precio del activo subyacente disminuye.

### Ejemplo de Perp
Supongamos que tienes \$1,000. Con un perp, puedes controlar \$10,000 en BTC usando solo tus \$1,000. En otras palabras, tienes una exposición de $10,000 en BTC. Esto se llama "apalancamiento 10x" porque tu poder de negociación se multiplica por 10.

Así es como funciona:
- Si el precio de BTC sube de \$50,000 a \$55,000 (un aumento del 10%):
  - Con un perp: Tu posición de \$10,000 gana \$1,000 (10% de \$10,000)
  - Con spot: Tus \$1,000 en BTC solo ganarían \$100 (10% de \$1,000)

Esto muestra cómo los perps pueden multiplicar tanto las ganancias COMO las pérdidas según la cantidad de apalancamiento (10x en este ejemplo). Esto hace que los perps sean más arriesgados, pero potencialmente más rentables que comprar el activo directamente.

Recuerda: Cuando operas un perp, nunca posees el BTC real, es solo un acuerdo entre operadores que sigue el precio de BTC. Piénsalo como una forma de operar con más poder adquisitivo del que realmente tienes.

## Avanzado
Ahora que entendemos por qué existen los perps—para proporcionar apalancamiento para mantener posiciones largas o cortas sin requerir la propiedad del activo—exploremos los mecanismos que los hacen funcionar.

### Tasas de Financiamiento
La primera gran pregunta abierta es cómo el precio de un perp sigue el precio del activo subyacente. Las tasas de financiamiento resuelven esto incentivando a los operadores a alinear el precio del perp con el precio subyacente. Son pagos periódicos entre operadores largos y cortos, basados en la diferencia entre el precio del perp y el precio reportado por el [oráculo](./oracle.md) del activo subyacente.

Cómo funciona:
- Si el precio del perp está **por encima** del precio subyacente, los operadores largos pagan financiamiento a los operadores cortos.
- Si el precio del perp está **por debajo** del precio subyacente, los operadores cortos pagan financiamiento a los operadores largos.

La tasa de financiamiento por lo tanto crea incentivos para corregir el precio del perp:
- Si el perp está **por encima** del precio del activo subyacente, los cortos ganan financiamiento y los largos pagan financiamiento. Esto incentiva a los operadores a:
  1. Abrir posiciones cortas (haciendo bajar el precio)
  2. Cerrar posiciones largas (haciendo bajar aún más el precio)
- Si el perp está **por debajo** del precio del activo subyacente, los largos ganan financiamiento y los cortos pagan financiamiento. Esto incentiva a los operadores a:
  1. Abrir posiciones largas (haciendo subir el precio)
  2. Cerrar posiciones cortas (haciendo subir aún más el precio)

La magnitud de la tasa de financiamiento crece con la desviación entre el precio del perp y el precio subyacente, aumentando los incentivos para operar y realinear ambos precios. En Klyra, las tasas de financiamiento se pagan cada hora.

Para detalles sobre cómo se calculan las tasas de financiamiento, consulta [aquí](./funding-rates.md). Por ahora, entiende las tasas de financiamiento como un mecanismo que mantiene el precio del perp estrechamente vinculado al activo subyacente.

### Colateral
El colateral (a veces también llamado margen) es el capital que un operador deposita para respaldar sus posiciones en un intercambio perpetual. Determina el poder de compra de un operador, que es un múltiplo de la cantidad de colateral según el apalancamiento. Por ejemplo, con un apalancamiento de 10x, un operador puede controlar una posición que vale 10 veces su colateral.

Por qué el Colateral es Importante:
- El colateral asegura que un operador que incurre en pérdidas (también llamadas PNL negativa, que significa "ganancias y pérdidas") tenga suficientes fondos para cubrir las ganancias de su contraparte. En una operación, las contrapartes (por ejemplo, Alice y Bob, uno largo y uno corto) efectivamente "ganan" o "pierden" el colateral del otro según el movimiento del precio.

Apalancamiento y Riesgo:
- Un apalancamiento más alto aumenta el riesgo porque la PNL se amplifica por el múltiplo de apalancamiento. Por ejemplo, con apalancamiento 20x, un pequeño movimiento adverso del precio puede agotar rápidamente el colateral de un operador. Un apalancamiento menor (por ejemplo, 2x) proporciona más margen frente a las fluctuaciones del precio, reduciendo el riesgo de perder todo el colateral.

En resumen, el colateral asegura la integridad del sistema de negociación protegiendo los pagos a las contrapartes y alineando el riesgo con el tamaño de la posición.

### Liquidaciones
En su núcleo, los perps son un acuerdo entre dos partes, ¿qué sucede cuando el precio se mueve y el colateral de un operador se agota hasta llegar a cero? Vamos a usar un ejemplo:

Alice y Bob abren un perp entre sí, con Alice en largo de BTC y Bob en corto de BTC. El precio de BTC sube hasta que las pérdidas de Bob igualan su colateral. Una solución simple sería cerrar ambas posiciones: el colateral de Bob se enviaría a Alice y ambos traders saldrían de sus posiciones.

Sin embargo, esto crea una mala experiencia para Alice: ¿y si no quería cerrar su posición? Por esto, Klyra implementa liquidaciones, que transfieren la posición de Bob a un nuevo operador. En lugar de cerrar la posición de Alice, ella obtiene una nueva contraparte mientras solo Bob es obligado a salir (ya que no tiene más colateral para cubrir posibles pérdidas).

Las liquidaciones aseguran la solvencia del intercambio al prevenir colateral negativo. Si un operador tuviera colateral negativo, su contraparte tendría ganancias que no podrían ser pagadas. Una clave de Klyra es que el PNL neto total debe ser cero (es decir, si alguien gana \$X, otro operador debe perder \$X). Para prevenir escenarios de colateral negativo, las liquidaciones ocurren justo antes de que el colateral de un operador llegue a cero, dando tiempo al intercambio para encontrar una nueva contraparte.

Encuentra exactamente cómo funcionan las liquidaciones en Klyra [aquí](./liquidations.md).