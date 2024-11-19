---
sidebar_position: 3
description: ¿Como maneja el riesgo en Klyra?
---

# Colateral

## Introducción
El colateral (o margen) es el capital que un trader deposita para respaldar sus posiciones en un intercambio perpetual. Asegura que los traders que incurrean en pérdidas tengan suficientes fondos para cubrir las ganancias de su contraparte. El colateral mantiene la integridad del sistema de trading al garantizar que ambas partes en una operación puedan cumplir con sus obligaciones, alineando el riesgo con el tamaño de la posición y evitando escenarios en los que las pérdidas de un trader superen sus fondos disponibles.

Una pregunta natural que surge es qué garantías debe admitir un perpetual. Imagina que dos comerciantes desean operar con diferentes garantías y se niegan a aceptar cualquier otra cosa, entonces no podrían operar entre sí porque no habría forma de pagar ganancias y pérdidas al otro. En otras palabras, la única forma de que dos comerciantes con diferentes garantías operen entre sí es si están dispuestos a aceptar la garantía del otro comerciante. En general, esta es una suposición que no es verdadera, un comerciante puede confiar solo en USDC y BTC y no querer operar con alguien que use Solana.

Sin embargo, queremos que Klyra permita a un usuario que desee operar con garantías de Solana hacerlo.

Para lograr esto, Klyra utiliza grupos de garantías separados para respaldar las operaciones, garantizando la seguridad de la plataforma y sus usuarios. Cada grupo contiene tipos específicos de garantías, como USDC o Solana, y se mantienen completamente separados para evitar que los problemas de un grupo afecten a los otros. Por ejemplo, si Solana disminuye su valor, no impactará a los comerciantes en el grupo de USDC. Algunos grupos también permiten múltiples tipos de garantías, como USDC y BTC, para que los comerciantes puedan usar diferentes activos juntos. Además, ciertos grupos pueden generar rendimiento, dando a los comerciantes la oportunidad de ganar dinero mientras mantienen sus posiciones abiertas. Al abrir una posición perpetua, un usuario puede especificar en qué grupo opta por participar. Además, las configuraciones de cada grupo están disponibles públicamente y son verificables.

<div style={{ display: 'flex', justifyContent: 'center' }}>

![Collateral pools img](../../../../../static/img/collateral.png)

</div>

## Avanzada
Klyra está construido sobre un sistema de grupos de garantías independientes, donde cada grupo opera independientemente para minimizar el riesgo y garantizar la estabilidad. Cada grupo tiene un [fondo de seguros](./liquidations.md#advanced) separado (lea los documentos avanzados de liquidación para más información). Estos grupos pueden contener tipos específicos de garantías, como USDC o USDT, o incluso una mezcla de activos como USDC y BTC, permitiendo diversas posibilidades de operación. Los grupos que admiten múltiples garantías aún no están disponibles, pero se están desarrollando. El aislamiento de los grupos garantiza que eventos como el desacople de USDT no afecten a los comerciantes en otros grupos, como los que usan USDC. Esta separación también permite que la gobernanza defina parámetros de riesgo y recompensa personalizados para cada grupo, atendiendo a mercados tanto conservadores como esotéricos. Además, algunos grupos de garantías están diseñados para generar rendimiento, proporcionando a los comerciantes oportunidades de ingresos pasivos mientras mantienen posiciones abiertas. Este enfoque flexible y seguro hace que Klyra sea adaptable a diversas necesidades de operación mientras protege los fondos de los usuarios.

En Klyra, los mercados perpetuals están vinculados directamente a sus pools de colateral, lo que significa que cada perpetuals existe de manera única dentro de su pool. Por ejemplo, si hay dos pools separados—uno que mantiene USDC y otro que mantiene USDT—y ambos ofrecen mercados perpetuals de BTC, los traders en el pool de USDC no pueden operar con traders en el pool de USDT. Esta separación existe para aislar el riesgo, asegurando que los problemas en un pool no afecten a otros. Este diseño es intuitivo ya que las ganancias, pérdidas y pagos de financiamiento deben liquidarse usando el colateral dentro de un pool específico, haciendo imposible que los traders en pools separados liquiden obligaciones entre sí.

Al abrir una posición, los usuarios especifican el pool de colateral que desean usar, proporcionando una garantía de que su exposición está limitada a los activos de ese pool. Esto garantiza seguridad y previsibilidad para los traders, ya que no se ven afectados por los riesgos en otros pools. Sin embargo, esta estructura puede llevar a una fragmentación de la liquidez, donde los pools más pequeños o esotéricos pueden tener menos participantes y menor liquidez en comparación con los pools más grandes, ya que solo pueden operar con otros que usen el mismo colateral. Para abordar esto, el pool de colateral principal de Klyra incluirá inicialmente USDC, BTC y ETH, ya que estos activos satisfacen una amplia gama de necesidades mientras aseguran una fuerte liquidez y mantienen la seguridad a través de su estabilidad y confiabilidad.

Los cambios en la estructura de un pool, como agregar o eliminar tipos de colateral, solo pueden realizarse a través de un voto de gobernanza. Este proceso asegura que cualquier cambio sea gradual y transparente, dando tiempo a los traders para ajustar sus estrategias en consecuencia. Si bien se pueden introducir pools nuevos y experimentales, estos pueden atender a mercados nicho con una liquidez inherentemente menor que los pools principales. Este diseño permite que Klyra apoye diversas necesidades de trading mientras mantiene límites claros para la gestión de riesgos.

Los pools multi-colateral aún no están disponibles pero están en desarrollo.