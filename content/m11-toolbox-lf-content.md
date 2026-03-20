Praca z kodem legacy często przypomina operację na otwartym sercu, gdzie każda dodatkowa rurka (np. logowanie) wymaga nacięcia w dziesięciu innych miejscach. Wprowadzanie **logiki ortogonalnej** — czyli takiej, która przecina warstwy biznesowe, ale nie jest ich częścią — to klasyczne wyzwanie, przed którym stajemy w projekcie _Cabs_.

Oto esencja podejścia do zmian, które mają być skuteczne, ale nieinwazyjne.

---

## Wyzwanie: Koszt zmian tymczasowych

Wyobraź sobie, że chcesz tylko "na chwilę" sprawdzić, jak często wołana jest dana metoda w systemie legacy. Jeśli zaczniesz modyfikować kod źródłowy, napotkasz trzy główne problemy:

1. **Rozproszenie**: Zmiana może dotyczyć dziesiątek miejsc w kodzie (np. ręczne wstrzykiwanie loggera w fabrykach i konstruktorach).
2. **Czasochłonność**: Więcej czasu spędzisz na "podpinaniu kabli" niż na samej analizie wyników.
3. **Ryzyko przy sprzątaniu**: Usuwanie tymczasowego kodu z wielu klas to kolejna okazja do wprowadzenia błędu (regresji).

---

## Rozwiązanie: Aspect-Oriented Programming (AOP)

Zamiast walczyć z kodem źródłowym, możemy zastosować paradygmat programowania aspektowego. Pozwala on na "wstrzyknięcie" zachowania w konkretne punkty programu bez dotykania samej implementacji metod biznesowych.

### Kluczowe pojęcia w pigułce

| Termin         | Definicja                                      | Przykład                                           |
| -------------- | ---------------------------------------------- | -------------------------------------------------- |
| **Join Point** | Punkt w programie, gdzie można się "podpiąć".  | Wywołanie metody `calculatePrice()`.               |
| **Point Cut**  | Wyrażenie definiujące zbiór punktów złączenia. | "Wszystkie publiczne metody w pakiecie `service`". |
| **Advice**     | Kod, który ma się wykonać.                     | `logger.info("Metoda została wywołana")`.          |
| **Aspect**     | Moduł łączący Point Cut i Advice.              | Klasa `LoggingAspect`.                             |

---

## Gdzie szukać zysku (ROI)?

Zastosowanie aspektów w refaktoryzacji kodu legacy daje nam supermoce:

- **Błyskawiczne logowanie**: Możesz ologować cały moduł jednym wyrażeniem (Point Cut).
- **Dynamiczna podmiana**: Możesz tymczasowo przekierować wywołania do nowej, eksperymentalnej implementacji bez zmieniania klientów tej metody.
- **Czystość**: Kod biznesowy pozostaje wolny od szumu technicznego.

---

## ❗ Uwaga na "Magiczne" zachowania

Mimo ogromnych zalet, AOP to narzędzie wysokiego ryzyka. Zachowaj ostrożność, ponieważ:

- **Utrudnia analizę**: Programista czytający kod metody nie widzi "na pierwszy rzut oka", że dzieje się tam coś jeszcze (tzw. _hidden behavior_).
- **Może psuć przypadkiem**: Zbyt szeroki Point Cut może zmodyfikować kod, którego nie planowałeś ruszać, prowadząc do trudnych do wykrycia błędów.

**Czy w Twoim obecnym projekcie masz moduł, który jest tak "gęsty", że boisz się dodać do niego logowanie ręcznie? Jeśli chcesz, mogę pomóc Ci skonstruować przykładowy Point Cut, który bezpiecznie ologuje wybrane metody.**

---

Refaktoryzacja systemu legacy to często spacer po polu minowym – jedna mała zmiana w klasie `Money` może „wybuchnąć” w module raportów, o którym istnieniu dawno zapomniałeś. Aby nie dać się przytłoczyć kognitywnie, musisz przestać patrzeć na kod jak na tekst, a zacząć widzieć go jako **przepływ informacji**.

