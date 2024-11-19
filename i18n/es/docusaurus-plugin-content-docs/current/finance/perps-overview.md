---
sidebar_position: 1
description: ¿Qué son los contratos perpetuals?
---

# Introducción a los Perpetuals

## Introductoria
Los productos financieros se pueden dividir fundamentalmente en dos categorías amplias: productos al contado y productos derivados.

### Productos al Contado
Los productos al contado tratan con el activo subyacente real; en otras palabras, cuando posees un producto al contado, posees el activo real. El ejemplo más simple de un producto al contado es un intercambio entre dos activos. Supongamos que tengo BTC y quiero USDC. Cuando cambio el BTC por USDC, poseo el activo real de BTC antes del intercambio, y después del intercambio poseo el activo real de USDC.

### Productos Derivados
Por otro lado, los productos derivados son herramientas financieras que derivan su valor de un activo subyacente. Aunque derivan su valor de un activo subyacente, cuando posees un producto derivado, no posees el activo subyacente. Los derivados están estructurados como un acuerdo mutuo entre dos partes. Por ejemplo, supongamos que Alice cree que el precio de BTC subirá y Bob cree que bajará. Alice y Bob crean un acuerdo en el que por cada \\$100 que suba el precio de BTC, Bob le pagará a Alice \\$500, y lo inverso si el precio baja. Ahora Alice y Bob tienen un contrato (el derivado) cuyo valor deriva del precio subyacente de BTC, pero no requiere la propiedad del activo de ninguna manera.

Un tipo común de derivado es un contrato de futuros perpetuos, o "perps" en corto. Es un tipo de producto derivado que permite operar un activo con apalancamiento. Operar con apalancamiento significa que obtienes más exposición al activo subyacente de lo que tienes en dinero. Cuando compras un perp, tienes dos opciones: ir largo o corto en el activo. Ir largo en el activo significa que el trader gana dinero cuando el precio del activo subyacente aumenta. Ir corto significa que el trader gana dinero cuando el precio del activo subyacente disminuye.

### Ejemplo de Perp
Supongamos que tienes \\$1,000. Con un perp, puedes obtener, por ejemplo, exposición a BTC por \\$10,000 (simular las ganancias y pérdidas de una posición de \\$10,000) con solo \\$1,000. A esto lo llamarías estar apalancado 10x. Entonces, las ganancias o pérdidas se multiplican por 10 en este ejemplo. Si el precio de BTC es \\$50,000 cuando compras el perp (suponiendo que vas largo), y luego el precio de BTC sube a \\$55,000 (+10%), entonces tu ganancia es \\$1,000. En cambio, si solo hubieras comprado BTC al contado y no el perp, solo habrías poseído \\$1,000 de BTC y tu ganancia sería de \\$100. Así que cuando estás largo 10x, las ganancias o pérdidas se multiplican por 10.

En consecuencia, los perps son más riesgosos, pero también más recompensantes que comprar el activo al contado, ya que los movimientos de precios se exageran. Los perps ofrecen una buena experiencia de usuario porque el precio del perp sigue el precio del activo subyacente a través de un mecanismo único específico de los perps. A alto nivel, simplemente puede pensarse como una forma de que los traders aumenten su poder de compra. Es importante recordar que debido a que un perp es un derivado, cuando compras un perp, nunca posees el activo subyacente, es solo un acuerdo mutuo entre dos traders.

## Avanzado
Con la intuición sobre por qué se necesitan los perps y lo que habilitan—es decir, acceder a grandes cantidades de apalancamiento para ir largo o corto en un activo determinado—podemos expandirnos sobre los mecanismos que habilitan tal producto derivado.

### Tasas de Financiación
La primera gran pregunta abierta es cómo el precio de un perp sigue el precio del activo subyacente. Las tasas de financiación resuelven esto incentivando a los traders a alinear el precio del perp con el precio subyacente. Son pagos periódicos entre traders largos y cortos, dependiendo de la relación entre el precio del perp y el precio reportado por el [oracle](./oracle.md) del activo subyacente.

Cómo Funciona:
- Si el precio del perp está **por encima** del precio subyacente, los traders largos pagan financiación a los traders cortos.
- Si el precio del perp está **por debajo** del precio subyacente, los traders cortos pagan financiación a los traders largos.

