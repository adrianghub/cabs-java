Rozumiem, wracamy do konkretów z Twoich materiałów. Skupmy się na esencji modułu **„Lokalna struktura kodu”**, trzymając się terminologii i przykładów z kursu Legacy Fighter.

Oto poprawione podsumowanie, wierniejsze dostarczonym tekstom:

---

## 1. Lokalna struktura a Zasada Skauta

Choć największy zysk daje naprawa błędnego modelu, nie wolno zaniedbywać lokalnych zmian. Małe inwestycje w kod generują interesującą stopę zwrotu.

- **Problem w Legacy:** Przykładem jest metoda `findDriversForTransit` w `TransitService`. Widzimy tam pętle, warunki i zagnieżdżenia sięgające dziesięciu poziomów. Praca z takim kodem to ogromne **przeciążenie poznawcze**.
- **Rozwiązanie:** Stosuj mechaniczną transformację **Extract Method**. Wydzielaj bloki kodu do metod prywatnych, które nazywają biznesowe „CO”, zamiast technicznego „JAK”.
- **Zasada Skauta:** Spróbuj zostawić kod lepszym, niż go zastałeś. Jeśli widzisz drobny problem (np. „magiczne stałe”), usuń go osobnym commitem.

---

## 2. Teoria Rozbitych Okien i Syndrom Gotowanej Żaby

Degradacja kodu następuje powoli. Małe zmiany (0.01%) kumulują się, aż jakość osiągnie wartość krytyczną (**Syndrom Gotowanej Żaby**).

- **Rozbite okno:** To np. dyrektywa `SuppressWarnings` wprowadzona tylko po to, by oszukać Sonara. Brak reakcji zespołu na takie „wandalizmy” oznacza przyzwolenie na dalszą degradację.
- **Przykład Tariff:** Wprowadzenie flagi `boolean happy` do konstruktora klasy `Tariff` (dla funkcjonalności Happy Hours) to „wybicie okna”. Gdy pojawi się wymaganie „Cyber Monday” (zniżka 50% i przedrostek w nazwie), taki model okaże się zupełnie nieelastyczny i doprowadzi do duplikacji logiki w całym projekcie (np. w `TransitDTO`).

---

## 3. Brzydkie zapachy kodu (Code Smells)

Według klasyfikacji Miki Mäntyli, zapachy dzielimy na:

### Kategorie zapachów:

- **Bloaters (Rozpuchlacze):** Zbyt długie metody i listy parametrów. Przykład: operacje na `double` zamiast na **Value Object** dla współrzędnych geograficznych.
- **Object-Orientation Abusers:** Naruszanie paradygmatu OO. Przykład: instrukcje `if/instanceof` w `CommonBaseAbstractUser` (tzw. _Poor man's pattern matching_).
- **Change Preventers:** Zapachy utrudniające zmiany, jak **Shotgun Surgery** (jedna zmiana wymaga modyfikacji wielu plików, co widzieliśmy przy cennikach przed wprowadzeniem klasy `Tariff`).
- **Dispensables (Zbędne elementy):** Martwy kod, zakomentowane linie w `TransitAnalyzer`. Komentarze to nie system kontroli wersji – jeśli kod nie jest potrzebny, usuń go.
- **Couplers (Sprzęgacze):** Zbyt silne powiązania, łańcuchy wywołań (gettery zwracające obiekty, na których wołamy kolejne metody).

---

## 4. SOLID vs STUPID

Zasady SOLID pomagają tworzyć kod łatwy w utrzymaniu, podczas gdy systemy legacy często charakteryzują się cechami **STUPID**:

| Litera | Cecha STUPID               | Problem                                                   |
| ------ | -------------------------- | --------------------------------------------------------- |
| **S**  | **Singleton**              | Utrudnia testowanie i podmianę obiektów.                  |
| **T**  | **Tight Coupling**         | Silne sprzężenie, np. z konkretnym systemem fakturującym. |
| **U**  | **Untestability**          | Strach przed zmianą z powodu braku testów.                |
| **P**  | **Premature Optimization** | Optymalizacja problemów, które jeszcze nie istnieją.      |
| **I**  | **Indescriptive Naming**   | Mało znaczące nazwy (np. `iter`, `milesList`, `algo`).    |
| **D**  | **Duplication**            | Duplikacja zachowań (gorsza niż duplikacja danych).       |

---

## 5. Kluczowe techniki refaktoryzacyjne

W materiałach znajdziesz konkretne rozwiązania dla typowych problemów:

- **Strategy i Decorator:** Na dynamiczne zachowania obiektów.
- **Guard Clauses:** Na zagnieżdżoną logikę warunkową.
- **Specification:** Na zmienną logikę warunków.
- **State Machine:** Na złożone przejścia stanowe.

> **Wniosek:** Uważaj na uogólnienia. Zła abstrakcja (błędne „wyciąganie przed nawias”) jest zazwyczaj gorsza niż duplikacja zachowań.

---

**Czy chciałbyś, abym przeanalizował konkretny przykład z Twojego kodu pod kątem któregoś z wymienionych zapachów (np. Bloaters lub Change Preventers), tak jak zrobiono to w materiałach z `TransitService`?**
