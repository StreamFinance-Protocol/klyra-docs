---
sidebar_position: 8
description: Aprende sobre la custodia de Klyra
---

# Custodia
La custodia de Klyra funciona de manera similar a la custodia de Ethereum o Bitcoin: los fondos de los usuarios se mantienen de forma segura en la blockchain en cuentas controladas por claves privadas. Estas claves están en posesión de los propios usuarios o de su exchange de confianza (no de Klyra). Cualquier persona puede crear una cuenta generando una clave privada, pero debe asegurarse de proteger estas claves para evitar la pérdida de fondos.

Para los exchanges, el enfoque más simple es utilizar una cuenta por usuario, lo que permite que Klyra maneje toda la contabilidad directamente. Para integraciones más avanzadas, los servicios pueden usar una sola cuenta para gestionar múltiples usuarios mediante el uso de [subcuentas](./accounting#subcuentas) o lógica personalizada. Si bien este enfoque puede reducir las tarifas y minimizar los riesgos mediante la agregación de posiciones, requiere una implementación más sofisticada.