Oto zestawienie dwóch kluczowych narzędzi w Twoim IDE, które pomogą Ci zmapować teren przed rozpoczęciem prac.

---

## Find Usages vs. Call Hierarchy

Większość programistów odruchowo używa „Find Usages” (Szukaj użyć). To świetny start, ale w świecie legacy to tylko wierzchołek góry lodowej.

| Cecha            | **Find Usages** (Wyszukiwanie użyć)                  | **Call Hierarchy** (Stos wywołań)                            |
| ---------------- | ---------------------------------------------------- | ------------------------------------------------------------ |
| **Perspektywa**  | **Statyczna i płaska**: „Kto ma to pole/klasę?”      | **Dynamiczna i procesowa**: „Skąd ta informacja tu trafiła?” |
| **Główny zysk**  | Pokazuje częstotliwość występowania konceptu.        | Pokazuje **kontekst biznesowy** i przepływ (flow).           |
| **Zastosowanie** | Szybka podmiana typu (np. zmiana pola na inny typ).  | Planowanie refaktoryzacji konkretnego procesu.               |
| **Metafora**     | Znalezienie wszystkich wysp, na których rosną palmy. | Znalezienie prądów morskich łączących te wyspy.              |

---

## Dlaczego Stos Wywołań (Call Hierarchy) to „Supermoc”?

Przeglądanie stosu wywołań pozwala Ci na tzw. **trawersowanie przepływów**. Dzięki temu zamiast widzieć 500 użyć klasy `Money`, odkrywasz, że pieniądz przepływa przez trzy konkretne ścieżki:

1. Naliczanie wynagrodzeń.
2. Kalkulacja kosztów przejazdu.
3. Procesowanie reklamacji.

Daje Ci to dwie potężne przewagi:

- **Decyzja o zakresie:** Możesz zdecydować: „Dzisiaj refaktoryzuję `Money` tylko w procesie reklamacji”. Resztę zostawiasz nietkniętą, co drastycznie zmniejsza ryzyko błędu.
- **Znalezienie granic testu:** Idąc w górę stosu, znajdziesz miejsce, gdzie „szczegół implementacyjny” (Twoja zmiana) przestaje być widoczny. To idealne miejsce na **test obserwowalnego zachowania**. Jeśli `ClaimController` zwraca JSON-a z kwotą, nie obchodzi go, czy pod spodem używasz `BigDecimal`, czy `Integer`.

---

## Twoja strategia działania (Ćwiczenie)

Jeśli chcesz poczuć różnicę w praktyce, wykonaj te trzy kroki:

1. **Wybierz punkt zapalny:** Znajdź w swoim systemie pole, które jest „wszędzie” (np. `status`, `amount`, `id`).
2. **Uruchom Call Hierarchy:** Zobacz, jak ten koncept wędruje od bazy danych aż po kontroler API.
3. **Nazwij przepływy:** Nie patrz na to jako `ServiceA -> ServiceB`. Zadaj sobie pytanie: **„CO ten proces robi dla użytkownika?”**.

> **Pro-tip:** Jeśli zmieniasz metodę `getAmount()`, pierwszy poziom stosu wywołań to dokładnie to samo, co „Find Usages”. Dopiero zagłębienie się w kolejne poziomy (kto woła metodę, która woła `getAmount()`) daje Ci pełny obraz sytuacji.

**W Twoim systemie na pewno jest taka „magiczna” zmienna, której boisz się dotknąć. Czy chciałbyś, abym pomógł Ci przeanalizować jeden z jej przepływów pod kątem napisania bezpiecznego testu refaktoryzacyjnego?**

---

Praca z systemem legacy przypomina lądowanie na ogromnym archipelagu w gęstej mgle. Jeśli spróbujesz ogarnąć wzrokiem wszystkie wyspy naraz, zamarzniesz z przerażenia. Kluczem do przetrwania i skutecznego działania jest **radykalna lokalność**.

Oto jak przestać bać się „szumu” i zacząć dostarczać wartość w kodzie, którego nie rozumiesz w całości.

---

