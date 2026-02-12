<p align="center">
  <img src="https://img.shields.io/badge/platform-macOS%20%7C%20Linux%20%7C%20Windows-lightgrey?style=flat-square" />
  <img src="https://img.shields.io/badge/license-MIT-green?style=flat-square" />
</p>

# Canopy

**Десктопный дашборд для разработчиков.** Репозитории, pull requests, CI/CD статусы — всё в одном нативном окне. Без браузера, без подписок, без телеметрии.

---

## Проблема

У каждого разработчика есть несколько репозиториев. Чтобы понять, что происходит прямо сейчас, приходится:

- Открыть GitHub, проверить PR, переключиться на другой репо, проверить CI
- Зайти в Actions, найти упавший билд, понять в каком репо проблема
- Вспомнить, что тебя добавили ревьюером три дня назад

Canopy собирает всё в одном месте.

---

## Что внутри

- **Статусы CI/CD** по всем репозиториям — видно сразу, что сломано
- **Pull Requests** — открытые, на ревью, смёрженные
- **Список репозиториев** — язык, ветка, последний коммит
- **График активности** — визуализация CI за последнее время

---

## Установка

### Из релиза

Скачать последний билд со страницы [Releases](https://github.com/1rowvy/canopy/releases).

### Из исходников

```bash
go install github.com/wailsapp/wails/v2/cmd/wails@latest
git clone https://github.com/1rowvy/canopy.git
cd canopy
wails build
```

---

## Первый запуск

1. Запустите приложение
2. Перейдите в **Settings**
3. Вставьте [GitHub Personal Access Token](https://github.com/settings/tokens/new) (scopes: `repo`, `read:user`)
4. Нажмите **Save Token**
5. Вернитесь на **Dashboard** — данные подтянутся автоматически

---

## Лицензия

[MIT](LICENSE)
