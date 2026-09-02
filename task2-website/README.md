# Задание №2: Тестирование infotecs.ru
Автоматизированные тесты для сайта [infotecs.ru](https://infotecs.ru) с использованием Playwright и Page Object Model (POM).

## Установка и подготовка окружения

### Требования
- [Bun](https://bun.com/docs/installation)

### Установка зависимостей
```bash
cd task2-website
bun install
```

### Установка браузера Chromium для Playwright
```bash
bunx playwright install chromium
```

### Установка системных зависимостей для Chromium (опционально)
Если при запуске тестов возникают ошибки, связанные с библиотеками:
```bash
bunx playwright install-deps chromium
```

## Запуск тестов

### Обычный запуск (headless)
```bash
bun run test
```

### Запуск с открытым браузером (headed)
```bash
bun run test:headed
```

## Просмотр отчёта

### Через CLI
```bash
bun run report
```

### Вручную
Откройте `playwright-report/index.html` в браузере.

## Работа с Docker

### Сборка образа
```bash
docker build -t task2-website .
```

### Запуск контейнера с сохранением отчёта
```bash
docker run --rm -v $(pwd)/playwright-report:/app/playwright-report task2-website
```

### Получение отчёта из контейнера
После запуска отчёт сохранится в папке `playwright-report/` в текущей рабочей директории. Откройте `playwright-report/index.html` в браузере.

## Структура проекта

```
task2-website/
├── pages/
│   ├── homePage.js       # Page Object для главной страницы
│   └── patentsPage.js    # Page Object для страницы патентов
├── tests/
│   └── infotecs.spec.js  # Тесты
├── playwright.config.js  # Конфигурация Playwright
├── package.json
├── Dockerfile
└── README.md
```
