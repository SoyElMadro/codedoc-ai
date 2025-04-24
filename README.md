# **CodeDoc AI** 🤖📄  
*CodeDoc AI* es una herramienta que utiliza inteligencia artificial (Gemini AI) para generar documentación automáticamente para proyectos de código, mejorando la accesibilidad y comprensión del código fuente de manera eficiente.

---

## **📑 Tabla de Contenidos**

- [Descripción](#descripción)
- [Características](#características)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Uso en Línea](#uso-en-línea)
- [Contribuir](#contribuir)
- [Licencia](#licencia)
- [Configuración de API](#configuración-de-api)

---

## **📝 Descripción**  

*Codedoc AI* es una plataforma en línea que genera documentación automáticamente para tus proyectos de software. Utilizando Gemini AI, el sistema analiza el código fuente y produce explicaciones claras y detalladas de las funciones, clases y estructuras del código. Esto facilita la comprensión del código y mejora la accesibilidad para otros desarrolladores.

---

## **✨ Características**  

- **Generación automática** de documentación basada en Gemini AI. 🤖
- **Soporte** para múltiples lenguajes de programación (más lenguajes serán soportados en el futuro). 🌍
- **Interfaz sencilla** y fácil de usar. 🎨
- **Personalización** de la salida de documentación. ⚙️
- **Accesibilidad en línea** desde cualquier navegador. 🌐

---

## **🛠️ Tecnologías Utilizadas**  

Este proyecto está construido con las siguientes tecnologías:

- **Next.js 14**: Framework para React que permite crear aplicaciones web rápidas y escalables. ⚡
- **TailwindCSS 3**: Framework CSS para diseño rápido y responsivo. 🎨
- **TypeScript**: Lenguaje de programación para escribir código más seguro y fácil de mantener. 🖥️
- **Node.js**: Entorno de ejecución de JavaScript para el backend. 🔧
- **Gemini AI**: Para procesar y generar documentación a partir del código fuente. 🤖

---

## **🚀 Uso en Línea**  

1. Accede al proyecto en su página publicada: [Codedoc AI](https://codedoc-ai.vercel.app) (asegúrate de reemplazar la URL por la correcta si es diferente). 🌍
2. Carga tu código fuente en la aplicación usando el formulario de carga disponible. 📤
3. Configura las opciones de personalización de la documentación, si lo deseas. ⚙️
4. Haz clic en **"Generar Documentación"** y espera a que Gemini AI procese el código y genere la documentación. 🧠
5. Descarga o visualiza la documentación generada directamente desde la interfaz. 📥

---

## **💡 Contribuir**  

¡**Contribuciones** son bienvenidas! Si deseas contribuir al proyecto o agregar nuevas funcionalidades, sigue estos pasos:

1. Haz un fork del repositorio. 🍴
2. Crea una rama para tu cambio:  
   ```bash
   git checkout -b feature/mi-nueva-funcionalidad
   ```
3. Realiza los cambios y haz commits:  
   ```bash
   git commit -am 'Añadir nueva funcionalidad'
   ```
4. Empuja los cambios a tu repositorio:  
   ```bash
   git push origin feature/mi-nueva-funcionalidad
   ```
5. Abre un **Pull Request** para que podamos revisar y discutir tus cambios. 📥

Si tienes ideas para nuevas características o mejoras, no dudes en abrir un [Issue](https://github.com/SoyElMadro/codedoc-ai/issues) para discutirlas con la comunidad. 💬

---

## **📜 Licencia**  

Este proyecto está bajo la Licencia **MIT**. Consulta el archivo [LICENSE](LICENSE) para más detalles. 📃

---

## **🔑 Configuración de API**  

Este proyecto utiliza la API de **Gemini AI** para procesar y generar documentación. Asegúrate de configurar las credenciales de Gemini AI si decides ejecutar el proyecto localmente o realizar contribuciones.

1. Crea una cuenta en [Gemini AI](https://gemini-ai.com/signup/). 📝
2. Obtén tu clave API desde el [panel de Gemini AI](https://gemini-ai.com/account/api-keys). 🔑
3. Si deseas ejecutar el proyecto localmente, configura tu clave API en el archivo `.env.local`:

    ```env
    GEMINI_API_KEY=tu_clave_api
    ```
