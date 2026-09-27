# Wong Design Fundamentals — Reglas Mecánicas y Matriz de Funcionamiento

> **DOCUMENTO DE ARQUITECTURA Y CONTRATO DE DISEÑO**  
> Este documento define las reglas de funcionamiento mecánico del editor, la matriz de relaciones visuales y las dependencias teóricas entre modificadores basadas en la obra *Fundamentos del Diseño Bi- y Tridimensional* de **Wucius Wong**.  
> **Cualquier desarrollo, refactor o modificación futura en la aplicación debe respetar obligatoriamente este contrato.**

---

## 1. Principio Fundamental de la Interfaz (UX)

1. **Autonomía del Usuario (No Forzar Switches):**  
   Ningún modificador debe encender o apagar automáticamente los switches de otros modificadores. El usuario tiene control manual total sobre los switches de su fórmula compositiva.
2. **Pedagogía Activa (Avisos Explicativos):**  
   Si un modificador requiere un prerrequisito estructural que no está encendido en ese momento, el modificador se activa normalmente en la interfaz, abre sus controles y notifica educadamente mediante:
   - Un **Toast explicativo** con la razón conceptual según Wong.
   - Una **Insignia de advertencia pedagógica** (`dep-warning-...`) dentro de su acordeón en el panel derecho.
   - Una **Píldora de estado** en la Study Card correspondiente en el feed lateral izquierdo (ejemplo: `Requires Repetition grid`).
3. **Precedencia Óptica en el Render:**  
   Cuando conviven sistemas geométricos incompatibles (por ejemplo retícula cartesiana vs. sistema polar), el motor de renderizado (`StudioEngine`) aplica una precedencia visual matemática clara sin necesidad de mutar ni destruir el estado de los controles del usuario.

---

## 2. Matriz de Dependencias y Comportamiento Mecánico

| Modificador | Dependencia / Requisito | Razón según el libro de Wucius Wong | Comportamiento si no se cumple el requisito |
| :--- | :--- | :--- | :--- |
| **Form / Module** *(CH 02)* | **Ninguna (Autónomo)** | Es la unidad visual fundamental e indivisible del diseño (figura-fondo y las 8 interrelaciones espaciales). | Siempre activo en el canvas. Base de toda la experiencia de composición. |
| **Repetition** *(CH 03)* | **Ninguna (Autónomo)** | Multiplica el módulo en una retícula ortogonal regular cartesiana, creando cadencia rítmica. | Funciona por sí solo. Si *Radiation* está activo, se notifica que la estructura polar tiene precedencia espacial en el lienzo. |
| **Radiation** *(CH 07)* | **Ninguna (Autónomo)** | Estructura el espacio mediante coordenadas polares (rayos y anillos concéntricos desde un foco). | Funciona por sí solo. Prevalece ópticamente sobre la retícula cartesiana si ambas están encendidas, sin apagar el switch de *Repetition*. |
| **Structure** *(CH 04)* | **Requiere Repetition** | Regula las líneas estructurales y los intervalos rítmicos duales ($A : B$) que gobiernan las celdas de la retícula. | Se activa sin forzar otros switches. Muestra toast explicativo e insignia de aviso en su acordeón y en su Study Card indicando que requiere *Repetition*. |
| **Similarity** *(CH 05)* | **Requiere Repetition o Radiation** | Define variaciones de parentesco genético en una familia de módulos. Sin un grupo/población, no hay con quién establecer parentesco. | Se activa sin forzar otros switches. Muestra toast explicativo e insignia de aviso si no hay retícula cartesiana ni polar activa. |
| **Gradation** *(CH 06)* | **Requiere Repetition o Radiation** | Es una secuencia gradual de pasos ordenados a lo largo de un camino espacial. Requiere una progresión de módulos para manifestar el gradiente. | Se activa sin forzar otros switches. Muestra toast explicativo e insignia de aviso si no hay retícula cartesiana ni polar activa. |
| **Anomaly** *(CH 08)* | **Requiere Repetition o Radiation** | Es la presencia de irregularidad *donde prevalece una regularidad*. Sin una base regular previa, no existe concepto formal de anomalía. | Se activa sin forzar otros switches. Muestra toast explicativo e insignia de aviso si no hay retícula cartesiana ni polar activa. |
| **Contrast** *(CH 09)* | **Requiere Repetition o Radiation** | Establece disparidad y dominancia (mayoría regular vs. minoría contrastante). Requiere una población de módulos para distribuir la dominancia. | Se activa sin forzar otros switches. Muestra toast explicativo e insignia de aviso si no hay retícula cartesiana ni polar activa. |
| **Concentration** *(CH 10)* | **Requiere Repetition o Radiation** | Simula fuerzas gravitatorias acumulando módulos hacia puntos, líneas o vacíos dentro de un campo modular. | Se activa sin forzar otros switches. Muestra toast explicativo e insignia de aviso si no hay retícula cartesiana ni polar activa. |
| **Texture** *(CH 11)* | **Ninguna (Autónomo)** | Tratamiento superficial táctil y óptico (grano litográfico, semitono, estriado). | Opera directamente sobre la superficie de las figuras (*shapes*) o sobre el canvas completo. |
| **Space** *(CH 12)* | **Ninguna (Autónomo)** | Modula la ilusión de profundidad tridimensional mediante extrusión isométrica, inclinaciones y planos en conflicto. | Transforma volumétricamente las formas planas sin requerir retícula previa. |

