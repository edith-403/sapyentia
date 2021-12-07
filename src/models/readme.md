# Models
En este directorio se encuentran los modelos que se utilizaron para las colecciones utilizadas para Mongo. Aquí se encontrará documentación rápida que puede ser útil o importante. Para más información, favor de ver el directorio [docs](../../docs/).

## Tesis
El esquema de tesis cuenta con un atributo `status`, que toma los siguientes valores
```mongodb
status: Number

-1 | null | undefined: Indeterminado
0: Rechazado
1: Aceptado
```
<!-- * Status:
 * · -1 - Indeterminado
 * · 0 - Rechazado
 * · 1 - Aceptado -->