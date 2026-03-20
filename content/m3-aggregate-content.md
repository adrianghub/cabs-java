# 🧱 Refaktoryzacja do wzorca Aggregate (Agregat)

Refaktoryzacja do wzorca **Aggregate** (Agregat) to moment, w którym przestajemy patrzeć na obiekty jak na zwykłe kontenery na dane (worki z polami), a zaczynamy widzieć w nich **strażników reguł biznesowych**. W projekcie Cabs to przejście pozwala wyeliminować błędy wynikające z niespójności danych, gdzie "każdy mógł ustawić wszystko" za pomocą setterów.

---

## 🧐 Czym właściwie jest Agregat?

Agregat to klaster powiązanych obiektów (encji i Value Objectów), które traktujemy jako jedną jednostkę pod kątem zmiany danych.

### Kluczowe cechy Agregatu:

- **Decyzyjność:** To on mówi "tak" lub "nie" operacji biznesowej na podstawie swoich wewnętrznych reguł (**niezmienników**).
- **Granica spójności:** Wszystko, co dzieje się wewnątrz agregatu, musi być spójne natychmiastowo (w jednej transakcji).
- **Tożsamość:** Agregat ma unikalne ID. Nawet jeśli dwa przejazdy mają te same parametry, to dzięki ID wiemy, że to dwa różne wydarzenia.
- **API oparte na zachowaniach:** Zamiast `setAddress()`, mamy `changePickupTo()`. To różnica między "ustawieniem pola" a "wykonaniem operacji biznesowej".

---

## 📜 4 Zasady projektowania Agregatów

Aby agregaty nie stały się "wszystkomającymi" gigantami, które blokują całą bazę danych, stosujemy cztery złote zasady:

### 1. Modeluj prawdziwe niezmienniki

Niezmiennik to reguła, która **zawsze** musi być prawdziwa.

- _Przykład:_ Nie możesz zmienić adresu odbioru w klasie `Transit`, jeśli licznik zmian przekroczył 2 lub jeśli status to już `IN_PROGRESS`.

> Te reguły muszą być sprawdzane wewnątrz agregatu, a nie w serwisie.

### 2. Projektuj małe agregaty

Im mniejszy agregat, tym mniejsza szansa na konflikty podczas jednoczesnej edycji przez wielu użytkowników.

- _Przykład:_ Rozbicie `CarType` na `CarType` (reguły) i `CarTypeActiveCounter` (techniczny licznik). Dzięki temu zmiana nazwy typu samochodu nie blokuje operacji rejestracji nowego auta.

### 3. Odwołuj się do innych agregatów przez Tożsamość (ID)

Nie osadzaj całego obiektu `Driver` wewnątrz obiektu `Transit`. Trzymaj tam tylko `driverId`.

- **Dlaczego?** Bo kierowca ma własny cykl życia i własne reguły. Gdybyśmy mieli referencję do całego obiektu, granica tego, co zmieniamy w jednej transakcji, zaczęłaby się niebezpiecznie rozmywać.

### 4. Wykorzystuj model Eventual Consistency (Spójność Końcowa)

Jeśli zmiana w `Transit` musi pociągnąć za sobą zmianę w `AwardsAccount`, nie musisz robić tego w tym samym momencie.

- Użyj mechanizmu zdarzeń (Events). Agregat A publikuje informację o zmianie, a Agregat B reaguje na nią po chwili. System "docelowo" będzie spójny.

---

## 🚀 Przykłady efektów refaktoryzacji

| Obiekt            | Problem przed zmianą                                | Rozwiązanie (Agregat)                                         |
| ----------------- | --------------------------------------------------- | ------------------------------------------------------------- |
| **Transit**       | Niespójne settery, logika rozproszona w serwisach.  | Metody `changePickupTo()` i `confirm()` chroniące stan.       |
| **AwardsAccount** | Punkty naliczane "z zewnątrz", ryzyko błędnych sum. | Agregat sam pilnuje polityk naliczania i usuwania mil.        |
| **CarType**       | Jeden wielki obiekt techniczny blokujący biznes.    | Rozbicie na reguły biznesowe i wydajny licznik aktywnych aut. |