## 1. Strategia Archipelagu (Odszumianie)

W systemach legacy musisz nauczyć się **ignorować większość systemu**. Twoim celem nie jest poznanie mapy całego świata, ale zrozumienie mechaniki działania jednej, konkretnej wyspy, na której aktualnie stoisz.

- **Mentalne odszumianie:** Pogódź się z tym, że 90% klas w projekcie to dla Ciebie obecnie „szum”. Nie musisz ich znać, by naprawić błąd w module płatności.
- **Skakanie po wyspach:** Gdy skończysz pracę w jednym miejscu, Twoja uwaga przenosi się na kolejny fragment. Reszta archipelagu znów znika we mgle. To nie ignorancja – to higiena pracy.

---

## 2. Twój Lokalny Plan Działania

Zamiast paraliżu decyzyjnego, zastosuj prosty algorytm działania:

1. **Wybierz punkt zaczepienia:** Znajdź miejsce, które musisz zmienić (np. konkretną metodę lub klasę).
2. **Oszacuj promień rażenia:** Użyj narzędzi (stos wywołań, wyszukiwanie fraz), aby zobaczyć, kto faktycznie zależy od tego fragmentu. To Twoje „pobliski wyspy”.
3. **Zignoruj resztę:** Jeśli coś nie jest w bezpośrednim grafie wywołań Twojej zmiany, przestań o tym myśleć.

---

## 3. Techniki „Odcinania się”

Nie każda zmiana musi rozlać się na cały system jak plama oleju. Czasem najlepszą strategią jest **izolacja lokalnego sukcesu**:

- **Mapowanie typów:** Jeśli wprowadzasz nowy, lepszy obiekt (np. `Money` zamiast `double`), możesz na granicy swojej „wyspy” przemapować go z powrotem na stary typ. Dzięki temu naprawiasz logikę wewnątrz, nie psując kontraktów na zewnątrz.
- **Obserwowalne zachowania:** Skup się na tym, co widzi użytkownik lub inne moduły. Jeśli wynik końcowy się zgadza, droga, którą do niego doszedłeś (Twój lokalny refaktoring), może pozostać Twoją słodką tajemnicą.

---

## Narzędzia nawigacyjne

Gdy mgła jest wyjątkowo gęsta, sięgnij po sprawdzone techniki orientacji w terenie:

- **EventStorming:** Pomoże Ci zobaczyć procesy biznesowe (strzałki między wyspami) bez wgłębiania się w kod.
- **Call Hierarchy:** Pokaże Ci fizyczne połączenia między komponentami.

> **Blokada mentalna do pokonania:** „Muszę wiedzieć, jak to działa, żeby tego nie zepsuć”.
> **Prawda Legacy Fightera:** „Muszę wiedzieć, co testy mówią o tym zachowaniu, i zabezpieczyć moją zmianę lokalnie”.

---

**Wniosek:** Poruszanie się w szumie to nie brak profesjonalizmu, to jedyny sposób na zachowanie zdrowia psychicznego przy dużych projektach. Lokalna refaktoryzacja to mały krok dla systemu, ale wielki skok dla Twojej produktywności.

**Skoro wiemy już, jak ignorować szum, może spróbujemy namierzyć Twoją pierwszą „wyspę”? Czy masz w kodzie fragment, który wydaje się odizolowany, ale boisz się go ruszyć ze względu na „resztę świata”?**

---

Czas w systemach legacy to wyjątkowo podstępny „pasażer”. Często jest ukryty głęboko w kodzie jako wywołanie `Instant.now()` lub `new Date()`, co sprawia, że system staje się nieprzewidywalny i niemal niemożliwy do rzetelnego przetestowania.

Oto zestawienie strategii, które pozwolą Ci odzyskać kontrolę nad zegarem w Twoim projekcie.

---

## Gdzie czas "psuje" Twoją logikę?

Zanim zaczniesz refaktoryzację, musisz zidentyfikować, w jakiej roli występuje czas w danym fragmencie kodu. Najczęściej spotkasz cztery scenariusze:

