W tej części kursu skupiamy się na „uzbrojeniu” Twojego warsztatu. Praca z systemem legacy bez odpowiedniej aparatury pomiarowej to jak nawigowanie we mgle – możesz ufać intuicji, ale liczby i wizualizacje rzadziej kłamią.

Oto zestawienie narzędzi, które pomogą Ci namierzyć, zrozumieć i spriorytetyzować problemy w Twoim kodzie.

---

## 1. CodeScene – Twoje radar techniczny i społeczny

CodeScene to narzędzie, które wykracza poza zwykłą analizę statyczną. Pozwala zobaczyć to, co niewidoczne gołym okiem w repozytorium.

- **Analiza Change Coupling:** Pomaga namierzyć pliki, które „zawsze zmieniają się razem”. Jeśli zmiana w module A wymusza zmianę w module B (choć technicznie nie są połączone), masz do czynienia z ukrytym sprzężeniem, które spowalnia rozwój.
- **Analiza struktury klas:** Automatycznie wyszukuje typowe **brzydkie zapachy kodu** (code smells) wewnątrz Twoich klas, wskazując miejsca, gdzie lokalna złożoność wymknęła się spod kontroli.
- **Priorytetyzacja długu:** Dzięki analizie częstotliwości zmian (churn) i złożoności, narzędzie podpowiada, która refaktoryzacja da Ci największy zwrot z inwestycji (ROI).

---

## 2. CodeMR – Strażnik Kohezji i Couplingu

CodeMR to wyspecjalizowane narzędzie do monitorowania dwóch najważniejszych metryk w systemach legacy: **sprzężenia (coupling)** i **spójności (cohesion)**.

- **Coupling:** Informuje o tym, jak bardzo klasy są od siebie zależne. Wysokie sprzężenie to główna przyczyna efektu domina przy wprowadzaniu zmian.
- **Cohesion:** Mówi o tym, jak bardzo odpowiedzialności wewnątrz klasy są ze sobą powiązane. Niska kohezja to sygnał, że klasa robi zbyt wiele rzeczy na raz (tzw. _God Object_).

---

## 3. PHPMetrics – Statyczna analiza dla PHP

Jeśli Twój projekt legacy jest napisany w PHP, PHPMetrics jest odpowiednikiem CodeMR. Dostarcza szerokiego oglądu sytuacji, pozwalając na głęboką analizę sprzężenia w tej konkretnej technologii. Pozwala na szybkie wyłapanie najbardziej problematycznych węzłów w grafie zależności Twojego systemu.

---

## 4. Infection – Testowanie Mutacyjne

Nawet 100% pokrycia kodu testami (Code Coverage) nie gwarantuje, że Twoje testy faktycznie cokolwiek sprawdzają. Tu do gry wchodzi Infection.

- **Zasada działania:** Narzędzie wprowadza małe błędy (mutacje) do Twojego kodu źródłowego (np. zmienia `>` na `<` lub `true` na `false`).
- **Cel:** Jeśli po wprowadzeniu błędu Twoje testy nadal przechodzą na zielono, oznacza to, że mutacja „przeżyła”, a Twój test jest słaby. Jeśli testy padną – mutacja została „zabita”, a Twój test jest wartościowy.

---

## Podsumowanie narzędziówki

| Narzędzie               | Główny cel                         | Kluczowa metryka          |
| ----------------------- | ---------------------------------- | ------------------------- |
| **CodeScene**           | Priorytetyzacja długu technicznego | Change Coupling, Hotspots |
| **CodeMR / PHPMetrics** | Wizualizacja architektury          | Coupling, Cohesion        |
| **Infection**           | Weryfikacja jakości testów         | Mutation Score            |

Zastosowanie tych narzędzi pozwala odejść od subiektywnych opinii („ten kod jest brzydki”) na rzecz twardych danych („ta klasa ma krytycznie wysokie sprzężenie i zmienia się w co drugim zadaniu”).

**Czy chciałbyś, abym przygotował dla Ciebie prosty plan, jak wprowadzić jedno z tych narzędzi (np. CodeScene lub Infection) do Waszego procesu CI/CD, aby od dziś automatycznie pilnowały jakości kodu?**
