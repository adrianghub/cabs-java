# Course and SaaS Roadmap

## Główny cel

Przechodzimy przez kurs i repozytoria tak, żeby równolegle osiągnąć trzy efekty:

1. nauczyć się praktycznej Javy na realnym kodzie,
2. nauczyć się pracy z legacy / brownfield / monolitem,
3. doprowadzić `cabs` do stanu, z którego da się zbudować pełnoprawny produkt SaaS z frontendem, np. w Angularze.

Nie idziemy "po slajdach". Każdy moduł zamieniamy na realną pracę w kodzie, testach i architekturze.

---

## Zasady pracy

Dla każdego modułu robimy zawsze ten sam cykl:

1. **Rozpoznanie problemu**
   - Co to miejsce robi biznesowo?
   - Jakie są obserwowalne zachowania?
   - Jaki jest obecny ból: złożoność, duplikacja, brak enkapsulacji, słaby odczyt, problem komunikacyjny?

2. **Zabezpieczenie wiedzy**
   - Test charakteryzujący albo opis świadomego braku testu.
   - Krótki zapis decyzji: co zachowujemy, czego nie ruszamy.

3. **Refaktor minimalny i bezpieczny**
   - Małe kroki.
   - Bez zmiany logiki, jeśli moduł nie wymaga inaczej.
   - Utrzymanie działającego systemu przez cały czas.

4. **Wnioski edukacyjne**
   - Java / Spring / JPA / testy
   - wzorce projektowe
   - heurystyki pracy w legacy
   - rozmowa z biznesem i interesariuszami

5. **Przełożenie na produkt SaaS**
   - Jak dana zmiana pomaga w API, frontendzie, utrzymaniu i skalowaniu produktu?

---

## Kolejność pracy

### Etap 1 — Kurs i refaktor domeny

#### M01 — Poznanie domeny i zachowań systemu

**Materiały:** `LF_M01_Zadanie_Praktyczne.pdf`

**Cel nauki**
- nauczyć się czytać legacy bez dokumentacji,
- rozpoznawać zachowania systemu,
- odróżniać "co robi" od "jak jest zrobione".

**Praca w `cabs`**
- wybrać 2-3 złożone zachowania domeny,
- rozpisać przepływy dla `Transit`, `Claim`, `Driver`,
- dopisać pierwsze testy charakteryzujące.

**Najlepsze kandydaty**
- `io.legacyfighter.cabs.service.ClaimService`
- `io.legacyfighter.cabs.service.TransitService`
- `io.legacyfighter.cabs.entity.Transit`

**Efekt końcowy modułu**
- mapa zachowań domenowych,
- pierwsza siatka bezpieczeństwa w testach,
- lista największych legacy-smells.

---

#### M02 — Refaktoryzacja do Value Object

**Materiały:** `LF_M02/LF_M2_Zadanie_praktyczne.pdf` + materiały dodatkowe o `Money`, `DriverLicence`, `Distance`

**Cel nauki**
- eliminacja duplikacji walidacji,
- zamiana prymitywów i luźnych stringów/liczb na pojęcia domenowe,
- nauka kiedy Value Object poprawia czytelność i bezpieczeństwo.

**Praca w `dodatkowe-zadania-java`**
- code review i refaktor `legacyfigher.dietary.newproducts.OldProduct`,
- identyfikacja duplikowanej walidacji i ukrytych reguł.

**Praca w `cabs`**
- kandydaci na Value Objects:
  - `Driver license`
  - `Money / Price`
  - `Distance / Km`
  - `ClaimNumber`
  - potencjalnie `Address` w bardziej domenowej postaci

**Efekt końcowy modułu**
- przynajmniej jeden realny Value Object wdrożony bezpiecznie,
- zredukowana duplikacja walidacji,
- lepszy język domenowy w kodzie.

---

#### M03 — Aggregate, enkapsulacja, reguły biznesowe

**Materiały:** `LF_M03/*` — aggregate, przywracanie enkapsulacji, zmiana granic transakcji, polityki, rozdzielenie decyzji od konsekwencji

**Cel nauki**
- zrozumienie agregatów i spójności biznesowej,
- przywracanie enkapsulacji,
- oddzielanie decyzji biznesowych od efektów ubocznych,
- poprawa granic transakcji.

**Praca w `cabs`**
- główny kandydat: `ClaimService`
  - wydzielenie decyzji automatycznego rozstrzygania reklamacji,
  - oddzielenie reguł od notyfikacji i awardów,
  - przygotowanie pod polityki / strategy.
- drugi kandydat: `Transit` + `TransitService`
  - przegląd statusów i przejść stanu,
  - stopniowe przesuwanie logiki bliżej encji / agregatu tam, gdzie to ma sens.

**Efekt końcowy modułu**
- mniej proceduralnego sterowania w serwisach,
- bardziej jawne reguły biznesowe,
- czytelniejsze transakcje i granice odpowiedzialności.

---

#### M04 — Refaktoryzacja złożonych odczytów

**Materiały:** `LF_M04/LF_M4_Cwiczenia_praktyczne_.pdf` + materiały o parallel models i algorytmach refaktoryzacji

**Cel nauki**
- poprawa odczytów bez rozwalania zapisu,
- budowanie osobnych modeli odczytowych,
- zwiększenie wydajności i czytelności endpointów.

**Praca w `dodatkowe-zadania-java`**
- refaktor `legacyfigher.dietary.TaxConfigController`,
- uporządkowanie grupowania i deduplikacji reguł podatkowych,
- ewentualne testy na poziomie odczytu / kontrolera / serwisu.

