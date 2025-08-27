# Reflexion zu Cookies im Express.js Demo-Projekt

## Cookie-Verhalten: Warum bleibt der Name nach einem Neuladen erhalten?

Der Name bleibt nach einem Neuladen der Seite erhalten, weil der Server einen Cookie im Browser des Benutzers speichert, wenn dieser sich anmeldet. Dieser Cookie enthält den Benutzernamen und wird bei jedem Seitenaufruf vom Browser automatisch an den Server gesendet. Der Server liest dann den Benutzernamen aus dem Cookie und zeigt die personalisierte Begrüßung an.

In der Anwendung wird der Cookie wie folgt gesetzt:
```javascript
res.cookie("username", username, { httpOnly: true, maxAge: 60000 });
```

Und beim nächsten Seitenaufruf wird er wie folgt gelesen:
```javascript
const username = req.cookies.username;
```

## HttpOnly-Flag: Warum kann JavaScript im Browser den Cookie nicht lesen?

Das HttpOnly-Flag verhindert, dass clientseitiges JavaScript auf den Cookie zugreifen kann. Dies ist eine Sicherheitsmaßnahme zum Schutz vor Cross-Site Scripting (XSS) Angriffen. Wenn ein Cookie das HttpOnly-Flag gesetzt hat, kann es nur vom Server gelesen und geschrieben werden, nicht von JavaScript im Browser.

In der Anwendung wird das HttpOnly-Flag wie folgt gesetzt:
```javascript
res.cookie("username", username, { httpOnly: true, maxAge: 60000 });
```

Durch diese Einstellung wird verhindert, dass bösartiges JavaScript den Cookie auslesen und z.B. an einen fremden Server senden kann.

## Lebensdauer: Was passiert nach 1 Minute, wenn maxAge: 60000 abläuft?

Das maxAge-Attribut legt fest, wie lange der Cookie gültig bleibt, gemessen in Millisekunden. Bei maxAge: 60000 läuft der Cookie nach 60.000 Millisekunden = 60 Sekunden = 1 Minute ab.

Nach Ablauf dieser Zeit:
1. Löscht der Browser den Cookie automatisch
2. Beim nächsten Seitenaufruf ist der Cookie nicht mehr vorhanden
3. Der Server erhält keinen Benutzernamen mehr im Cookie
4. Die Anwendung zeigt wieder die Startseite mit dem Login-Formular an

In der Anwendung wird der Cookie mit einer Lebensdauer von 1 Minute gesetzt:
```javascript
res.cookie("username", username, { httpOnly: true, maxAge: 60000 });
```

## Vergleich: Wie würde man dasselbe mit localStorage statt Cookies umsetzen?

localStorage ist ein clientseitiger Speichermechanismus, der keine automatische Übertragung an den Server bietet. Um das gleiche Verhalten mit localStorage zu implementieren, müsste man:

1. **Speichern des Benutzernamens**: Statt `res.cookie()`, würde man clientseitig mit JavaScript den Benutzernamen speichern:
   ```javascript
   localStorage.setItem('username', username);
   ```

2. **Senden an den Server**: Bei jedem Seitenaufruf müsste der Client den Benutzernamen im HTTP-Header oder als Teil der URL an den Server senden:
   ```javascript
   fetch(`/set-user/${localStorage.getItem('username')}`);
   ```

3. **Serverseitige Verarbeitung**: Der Server müsste den Benutzernamen aus dem Request entnehmen und in der Session speichern.

4. **Ablauf**: localStorage hat kein eingebautes Ablaufdatum. Man müsste selbst einen Zeitstempel speichern und prüfen:
   ```javascript
   localStorage.setItem('loginTime', Date.now());
   // Beim Seitenaufruf prüfen
   if (Date.now() - localStorage.getItem('loginTime') > 60000) {
     localStorage.removeItem('username');
     localStorage.removeItem('loginTime');
   }
   ```

**Nachteile von localStorage gegenüber Cookies**:
- Keine automatische Übertragung an den Server
- Kein HttpOnly-Schutz möglich
- Daten bleiben im Client und werden nicht automatisch gelöscht
- Bei verteilten Systemen muss der Benutzerstatus zwischen Servern synchronisiert werden

**Vorteile von localStorage**:
- Mehr Speicherplatz (ca. 5-10MB vs. 4KB bei Cookies)
- Daten werden nicht bei jedem Request übertragen
- Komplexere Datenstrukturen können gespeichert werden (nach JSON-Serialisierung)
