Refaktoryzacja do wzorca Value Object

Wprowadzenie wzorca Value Object (Obiekt Pracy/Wartości) pozwala na przeniesienie logiki biznesowej bezpośrednio do struktur danych, które tę logikę reprezentują. W projekcie szkoleniowym refaktoryzacja ta objęła cztery kluczowe obszary, z których każdy rozwiązywał inny problem:

    DriverLicense: Rozwiązuje problem powtarzającej się walidacji. Logika sprawdzania numeru prawa jazdy została zamknięta w jednej klasie zamiast wielu rozproszonych metod.

    Money: Rozwiązuje problem zmiennej reprezentacji. Zmiana sposobu zapisu kwoty (np. dodanie waluty) jest teraz lokalna i ukryta za stabilnym interfejsem.

    Distance: Rozwiązuje problem różnorodności prezentacji danych (np. metry vs kilometry).

    Tariff: Rozwiązuje problem braku odwzorowania konceptu domenowego. Taryfa stała się jawnym elementem modelu, co poprawiło czytelność i ułatwiło zmianę sposobu naliczania kosztów.

💎 Charakterystyka Value Object

Każdy poprawnie zaimplementowany Value Object powinien spełniać pięć podstawowych kryteriów:

    Opisuje cechy konceptu, a nie sam koncept: Dystans jest cechą przejazdu. Sam w sobie, bez kontekstu, jest bezużyteczny.

    Niemutowalność (Immutability): Obiekt nie zmienia swojego stanu po utworzeniu. Każda operacja (np. dodawanie pieniędzy) zwraca nowy obiekt. Zapobiega to błędom wynikającym z przypadkowego współdzielenia stanu.

    Wiąże atrybuty w logiczną całość: Łączy dane, które nie mają sensu osobno (np. kwota + waluta, stawka + opłata początkowa).

    Stabilny interfejs i wymienność: Implementacja może się zmienić (np. sposób walidacji), ale reszta systemu korzystająca z obiektu pozostaje nienaruszona.

    Równość na podstawie wartości: Dwa obiekty są identyczne, jeśli ich atrybuty są takie same. Nie posiadają unikalnego identyfikatora (ID).

🚀 Korzyści z wprowadzenia wzorca

Wprowadzenie Value Object do systemu przynosi wymierne zyski architektoniczne:

    Jawność modelu: Kod mówi językiem biznesu (zamiast String mamy DriverLicense).

    Enkapsulacja: Logika (np. walidacja) nie wycieka do serwisów.

    Bezpieczeństwo: Niemutowalność eliminuje całą klasę błędów związanych ze skutkami ubocznymi.

    Czytelność: Redukcja parametrów w metodach i jaśniejsza struktura klas.

⚠️ Pułapka „sztuki dla sztuki”

Mimo licznych zalet, wzorca nie należy stosować bezkrytycznie. Jeśli zysk z refaktoryzacji jest znikomy, może dojść do niepotrzebnego przerostu kodu (boilerplate).

Przykład negatywny: Tworzenie klas FirstName i LastName tylko po to, by opakować Stringa, który nie posiada żadnej własnej logiki ani walidacji. W takim przypadku lepiej pozostać przy typach prostych.
Java

// Przykład nadmiarowej komplikacji (boilerplate)
class FirstName {
String name;
public FirstName(String name) { this.name = name; }
public String getName() { return name; }
}

Każda decyzja o wprowadzeniu Value Objectu powinna być podyktowana realnym problemem (np. potrzebą spójności danych lub uniknięciem duplikacji), a nie chęcią ślepego podążania za wzorcami.

# Problem powtarzającej się walidacji — Driver License

W systemach legacy często spotykamy zjawisko **Shotgun Surgery** (operacja "odłamkowa") – sytuację, w której wprowadzenie jednej, małej zmiany wymaga zmodyfikowania dziesiątek podobnych fragmentów kodu w różnych miejscach systemu. Powoduje to strach przed zmianą, ryzyko pomyłki oraz konieczność zwielokrotnionego testowania.

### 🚩 Kontekst problemu w projekcie Cabs

Aplikacja wchodzi na nowe rynki, co wiąże się z różnymi formatami numerów praw jazdy (lokalne przepisy). Obecna struktura kodu utrudnia te zmiany:

- **Duplikacja:** Logika walidacji (Regex) jest powtórzona w wielu metodach klasy `DriverService` (np. `createDriver`, `changeDriverStatus`, `changeLicenseNumber`).
- **Brak spójności:** Operując na typie `String`, nigdy nie mamy pewności, czy dany numer jest poprawny bez każdorazowego wywołania walidacji.
- **Koszty testowania:** Każde powtórzenie logiki wymaga osobnych przypadków testowych w testach integracyjnych.

---

## 🛠️ Poszukiwanie rozwiązania

Rozważano kilka opcji "ściągnięcia" rozproszonej logiki do jednego miejsca:

1. **Klasa Utils (`Utils.validateLicense`):** Rozwiązuje duplikację, ale tworzy "byt centralny" (God Object), o którym musi wiedzieć cały system. Prowadzi to do konfliktów przy scalaniu kodu (merge conflicts) i ryzyka błędów w losowych częściach systemu.
2. **Validator lub metoda prywatna:** Pomaga lokalnie, ale nie rozwiązuje problemu "pewności" co do poprawności `Stringa` w innych częściach systemu.
3. **Klasa `DriverLicense` (Value Object):** Rozwiązanie optymalne. Enkapsuluje walidację wewnątrz obiektu. Jeśli w dowolnym miejscu systemu mamy instancję tej klasy, mamy **gwarancję**, że jej stan jest poprawny.

```java
public class DriverLicense {
    private String driverLicense;

    public static DriverLicense withLicense(String driverLicense) {
        if (!driverLicense.matches(DRIVER_LICENSE_REGEX)) {
            throw new IllegalArgumentException("Illegal license no");
        }
        return new DriverLicense(driverLicense);
    }
}

```

---

## 🧪 Testy w systemach Legacy

W projektach legacy testy pełnią znacznie więcej funkcji niż tylko sprawdzanie poprawności:

- **Uczenie się systemu:** Pozwalają zrozumieć reguły biznesowe i procesy (np. jakie stany musi przejść obiekt, by funkcja była dostępna).
- **Dokumentacja:** Testy są najbardziej aktualną formą dokumentacji technicznej i przykładami użycia.
- **Siatka bezpieczeństwa:** Pozwalają na bezstresową refaktoryzację "wnętrzności" systemu.

### Strategia eliminacji duplikacji w testach

Po ekstrakcji logiki do `DriverLicense` i napisaniu dla niej testów jednostkowych, dotychczasowe testy integracyjne stają się częściowo nadmiarowe.

- **Testy jednostkowe:** Są szybkie, tanie i testują wszystkie brzegowe przypadki walidacji.
- **Testy integracyjne:** Powinny zostać uproszczone do tzw. **"happy path"**. Ich rolą jest teraz jedynie sprawdzenie, czy nowy obiekt poprawnie integruje się z resztą systemu (np. czy zapisuje się w bazie danych), a nie ponowne testowanie Regexa.

---

## 📈 Jak wdrożyć to w Twoim projekcie?

1. **Nazwij problem:** Zidentyfikuj miejsca, gdzie logika walidacji wycieka lub jest powielana (pomogą w tym narzędzia analizy statycznej kodu).
2. **Oceń ROI:** Sprawdź historię zmian – jeśli kod jest stabilny i rzadko zmieniany, refaktoryzacja może być "sztuką dla sztuki". Jeśli planujecie ekspansję lub zmiany w tym obszarze – działaj.
3. **Zastosuj Generalną Ścieżkę Refaktoryzacji:**

- Zabezpiecz się testem wysokiego poziomu (obserwowalne zachowanie).
- Wprowadź nowy koncept (Value Object).
- Podłącz nowy obiekt w miejsce `Stringów`.
- Zaobserwuj efekty (np. czy zmiana Regexa wymaga teraz modyfikacji tylko jednej klasy).

---

## 📌 Podsumowanie

> **Kluczowe wnioski:**
>
> - Powtórzenie kodu to mniejszy problem niż **powtórzona logika**.
> - Value Object daje bezpieczeństwo poprzez **silne typowanie** – nie musisz ufać `Stringom`.
> - Zasada wspinacza: najpierw test integracyjny (podparcie), potem refaktoryzacja do testu jednostkowego (ruch).

---

# Problem zmiennej reprezentacji — Money

W poprzednich lekcjach zajmowaliśmy się duplikacją logiki. Tutaj mierzymy się z innym wyzwaniem: **zmiennością reprezentacji konceptu domenowego**. Pieniądz, który początkowo był reprezentowany jako zwykły `Integer`, musi teraz ewoluować, aby obsłużyć waluty, różne precyzje zaokrągleń oraz kryptowaluty.