**Praca w `cabs`**
- identyfikacja wolnych lub zbyt złożonych endpointów,
- wydzielanie read model / DTO assemblerów / projekcji,
- przygotowanie pod frontend Angularowy, który lubi stabilne, czytelne kontrakty API.

**Efekt końcowy modułu**
- lepsze odczyty i prostsze endpointy,
- pierwszy krok do rozdzielenia modelu zapisu i odczytu,
- realny zysk pod przyszły panel SaaS.

---

#### M05 — Archetypy, komunikacja i uzasadnianie refaktoru

**Materiały:** `LF_M05/*`

**Cel nauki**
- nauczyć się uzasadniać refaktor różnym odbiorcom,
- przestać mówić o kodzie wyłącznie językiem technicznym,
- dopasować argumenty do interesariusza.

**Praca praktyczna**
- przygotować 3 wersje komunikacji o stanie projektu i potrzebie zmian:
  - do HR / managementu,
  - do CTO,
  - do klienta / właściciela produktu / biznesu.
- oprzeć argumentację o realny stan `cabs`.

**Efekt końcowy modułu**
- umiejętność sprzedaży refaktoru,
- język korzyści zamiast wyłącznie języka długu technicznego,
- podkład pod decyzje produktowe i inwestycyjne.

---

#### Moduł 9 — Bounded Context

**Materiały:** `LF_M09_Wskazowki_do_zadania_domowego.pdf`

**Cel nauki**
- nauczyć się dzielić domenę na sensowne granice,
- odróżniać różne znaczenia tych samych pojęć,
- przygotować monolit pod modularność i przyszły SaaS.

**Praca w `cabs`**
- zaproponować bounded contexts, np.:
  - `Transit / Ride Management`
  - `Driver Management`
  - `Pricing`
  - `Claims`
  - `Awards / Loyalty`
  - `Invoicing / Billing`
  - `Tracking / Driver Position`
- wskazać obiekty i procesy, które mieszają się dziś w jednym miejscu.

**Efekt końcowy modułu**
- mapa kontekstów domenowych,
- lepszy podział odpowiedzialności w monolicie,
- baza pod modular monolith, a później wybrane usługi lub osobne moduły.

---

## Jak to połączymy z nauką Javy

W każdym module zwracamy uwagę nie tylko na wzorzec, ale też na praktykę języka i platformy:

- klasy, rekordy, immutability, enkapsulacja,
- wyjątki i modelowanie błędów,
- kolekcje, streamy, Optional — ale bez nadużyć,
- `BigDecimal`, czas (`Instant`, `Clock`), identyfikatory,
- Spring Boot: kontrolery, serwisy, repozytoria, transakcje,
- JPA/Hibernate: encje, lazy loading, granice agregatów,
- testy: jednostkowe, charakteryzujące, integracyjne.

---

## Jak to połączymy z budową SaaS

Po etapie kursowym nie wyrzucamy tej pracy. Używamy jej jako fundamentu produktu.

### Etap 2 — Stabilizacja backendu
- uporządkowanie `pom.xml`, wersji Javy i builda,
- naprawa oczywistych bugów endpointów i kontraktów API,
- globalna obsługa błędów,
- walidacja wejścia,
- porządne testy dla najważniejszych ścieżek biznesowych.

### Etap 3 — API gotowe pod frontend
- stabilizacja DTO i endpointów,
- rozdzielenie komend i odczytów tam, gdzie ma to sens,
- pagination, filtrowanie, sortowanie,
- wersjonowanie API jeśli zajdzie potrzeba.

### Etap 4 — Angular frontend
- panel operatora / admina,
- panel kierowcy,
- panel klienta biznesowego,
- logowanie, role, uprawnienia, workflow.

### Etap 5 — SaaS foundation
- tenanting / organizacje / konta firmowe,
- role i uprawnienia per tenant,
- audyt, logowanie zdarzeń, billing,
- integracje (np. płatności, e-mail, SMS, mapy),
- monitoring, deployment, środowiska.

### Etap 6 — Docelowa architektura
- najpierw modularny monolit,
- potem ewentualne wydzielanie wybranych obszarów,
- bez przedwczesnego mikroserwisowania.

---

## Priorytety praktyczne na start

### Sprint 1
- M01 na `cabs`
- wybór 2-3 zachowań
- pierwsze testy charakteryzujące
- opis największych problemów domenowych

### Sprint 2
- M02 na `dodatkowe-zadania-java`
- refaktor `OldProduct`
- pierwszy Value Object w `cabs`

### Sprint 3
- M03 na `ClaimService`
- rozdzielenie decyzji od konsekwencji
- poprawa enkapsulacji

### Sprint 4
- M04 na `TaxConfigController`
- potem analogiczny read-side refaktor w `cabs`

### Sprint 5
- M05
- opis projektu i argumentacja dla archetypów / interesariuszy

### Sprint 6
- M09
- bounded contexts dla `cabs`
- decyzja jak ma wyglądać modularizacja produktu

---

## Nasza definicja sukcesu

Po przejściu tego planu:

- lepiej rozumiemy Javę i Springa na realnym kodzie,
- umiemy bezpiecznie refaktorować legacy,
- umiemy uzasadniać zmiany techniczne biznesowi,
- `cabs` staje się sensowną bazą pod pełnoprawny backend SaaS,
- mamy naturalny następny krok: budowę frontendu i produktu.

---

## Co robimy teraz

1. Zaczynamy od **M01 w `cabs`**.
2. Wybieramy pierwszy obszar: najlepiej `ClaimService`.
3. Spisujemy obserwowalne zachowania.
4. Dopisujemy pierwsze testy.
5. Robimy mały, bezpieczny refaktor.