> **Pamiętaj:** Agregat to jednostka transakcyjna. Zmieniamy albo wszystko wewnątrz niego, albo nic.

---

## 📈 Jaki jest zwrot z tej inwestycji (ROI)?

Zyskujemy **testowalność jednostkową**. Nie musisz już stawiać połowy bazy danych i tworzyć skomplikowanych mocków, żeby sprawdzić, czy reklamacja zostanie uznana. Wystarczy stworzyć obiekt `ClaimResolver`, nakarmić go danymi i sprawdzić wynik metody. To proste, szybkie i odporne na błędy.

---

# ⚠️ Problem braku spójności danych — Transit

W systemach legacy jednym z najpoważniejszych ryzyk jest utrata **spójności danych**. W projekcie _Cabs_ objawiało się to np. anulowaniem przejazdu bez wyzerowania dystansu lub możliwością zmiany adresu odbioru po zakończeniu trasy. Takie błędy wynikają bezpośrednio z architektury opartej na **anemicznym modelu domenowym**.

### 🚩 Geneza problemu: Cykl "Pobierz - Sprawdź - Ustaw"

Obecnie klasa `Transit` to jedynie worek na dane (settery i gettery), a cała logika biznesowa znajduje się w `TransitService`.

W tym modelu programista musi:

1. **Pobrać** wartość z obiektu (np. `getStatus()`).
2. **Sprawdzić** reguły w serwisie (instrukcje `if`).
3. **Ustawić** nową wartość (np. `setStatus(CANCELLED)`).

**Ryzyko:** Możesz wywołać setter pomijając sprawdzenie reguł lub zapominając o aktualizacji powiązanych pól (np. licznika odrzuceń kierowców). Architektura w żaden sposób nie broni obiektu przed wejściem w niepoprawny stan.

---

## 🏗️ Rozwiązanie: Przywrócenie Enkapsulacji

Zamiast trzymać reguły w serwisie, przenosimy je bezpośrednio do obiektu `Transit`. Zamieniamy settery na metody **wyrażające intencję biznesową**.

### Transformacja kodu:

- **ZAMIAST:** `transit.setStatus(Status.CANCELLED)` oraz `transit.setKm(0)`.
- **WPROWADZAMY:** `transit.cancel()`.

Wewnątrz metody `cancel()` to sam obiekt `Transit` dba o to, by status zmienił się razem z wyzerowaniem kilometrów. Jeśli stan obiektu nie pozwala na anulowanie, metoda rzuca wyjątek.

```java
public void cancel() {
    if (!status.canBeCancelled()) {
        throw new IllegalStateException("Cannot cancel transit in status: " + status);
    }
    this.status = Status.CANCELLED;
    this.km = 0;
    this.awaitingDriversResponses = 0;
}

```

---

## 🧗 Dlaczego to się opłaca?

1. **Gwarancja spójności:** Nie da się zmienić statusu bez wyzerowania licznika – te dwie operacje są teraz "atomowe" z perspektywy biznesu.
2. **Testowalność jednostkowa:** Logikę można przetestować w ułamku sekundy testem jednostkowym klasy `Transit`, zamiast stawiać całą bazę danych dla testu serwisu.
3. **Lokalna refaktoryzacja:** Jeśli zmienisz nazwę pola wewnątrz `Transit`, nie musisz poprawiać dziesięciu serwisów. Zmieniasz tylko kod wewnątrz jednej klasy.

---

## 📌 Jak to wdrożyć u siebie?

Jeśli w Twoim projekcie widzisz "sekwencje setterów" wywoływane w serwisach, to znak, że brakuje tam enkapsulacji.

1. **Zidentyfikuj powiązane dane:** Które pola zawsze zmieniają się razem? (np. `status` i `acceptedAt`).
2. **Stwórz metodę biznesową:** Nazwij ją tak, jak opisuje to biznes (np. `publish()`, `rejectBy(driver)`).
3. **Ukryj settery:** Zrób je prywatne lub usuń całkowicie.
4. **Przenieś reguły:** Przenieś instrukcje `if` z serwisu do nowej metody w obiekcie.

> **Pamiętaj:** Nie naprawisz całego systemu naraz. Skup się na przywróceniu spójności w jednym miejscu. Klasa może stać się większa, ale będzie bezpieczniejsza i łatwiejsza w zrozumieniu.

