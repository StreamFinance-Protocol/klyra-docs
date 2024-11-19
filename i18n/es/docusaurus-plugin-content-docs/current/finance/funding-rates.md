---
sidebar_position: 2
description: ¿Qué son las funding rates?
---

# Funding Rates

![funding payment diagram](../../../../../static/img/funding-diagram.png)

## Introductoria
Las funding rates ayudan a mantener el precio de un contrato perpetuo alineado con el precio del activo real que representa. Funcionan mediante pequeños pagos entre los traders dependiendo de si el precio perpetuo es más alto o más bajo que el precio del activo real. Cuando el precio perpetuo se desvía del precio del activo subyacente, los traders se ven incentivados a actuar porque pueden obtener ganancias de la diferencia. Si el precio es demasiado alto, vender el contrato perpetuo mientras se compra el activo subyacente asegura una ganancia a medida que los precios se convergen. Si el precio es demasiado bajo, comprar el contrato perpetuo y vender el activo subyacente logra lo mismo. Estas oportunidades de arbitraje naturalmente empujan el precio perpetuo de vuelta a la paridad con el activo subyacente. Este sistema se ajusta continuamente según la diferencia entre los precios, asegurando que se mantengan estrechamente alineados. En Klyra, este ajuste ocurre cada hora.

## Avanzada
Las tasas de financiamiento son un mecanismo crítico en los mercados perpetuos, diseñado para asegurar que el precio del contrato se mantenga estrechamente alineado con el precio del activo subyacente que representa. Lo logran creando flujos de efectivo periódicos entre los traders, incentivando comportamientos que corrigen las discrepancias de precio. Cuando el precio perpetuo está por encima del precio del activo subyacente, las tasas de financiamiento hacen que sea más costoso mantener posiciones que empujen el precio hacia arriba, alentando a los traders a tomar acciones que lo hagan bajar. Por el contrario, cuando el precio perpetuo está por debajo del precio del activo, las recompensas de financiamiento incentivan comportamientos que mueven el precio hacia arriba.

La tasa de financiamiento consta de dos componentes: la prima (que tiene en cuenta el precio de mercado actual del contrato perpetuo y se calcula por separado para cada mercado) y la tasa de interés. En Klyra, la prima se calcula a través de un proceso de múltiples pasos. Cada segundo, un validador toma una muestra de la prima basada en la relación entre el precio perpetuo y el precio del activo subyacente. Estas muestras, tomadas segundo a segundo, se agregan luego en promedios por minuto, y cada hora, los promedios de los últimos 60 minutos se agregan aún más para obtener el valor final de la prima. La tasa de financiamiento, que combina esta prima con la tasa de interés, se liquida cada hora, asegurando que las correcciones de precios sean oportunas y respondan a las condiciones del mercado. La liquidación horaria de las tasas de financiamiento establece un equilibrio efectivo. Liquidar con menor frecuencia corre el riesgo de permitir que los precios se desvíen significativamente del subyacente, mientras que los intervalos de una hora aseguran correcciones oportunas. El financiamiento por hora también es práctico porque los costos de abrir y cerrar posiciones suelen superar las tarifas de financiamiento acumuladas dentro de una hora, lo que hace difícil manipular el sistema. Además, liquidar cada hora mantiene los costos computacionales manejables mientras se mantiene la capacidad de respuesta.

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

El segundo componente de la tasa de financiamiento es la tasa de interés fija, que tiene en cuenta el costo de capital involucrado en la ejecución de operaciones de carry trade. Estas operaciones, realizadas típicamente por traders sofisticados, ayudan a realinear el precio del contrato perpetuo con el activo subyacente cuando se desvían. Proporcionar incentivos suficientes para estas operaciones es crucial; sin ellos, el precio perpetuo puede no seguir de cerca el precio al contado. Las operaciones de carry generalmente requieren pedir prestado fondos de otras plataformas, y el componente de tasa de interés subsidia este costo de préstamo. De forma intuitiva, cuando el precio perpetuo coincide con el precio subyacente, ejecutar un carry trade debería ser neutral. Sin embargo, en el momento en que los precios divergen, ejecutar un carry trade alineado con la tasa de financiamiento se vuelve rentable, incentivando a los traders a restaurar el equilibrio de precios. Dado que la tasa de interés está diseñada para subsidiar el costo del préstamo, normalmente varía entre 8-12%. Como resultado, incluso cuando el precio perpetuo coincide con el precio subyacente, la tasa de financiamiento sigue siendo distinta de cero, igual a la tasa de interés.

La tasa de interés se establece para cada mercado, de acuerdo con la siguiente fórmula:

`Tasa de Interés = (Índice de Tasa de Interés de Cotización - Índice de Tasa de Interés Base) / Intervalo de Financiamiento`

Con las siguientes definiciones:
- Índice de Tasa de Interés de Cotización: La tasa de interés para pedir prestada la moneda de cotización (por ejemplo, USDC en un mercado BTC-USD).
- Índice de Tasa de Interés Base: La tasa de interés para pedir prestado la moneda base (por ejemplo, BTC en un mercado BTC-USD).
- Intervalo de Financiamiento: 24 horas / tiempo en el que ocurre el financiamiento. En nuestro caso, esto es 3 (ya que calculamos el intervalo de financiamiento para períodos de 8 horas, mientras que lo subdividimos en períodos de 1 hora en el cálculo final).

Una vez que hemos calculado la prima y la tasa de interés, la tasa de financiamiento se calcula de la siguiente manera:

`Tasa de Financiamiento = (Componente de Prima + Componente de Tasa de Interés) * Tiempo Desde el Último Financiamiento / 8 horas`

Dado que el Tiempo Desde el Último Financiamiento generalmente será aproximadamente de 1 hora, el cálculo final para la tasa de financiamiento es el siguiente:

`Tasa de Financiamiento = (Componente de Prima + Componente de Tasa de Interés) / 8`

Para proteger a los traders, existe un límite máximo para la tasa de financiamiento de 8 horas. El límite particular depende del mercado y se calcula de la siguiente manera:

`Límite de Tasa de Financiamiento de 8 horas = 600% * (Margen Inicial - Requisito de Margen de Mantenimiento)`

Por ejemplo, si el Margen Inicial es del 6% y el Requisito de Margen de Mantenimiento es del 3%, entonces el Límite de Tasa de Financiamiento de 8 horas es del 18%.