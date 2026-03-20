Refaktoryzacja do wzorca **CQRS (Command Query Responsibility Segregation)** to w świecie systemów legacy moment, w którym przestajemy udawać, że jeden model danych obsłuży równie dobrze skomplikowaną logikę biznesową (zapis) i wielowymiarowe raporty (odczyt).

Poniżej znajdziesz syntezę najważniejszych koncepcji z tego modułu, które pomogą Ci zrozumieć, jak skalować wydajność, nie tracąc przy tym spójności.

---

## 1. Trzy poziomy wtajemniczenia CQRS

W pracy z systemami legacy nie zawsze musisz rzucać się na głęboką wodę asynchroniczności. Wzorzec ten można wdrażać ewolucyjnie:

| Poziom       | Charakterystyka                                                                                               | Spójność               | Baza danych       |
| ------------ | ------------------------------------------------------------------------------------------------------------- | ---------------------- | ----------------- |
| **Poziom 1** | Oddzielne obiekty (DTO/Query) dla odczytu, te same tabele SQL. Unikasz N+1 i ciężkich encji.                  | **Silna (Strong)**     | Ta sama           |
| **Poziom 2** | Fizycznie oddzielne tabele pod odczyt (np. zdenormalizowane), ale w tej samej bazie. Zasilane synchronicznie. | **Silna (Strong)**     | Ta sama           |
| **Poziom 3** | Całkowicie inna baza (np. Grafowa dla relacji, Elastic dla wyszukiwania). Zasilanie asynchroniczne (eventy).  | **Końcowa (Eventual)** | Różne paradygmaty |

---

## 2. Case Studies: Kiedy zmienić paradygmat?

W projekcie **Cabs** rozwiązaliśmy trzy konkretne problemy wydajnościowe, stosując różne podejścia:

1. **DriverReportController (SQL zamiast ORM):** Wykorzystanie surowego SQL-a do raportów. Rozwiązuje problem N+1, gdzie Hibernate generował setki zapytań o powiązane encje. To najprostsza forma CQRS.
2. **DriverTrackingService (Odrębny model odczytu):** Zamiast liczyć kilometry "w locie" z tysięcy rekordów pozycji GPS, stworzono tabelę `TravelledDistance`. Jest ona zasilana przy każdym zapisie pozycji, dzięki czemu raport jest natychmiastowy.
3. **TransitAnalyzer (Baza grafowa):** Relacyjne bazy danych cierpią przy zapytaniach o "ścieżki i przesiadki". Przeniesienie tego do Neo4j (model grafowy) pozwala na analizę tras w milisekundach, a nie minutach.

---

## 3. Synergia Technik: VO + Aggregate + CQRS

Te wzorce nie żyją w izolacji. Warto patrzeć na nie jak na narzędzia do budowania "wysepek" w systemie:

- **Value Objects:** Malutkie wysepki logiki (np. `Money`, `Distance`), które czyszczą kod z prymitywów.
- **Aggregates:** Wysepki spójności. Pilnują, aby transakcje zapisu były bezpieczne i krótkie.
- **CQRS:** Wysepki odczytowe. Budowane wtedy, gdy Aggregates stają się zbyt "ciężkie" do raportowania.

---

## 4. CQS vs. CQRS: Czy potrzebujesz "Bus-a"?

Częstym błędem jest myślenie, że CQRS wymaga skomplikowanej infrastruktury (Command Bus, Handlery). To nieprawda:

- **CQS (Command Query Separation):** To zasada na poziomie metody. "Pytanie nie powinno zmieniać odpowiedzi".
- **CQRS:** To zasada na poziomie architektury (oddzielne modele).

Możesz mieć CQRS, wywołując po prostu inną metodę w serwisie. Obiekty `Command` i `CommandBus` to tylko **sposób implementacji**, który ułatwia np. testowanie lub asynchroniczność, ale nie są "sercem" samego wzorca.

---

### Co dalej?

Zrozumienie poziomów CQRS pozwala uniknąć "przeinżynierowania" systemu. Często poziom 1 lub 2 wystarczy, by uratować wydajność legacy.

**Czy chciałbyś, abym pomógł Ci zaprojektować model odczytowy (Read Model) dla konkretnego, powolnego raportu w Twoim systemie?**

---