---

# 🚦 Problem dostępności: Zbyt duży Agregat (CarType)

W systemie "Cabs" natrafiliśmy na klasyczny problem, gdzie **architektura techniczna blokuje biznes**. Administratorzy nie mogą zmienić opisu klasy pojazdu (np. "Eco" na "Eco Plus"), ponieważ system jest "bombardowany" żądaniami od kierowców, którzy logując się i wylogowując, aktualizują licznik aktywnych aut w tej samej tabeli.

---

## ⚔️ Anatomia konfliktu: Write-Write

Mamy tu do czynienia z konfliktem typu **Write-Write**. Dwie niezależne operacje próbują zapisać dane w tym samym rekordzie bazy danych:

1. **Administrator:** Rzadka zmiana (raz na miesiąc), ale ważna.
2. **Kierowcy:** Bardzo częste zmiany (tysiące razy na godzinę).

Ponieważ obie te informacje (opis i licznik) mieszkają w jednym obiekcie `CarType`, baza danych lub mechanizm **blokowania optymistycznego** (Optimistic Locking) uniemożliwia administratorowi "wstrzelenie się" ze swoją zmianą.

---

## ✂️ Rozwiązanie: Fizyczny podział (Eksmisja sąsiada)

Najlepszą strategią nie jest przeniesienie administratora do "okna serwisowego" o 3 nad ranem, lecz **rozbicie Agregatu**. Stosujemy zasadę "hałaśliwego sąsiada" – jeśli jedna dana (licznik) generuje mnóstwo ruchu i blokuje inne, musimy ją wyeksmitować do osobnej tabeli.

### Nowy podział:

- **CarType:** Zawiera opis, klasę i status. Tu zostawiamy **blokowanie optymistyczne**, bo chronimy reguły (np. nie można aktywować klasy, jeśli nie ma w niej aut).
- **CarTypeActiveCounter:** Zawiera tylko licznik. Tutaj blokowanie optymistyczne jest zbędne, a wręcz szkodliwe.

### 💡 Technika "Dźwigni" (Leverage)

Możesz pomyśleć: _"Ale teraz odczyt wymaga dwóch zapytań (lub JOIN-a)!"_. To prawda. Ale to jest właśnie **dźwignia**:

- **Koszt:** Minimalnie wolniejszy odczyt DTO (praktycznie niezauważalny).
- **Zysk:** Pełna dostępność systemu. Administrator może pracować w południe, a kierowcy nie blokują się nawzajem.

---

## 🛠️ Concurrency bez konfliktów (Lost Updates)

Dla licznika (`CarTypeActiveCounter`) nie potrzebujemy skomplikowanych mechanizmów ORM, które nadpisują cały rekord. Zamiast tego możemy użyć atomowych operacji SQL:

```sql
UPDATE car_type_active_counter
SET active_cars_counter = active_cars_counter + 1
WHERE car_class = 'ECO';

```

Dzięki temu, że dodawanie jest przemienne, wiele wątków może jednocześnie aktualizować licznik bez ryzyka **zgubionych aktualizacji** (Lost Updates) i bez wzajemnego blokowania.

---

## ⚠️ Co zrobić, gdy podczas refaktoryzacji znajdziesz błąd?

Podczas prac w `Cabs` odkryto, że system przy wylogowaniu zmieniał... niewłaściwy licznik (ogólny zamiast aktywnego).

**Zasada bezpiecznej refaktoryzacji:**

1. **Nie naprawiaj od razu:** Refaktoryzacja to zmiana struktury, nie zachowania.
2. **Oceń skutki:** Czy ktoś kompensuje ten błąd "ręcznie" poza systemem? Jeśli tak, Twoja "poprawka" zepsuje raporty finansowe.
3. **Oddzielny commit:** Jeśli decydujesz się na naprawę, zrób to w osobnym kroku, po zakończeniu zmian strukturalnych.

---

## 📋 Strategia dla Twojego projektu

Jeśli Twoi użytkownicy narzekają, że "system czasem nie przyjmuje zmian", sprawdź:

- Czy masz w systemie "grube" obiekty, które są dotykane przez wiele różnych procesów?
- Czy stosujesz blokowanie optymistyczne tam, gdzie nie ma żadnych reguł biznesowych do ochrony?
- Czy możesz wydzielić "gorące dane" (liczniki, statusy techniczne) do osobnych tabel?

---

# 🔄 Mikrocykle w refaktoryzacji

Refaktoryzacja systemu legacy to nie jest szarża ułańska, gdzie rzucasz się na tysiące linii kodu i liczysz na to, że po tygodniu wszystko zacznie kompilować. To raczej precyzyjna operacja na otwartym sercu, którą dzielimy na **mikrocykle**.

---

## 🔬 Dlaczego "Mikro" ma znaczenie?

Dzielenie dużego zadania (jak rozbicie klasy `CarType`) na mniejsze kroki pozwala nam na:

- **Wczesne wykrywanie ryzyk (Fail-Fast):** Jeśli podłączenie klientów do nowego obiektu okaże się niemożliwe, chcemy o tym wiedzieć w poniedziałek, a nie po trzech tygodniach pisania skryptów migracyjnych.
- **Równoległe prace:** Inni programiści mogą pracować nad różnymi etapami planu.
- **Psychologię sukcesu:** Każdy wdrożony mały krok to zastrzyk dopaminy dla zespołu i sygnał dla biznesu, że system "żyje".

---

## 📋 Plan bitwy: Rozbicie klasy CarType

W standardowym scenariuszu (rozwiązujemy problem dostępności), nasze kroki wyglądają tak:

1. **Krok 0: Zabezpieczenie terenu** – Pisanie testów integracyjnych, które potwierdzają obecne zachowanie.
2. **Krok 1: Fizyczny podział** – Utworzenie nowej klasy `CarTypeActiveCounter` i nowej tabeli w bazie.
3. **Krok 2: Edukacja klientów** – Przepięcie komponentów (np. `DriverSessionService`), aby zaczęły używać nowego licznika.
4. **Krok 3: Porządki (Migracja)** – Przeniesienie starych danych i ewentualne usunięcie zbędnych kolumn.

---

## 🎩 Sztuczka: Wzorzec Proxy (Gdy system jest "trudny")

Czasem podłączenie reszty systemu do nowego obiektu jest tak ryzykowne, że chcemy to zrobić **zanim** fizycznie rozdzielimy dane w bazie. Wtedy stosujemy **Proxy**.

### Jak to działa?

Tworzysz nową klasę `CarTypeActiveCounter`, ale w środku... ona nie ma własnych danych. Ma tylko referencję do starego `CarType` i deleguje do niego wszystkie zadania.

```java
public class CarTypeActiveCounter {
    private final CarType carType; // Delegacja do starego obiektu

    public void registerActiveCar() {
        carType.registerActiveCar(); // Udajemy, że to my robimy robotę
    }
}

```

**Co zyskujesz?**

- Możesz podłączyć cały system do nowego API.
- Jeśli przepięcie się uda – masz "wygrzany" kod na produkcji.
- Dalsza refaktoryzacja (przeniesienie danych do nowej tabeli) staje się **zmianą lokalną**, o której reszta systemu nawet nie musi wiedzieć.

---

## 💡 Zapamiętaj

> _"Make the change easy, then make the easy change."_ – Kent Beck

Refaktoryzacja w mikrocyklach to zamiana zmiany globalnej (niebezpiecznej) w serię zmian lokalnych (bezpiecznych). Jeśli coś w Twoim planie wydaje się najtrudniejsze – zrób to na samym początku, używając Proxy lub innej "zaślepki", aby sprawdzić, czy reszta systemu to przeżyje.

---

**Masz w swoim projekcie taką "klasę-potwora", którą strach ruszyć? Może spróbujemy wspólnie rozpisać dla niej plan mikrocykli i sprawdzić, gdzie najlepiej pasowałoby Proxy?**

---

# ⚖️ Problem pomieszanej logiki — Reklamacje (Claim)

W systemach legacy często spotykamy klasy takie jak `ClaimService`, gdzie prosta na początku logika z czasem staje się "gotującą się żabą". Problemem nie jest sam rozmiar kodu, ale **wymieszanie różnych rodzajów odpowiedzialności**, co uniemożliwia proste testowanie i bezpieczne wprowadzanie zmian.