Este mecanismo funciona porque ir largo aumenta el precio del perp, mientras que ir corto lo disminuye. Por ejemplo:
- Si el perp está **sobrevalorado**, ir corto gana financiación. Los traders se incentivan a ir corto, lo que hace que el precio baje.
- Si el perp está **subvalorado**, ir largo gana financiación. Los traders se incentivan a ir largo, lo que hace que el precio suba.

La magnitud de la tasa de financiación crece con la desviación entre el precio del perp y el precio subyacente, aumentando los incentivos para operar y realinear los dos. En Klyra, las tasas de financiación se pagan cada hora.

Para detalles sobre los cálculos de las tasas de financiación, ver [aquí](./funding-rates.md). Por ahora, entiende que las tasas de financiación son un mecanismo que mantiene el precio del perp estrechamente vinculado al activo subyacente.

### Colateral
El colateral (a veces también llamado margen) es el capital que un trader deposita para respaldar sus posiciones en un intercambio perpetuo. Determina el poder de compra del trader, que es un múltiplo del monto de colateral basado en el apalancamiento. Por ejemplo, con apalancamiento de 10x, un trader puede controlar una posición de 10 veces su colateral.

Por qué el Colateral es Importante:
- El colateral asegura que un trader que incurra en pérdidas (PNL negativa) tenga suficientes fondos para cubrir las ganancias de su contraparte. En un intercambio, las contrapartes (por ejemplo, Alice y Bob, uno largo y uno corto) efectivamente "ganan" o "pierden" el colateral del otro según el movimiento del precio.

Apalancamiento y Riesgo:
- Un apalancamiento mayor aumenta el riesgo porque el PNL se amplifica por el múltiplo de apalancamiento. Por ejemplo, con apalancamiento de 20x, un pequeño movimiento adverso en el precio puede agotar rápidamente el colateral de un trader. Un apalancamiento menor (por ejemplo, 2x) proporciona más margen para las fluctuaciones de precio, reduciendo el riesgo de perder todo el colateral.

En resumen, el colateral asegura la integridad del sistema de intercambio al salvaguardar los pagos de contrapartes y alinear el riesgo con el tamaño de la posición.

### Liquidaciones
En su núcleo, los perps son un acuerdo entre dos partes, por lo que ¿qué sucede cuando el precio se mueve y el colateral de un trader se agota a cero? Supongamos que Alice y Bob abren un perp entre ellos con Alice largo en BTC y Bob corto en BTC. Ahora el precio de BTC sube y la posición corta de Bob está perdiendo tanto dinero que sus pérdidas son iguales a su colateral. Una opción que podría hacer un intercambio es forzar el cierre de esta posición en ambos lados. Así que Alice y Bob salen de la posición y Bob le da su colateral a Alice para proporcionar las ganancias de Alice. Sin embargo, esto crea una experiencia de usuario muy extraña para Alice: ¿y si Alice no quería cerrar su posición? Por esta razón, Klyra implementa un mecanismo llamado liquidaciones, que en este ejemplo facilitaría la transferencia de la posición de Bob a un nuevo trader. Ahora, en lugar de cerrar la posición de Alice, Alice tiene un nuevo contraparte y solo Bob es forzado a salir de su posición, ya que ya no tiene colateral para pagar las ganancias de su contraparte.

Las liquidaciones aseguran la solvencia de un intercambio. En otras palabras, se aseguran de que un trader nunca tenga un colateral negativo. Si tal caso surgiera, un trader tendría ganancias que no podrían pagarse porque esas PNL no podrían ser suministradas por el colateral de la contraparte. Un invariante de Klyra es que el PNL neto total de los traders es cero (es decir, si alguien gana \\$X, otro trader pierde \\$-X). Un trader con colateral negativo es lo peor que le puede pasar a un intercambio de perps. Para combatir esto, las liquidaciones no ocurren cuando el colateral de un trader es exactamente cero. En cambio, las liquidaciones ocurren un poco antes de que el colateral llegue a cero para permitir que el intercambio encuentre una nueva contraparte para la posición.

Encuentra exactamente cómo funcionan las liquidaciones en Klyra [aquí](./liquidations.md).
