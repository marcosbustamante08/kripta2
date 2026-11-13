#!/bin/sh
# Crea un historial de Git donde se "borra" un secreto pero sigue en el historial.
# Ejecuta esto en la carpeta del proyecto antes de subirlo a GitHub.
git init -q
git add -A && git commit -q -m "Primera versión de la web"
printf 'DB_PASSWORD=Kripta2024!\nAPI_KEY=kr_live_FAKE_9f8e7d6c5b4a3210\n' > .env
git add .env && git commit -q -m "Añadir configuración local"
git rm -q .env && git commit -q -m "Quitar .env (ya no hace falta)"
echo "Listo. Prueba: git log --oneline  y  git show HEAD~1"
