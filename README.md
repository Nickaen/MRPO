# MRPO
Первая практическая работа по МРПО<br>
Михайлов Андрей Олегович
БИВТ-23-СП3<br>
## Для запуска необходимо установить 
NodeJS - https://nodejs.org <br>
TypeScript - npm install -g typescript<br>
Type definitions - npm install --save-dev @types/node
## При добавлении новых картинок
Добавлять картинки в папку public (если нет папки public, создать ее в том же директории, что и dist, src)<br>
Картинки будут дублироваться в dist/images. Если нет такой папки, необходимо ее создать.
cd /app (app - директорий, в котором находится приложение)<br>
npm run build
## Запуск
cd /app<br>
npx serve dist
