# Wong Design Fundamentals — Reglas Mecánicas y Matriz de Funcionamiento

> **DOCUMENTO DE ARQUITECTURA Y CONTRATO DE DISEÑO**  
> Este documento define las reglas mecánicas del editor, la matriz de relaciones visuales y las dependencias teóricas entre modificadores basadas en la obra *Fundamentos del Diseño Bi- y Tridimensional* de **Wucius Wong**.  
> **Cualquier desarrollo, refactor o modificación futura en la aplicación debe respetar obligatoriamente este contrato.**

---

## 1. Principio Fundamental de la Interfaz: "Lo que está ON siempre afecta el Canvas"

En una herramienta de práctica para diseño gráfico, **no pueden existir modificadores con switch ON cuyos controles no tengan efecto visual inmediato en el canvas**. Si un usuario mueve un slider o cambia un parámetro de un modificador encendido, el canvas **debe responder en tiempo real**.

Para garantizar esto, el editor implementa 3 reglas mecánicas estrictas:
1. **Exclusión Mutua de Sistemas Espaciales Incompatibles:**  
   La retícula cartesiana (*Repetition*) y el esquema polar (*Radiation*) no pueden coexistir. Activar uno apaga automáticamente el otro y sus dependientes exclusivos.
2. **Auto-activación de Prerrequisitos:**  
   Si un modificador requiere una retícula o población de módulos para poder manifestarse (*Structure*, *Similarity*, *Gradation*, *Anomaly*, *Contrast*, *Concentration*) y el usuario lo enciende estando en modo módulo único, **el sistema activa automáticamente la retícula (*Repetition*)** para que el efecto sea visible de inmediato.
3. **Cascada de Apagado (Evitar Controles Fantasma):**  
   Si el usuario apaga la retícula base (*Repetition* o *Radiation*) regresando al estudio de módulo central aislado, los modificadores que dependen de una población de módulos se apagan automáticamente, evitando controles activos sin efecto en el canvas.

---

## 2. Matriz Completa de Dependencias y Comportamiento Mecánico

| Modificador | Dependencia / Requisito | Razón según el libro de Wucius Wong | Comportamiento Mecánico en la Interfaz |
| :--- | :--- | :--- | :--- |
| **Form / Module** *(CH 02)* | **Ninguna (Autónomo)** | Es la unidad visual fundamental e indivisible del diseño (figura-fondo y las 8 interrelaciones espaciales entre Form A y Form B). | **Siempre activo** en el canvas. Base matemática sobre la que operan todos los demás modificadores. |
| **Repetition** *(CH 03)* | **Incompatible con Radiation** | Multiplica el módulo en una retícula ortogonal regular cartesiana ($X, Y$). | **Al activar:** Si *Radiation* estaba activo, lo apaga automáticamente. Notifica cambio a retícula cartesiana.<br>**Al desactivar:** Si *Radiation* no está activo, apaga en cascada los modificadores dependientes de retícula (*Structure*, *Similarity*, *Gradation*, *Anomaly*, *Contrast*, *Concentration*) restaurando el modo de módulo único. |
| **Radiation** *(CH 07)* | **Incompatible con Repetition & Structure** | Estructura el espacio mediante coordenadas polares (rayos y anillos concéntricos desde un foco). | **Al activar:** Apaga automáticamente *Repetition* y *Structure* (que es exclusivo cartesiano). Notifica cambio a esquema polar.<br>**Al desactivar:** Si *Repetition* no está activo, apaga en cascada los modificadores dependientes de población (*Similarity*, *Gradation*, *Anomaly*, *Contrast*, *Concentration*) restaurando el modo de módulo único. |
| **Structure** *(CH 04)* | **Requiere Repetition (Exclusivo Cartesiano)** | Regula las líneas estructurales y los intervalos rítmicos duales ($A : B$) que gobiernan las celdas de la retícula ortogonal. No existe en coordenadas polares. | **Al activar:** Si *Radiation* estaba encendido, lo apaga y enciende *Repetition*. Si *Repetition* estaba apagado, lo enciende automáticamente.<br>**Al desactivar Repetition:** *Structure* se apaga automáticamente. |
| **Similarity** *(CH 05)* | **Requiere Retícula (Repetition o Radiation)** | Define variaciones de parentesco genético en una familia de módulos. Sin una población de módulos, no hay con quién establecer parentesco. | **Al activar:** Si no hay retícula activa (modo módulo único), activa automáticamente *Repetition* para que la variación de parentesco sea visible. |
| **Gradation** *(CH 06)* | **Requiere Retícula (Repetition o Radiation)** | Es una secuencia gradual de pasos ordenados a lo largo de un camino espacial. Requiere una progresión de módulos para manifestar el cambio. | **Al activar:** Si no hay retícula activa, activa automáticamente *Repetition* para que la progresión sea visible de inmediato en el canvas. |
| **Anomaly** *(CH 08)* | **Requiere Retícula (Repetition o Radiation)** | Es la presencia de irregularidad *donde prevalece una regularidad*. Sin una base regular previa, no existe concepto de anomalía. | **Al activar:** Si no hay retícula activa, activa automáticamente *Repetition* para establecer el campo regular donde manifestar el foco anómalo. |
| **Contrast** *(CH 09)* | **Requiere Retícula (Repetition o Radiation)** | Establece disparidad y dominancia (mayoría regular vs. minoría contrastante). Requiere una población de módulos para distribuir la dominancia. | **Al activar:** Si no hay retícula activa, activa automáticamente *Repetition* para manifestar la proporción de dominancia. |
| **Concentration** *(CH 10)* | **Requiere Retícula (Repetition o Radiation)** | Simula fuerzas gravitatorias acumulando módulos hacia puntos, líneas o vacíos dentro de un campo modular. | **Al activar:** Si no hay retícula activa, activa automáticamente *Repetition* para generar el campo de atracción. |
| **Texture** *(CH 11)* | **Ninguna (Autónomo)** | Tratamiento superficial táctil y óptico (grano litográfico, semitono, estriado). | **Funciona en todos los modos:** Aplica directamente sobre la silueta de las formas (Form A y Form B) en módulo único o sobre cada celda de cualquier retícula, o sobre el fondo. |
| **Space** *(CH 12)* | **Ninguna (Autónomo)** | Modula la ilusión de profundidad tridimensional mediante extrusión isométrica, inclinaciones y planos en conflicto. | **Funciona en todos los modos:** Transforma volumétricamente las formas planas tanto en módulo único como en retículas cartesianas o polares. |