Ten materiał to kompendium wiedzy na temat jednego z najczęstszych problemów wydajnościowych w systemach opartych na **ORM (Object-Relational Mapping)**: próby budowania złożonych raportów poprzez nawigowanie po grafie encji.

Oto kluczowe wnioski i strategie refaktoryzacyjne:

---

## 1. Anatomia problemu N+1

Głównym winowajcą powolnego działania raportu `DriverReport` jest **problem N+1**. Wynika on z mechanizmu **Lazy Loading**:

- **1 zapytanie**: Pobierasz listę sesji kierowcy (liczebność N).
- **N zapytań**: Dla każdej sesji w pętli wołasz getter (np. `getTransits()`), co zmusza ORM do wykonania kolejnego zapytania do bazy.

Jeśli masz zagnieżdżone pętle (sesje -> przejazdy -> reklamacje), liczba zapytań rośnie wykładniczo, generując ogromny ruch sieciowy i obciążając bazę danych niepotrzebnymi operacjami I/O.

---

## 2. Pułapka "EAGER vs LAZY"

Częstym błędem jest próba naprawy tego poprzez zmianę mapowania na `FetchType.EAGER`. To "lekarstwo", które bywa gorsze od choroby:

- **EAGER** przyspiesza raport, ale drastycznie spowalnia proste operacje (np. rozpoczęcie przejazdu), bo wciąga do pamięci połowę bazy danych bez potrzeby.
- **Wniosek**: Jedna encja nie może optymalnie służyć dwóm celom: **podejmowaniu decyzji** (mały wycinek danych) i **prezentacji** (szeroki przekrój danych).

---

## 3. Rozwiązanie: CQRS (Poziom 1) i bezpośredni SQL

Najskuteczniejszym sposobem na szybkie odczyty jest **pominięcie encji i ORM-a** tam, gdzie budujemy tylko widok.

- Zamiast nawigować po getterach, piszemy dedykowane zapytanie (np. w SQL), które jednym "strzałem" wyciąga dokładnie te dane, których potrzebuje raport.
- **Fizyczny decoupling**: Zmieniamy konstruktory w DTO, aby przyjmowały surowe dane, a nie obiekty encji. Dzięki temu możemy usunąć niepotrzebne gettery z modelu domenowego.

---

## 4. Greenfield w Brownfieldzie

To technika, która pozwala zachować morale zespołu w trudnym projekcie legacy:

1. **Zdefiniuj "CO"**: Co robi ten raport? (np. "Wyświetla historię sesji").
2. **Zaimplementuj nowe "JAK"**: Napisz nową klasę/metodę (Greenfield) używającą czystego SQL-a.
3. **Testy charakterystyki**: Uruchom obie implementacje i porównaj, czy zwracają to samo.
4. **Podmiana**: Podepnij nową wersję pod istniejący kontroler.

Ponieważ raporty to **zapytania (Query)**, nie mają one efektów ubocznych. To czyni ich refaktoryzację najbezpieczniejszym punktem startu w naprawie systemu.

---

## Podsumowanie do zapamiętania

- **I/O to wąskie gardło**: Optymalizacja procesora rzadko daje tyle, co wycięcie zbędnych wycieczek do bazy.
- **DTO to kontrakt**: Nie musi (a często nie powinien) odzwierciedlać struktury tabel 1:1.
- **Encja to Agregat**: Służy do ochrony spójności danych przy zapisie, a nie do bycia "workiem na dane" dla raportów.

**Czy w Twoim projekcie masz raport, którego kod zajmuje setki linii i opiera się na skomplikowanych pętlach? Chętnie pomogę Ci zaplanować dla niego "lokalny rewrite" z użyciem bezpośredniego zapytania SQL.**

---

Podejście **Parallel Models** (modele równoległe) to w świecie legacy odpowiednik „remontu generalnego kuchni przy jednoczesnym mieszkaniu w domu”. Jest to technika, która pozwala przestać bać się zmian w najbardziej zawiłych miejscach systemu, oferując bezpieczną ścieżkę od „starego i brzydkiego” do „nowego i błyszczącego”.

Oto esencja tego podejścia:

---

## 1. Na czym polega „sztuczka”?

Zamiast modyfikować stary, splątany kod, zostawiamy go w spokoju. Tworzymy obok niego zupełnie nową, czystą implementację, która odpowiada na to samo pytanie biznesowe (**obserwowalne zachowanie**).