### 🚩 Kontekst problemu

W klasach takich jak `Transit` czy `DriverFeeService`, kwoty są zapisane jako liczby całkowite. Powoduje to szereg problemów przy próbie wejścia na nowe rynki:

- **Brak waluty:** System zakłada domyślną walutę, co uniemożliwia rozliczenia międzynarodowe.
- **Rozproszona logika obliczeń:** Operacje takie jak naliczanie opłat czy zaokrąglanie są wykonywane bezpośrednio na prymitywach, co prowadzi do "ifologii" (np. inne zaokrąglanie dla PLN, inne dla BHD).
- **Trudność zmiany:** Każda zmiana techniczna (np. przejście z `Integer` na `BigDecimal`) wymaga modyfikacji sygnatur metod i logiki w całym systemie.

---

## 🏗️ Rozwiązanie: Stabilny interfejs i koncept _Money_

Zamiast dodawać kolejne parametry (np. `String currency`) do każdej metody, wprowadzamy **Value Object `Money**`. Pełni on rolę stabilnego interfejsu, który ukrywa przed resztą systemu to, **JAK** pieniądz jest reprezentowany w środku.

### Korzyści ze stabilnego interfejsu:

1. **Enkapsulacja zmienności:** Dziś w środku może być `Integer`, jutro `BigDecimal`, a pojutrze zewnętrzna biblioteka. Dla klienta (reszty systemu) nic się nie zmienia.
2. **Lokalność zmian:** Decyzje o precyzji, walidacji walut czy sposobie formatowania (`toString`) są podejmowane w jednym miejscu.
3. **Podatność na "usuwanie":** Dobrze zdefiniowany interfejs sprawia, że kod za nim stojący jest łatwy do wyrzucenia i zastąpienia nową, lepszą implementacją bez wpływu na system.

```java
public class Money {
    private Integer value; // Detal implementacyjny

    public Money add(Money other) {
        // Logika dodawania zamknięta wewnątrz obiektu
        return new Money(value + other.value);
    }
}

```

---

## 🛠️ Techniki refaktoryzacyjne: _Extract_ i _Move Method_

Podczas wprowadzania obiektu `Money` wykorzystujemy dwie kluczowe techniki:

- **Extract Method (Wydzielenie metody):** Wyodrębniamy fragment logiki obliczeniowej (np. kalkulację ceny) z dużej metody, nadajemy mu jasną nazwę i zamykamy w nowej metodzie.
- **Move Method (Przeniesienie metody):** Jeśli wydzielona logika operuje głównie na danych obiektu `Money`, przenosimy ją z serwisu bezpośrednio do klasy `Money`. Zwiększa to **kohezję** (spójność) klas.

---

## 🧗 Zasada małych kroków i ROI

Refaktoryzacja do `Money` jest doskonałym przykładem wysokiego **ROI (Return on Investment)**:

1. **Krok 1:** Zamknięcie `Integer` wewnątrz klasy `Money` (bez zmiany bazy danych). Już to daje nam stabilny interfejs.
2. **Krok 2:** Dodanie obsługi walut wewnątrz klasy `Money`.
3. **Krok 3:** Zmiana typu wewnętrznego na `BigDecimal` lub migracja bazy danych.

Dzięki takiemu podejściu, zmiany mogą trafiać na produkcję szybciej, są bezpieczniejsze i minimalizują ryzyko konfliktów w kodzie.

---

## 📌 Podsumowanie

> **Warto zapamiętać:**
>
> - **Stabilny interfejs** to tarcza chroniąca system przed zmianami w szczegółach implementacyjnych.
> - **Usuwalność kodu** to driver architektoniczny – dążymy do tego, by części systemu dało się łatwo wymienić.
> - Refaktoryzację dzielimy na **małe kroki**, z których każdy powinien przybliżać nas do celu bez psucia obserwowalnych zachowań.

---

# 📏 Problem zmiennej prezentacji — Distance

W procesie refaktoryzacji często spotykamy kod, który nie cierpi na brak walidacji czy skomplikowany model wewnętrzny, ale ugina się pod ciężarem **różnorodności prezentacji danych**. Przykładem jest dystans, który w bazie danych może być zawsze kilometrem, ale użytkownik musi go zobaczyć w milach, metrach czy jardach.

