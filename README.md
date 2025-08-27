# Express Cookies Demo

## Server starten

Führe im Projektverzeichnis folgenden Befehl aus:

```
npm install
node index.js
```

Der Server läuft dann standardmäßig auf [http://localhost:3000](http://localhost:3000).

## Was speichert der Cookie?

Der Server setzt einen Cookie namens `username`. Dieser Cookie speichert den Benutzernamen, der beim Besuch der Seite übergeben wird.

## Wo sieht man den Cookie in den DevTools?

Öffne die DevTools deines Browsers (meist mit F12 oder Rechtsklick → "Untersuchen").

- Gehe zum Tab "Application" (Chrome) oder "Speicher" (Firefox).
- Wähle im linken Menü "Cookies" und dann die URL des Servers (z.B. `http://localhost:3000`).
- Dort findest du den Cookie `username` und seinen Wert.
