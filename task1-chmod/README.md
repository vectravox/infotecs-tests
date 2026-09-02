# Задание №1: Тестирование утилиты `chmod`
Автотесты для `chmod` с использованием Cucumber.js и Bun.

## Установка и подготовка окружения

### Требования
- [Bun](https://bun.com/docs/installation)

### Установка зависимостей
```bash
cd task1-chmod
bun install
```

## Запуск тестов
```bash
bun run test
```

## Docker

### Сборка
```bash
docker build -t task1-chmod .
```

### Запуск
```bash
docker run --rm task1-chmod
```

## Структура

```
features/
├── chmod.feature              # Сценарии на русском языке
└── step_definitions/
    └── chmod.steps.cjs        # Реализация шагов
```