---

## 🧩 Trzy rodzaje logiki

Aby naprawić ten problem, musimy najpierw nauczyć się rozróżniać rodzaje logiki, które spotykamy w kodzie:

1. **Logika Walidacyjna:** Sprawdza poprawność danych wejściowych (np. czy numer seryjny jest wpisany). Nie wymaga sięgania do bazy danych.
2. **Logika Biznesowa (Domenowa):** Podejmuje kluczowe decyzje i zapewnia spójną zmianę stanu (np. czy możemy uznać reklamację?). Musi dziać się "tu i teraz".
3. **Logika Procesowa:** Opisuje długotrwały przebieg zdarzeń ("JEŚLI uznano, TO wyślij maila, A NASTĘPNIE zleć kuriera"). Jej skutki mogą być odroczone w czasie.

---

## 🛠️ Rozwiązanie: Rozdzielenie Decyzji od Konsekwencji

Zamiast trzymać wszystko w jednym wielkim serwisie, stosujemy strategię separacji:

### 1. Wydzielenie Decydenta (`ClaimsResolver`)

Tworzymy dedykowany obiekt, który zajmuje się tylko **podejmowaniem decyzji biznesowej**.

- **Dane:** Zawiera tylko to, co niezbędne do spójności (np. listę ID już reklamowanych przejazdów).
- **Testowalność:** Możemy go testować **testami jednostkowymi** (bez bazy danych i mockowania połowy systemu).

### 2. Pozostawienie Koordynatora (`ClaimService`)

Serwis staje się "zarządcą procesu".

- Pobiera dane z bazy.
- Pyta `ClaimsResolver` o decyzję.
- **Realizuje konsekwencje:** Zmienia stan reklamacji, przyznaje punkty lojalnościowe, wysyła notyfikacje.

---

## 📏 Granice obiektu a spójność

Wyznaczając granice nowego obiektu (np. Agregatu), musimy uważać na dwa ryzyka:

- **Zbyt szeroka granica:** Blokujemy zbyt wiele danych (np. cały profil klienta), co obniża wydajność systemu.
- **Zbyt wąska granica:** Pomijamy ważne dane, co może prowadzić do niespójności (np. podwójne uznanie tej samej reklamacji).

> **🔍 Heurystyka:** Jeśli dane są krytyczne dla spójności — zamknij je wewnątrz obiektu. Jeśli użycie "nieświeżych" danych nie jest problemem biznesowym (np. liczba wszystkich przejazdów klienta przy VIP-ie) — przekaż je jako parametr.

---

## 📈 Korzyści z refaktoryzacji

- **Fail-Fast:** Nowe wymagania biznesowe (np. specyficzne reguły dla VIP-ów) implementujemy w jednym, dobrze przetestowanym miejscu.
- **Czytelność:** Serwis pokazuje "co się dzieje" (proces), a Resolver "dlaczego" (reguły).
- **Równoległość:** Jedna osoba może pracować nad nowymi regułami w Resolverze, a druga nad integracją z nowym dostawcą notyfikacji w serwisie.

---

**Czy w Twoim projekcie masz metody serwisowe, które wymagają dziesiątek zaślepek (mocks) w testach? Może to sygnał, że warto wydzielić z nich czysty "Silnik Decyzyjny"?**

---

Ten materiał to świetne studium przypadku, jak radzić sobie z „rozpełzniętą” logiką biznesową w systemach Legacy. Analizujemy tu przypadek **AwardsAccount** (punktów lojalnościowych/mil), gdzie głównym wyzwaniem jest jednoczesne występowanie **niespójności danych** oraz **mnogości reprezentacji** algorytmów.

Oto esencja tego, jak przekształcić ten fragment kodu z „bagna” w elastyczny moduł:

---

## 1. Diagnoza: Dlaczego kod „boli”?

W systemie zdiagnozowano dwa główne problemy:

- **Niespójność**: Serwis (`AwardsService`) wyciąga dane, sprawdza reguły i ustawia stan setterami. To klasyczny brak enkapsulacji – łatwo pominąć sprawdzenie warunku (np. czy balans nie spadnie poniżej zera) w innym miejscu kodu.
- **Mnogość reprezentacji**: System musi obsługiwać różne „rodzaje” mil (wygasające po X dniach, niewygasające nigdy, a w przyszłości liniowe lub krokowe). Obecnie każda nowa reguła to dodatkowe flagi (np. `isSpecial`) i `if`-y w całym systemie.

## 2. Strategia: Uproszczenie przez „pozorne skomplikowanie”

Często boimy się dodawać kolejne przypadki testowe, myśląc, że to skomplikuje kod. Autorzy sugerują odwrotne podejście: **wizualizację wielu scenariuszy**, aby znaleźć nadrzędną regułę.

Zamiast traktować każdy algorytm jako zestaw pól w bazie danych, potraktowano go jako **funkcję matematyczną $f(x)$**.

- Mile wygasające to funkcja stała, która w dacie $D$ spada do zera.
- Mile „specjalne” to funkcja stała z datą wygaśnięcia ustawioną na nieskończoność ($\infty$).
- Dzięki temu każdy algorytm można zamknąć za **stabilnym interfejsem `Miles**`.

## 3. Kluczowe kroki refaktoryzacji

### Wprowadzenie Value Objectu `Miles`

Zamiast trzymać daty i flagi bezpośrednio w encji `AwardedMiles`, wprowadzamy interfejs:

```java
public interface Miles {
    Integer getAmountFor(Instant moment);
    Miles subtract(Integer amount, Instant moment);
    Instant expiresAt();
}

```

To pozwala na **zmiany addytywne** – aby dodać nowy sposób wygaszania punktów (np. krokowy), po prostu tworzysz nową klasę implementującą interfejs, nie dotykając istniejącej logiki.

### Enkapsulacja wewnątrz AwardsAccount

Reguły biznesowe (np. transfer mil) są rozpięte na wielu obiektach `AwardedMiles`. Rozwiązaniem jest:

1. **Ukrycie kolekcji**: Tylko `AwardsAccount` powinno zarządzać listą mil.
2. **Usunięcie repozytorium dla dzieci**: `AwardedMiles` nie powinny być modyfikowane bezpośrednio przez bazę danych, a jedynie przez „rodzica” (`AwardsAccount`).

### Przechowywanie danych (JSON)

Aby nie dodawać nowej kolumny do tabeli przy każdym nowym algorytmie, dobrym rozwiązaniem w Legacy jest zapisywanie stanu konkretnej strategii w kolumnie typu **JSON**. Dzięki temu baza danych pozostaje stabilna, mimo że logika wygaszania ewoluuje.

---

## 4. Problem "GOD Klas" i Modułów

Autorzy słusznie zauważają, że nie da się od razu podzielić systemu na piękne moduły (jak `fee` czy `transits`), dopóki istnieją tzw. **GOD Klasy** (jak `Transit`), które są używane wszędzie.

- **Najpierw**: Naprawiamy granice na poziomie klas i małych paczek (np. wydzielenie podgrupy `miles`).
- **Potem**: Gdy klasy są już „czyste” i spójne, możemy myśleć o architekturze wyższego poziomu.

---

## Co warto zapamiętać?

- **Reguły rozpięte**: Czasem reguła biznesowa nie mieści się w jednym obiekcie – wtedy musisz znaleźć „właściciela” (Agregat), który obejmie je wszystkie.
- **Stabilne API**: Szukaj pytań, które biznes zadaje danym (np. „ile mam mil dzisiaj?”), i uczyń z nich metody interfejsu.
- **Zmiany addytywne**: Docelowy stan to taki, w którym nowe wymaganie biznesowe oznacza dopisanie nowej klasy, a nie edytowanie starych instrukcji `switch/if`.

**Czy chciałbyś, abym pomógł Ci przeanalizować Twój konkretny fragment kodu pod kątem wydzielenia podobnego interfejsu (Value Objectu)?**

---

Ten materiał to głęboka analiza problemu **ciągłej modyfikacji tego samego fragmentu kodu** (tzw. _churn_), który często wynika z mieszania stabilnej logiki technicznej z dynamicznie zmieniającymi się regułami biznesowymi.