### Klucz do sukcesu: Abstrakcja

Największym wrogiem Parallel Models jest brak enkapsulacji w starym kodzie. Jeśli szczegóły starego rozwiązania (np. gettery wyciągające strukturę drzewiastą) wyciekły do 40 innych komponentów, nie możemy po prostu „podpiąć” nowej wersji.

- **Rozwiązanie:** Musimy najpierw wprowadzić stabilne API, które mówi językiem problemu („Czy użytkownik może edytować?”), a nie językiem rozwiązania („Pobierz rodzica z węzła X”).

---

## 2. Efekt Brzydkiego Kaczątka

Refaktoryzacja to proces, a nie punkt w czasie. Wprowadzając drugi model, sprawiamy, że system przejściowo wygląda **gorzej** (więcej kodu, instrukcje warunkowe, migracje danych).

> **Zapamiętaj:** To normalny etap. System musi stać się „brzydszy”, by docelowo stać się czystszy. Oceniamy proces (kierunek zmian), a nie statyczny zrzut ekranu z dzisiaj.

---

## 3. Strategie wdrażania i Feature Flags

Dzięki **Feature Flags**, możemy decydować o użyciu modelu w locie, bez ponownego wdrażania aplikacji.

| Strategia                  | Jak działa?                                                               | Kiedy stosować?                                        |
| -------------------------- | ------------------------------------------------------------------------- | ------------------------------------------------------ |
| **Dla wybranych klientów** | Włączamy nowy model tylko dla użytkowników VIP lub strategicznych krajów. | Gdy chcemy zbudować zaufanie biznesu niskim kosztem.   |
| **Testy A/B**              | Losowo wybieramy model dla X% użytkowników.                               | Przy optymalizacji wydajności lub UX.                  |
| **Dzień / Noc**            | Nowy kod działa tylko wtedy, gdy ruch jest mniejszy.                      | Przy ryzykownych zmianach infrastrukturalnych.         |
| **Rekoncyliacja**          | Uruchamiamy oba modele i porównujemy wyniki w tle.                        | Gdy „ma działać tak, jak działało”, a nie mamy testów. |

---

## 4. Rekoncyliacja: Najwyższy poziom bezpieczeństwa

To technika „asercji na produkcji”. Kod odpytuje oba modele, ale zwraca wynik starego, jednocześnie logując różnice między nimi.

**Cykl życia rekoncyliacji:**

1. **Old Only:** Tylko stary kod działa.
2. **Comparison Mode:** Stary kod zwraca wynik, nowy jest sprawdzany w tle.
3. **Shadow Mode:** Nowy kod zwraca wynik, stary jest sprawdzany w tle (dla bezpieczeństwa).
4. **New Only:** Stary kod zostaje usunięty.

---

## Podsumowanie korzyści i kosztów

- ✅ **Bezpieczeństwo:** Banalny rollback (przełączasz flagę i po problemie).
- ✅ **Morale:** Możesz pisać w stylu Greenfield w samym środku Brownfieldu.
- ✅ **Testy:** Możesz użyć starego systemu jako „wyroczni” dla nowego.
- ❌ **Narzut:** Przez pewien czas musisz utrzymywać dwie wersje logiki.
- ❌ **Migracja:** Jeśli model zmienia stan (Commands), musisz zadbać o spójność danych w obu miejscach.

Parallel Models to dowód na to, że w legacy nie trzeba wszystkiego przepisywać od zera (Big Bang Rewrite). Można to robić kawałek po kawałku, zachowując pełną kontrolę nad ryzykiem.

**Czy w Twoim projekcie jest jakiś moduł (np. system naliczania opłat lub uprawnień), który wszyscy boją się dotykać? Chcesz, żebyśmy spróbowali zaprojektować dla niego warstwę abstrakcji, która umożliwi wprowadzenie Parallel Models?**

Warto zapamiętać:

w złożonym systemie, który przechodzi gruntowną refaktoryzację oraz jest jednocześnie rozwijany, utrzymanie dwóch równoległych modeli to często jedyna bezpieczna droga
dużo łatwiej podłączyć drugi równoległy model, jeśli ten pierwszy ma abstrakcję i dobre API
oraz gdy nie zmieniamy modelu w bazie
włączanie i wyłączanie nowej odpowiedzi na obserwowalne zachowanie powinno być bezbolesne, a pomóc mogą w tym Feature Flags

