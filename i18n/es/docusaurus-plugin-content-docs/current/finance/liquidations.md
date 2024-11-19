---
sidebar_position: 4
description: ¿Qué son las liquidaciones?
---

# Liquidaciones

## Introductoria
Las liquidaciones en los contratos perpetuals ocurren cuando la cuenta de un trader se vuelve demasiado riesgosa para el sistema. Imagina pedir dinero prestado para apostar sobre el precio de algo, como Bitcoin, y el mercado se mueve en tu contra de tal manera que tus pérdidas están a punto de superar el valor de tu cuenta. Para proteger al sistema y a los demás traders, la plataforma interviene para "cerrar" tu posición antes de que las pérdidas crezcan de forma incontrolable. Este proceso se llama liquidación.

Es importante destacar que el precio en el cual se activa una liquidación es conocido por el trader cuando entra en el contrato perpetual, por lo que nunca debería ser una sorpresa.

En esencia, las liquidaciones actúan como una red de seguridad para la plataforma de trading, asegurando que ninguna operación mala pueda poner en peligro la estabilidad del sistema.

## Avanzada
Liquidación es el proceso de cerrar de manera forzada la posición de un trader en el libro de órdenes. Esto ocurre cuando el saldo de la cuenta del trader, incluyendo el colateral y las ganancias o pérdidas no realizadas, cae por debajo del requisito de margen de mantenimiento. Durante la liquidación, el sistema empareja la posición del trader con órdenes contrarias en el mercado, vendiendo o comprando efectivamente la posición para devolver la cuenta a la conformidad o cerrarla por completo. Si la liquidez es insuficiente o el precio de liquidación resulta en un saldo negativo, se emplean mecanismos adicionales, como fondos de seguro o desapalancamiento, para gestionar los riesgos.

### Margen de Mantenimiento y Condiciones de Liquidación
Una tasa de margen de mantenimiento perpetual es el colateral mínimo que un trader debe mantener para mantener una posición abierta. Esta tasa, que normalmente está entre el 1% y el 10% del tamaño de la posición, varía según los parámetros de riesgo específicos de la plataforma. Una cuenta se considera liquidable cuando su valor (incluyendo ganancias y pérdidas) cae por debajo del requisito de margen de mantenimiento.

Cada bloque, el sistema identifica todas las cuentas con posiciones liquidables. Sin embargo, dado que el número de transacciones por bloque está limitado, no todas las posiciones pueden ser liquidadas de inmediato. Para abordar esto, el sistema emplea un mecanismo de prioridad para determinar qué cuentas se liquidan primero, en función de su nivel de riesgo.

#### Métrica de Prioridad de Liquidación
La prioridad para la liquidación se calcula utilizando la siguiente métrica:

`Prioridad = salud_cuenta / tamaño_ponderado`

Donde:

`Salud de la Cuenta = colateral_neto_total / margen_mantenimiento`

`Tamaño Ponderado = Suma( abs(tamaño_posición_i) * índice_peligro_i )`

Aquí, i se refiere a cada contrato perpetual que mantiene la cuenta, y el Índice de Peligro es un parámetro específico del mercado que representa el riesgo relativo de ese contrato. Las cuentas se ordenan según esta métrica, asegurando que aquellas con mayor riesgo sean las prioritarias para la liquidación.

### Proceso de Liquidación
Una vez que una cuenta es seleccionada para la liquidación, el sistema identifica la posición específica (contrato perpetual) que, al ser liquidada, mejora de manera óptima la salud de la cuenta. Si liquidar una única posición no restaura la cuenta por encima del margen de mantenimiento, la cuenta se reevalúa y se vuelve a insertar en la cola de liquidación con una prioridad actualizada para su posterior procesamiento.

### Mecanismos de Seguridad: Fondo de Seguro y Desapalancamiento
Para mantener la estabilidad del sistema durante períodos de baja liquidez en el mercado:

- Prioridad de Liquidación: Las liquidaciones tienen prioridad sobre las transacciones estándar en el libro de órdenes para asegurar que las cuentas insalubres se aborden rápidamente.
- Fondo de Seguro: Si la liquidación resulta en un saldo negativo debido a baja liquidez, el fondo de seguro de la cadena Klyra cubre el déficit. El fondo de seguro recibe una porción de las tarifas de Klyra y asegura la solvencia del intercambio en caso de fallos. El fondo de seguro es sin permisos y está programado en la cadena: no lo administra el equipo de Klyra ni ninguna otra entidad central. En casos raros en los que la liquidación no pueda completarse con éxito, se activa un mecanismo de desapalancamiento. Este mecanismo cierra de manera forzada la cuenta insalubre compensando sus posiciones contra cuentas seleccionadas aleatoriamente con posiciones opuestas. El desapalancamiento es un último recurso y está diseñado para ser una ocurrencia extremadamente rara. Si se activa, el sistema detiene la apertura de nuevas posiciones para proteger el ecosistema y los traders.

### Precio de Liquidación
Cuando se liquida la posición de un contrato perpetual de una cuenta, debe determinarse un precio mínimo para colocar la orden en el libro de órdenes. Este es el peor precio en el que la orden puede ejecutarse. Para determinar el precio de liquidación, Klyra utiliza el precio más agresivo entre el precio de quiebra y el precio llenable. El precio de quiebra es el precio al cual, si la liquidación se empareja, resultará en un saldo de cuenta igual a cero (es decir, todo el colateral se elimina). El precio llenable varía dependiendo de la salud de la cuenta; mientras peor sea la salud, mayor será el delta entre el precio del oráculo y el precio llenable. Esto significa que cuando la cuenta está casi liquidable, Klyra utilizará el precio de quiebra para maximizar la posibilidad de que la cuenta se liquide (esto es un mecanismo de seguridad). Cuando la cuenta está muy cerca de la quiebra, Klyra utilizará el precio llenable para permitir más órdenes potenciales que puedan coincidir con la cobertura del fondo de seguro. Esto está diseñado para maximizar la probabilidad de una liquidación exitosa. A continuación se muestra la fórmula utilizada para calcular cada uno de estos precios respectivos.

#### Precio de Quiebra
`precio_quiebra = (-DNNV - (TNC * (abs(DMMR) / TMMR))) / PS`

- DNNV (delta valor nocional neto de posición) es PNNVAD - PNNV

- PNNV es el valor nocional neto de la posición

- PNNVAD es el valor nocional neto de la posición después del delta.

- El valor nocional neto se refiere al valor de la posición en la moneda de cotización (normalmente USD).

- TNC: colateral neto total

- DMMR (delta requisito de margen de mantenimiento) = PMMRAD - PMMR donde PMMRAD es el requisito de margen de la posición después del delta.

- TMMR: requisito total de margen de mantenimiento de la posición abierta actual

- PS: tamaño de la posición

- Delta: se refiere al cambio en el tamaño de la posición debido a que se empareja la orden de liquidación.

#### Precio Llenable
`precio_llenable = (PNNV - ABR * SMMR * PMMR) / PS`

- PNNV es el valor nocional neto de la posición

- ABR (tasa de quiebra ajustada) es BA * (1 - (TNC / TMMR))

- BA: ajuste de quiebra en partes por millón (este es un valor constante establecido en la configuración de la cadena que puede cambiarse mediante una votación de gobernanza)

- SMMR: ratio de margen de mantenimiento (este es un valor constante establecido en la configuración de la cadena que puede cambiarse mediante una votación de gobernanza)

- PMMR: requisito de margen de mantenimiento de la posición