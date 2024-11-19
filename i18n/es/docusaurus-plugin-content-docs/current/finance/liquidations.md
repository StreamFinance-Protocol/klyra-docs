---
sidebar_position: 4
description: ¿Qué son las liquidaciones?
---

# Liquidaciones

![Liquidation diagram](../../../../../static/img/liquidation-diagram.png)

## Introductoria
Las liquidaciones son un mecanismo de seguridad de Klyra para asegurar que ninguna cuenta de trader llegue a valores negativos. Como se menciona en la [descripción general](../overview.md), la pérdida de un trader es la ganancia de otro trader. Por lo tanto, si una cuenta está en negativo, entonces algún otro trader tiene ganancias que Klyra no puede pagar. En finanzas, esto se llamaría una plataforma insolvente, y es lo peor que puede suceder a una plataforma financiera.

Cada operación que un trader abre, otro trader está en el lado opuesto. Por ejemplo, si Alice toma una posición larga de 1 BTC, entonces Bob (u otro trader) tiene una posición corta de 1 BTC. Digamos que el precio de BTC sube, y Bob comienza a perder mucho dinero, hasta el punto en que sus pérdidas son iguales a su [garantía](./collateral-pools.md), es decir, el valor de su cuenta es cero. En este punto, lo más simple que Klyra podría hacer es forzar el cierre de la posición tanto para Alice como para Bob. Ahora Klyra puede asegurarse de que ninguna cuenta puede tener un valor negativo porque fuerza el cierre de todas sus posiciones.

Esto funciona, pero es una experiencia de usuario terrible para Alice. Imagina que ella quería continuar manteniendo su posición larga de 1 BTC - ¿por qué debería verse forzada a cerrar su posición porque Bob perdió dinero? Para combatir esto, Klyra no fuerza el cierre de la posición para ambas partes, en su lugar encuentra un nuevo trader (que también quiere tomar una posición corta en BTC), para tomar el otro lado de la posición de Alice. Ahora el lado de la posición de Bob se cierra forzosamente, pero la posición de Alice permanece abierta pero con un nuevo trader.

Sin embargo, este proceso de encontrar un nuevo trader lleva tiempo, por lo que este proceso no puede comenzar tan pronto como el valor de la cuenta del trader llega a cero. Como no está claro cuánto tiempo tomaría, si Klyra comenzara este proceso cuando el valor de la cuenta llega a cero, es posible que para cuando se encuentre un nuevo trader, la cuenta con valor cero se haya vuelto negativa. Por lo tanto, este proceso de encontrar un nuevo trader se llama **liquidación** y ocurre un poco antes de que la cuenta llegue a cero para permitir este margen de tiempo para encontrar un nuevo trader.

En esencia, las liquidaciones actúan como una red de seguridad para Klyra, asegurando que ninguna operación mala pueda poner en peligro la estabilidad del sistema.

## Avanzada
Liquidación es el proceso de cerrar de manera forzada la posición de un trader en el libro de órdenes. Esto ocurre cuando el saldo de la cuenta del trader, incluyendo el colateral y las ganancias o pérdidas no realizadas, cae por debajo del requisito de margen de mantenimiento. Durante la liquidación, el sistema empareja la posición del trader con órdenes contrarias en el mercado, vendiendo o comprando efectivamente la posición para devolver la cuenta a la conformidad o cerrarla por completo. Si la liquidez es insuficiente o el precio de liquidación resulta en un saldo negativo, se emplean mecanismos adicionales, como fondos de seguro o desapalancamiento, para gestionar los riesgos.

### Margen de Mantenimiento y Condiciones de Liquidación
El margen de mantenimiento perpetuo es el colateral mínimo que un trader debe mantener para mantener una posición abierta. Se calcula utilizando la fórmula:

`margen_de_mantenimiento = tamaño_de_posición * tasa_de_margen_de_mantenimiento`

Vemos que el margen de mantenimiento depende tanto del tamaño de la posición (apalancamiento) como de la tasa de margen de mantenimiento. Esta tasa, típicamente entre 1-10%, varía según los parámetros de riesgo específicos de la plataforma. Una cuenta se considera liquidable cuando su valor (incluyendo ganancias y pérdidas) cae por debajo del requisito de margen de mantenimiento.

Cada bloque, el sistema identifica todas las cuentas con posiciones liquidables. Sin embargo, dado que el número de transacciones por bloque está limitado, no todas las posiciones pueden ser liquidadas de inmediato. Para abordar esto, el sistema emplea un mecanismo de prioridad para determinar qué cuentas se liquidan primero, en función de su nivel de riesgo.

#### Métrica de Prioridad de Liquidación
La prioridad para la liquidación se calcula utilizando la siguiente métrica:

`Prioridad = salud_cuenta / tamaño_ponderado`

Donde:

`Salud de la Cuenta = colateral_neto_total / margen_mantenimiento`

`Tamaño Ponderado = Suma( abs(tamaño_posición_i) * índice_peligro_i )`

Aquí, `i` se refiere a cada contrato perpetuo que mantiene la cuenta, y el `índice_peligro` es un parámetro específico del mercado que representa el riesgo relativo de ese contrato. Las cuentas se ordenan según esta métrica, asegurando que aquellas con mayor riesgo sean las prioritarias para la liquidación.

### Proceso de Liquidación
Una vez que una cuenta es seleccionada para la liquidación, el sistema identifica la posición específica (contrato perpetual) que, al ser liquidada, mejora de manera óptima la salud de la cuenta. Si liquidar una única posición no restaura la cuenta por encima del margen de mantenimiento, la cuenta se reevalúa y se vuelve a insertar en la cola de liquidación con una prioridad actualizada para su posterior procesamiento.

### Mecanismos de Seguridad: Fondo de Seguro y Desapalancamiento
Para mantener la estabilidad del sistema durante períodos de baja liquidez en el mercado:

- Prioridad de Liquidación: Las liquidaciones tienen prioridad sobre las transacciones estándar en el libro de órdenes para asegurar que las cuentas insalubres se aborden rápidamente.
- Fondo de Seguro: Si la liquidación resulta en un saldo negativo debido a baja liquidez, el fondo de seguro de la cadena Klyra cubre el déficit. El fondo de seguro recibe una porción de las tarifas de Klyra y asegura la solvencia de la sistema en caso de fallos. El fondo de seguro es sin permisos y está programado en la cadena: no lo administra el equipo de Klyra ni ninguna otra entidad central. 
- Desapalancmiento: En casos raros en los que la liquidación no pueda completarse con éxito, se activa un mecanismo de desapalancamiento. Este mecanismo cierra de manera forzada la cuenta insalubre compensando sus posiciones contra cuentas seleccionadas aleatoriamente con posiciones opuestas. El desapalancamiento es un último recurso y está diseñado para ser una ocurrencia extremadamente rara. Si se activa, el sistema detiene la apertura de nuevas posiciones para proteger el ecosistema y los traders.

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