### 🚩 Geneza problemu i „Kod Stanisława”

Wyobraźmy sobie funkcję w klasie `TransitDTO`, która przelicza dystans na podstawie parametru tekstowego `unit`.

- **Problem:** Klasa DTO, która powinna jedynie transportować dane, zaczyna zawierać złożoną logikę matematyczną i formatowanie tekstowe (np. `String.format`).
- **Skutek:** Przeładowanie kognitywne. Deweloper przeglądający DTO musi przedzierać się przez gąszcz instrukcji `if-else` i obliczeń, które są szumem informacyjnym.
- **Ryzyko:** Brak jawnego konceptu (klasy) sprawia, że inni programiści w dużym zespole mogą nie wiedzieć o istnieniu tej logiki i napisać własną wersję w innej części systemu, co prowadzi do duplikacji.

---

## 🛠️ Jak nasz problem rozwiązać?

Rozwiązaniem jest wprowadzenie **Value Objectu `Distance**`. W odróżnieniu od lekcji o [Money](https://www.google.com/search?q=../money/), gdzie dodawaliśmy nowe dane (walutę) do modelu, tutaj skupiamy się na wydzieleniu logiki prezentacyjnej.

### Stabilny interfejs `Distance`

Zamiast trzymać logikę w DTO, zamykamy ją w dedykowanej klasie. Dzięki temu:

1. **DTO odzyskuje czytelność:** Wywołuje jedynie prostą metodę `distance.printIn(unit)`.
2. **Separacja odpowiedzialności:** Klasa `Distance` może wewnętrznie delegować zadania do prywatnych komponentów: `DistanceConverter` (matematyka) i `DistanceFormatter` (tekst).
3. **Łatwa rozszerzalność:** Dodanie nowej jednostki (np. mil morskich dla motorówek) wymaga zmiany tylko w jednym, logicznym miejscu.

```java
public final class Distance {
    private final float km;

    public String printIn(String unit) {
        // Logika konwersji i formatowania ukryta za stabilnym interfejsem
        if (unit.equals("miles")) {
            return formatMiles(km / 1.609344f);
        }
        // ...
    }
}

```

---

## 🧗 ROI i „usuwalność” kodu

Gdzie leży zysk z tej inwestycji (ROI)?

- **Czystość komponentów peryferyjnych:** Zyskujemy nie tylko w samej klasie `Distance`, ale przede wszystkim tam, gdzie jest ona używana. `TransitDTO` staje się o połowę mniejszy i łatwiejszy w utrzymaniu.
- **Podatność na usuwanie:** Jeśli zdecydujemy się zmienić bibliotekę do formatowania miar na zewnętrzną, podmieniamy kod tylko wewnątrz klasy `Distance`. Reszta systemu nawet nie zauważy zmiany.

---

## 📌 Jak to zrobić w moim projekcie?

Przed wprowadzeniem takiego obiektu zadaj sobie pytania pomocnicze:

- Czy dane w bazie są stałe, ale muszą być wyświetlane na wiele sposobów?
- Czy planowane są nowe jednostki miar w przyszłości?
- Czy ta sama logika przeliczeń pojawia się w różnych raportach lub widokach?

Jeśli sposobów prezentacji jest mało i są one obsługiwane przez wbudowane funkcje języka (np. proste zaokrąglanie liczby), refaktoryzacja może być nadmiarowa. Jeśli jednak logika puchnie – stosuj **Generalną Ścieżkę Refaktoryzacji**:

1. **Bezpieczeństwo:** Napisz testy integracyjne sprawdzające obecne formaty.
2. **Nowy koncept:** Wprowadź klasę `Distance`.
3. **Podłączenie:** Zamień prymitywne `float` na obiekt `Distance`.
4. **Obserwacja:** Sprawdź, o ile czytelniejszy stał się kod wywołujący.

---

## 📌 Podsumowanie

> **Kluczowe wnioski:**
>
> - Dystans to często problem **prezentacji**, a nie reprezentacji w bazie danych.
> - Value Object redukuje **złożoność kognitywną** klas transportowych (DTO).
> - Dobra architektura pozwala na łatwe „usunięcie” starej implementacji i zastąpienie jej nową za stabilnym interfejsem.

---

# 🏷️ Problem ukrytego konceptu domenowego — Tariff

W tej lekcji mierzymy się z jednym z najtrudniejszych wyzwań w systemach legacy: **ukrytym konceptem domenowym**. Zjawisko to występuje, gdy istotna reguła biznesowa (w naszym przypadku sposób naliczania opłat) jest rozproszona w kodzie, zamiast istnieć jako samodzielny, nazwany obiekt.

### 🚩 Główne symptomy problemu

- **Niebezpieczna duplikacja:** Logika wyboru cennika znajduje się zarówno w encji `Transit` (obliczenia finansowe), jak i w `TransitDTO` (prezentacja nazwy taryfy). Co gorsza, obie implementacje różnią się strukturą `if/else`, mimo że realizują ten sam cel.
- **Sztywne powiązanie (Tight Coupling):** Każda zmiana w taryfie (np. nowy cennik na Sylwestra) wymusza jednoczesną modyfikację kilku miejsc w systemie.
- **Brak elastyczności:** Biznes chce eksperymentować z nowymi mechanizmami (np. stawki zależne od dystansu), ale obecna "ifologia" czyni to ekstremalnie ryzykownym.

---

## 🏗️ Rozwiązanie: "Make the Implicit Explicit"

Zamiast pozwalać, aby taryfa była jedynie "ulotnym wynikiem kilku instrukcji warunkowych", musimy ją **ujawnić** w kodzie jako konkretny typ: **Value Object `Tariff**`.

### Ewolucja modelu:

1. **Identyfikacja atrybutów:** Taryfa to nie tylko cena. To zestaw trzech parametrów, które zawsze występują razem: **nazwa**, **stawka kilometrowa** oraz **opłata wejściowa (base fee)**.
2. **Stworzenie fabryki:** Logikę wyboru taryfy na podstawie czasu przenosimy do metody fabrycznej `Tariff.ofTime(LocalDateTime)`.
3. **Zapamiętywanie wyboru:** Zamiast przeliczać taryfę za każdym razem, gdy wyświetlamy raport, przypisujemy obiekt `Tariff` do encji `Transit`.

---

## 🧗 Dlaczego to się opłaca (ROI)?

Wprowadzenie jawnego konceptu `Tariff` to fundament pod dalszy rozwój systemu:

- **Stabilność historyczna:** Skoro taryfa jest zapisana przy przejeździe, nie musimy się martwić, że zmiana cennika w 2026 roku zepsuje wyliczenia dla przejazdów z 2024 roku.
- **Wymienność algorytmów:** Dzięki stabilnemu interfejsowi możemy w przyszłości wprowadzić `DistanceDependentTariff` bez modyfikowania klasy `Transit`.
- **Uproszczenie DTO:** Klasa transportowa `TransitDTO` nie musi już niczego "wiedzieć" o datach – po prostu pobiera nazwę i stawki z gotowego obiektu taryfy.

> **Zasada Wspinacza:** W tej refaktoryzacji "zostawiamy kod czystszym, niż go zastaliśmy", usuwając historyczne instrukcje warunkowe (np. te sprawdzające rok 2018), które po wprowadzeniu zapisu taryfy stają się zbędne.

---

## 📌 Jak to wdrożyć w Twoim projekcie?

Zanim zaczniesz pisać kod, wykonaj "rozpoznanie walką":

- **Szukaj "sklejonych" pól:** Czy masz w kodzie zestaw zmiennych (np. `price`, `tax`, `label`), które zawsze podróżują razem? To prawdopodobnie ukryty obiekt.
- **Słuchaj biznesu:** Jeśli managerowie mówią o "Taryfie Nocnej" lub "Cenniku Weekendowym", a w kodzie widzisz tylko `dayOfWeek == 6`, masz do czynienia z brakiem mapowania języka na kod.
- **Symuluj zmianę:** Czy dodanie nowej reguły wymagałoby edycji `if`ów w trzech różnych pakietach? Jeśli tak, czas na wydzielenie konceptu.

---

## 📌 Podsumowanie

> **Warto zapamiętać:**
>
> - Jeżeli reguły biznesowe trzeba "wywnioskować" z kodu, to ten kod jest trudny w utrzymaniu. **Ujawnij je.**
> - Zapisywanie wyniku skomplikowanych obliczeń (taryfy) jest bezpieczniejsze niż ich ciągłe powtarzanie.
> - Dobry model domenowy powinien odzwierciedlać słownictwo, którym posługują się eksperci biznesowi.

---