1. **Reguły domenowe (Niezmienniki):** Walidacja, czy coś jest jeszcze możliwe (np. „Zwrot towaru dostępny przez 14 dni”).
2. **Reguły procesowe:** Wyzwalanie akcji po upływie czasu (np. „Wyślij przypomnienie 3 dni po terminie płatności”).
3. **Reguły koordynacyjne:** Wybór ścieżki w zależności od momentu (np. „W weekendy korzystaj z innego dostawcy logistycznego”).
4. **Obliczenia:** Czas jako parametr wejściowy (np. „Oblicz dystans przejechany przez taksówkę od godziny 12:00 do teraz”).

---

## 2 Techniki odzyskiwania testowalności

Głównym problemem z czasem w legacy jest to, że jest **zmienny i niezależny od nas**. Aby to naprawić, musimy sprawić, by stał się **zależnością, którą sterujemy**.

### Strategia A: Parametryzacja (Szybki "hack")

Jeśli nie chcesz przebudowywać całego serwisu, dodaj czas jako parametr do metody. Stary kontrakt zostaw dla klientów produkcyjnych, a nowego używaj w testach.

| Podejście     | Kod Produkcyjny      | Kod Testowy                                   |
| ------------- | -------------------- | --------------------------------------------- |
| **Hardcoded** | `calculate(id)`      | Niemożliwy do powtórzenia (zegar tyka).       |
| **Parametr**  | `calculate(id, now)` | `calculate(id, FIXED_TIME)` – pełna kontrola. |

### Strategia B: Dostawca czasu (Clock Provider)

To bardziej dojrzałe podejście. Wstrzykujemy obiekt (np. `Clock` w Javie), który jest jedynym źródłem prawdy o czasie dla danego serwisu.

- **Na produkcji:** Wstrzykujesz `Clock.systemUTC()`.
- **W testach:** Wstrzykujesz `Clock.fixed(INSTANT, ZONE)`, dzięki czemu czas w teście „stoi w miejscu”.

---

## Schedulery: Czy na pewno potrzebujesz Crona?

W systemach legacy często spotyka się zadania (Jobs), które co rano o 8:00 przechodzą przez bazę i zmieniają statusy (np. „Anuluj rezerwacje starsze niż 3 dni”).

**Problem:** Takie rozwiązanie jest trudne do testowania, może obciążać bazę i wprowadza opóźnienia (rezerwacja wygasa o 2:00 w nocy, ale system dowie się o tym dopiero o 8:00 rano).

**Alternatywa: Leniwa Ewaluacja (Lazy Evaluation)**
Zamiast aktywnie zmieniać status w bazie, zapytaj o niego w momencie użycia:

- Zamiast `if (status == CANCELLED)`, użyj `if (creationDate + 3 days < now)`.

Dzięki temu eliminujesz skomplikowane mechanizmy planowania zadań na rzecz prostej logiki wewnątrz obiektu, którą przetestujesz w milisekundach.

---

## Techniczne "pułapki" (Candor Alert)

Czas to nie tylko sekundy. To pole minowe błędów implementacyjnych. Pamiętaj o tych zasadach:

- **UTC to jedyna słuszna droga:** Zapisuj daty w bazie w formacie UTC. Strefy czasowe to problem warstwy prezentacji (widoku), a nie logiki biznesowej.
- **Timestamp != Data:** Moment na osi czasu (`Instant`) to co innego niż data w kalendarzu (`LocalDate`). Upewnij się, że nie mieszasz tych pojęć.
- **Zmiana czasu (DST):** Przejście z czasu letniego na zimowy potrafi zepsuć obliczenia oparte na „godzinach”, jeśli nie używasz odpowiednich bibliotek.

---

**Warto zapamiętać:** Sterowanie czasem to nie magia, to inżynieria. Jeśli Twoja metoda woła `now()` w środku, to właśnie stworzyłeś ukryte powiązanie ze stanem globalnym (zegarem systemowym).

**W Twoim systemie na pewno jest jakiś "nocny proces", który regularnie coś czyści lub przelicza. Czy chciałbyś, abyśmy sprawdzili, czy da się go zastąpić leniwą ewaluacją, by pozbyć się problematycznego schedulera?**

