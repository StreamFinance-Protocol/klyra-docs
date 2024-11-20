---
sidebar_position: 9
description: ¿Cómo deposita y retira dinero en Klyra?
---

# Bridging

## Introducción
Inicialmente, Klyra se lanzará con un puente hacia Ethereum, permitiendo a los usuarios transferir fondos de manera segura entre ambas redes. Cuando los usuarios envían fondos a un contrato inteligente en Ethereum, la cantidad equivalente se acredita en su cuenta de Klyra. De manera similar, cuando los usuarios retiran fondos de Klyra, los fondos se liberan en Ethereum. Este sistema asegura que los activos totales en Klyra siempre coincidan con los activos totales en el contrato inteligente de Ethereum, proporcionando transferencias seguras y confiables entre ambas redes.

## Avanzado
Nuestra solución de puente está en desarrollo, y estamos abiertos a discutir el diseño para garantizar la solución más fácil y eficiente tanto para los clientes como para los usuarios. Dado que Klyra opera como una cadena, podemos aprovechar su conjunto de validadores para construir un puente que herede la seguridad total de Klyra.

Inicialmente, estamos construyendo un puente entre Klyra y Ethereum. Para depositar fondos en Klyra, los usuarios envían fondos a un contrato inteligente en Ethereum, el cual no está controlado por una clave maestra. Una vez que esta transacción se incluye en un bloque en Ethereum, los validadores de Klyra, cada uno ejecutando un cliente ligero de Ethereum independiente, pueden verificar de manera independiente la transacción. Un cliente ligero es un nodo simplificado de Ethereum que solo almacena un subconjunto de los datos de la blockchain, lo que permite que los validadores de Klyra lleguen a un consenso sobre el hecho de que el usuario ha depositado fondos en el contrato inteligente de Ethereum. Una vez que los validadores de Klyra verifican la transacción de depósito, los fondos se acreditan en la cuenta de Klyra del usuario.

La clave invariante en este proceso es que los activos totales en Klyra siempre equivalen a los activos totales mantenidos en el contrato inteligente de Ethereum, asegurando que los fondos siempre estén correctamente contabilizados.

Para los retiros, los usuarios inician una transacción en Klyra, y los validadores de Klyra confirman que el usuario tiene fondos suficientes en la cadena. Si se cumplen las condiciones, los validadores proporcionan una firma umbral, requiriendo una mayoría >2/3, la misma condición que en el algoritmo de consenso de Klyra. Una firma umbral es una firma criptográfica que solo se puede crear si un número suficiente de validadores está de acuerdo, proporcionando seguridad y garantía. Esta firma luego se valida en el contrato inteligente de Ethereum y, si es válida, los fondos se liberan al usuario.

Este diseño de puente ofrece las mayores garantías de seguridad posibles para transferir activos entre Ethereum y Klyra, heredando la seguridad total de ambas redes.