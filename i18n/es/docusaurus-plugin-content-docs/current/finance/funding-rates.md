---
sidebar_position: 2
description: ¿Qué son las tasas de financiamiento?
---

# Tasas de Financiamiento

![funding payment diagram](../../../../../static/img/funding-diagram.png)

## Introductoria
Las tasas de financiamiento ayudan a mantener el precio de un contrato perpetuo alineado con el precio del activo real que representa. Son pagos periódicos entre traders en posiciones largas y cortas, basados en la diferencia entre el precio del perpetuo y el precio del activo subyacente [reportado por el oráculo](./oracle.md).

Cómo Funciona:
- Si el precio del perpetuo está **por encima** del precio subyacente, los traders en largo pagan financiamiento a los traders en corto.
- Si el precio del perpetuo está **por debajo** del precio subyacente, los traders en corto pagan financiamiento a los traders en largo.

La tasa de financiamiento por lo tanto crea incentivos para corregir el precio del perpetuo:
- Si el precio del perpetuo está **por encima** del precio del activo subyacente, los cortos ganan financiamiento y los largos pagan financiamiento. Esto incentiva a los traders a:
  1. Abrir posiciones cortas (bajando el precio)
  2. Cerrar posiciones largas (bajando el precio)
  3. Obtener ganancias vendiendo perpetuos y comprando el activo hasta que los precios converjan (bajando aún más el precio)
- Si el precio del perpetuo está **por debajo** del precio del activo subyacente, los largos ganan financiamiento y los cortos pagan financiamiento. Esto incentiva a los traders a:
  1. Abrir posiciones largas (subiendo el precio)
  2. Cerrar posiciones cortas (subiendo el precio)
  3. Obtener ganancias comprando perpetuos y vendiendo el activo hasta que los precios converjan (subiendo aún más el precio)

Este sistema se ajusta automáticamente según el tamaño de la diferencia de precios. En Klyra, los pagos de financiamiento ocurren cada hora para mantener la alineación.

## Avanzada
### Componentes y Cálculo de la Tasa de Financiamiento
La tasa de financiamiento tiene dos componentes:
1. Prima: Calculada separadamente para cada mercado basada en el precio de mercado del perpetuo
2. Tasa de interés

En Klyra, cada validador calcula la prima para un mercado dado siguiendo estos pasos:
- Cada segundo: Los validadores muestrean la prima basada en las diferencias de precio
- Cada minuto: Las muestras segundo a segundo son promediadas
- Cada hora: Los promedios de los últimos 60 minutos se combinan en una prima final. La mediana de las primas de todos los validadores se usa como la prima canónica para un mercado.

### Liquidación por Hora
La tasa de financiamiento final combina la prima con la tasa de interés y se liquida cada hora. Esto asegura que las correcciones de precio sean oportunas y respondan a las condiciones del mercado.

La liquidación por hora logra un balance efectivo. Liquidar con poca frecuencia arriesga permitir que los precios se desvíen significativamente del precio subyacente, mientras que los intervalos por hora aseguran correcciones oportunas. El financiamiento por hora también es práctico porque los costos de abrir y cerrar posiciones típicamente exceden las tarifas de financiamiento acumuladas dentro de una hora, lo que dificulta manipular el sistema. Además, liquidar cada hora mantiene los costos computacionales manejables mientras mantiene la capacidad de respuesta.

### Cálculo de la prima
Cada segundo, se toma la muestra de la prima de la siguiente manera:

`Prima = (Max(0, Precio de Impacto de Oferta - Precio Índice) - Max(0, Precio Índice - Precio de Impacto de Demanda)) / Precio Índice`

Con las siguientes definiciones:
- Precio de Impacto de Oferta: Precio promedio de ejecución para una venta en el mercado del valor nocional de impacto.
- Precio de Impacto de Demanda: Precio promedio de ejecución para una compra en el mercado del valor nocional de impacto.
- Cantidad Nocional de Impacto: USD 500 / Margen inicial del mercado. Esto se establece en la configuración del nivel de liquidez para ese mercado. El mercado BTC-USD, por ejemplo, tiene un valor nocional de impacto de USD 10,000.

La fórmula de la prima se simplifica de la siguiente manera:

`Si Precio de Impacto de Oferta <= Precio Índice <= Precio de Impacto de Demanda, la prima es 0`

`Si Precio Índice < Precio de Impacto de Oferta: Prima = Precio de Impacto de Oferta / Precio Índice - 1`

`Si Precio de Impacto de Demanda < Precio Índice: Prima = Precio de Impacto de Demanda / Precio Índice - 1`

### Componente de Tasa de Interés
El segundo componente de la tasa de financiamiento es la tasa de interés fija. Esta existe para apoyar las operaciones de carry trade (lea más sobre carry trades [aquí](https://www.investopedia.com/terms/c/cashandcarry.asp)), que son ejecutadas por traders sofisticados para ayudar a realinear el precio del perpetuo con el precio del activo subyacente. La tasa de interés se establece deliberadamente en un valor distinto de cero (típicamente entre 8-12%) para asegurar que estos carry trades sean rentables cuando los precios divergen, incentivando así a los traders a ayudar a mantener la alineación de precios.

La tasa de interés se establece para cada mercado, de acuerdo con la siguiente fórmula:

`Tasa de Interés = (Índice de Tasa de Interés de Cotización - Índice de Tasa de Interés Base) / Intervalo de Financiamiento`

Con las siguientes definiciones:
- Índice de Tasa de Interés de Cotización: La tasa de interés para pedir prestada la moneda de cotización (por ejemplo, USDC en un mercado BTC-USD).
- Índice de Tasa de Interés Base: La tasa de interés para pedir prestado la moneda base (por ejemplo, BTC en un mercado BTC-USD).
- Intervalo de Financiamiento: 24 horas / tiempo en el que ocurre el financiamiento. En nuestro caso, esto es 3 (ya que calculamos el intervalo de financiamiento para períodos de 8 horas, mientras que lo subdividimos en períodos de 1 hora en el cálculo final).

### Calculo de la tasa de financiamiento

Una vez que hemos calculado la prima y la tasa de interés, la tasa de financiamiento se calcula de la siguiente manera:

`Tasa de Financiamiento = (Componente de Prima + Componente de Tasa de Interés) * Tiempo Desde el Último Financiamiento / 8 horas`

Dado que el Tiempo Desde el Último Financiamiento generalmente será aproximadamente de 1 hora, el cálculo final para la tasa de financiamiento es el siguiente:

`Tasa de Financiamiento = (Componente de Prima + Componente de Tasa de Interés) / 8`

Para proteger a los traders, existe un límite máximo para la tasa de financiamiento de 8 horas. El límite particular depende del mercado y se calcula de la siguiente manera:

`Límite de Tasa de Financiamiento de 8 horas = 600% * (Margen Inicial - Requisito de Margen de Mantenimiento)`

Por ejemplo, si el Margen Inicial es del 6% y el Requisito de Margen de Mantenimiento es del 3%, entonces el Límite de Tasa de Financiamiento de 8 horas es del 18%.