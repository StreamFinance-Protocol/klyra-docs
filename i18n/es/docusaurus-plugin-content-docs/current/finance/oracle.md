---
sidebar_position: 7
description: ¿Cómo funciona el oráculo de Klyra?
---

# Oráculo

## Introducción
Klyra actualiza los precios del mercado cada segundo combinando datos de los validadores para garantizar precisión y equidad. Cada validador recopila precios de múltiples fuentes, calcula un precio confiable tomando la mediana y lo comparte con el grupo. El precio final se determina tomando la mediana de todas las sugerencias de los validadores, asegurando que ninguna fuente o validador pueda influir demasiado en el resultado. Este proceso filtra los datos incorrectos y proporciona una forma rápida, segura y confiable de mantener los precios actualizados para el mercado.

## Avanzado
Las actualizaciones de precios en Klyra son una agregación de los precios propuestos por los validadores en cada bloque (1 segundo de promedio). Cada validador ejecuta perpetuamente un "sidecar" (un programa que se ejecuta en paralelo) que consulta diversas fuentes de precios y determina un único precio para cada mercado tomando la mediana de estos precios consultados. Estos precios individuales se mantienen en la caché del sidecar para ser utilizados por los validadores cuando se necesiten. Al comienzo de cada bloque, cada validador envía su precio propuesto a todos los demás validadores, y el validador que construye el bloque (el proponente) tomará otra mediana agregada de todos estos precios para cada mercado para determinar el precio final que se escribirá en el estado (el precio de la red). El precio que propone cada validador no es únicamente el precio obtenido del sidecar, sino una mediana de tres precios: el precio medio del orderbook (clob), el precio ponderado por financiamiento del oráculo (precio del oráculo = precio del sidecar) y un precio suavizado histórico. Este sistema es tolerante a fallos por ataques a oráculos de dos maneras. Primero, cada validador toma una mediana local de precios para evitar datos erróneos de las fuentes de precios externas. Segundo, el precio final escrito en el estado es una mediana de los precios de todos los validadores, lo que significa que se alcanza un consenso sobre el precio final. A continuación, una explicación más detallada de cada uno de los componentes que conforman el oráculo:

### Mediana del Precio del Oráculo
Para que el sidecar calcule el precio del oráculo, consulta rutinariamente diversas fuentes de datos de precios externos. Las fuentes externas suelen ser alrededor de 5-10 exchanges diferentes, como Binance, Kraken, Coinbase, etc. Consultamos múltiples exchanges para evitar que el oráculo falle si un solo exchange se cae. El sidecar luego agrega estos precios y almacena el resultado como el precio del oráculo. Por ejemplo, si Binance responde con BTC a \$65,100, Kraken a \$65,150 y Coinbase a \$65,050, el precio final almacenado en el sidecar será 1 BTC = \$65,100. El sidecar es ejecutado independientemente por cada validador y se les recomienda usar un conjunto variado de fuentes de precios para aumentar la descentralización.

### Mediana del Precio Propuesto
Cuando llega el momento de que el validador comparta su visión local de los precios, no solo envía el precio almacenado en el sidecar a todos los demás validadores. En su lugar, toma una mediana de tres precios, diseñada para evitar precios erróneos provenientes de exchanges externos. Estos tres precios son el precio medio del orderbook (clob), el precio ponderado por financiamiento del oráculo (precio del oráculo = precio del sidecar) y un precio suavizado histórico. Es importante notar que esta mediana se toma para cada mercado individual, por lo que cada validador propone un precio para cada mercado específico. A continuación se muestra el cálculo exacto de cada uno de estos precios:

#### Precio Medio del Clob:
`Mejor Oferta + ( (Mejor Pregunta - Mejor Oferta) / 2)`

#### Precio Ponderado por Financiamiento del Oráculo:
`Precio del Oráculo * (1 + precio de financiamiento)`

#### Precio Suavizado Histórico:
Los precios suavizados históricos se calculan utilizando un [suavizado exponencial](https://es.wikipedia.org/wiki/Suavizamiento_exponencial) de los precios.

### Mediana del Precio de la Red
El precio de la red es el precio final utilizado para la lógica financiera de Klyra. Se toma de todos los precios individuales que cada validador propuso por mercado. Así que ahora, el validador que construye el bloque tomará los precios reportados por cada validador para cada mercado y tomará una mediana global de estos precios. El precio final es lo que realmente se escribe en el estado como una actualización de precio para cada mercado específico. El precio tiene propiedades de descentralización completas de la cadena Klyra porque se agrega en cada bloque por los precios propuestos por los validadores, los cuales están firmados por los validadores. Además, para que un precio sea cambiado, se requiere que al menos 2/3 de los validadores sugieran un nuevo precio del cual tomamos una mediana.