---

## 3. Pipeline de Renderizado (`StudioEngine.render`)

El método `render(palette)` ejecuta las capas gráficas en el siguiente orden estricto:

```
[1] Fondo (Color de papel / lienzo según paleta activa e inversión Figura/Fondo)
 └── [2] Guías de dibujo arquitectónico & Safe Bounds (grilla tenue roja 48px)
      └── [2.5] Guías isométricas si Space está activo
           └── [3] Estructura espacial principal:
                ├── Si Radiation.enabled === true  ──> renderRadiation() (prevalencia polar)
                ├── Else if Repetition.enabled    ──> renderRepetition() (grilla cartesiana con Structure si está activa)
                └── Else                          ──> renderSingleModule() (módulo central aislado)
```

### Prevalencia y Modulación:
- **Radiation vs. Repetition:** Si el usuario tiene encendidos ambos, `renderRadiation` se dibuja en el canvas. Al apagar `Radiation`, el canvas vuelve inmediatamente a `renderRepetition` sin que el usuario haya perdido su configuración previa de filas/columnas.
- **Moduladores de Población:** `Similarity`, `Gradation`, `Anomaly`, `Contrast` y `Concentration` se inyectan dinámicamente durante el bucle de celdas en `renderRepetition` o `renderRadiation`.

---

## 4. Feed Lateral de Study Cards (`#studio-study-cards-sidebar`)

- **Columna izquierda:** Ubicada a la izquierda del canvas con scroll independiente (`#studio-cards-feed`).
- **Base permanente:** La tarjeta **CH 02 • FORM & 8 INTERRELATIONS** permanece siempre en el tope del feed y no tiene botón de cerrado (`[×]`).
- **Apilamiento dinámico:** Cada modificador activo en el panel derecho agrega su respectiva Study Card al feed en orden secuencial de capítulos.
- **Acciones en cada Study Card:**
  - `[×]`: Desactiva el modificador en el estado y en la interfaz.
  - `[📖 Theory]`: Cambia a la pestaña de Teoría y carga el capítulo correspondiente.
  - `[💼 Real World]`: Cambia a la pestaña de Casos Reales y carga el proyecto correspondiente.
  - **Insignia contextual:** Indica si el modificador tiene una dependencia pendiente o si otro sistema prevalece.

---

## 5. Colofón Editorial y Fórmula de Composición

Ubicado al pie del canvas de estudio (`#studio-colophon-text`):
- Se actualiza automáticamente a través de `StudioEngine.getColophonString()`.
- Refleja únicamente los principios matemáticamente aplicados sobre la composición en ese instante:
  `USED ON THIS DESIGN: FORM / REPETITION / GRADATION / TEXTURE`

---

## 6. Proporciones de Canvas (Aspect Ratios)

El canvas de estudio soporta las siguientes relaciones de aspecto con nitidez Retina HiDPI:
- **1:1 Square:** 600 × 600 px (Identidad, iconos, avatares)
- **9:16 Story:** 450 × 800 px (Social media, vertical reels)
- **4:3 Editorial:** 800 × 600 px (Publicaciones, catálogos)
- **3:4 Poster:** 600 × 800 px (Afiches y carteles impresos)
- **16:9 Cinematic:** 800 × 450 px (Pantallas panorámicas y hero sections)

---

## 7. Protocolo de Compilación Obligatorio (`build.py`)

La aplicación cuenta con una arquitectura de módulos ES en `js/` y un archivo empaquetado para compatibilidad local y web en `js/bundle.js`.
**Después de cualquier cambio en los archivos de `js/`, es mandatario ejecutar:**

```bash
python3 build.py
```

Esto garantiza que la versión bundle permanezca siempre 100% sincronizada con los módulos individuales.