Oto kluczowe wnioski z refaktoryzacji metody `remove` w klasie `AwardsAccount`:

---

## 1. Problem: Metoda „Worek na wszystko”

Metoda `remove` przed refaktoryzacją cierpiała na kilka typowych bolączek systemów Legacy:

- **Zmienność parametrów**: Za każdym razem, gdy biznes wymyślał nowy warunek (np. „mile VIP-ów w niedzielę”), trzeba było dodawać kolejne parametry do sygnatury metody.
- **Mieszanie poziomów abstrakcji**: W jednej metodzie znajdowało się sprawdzanie reguł (balans), wybór strategii sortowania (dostrajanie) oraz fizyczne odejmowanie mil (wykonanie decyzji).
- **Ryzyko regresji**: Zmieniając prosty warunek sortowania, programista musiał dotykać stabilnego kodu pętli, który faktycznie zmienia stan w bazie danych.

---

## 2. Rozwiązanie: Wprowadzenie Polityk (Wzorzec Strategii)

Rozwiązanie opiera się na zasadzie: **separuj to, co zmienne, od tego, co stabilne**.

### Krok 1: Rozplątanie bloków kodu

Zauważono, że metoda składa się z trzech faz:

1. **Reguła**: Czy w ogóle możemy usunąć mile?
2. **Dostrajanie (Polityka)**: W jakiej kolejności mamy je usuwać?
3. **Wykonanie**: Proces pętli i odejmowania wartości.

### Krok 2: Oddelegowanie decyzji na zewnątrz

Zamiast kazać klasie `AwardsAccount` decydować o sortowaniu, wprowadzono interfejs polityki. W tym przypadku wykorzystano standardowy interfejs `Comparator<AwardedMiles>`.

### Krok 3: Stabilna sygnatura

Po zmianie metoda `remove` przyjmuje tylko 3 parametry:

```java
public void remove(Integer miles, Instant when, Comparator<AwardedMiles> strategy) {
    milesList.sort(strategy); // Dostrojenie przekazane z zewnątrz
    // ... reszta stabilnego kodu pętli ...
}

```

Dzięki temu kod pętli staje się **nienaruszalny**. Jeśli biznes doda 10 nowych warunków sortowania, metoda `remove` nie zmieni się ani o linijkę.

---

## 3. Gdzie ląduje logika biznesowa?

Wybór konkretnej polityki (dostrajanie) przenosimy wyżej – do serwisu lub dedykowanej **fabryki polityk** (`MilesRemovingStrategyFactory`).

- **Serwis** zbiera potrzebne dane (liczbę reklamacji, typ klienta).
- **Fabryka** na ich podstawie „produkuje” odpowiedni komparator.
- **AwardsAccount** tylko wykonuje polecenie.

---

## 4. Ćwiczenie lingwistyczne: Jak namierzyć takie miejsca?

Aby znaleźć w swoim projekcie miejsca, gdzie warto wprowadzić polityki, spróbuj rozbić zdania biznesowe na trzy pytania:

- **CO robimy?** (np. usuwamy punkty) -> _To jest stabilny rdzeń operacji._
- **JAK to robimy?** (np. najpierw te najstarsze, niekorzystnie dla klienta) -> _To jest zmienna polityka (Strategia)._
- **KIEDY to robimy?** (np. gdy klient zalega z opłatami) -> _To jest warunek wyzwalający._

---

## Podsumowanie korzyści

1. **Mniej konfliktów przy mergowaniu**: Osoba dodająca nowy warunek VIP-a edytuje fabrykę, a nie kluczową encję biznesową.
2. **Testowalność**: Możesz przetestować algorytm usuwania mil niezależnie od logiki sortowania (używając prostego, testowego komparatora).
3. **Czyste funkcje**: Fabryka strategii to często „pure function” – łatwa do zrozumienia i przetestowania, bo nie zmienia stanu, tylko zwraca obiekt decyzji.

**Czy w Twoim projekcie istnieją metody z listą parametrów dłuższą niż 5? Chętnie pomogę Ci zastanowić się, który z nich służy do „dostrajania” decyzji i mógłby stać się częścią nowej polityki.**