---

To klasyczny przypadek, w którym system pada ofiarą własnego sukcesu. Na początku kilka punktów GPS nie robiło różnicy, ale przy tysiącach kierowców i raportach z całego tygodnia, przeliczanie wszystkiego „w locie” zamienia serwer w grzejnik.

Oto analiza problemu niedopasowanego modelu danych i droga do jego uzdrowienia.

---

## 1. Dlaczego system „puchnie”?

Problem w `DriverTrackingService` różni się od poprzedniego (N+1). Tutaj wąskim gardłem nie jest liczba zapytań, ale **wolumetryka i ciężar obliczeń**.

| Funkcja           | Operacja zapisu (Command)                   | Operacja odczytu (Query)                       |
| ----------------- | ------------------------------------------- | ---------------------------------------------- |
| **Częstotliwość** | Co 5 sekund dla każdego aktywnego kierowcy. | On-demand (rzadziej).                          |
| **Wolumen**       | 1 rekord (`DriverPosition`).                | **10 000+ rekordów** (dla raportu z tygodnia). |
| **Zależność**     | Samodzielny punkt.                          | Chronologiczna lista punktów + obliczenia geo. |

Problem polega na tym, że model zapisu (szczegółowe punkty GPS) jest używany do obsługi odczytu o zupełnie innej charakterystyce (zagregowany dystans). Próba „obejścia” tego cache’em zazwyczaj kończy się fiaskiem, bo wystarczy, że analityk zmieni zakres raportu o jedną sekundę, a klucz cache przestaje pasować.

---

## 2. Rozwiązanie: Dedykowany Model Odczytu (CQRS Poziom 2)

Zamiast walczyć z tysiącami punktów przy każdym zapytaniu, wprowadzamy **pre-kalkulację**. Tworzymy nową tabelę `TravelledDistance`, która przechowuje już przeliczone dane w określonych „slotach” czasowych (np. co 5 minut).

### Zalety tego podejścia:

- **Błyskawiczny odczyt:** Zamiast sumować 10 000 rekordów, sumujemy np. 20 gotowych wartości.
- **Separacja obaw:** Model zapisu dba o precyzję (historia pozycji), a model odczytu o wydajność (raporty).
- **Możliwość regeneracji:** Jeśli zmienimy logikę (np. rozdzielczość na 1 minutę), możemy przeliczyć nowy model na podstawie starych danych z `DriverPosition`.

---

## 3. Pułapka „Ukrytych Powiązań”

Wdrażając zasilanie nowego modelu poprzez zdarzenia synchroniczne (`eventPublisher.publish`), musisz uważać na **granice transakcji**.

> ⚠️ **Złota zasada:** Jeśli Twoje zdarzenie wyzwala akcję zewnętrzną (np. wysyłkę e-maila lub strzał do zewnętrznego API), nigdy nie rób tego wewnątrz transakcji bazodanowej modelu zapisu. Jeśli baza wycofa zmianę (Rollback), e-maila już nie „odwyślesz”.

---

## 4. Mierz to, co ma znaczenie (Percentyle)

Mariusz słusznie zauważył: „mając głowę w piekarniku, a nogi w zamrażarce, średnio masz temperaturę całkiem dobrą”. W optymalizacji wydajności **średnia to kłamstwo**.

Skup się na:

- **P95 / P99 (Percentyle):** Ile czasu czeka najwolniejsze 5% lub 1% użytkowników? To tam ukryte są prawdziwe dramaty Twojego systemu.
- **Trendy długookresowe:** Czy wydajność spada liniowo wraz z przyrostem danych?

---

## Jak wdrożyć to u siebie?

Zanim zaczniesz pisać kod, zadaj sobie pytanie: **Czy problemu nie rozwiąże infrastruktura?** Czasem zwiększenie IOPS na dyskach chmurowych (scale-up) jest tańsze niż 2 tygodnie pracy zespołu nad dedykowanym modelem odczytu. Inżynieria to sztuka wyboru najtańszego rozwiązania, które działa.

**Czy chciałbyś, abym pomógł Ci zaprojektować strategię migracji danych (Backfilling) dla nowego modelu `TravelledDistance`, aby analitycy mieli dane historyczne od razu po wdrożeniu?**

---