---

W świecie legacy często spotykamy ścianę: potrzebujemy danych z monolitu do nowej usługi, ale nie możemy (lub nie zdążymy) dopisać tam emisji zdarzeń. Zespół odpowiedzialny za monolit jest przeładowany, a my potrzebujemy świeżych informacji o kontraktach "na wczoraj".

Wtedy z pomocą przychodzi **Change Data Capture (CDC)** – technika, która pozwala śledzić zmiany bezpośrednio w bazie danych, z pominięciem warstwy aplikacji.

---

## Jak działa CDC? (Write-Ahead Log)

Każda nowoczesna baza danych (PostgreSQL, MySQL, SQL Server) zapisuje każdą zmianę (Insert, Update, Delete) w specjalnym pliku binarnym, zanim faktycznie naniesie ją na tabele. Ten plik nazywa się **Transaction Log**, **WAL (Write-Ahead Log)** lub **Binlog**.

Zamiast odpytywać bazę co minutę ciężkimi skryptami (Batch Update), podłączamy się pod ten strumień zmian. Dzięki temu:

- Widzimy zmiany **natychmiastowo** (milisekundy po transakcji).
- Wyłapujemy **usunięcia rekordów** (co w skryptach SQL jest bardzo trudne).
- Minimalnie obciążamy bazę (czytamy log, a nie skanujemy tabele).

---

## Debezium: Pomost między bazą a światem

**Debezium** to platforma typu Open Source, która specjalizuje się w "wyciąganiu" tych logów i zamienianiu ich na czytelne komunikaty. Najczęściej współpracuje z **Apache Kafka**, która rozsyła te informacje do zainteresowanych usług.

### Jak wygląda proces?

1. **Connector** (np. dla Postgresa) obserwuje WAL bazy danych systemu Cabs.
2. Każda zmiana w tabeli `Contract` jest zamieniana na format JSON/Avro.
3. Wiadomość trafia na **Topic w Kafce**.
4. Twoja nowa usługa subskrybuje ten Topic i aktualizuje swój lokalny stan.

---

## Bilans zysków i strat

CDC to potężne narzędzie, ale – jak każdy wzorzec – ma swoją cenę.

| Cecha                  | Batch Update (Skrypty)      | Change Data Capture (Debezium)       |
| ---------------------- | --------------------------- | ------------------------------------ |
| **Opóźnienie**         | Wysokie (interwałowe).      | Bardzo niskie (near real-time).      |
| **Obciążenie DB**      | Wysokie (skanowanie tabel). | Bardzie niskie (odczyt logów).       |
| **Usunięcia (Delete)** | Bardzo trudne do wykrycia.  | Widoczne natychmiast.                |
| **Intencja biznesowa** | Zgubiona.                   | **Zgubiona**.                        |
| **Infrastruktura**     | Prosta (Cron/SQL).          | Złożona (Kafka, Connect, Zookeeper). |

### ❗ Pułapka: Utrata intencji biznesowej

To największa wada CDC. Jeśli saldo konta zmienia się z 100 zł na 50 zł, Debezium powie Ci: `old_val: 100, new_val: 50`. Nie dowiesz się jednak, czy była to wypłata z bankomatu, opłata za przejazd Cabs, czy zwrot środków (chargeback). Dane "pamiętają" stan, ale "zapominają" o przyczynie zmiany.

---

## Podsumowanie

Debezium i CDC to genialne narzędzia do **wyciągania danych z monolitu**, którego nie możemy dotknąć. Pozwalają na budowę modeli odczytowych (Read Models) i synchronizację danych bez walki o czas programistów starego systemu.

**Czy w Twoim projekcie masz tabelę, która jest "źródłem prawdy" dla wielu procesów, ale jej synchronizacja z innymi modułami kuleje? Czy chciałbyś, abym pokazał Ci, jak mógłby wyglądać przykładowy komunikat JSON wygenerowany przez Debezium po zmianie statusu kontraktu?**