---

## 3. Mecánica de las Study Cards (Panel Izquierdo)

1. **Sincronización Total con los Switches:**  
   Hacer clic en el botón `[×]` de una Study Card en la columna izquierda ejecuta el **mismo evento mecánico** que desmarcar el switch en el panel derecho (`toggleEl.dispatchEvent(new Event("change"))`). Esto garantiza que la cascada de apagado se ejecute con idéntica precisión.
2. **Base Permanente:**  
   La tarjeta `CH 02 • FORM & 8 INTERRELATIONS` permanece siempre en el tope del feed y no se puede cerrar.
3. **Acciones Contextuales:**  
   Cada tarjeta cuenta con botones directos:
   - `[📖 Theory]`: Navega al capítulo correspondiente en el libro/teoría.
   - `[💼 Real World]`: Navega al caso de estudio aplicado en diseño real.

---

## 4. Pipeline Gráfico de Renderizado (`StudioEngine.render`)

```
[1] Fondo (Color de papel según paleta activa e inversión Figura/Fondo)
 └── [2] Guías arquitectónicas & Safe Bounds (grilla tenue roja 48px)
      └── [2.5] Guías isométricas si Space está activo
           └── [3] Estructura espacial principal:
                ├── Si Radiation.enabled === true  ──> renderRadiation() (esquema polar)
                ├── Else if Repetition.enabled    ──> renderRepetitionGrid() (grilla cartesiana con Structure)
                └── Else                          ──> renderSingleModule() (módulo central Form A + Form B)
```

---

## 5. Colofón Editorial

El texto ubicado al pie del canvas (`#studio-colophon-text`) se deriva de `StudioEngine.getColophonString()` y enumera los principios matemáticamente reflejados en la composición:
`USED ON THIS DESIGN: FORM / REPETITION / GRADATION / TEXTURE`

---

## 6. Proporciones de Canvas (Aspect Ratios)

- **1:1 Square:** 600 × 600 px (Identidad, branding, logos)
- **9:16 Story:** 450 × 800 px (Social media, vertical reels)
- **4:3 Editorial:** 800 × 600 px (Publicaciones, afiches)
- **3:4 Poster:** 600 × 800 px (Carteles impresos)
- **16:9 Cinematic:** 800 × 450 px (Panorámico, web hero)

---

## 7. Protocolo de Compilación Obligatorio (`build.py`)

Después de cualquier modificación en los archivos de la carpeta `js/`:
```bash
python3 build.py
```
Esto genera `js/bundle.js` manteniendo sincronizada la versión standalone de la aplicación.
