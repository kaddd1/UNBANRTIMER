# ЗОНА / COUNTDOWN

Шуточный сайт с обратным отсчётом до окончания блокировки в VALORANT.

Технологии: React 19, TypeScript, Vite, Tailwind CSS.

## Запуск

Нужен Node.js 22.6 или новее.

```bash
npm install
npm run dev        # режим разработки
npm run build      # проверка типов и production-сборка в dist/
npm run preview    # локальный просмотр собранного сайта
```

## Проверки

```bash
npm run typecheck  # TypeScript (приложение, конфиги и тесты)
npm run lint       # ESLint
npm test           # юнит-тесты (node:test), файлы tests/**/*.test.ts
```

Те же проверки и сборка запускаются в GitHub Actions (`.github/workflows/ci.yml`) на каждый push в `main` и pull request.

## Настройка

Дата начала и окончания срока задаётся в [`src/config/countdown.ts`](src/config/countdown.ts) с явным смещением часового пояса (`+05:00`, Ташкент), поэтому отсчёт не зависит от часового пояса посетителя. Текущая дата окончания: 10 января 2027, 00:00 по Ташкенту.

Эпизоды из «Материалов дела» лежат в [`src/config/caseFiles.ts`](src/config/caseFiles.ts).

Часы показывают Ташкент и Лондон через `Intl` (переход Лондона на летнее и зимнее время учитывается автоматически).

## Публикация

Сайт собирается как статика (`npm run build`, папка `dist/`) и подходит для Vercel без дополнительной настройки. В `index.html` стоит `noindex, nofollow`: сайт не предназначен для индексации поисковиками.
