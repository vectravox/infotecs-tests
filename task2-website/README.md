## Запуск тестов
Стандартный запуск.
```bash
bun run test
```

В "headed" режиме.
```bash
bun run test:headed
```

### Просмотр HTML-отчета
Командой:
```bash
bun run report
```

Либо открыть вручную в браузере `playwright-report/index.html`.

## Docker

### Сборка образа
```bash
docker build -t task2-website .
```

### Запуск контейнера с сохранением отчёта
```bash
docker run --rm -v $(pwd)/playwright-report:/app/playwright-report task2-website
```

## Получение отчёта
После запуска отчёт появится в текущей рабочей директории в `playwright-report/` на хосте.
Откройте `playwright-report/index.html` в браузере.
