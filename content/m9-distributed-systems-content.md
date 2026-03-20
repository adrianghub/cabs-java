Przejście od monolitu do systemów rozproszonych to proces, który przypomina przeprowadzkę z jednego dużego domu do osiedla mniejszych domków. Zyskujemy prywatność i niezależność, ale nagle musimy martwić się o infrastrukturę dróg, logistykę dostaw i to, że sąsiad może nie odebrać telefonu, gdy akurat go potrzebujemy.

Oto podsumowanie kluczowych aspektów rozpraszania systemu, które pozwolą Ci uniknąć architektury typu „rozproszony monolit”.

---

## 1. Strategiczne powody rozpraszania

Rozpraszanie systemu nie powinno być celem samym w sobie, lecz odpowiedzią na konkretne **drivery architektoniczne**. Zanim wytniesz pierwszy mikroserwis, zadaj sobie pytanie: „Co chcę osiągnąć?”.

- **Autonomia technologii**: Jedna część systemu (np. moduł wyceny) wymaga Pythona do ML, podczas gdy reszta to stabilna Java.
- **Autonomia awarii**: Jeśli padnie system generowania raportów, pasażerowie nadal muszą mieć możliwość zamówienia taksówki.
- **Autonomia skalowania**: Moduł obsługi geolokalizacji dostaje 100x więcej zapytań niż moduł zarządzania fakturami.
- **Autonomia zespołów**: Zespół A chce wdrażać zmiany codziennie, a Zespół B (finansowy) potrzebuje tygodniowych testów manualnych.

---

## 2. Wyzwania komunikacyjne: Synchronizacja vs Asynchroniczność

W monolicie wywołanie funkcji było natychmiastowe i pewne. W sieci wszystko może pójść nie tak.

| Cecha          | Komunikacja Synchroniczna (np. REST)          | Komunikacja Asynchroniczna (np. RabbitMQ/Kafka)                        |
| -------------- | --------------------------------------------- | ---------------------------------------------------------------------- |
| **Interakcja** | Żądanie – Odpowiedź (blokująca).              | Opublikuj – Zapomnij (nieblokująca).                                   |
| **Dostępność** | Obie usługi muszą działać w tym samym czasie. | Usługi mogą działać niezależnie czasowo.                               |
| **Zalety**     | Prostota implementacji, łatwe debugowanie.    | Duża odporność na piki obciążenia i awarie.                            |
| **Wyzwania**   | Ryzyko kaskadowych awarii, powolność.         | Spójność końcowa (eventual consistency), trudniejsze śledzenie błędów. |

### Jak radzić sobie z zawodnością?

- **Circuit Breaker (Bezpiecznik)**: Jeśli usługa B nie odpowiada, usługa A „otwiera bezpiecznik” i natychmiast zwraca błąd lub dane z cache, nie marnując zasobów na kolejne próby.
- **Transactional Outbox**: Aby mieć pewność, że po zapisie do bazy zdarzenie **na pewno** trafi do brokera, zapisujemy je najpierw w tej samej transakcji do technicznej tabeli `Outbox`.

---

## 3. Rozproszone „brzydkie zapachy” (Distributed Smells)

Jeśli czujesz, że Twój system rozproszony staje się trudniejszy w utrzymaniu niż stary monolit, prawdopodobnie dopadł Cię jeden z tych problemów:

1. **Złe cięcie (Bad Cut)**: Wydzielenie usługi na podstawie tabel w bazie zamiast procesów biznesowych. Skutek? Aby zrobić jedną rzecz, musisz wykonać 10 telefonów między usługami.
2. **Współdzielona baza (Shared Persistence)**: Dwie usługi zaglądają do tej samej tabeli. To bomba zegarowa – zmiana kolumny przez zespół A kładzie system zespołu B.
3. **Synchronizacja wydań (Deployment Train)**: Nie możesz wdrożyć usługi A bez jednoczesnego wdrożenia usługi B i C. To znak, że granice są źle wyznaczone.
4. **Niewłaściwa intymność**: Usługa A „wie za dużo” o wewnętrznej logice usługi B.
5. **Zazdrość o mikrousługi**: Rozbijanie systemu na siłę na zbyt małe kawałki (np. mikroserwis do sprawdzania, czy liczba jest parzysta). To generuje narzut infrastrukturalny bez realnych zysków.

---

## Podsumowanie i złota zasada

Pamiętaj: **system rozproszony to nie monolit połączony kablem sieciowym**. To zupełnie nowy paradygmat, w którym spójność bazodanowa zostaje zastąpiona przez spójność końcową, a pewność wywołań przez nieustanne zarządzanie ryzykiem awarii.

> **Warto zapamiętać:** Większość problemów, które rozwiązują mikroserwisy (autonomia wdrożeń, modularność), można osiągnąć w dobrze zaprojektowanym monolicie. Rozpraszaj system tylko wtedy, gdy limity fizyczne (pamięć, CPU, przepustowość sieci) lub organizacyjne nie dają Ci innego wyjścia.

---

**Widzimy, że komunikacja asynchroniczna wprowadza sporo zamieszania ze spójnością danych. Czy chciałbyś, abym wyjaśnił bardziej szczegółowo, jak zaimplementować wzorzec Saga, aby zarządzać transakcjami rozproszonymi bez użycia dwufazowego zatwierdzania (2PC)?**

---

Ekstrakcja logiki z monolitu do mikroserwisów to nie tylko wyzwanie techniczne, to przede wszystkim gra o **bezpieczeństwo i ciągłość biznesową**. Wzorce takie jak **Strangler Pattern** czy **Branch by Abstraction** pozwalają nam „udusić” stary kod tak sprytnie, by użytkownik nawet nie zauważył, że pod maską zmienił się cały silnik.

Oto zestawienie kluczowych strategii migracji do systemów rozproszonych.

---

## 1. Strangler Pattern (Wzorzec Dusiciela)

Zainspirowany pasożytniczymi drzewami, wzorzec ten zakłada powolne oplatanie monolitu nowymi usługami, aż stary kod stanie się zbędny.

- **Krok 1: Identyfikacja** – Dzięki wcześniejszej modularyzacji (Bounded Contexts) wiesz dokładnie, co wyciąć.
- **Krok 2: Implementacja** – Budujesz nowy serwis „z boku”. Może on działać w trybie cienia (Parallel Models), otrzymując dane, ale jeszcze nie rządząc systemem.
- **Krok 3: Przekierowanie** – Gdy masz pewność, że nowa usługa działa, API Gateway (lub router) kieruje ruch do niej, a stary moduł w monolicie zostaje wyłączony.

---

## 2. Branch by Abstraction

Strangler Pattern świetnie działa na „krawędzi” systemu (wywołania zewnętrzne). Ale co, jeśli moduły wewnątrz monolitu gadają ze sobą „po pamięci”? Tu wchodzi **Branch by Abstraction**.

- **Abstrakcja jako bezpiecznik:** Zamiast bezpośrednich wywołań między modułami, wprowadzasz warstwę pośrednią (interfejs/proxy).
- **Dwie drogi:** Za tą abstrakcją mogą kryć się dwie implementacje: stara (lokalna) i nowa (wywołująca zewnętrzny mikroserwis).
- **Decydent:** To warstwa abstrakcji decyduje (np. na podstawie Feature Flag), do którego „dostawcy” wysłać żądanie.

---

## 3. Kluczowe rozróżnienie: Deployment vs. Release

To fundament nowoczesnego inżynierstwa.

- **Wdrożenie (Deployment):** Skopiowanie kodu na serwer. Nowy mikroserwis żyje, oddycha, ale nikt go jeszcze nie używa (nie ma „Release”).
- **Wydanie (Release):** Moment, w którym faktycznie puszczasz ruch użytkowników na nową funkcję.

Rozdzielenie tych pojęć pozwala na **bezpieczny odwrót** – jeśli po wydaniu nowej usługi geolokalizacji system zacznie sypać błędami, po prostu zmieniasz flagę w routerze i wracasz do starego kodu w monolicie.

---

## 4. Testowanie w świecie rozproszonym

Gdy połączenia wewnątrzprocesowe zamieniają się w wywołania sieciowe, Twoje testy integracyjne stają się „flaky” (niestabilne). Jak temu zaradzić?

| Metoda                                 | Zalety                   | Wady                                                                                                     |
| -------------------------------------- | ------------------------ | -------------------------------------------------------------------------------------------------------- |
| **Lokalne uruchamianie**               | Realistyczne.            | Ciężkie, wolne, trudne do utrzymania (każdy musi mieć wszystko na PC).                                   |
| **Manualne Stubowanie (np. WireMock)** | Szybkie, niezależne.     | **Ryzyko desynchronizacji:** API producenta się zmienia, a Twój mock ciągle „myśli”, że jest po staremu. |
| **Testy Kontraktowe (np. Pact)**       | **Gwarancja spójności.** | Wymaga współpracy obu zespołów (Producenta i Konsumenta).                                                |

### Dlaczego Testy Kontraktowe to „Złoty Graal”?

Producent API definiuje **kontrakt** (np. YAML), który jest weryfikowany przy każdym jego buildzie. Na tej podstawie generowane są **stuby**, których używa Konsument. Jeśli Producent zmieni adres `/geocoding` na `/geo`, build kontraktu mu wybuchnie, zanim jeszcze zepsuje życie Konsumentowi na produkcji.

---

## 5. Synchronizacja danych – pytania kontrolne

Jeśli Twój nowy serwis nie jest całkowicie bezstanowy (stateless), musisz pomyśleć o danych:

1. **Inicjalne zasilenie:** Skąd weźmiesz historię? (Skrypt migracyjny, kopia DB).
2. **Kierunek prawdy:** Kto jest szefem? Zwykle zaczynamy od Monolitu, który „karmi” mikroserwis, ale docelowo to mikroserwis przejmie rolę źródła prawdy.
3. **Wspólna baza?** Jako krok przejściowy – dopuszczalne. Jako docelowy – to „rozproszony monolit”.

---

**Warto zapamiętać:** Duszenie monolitu to maraton, nie sprint. Każdy krok musi dawać możliwość powrotu do bezpiecznej przystani starego kodu.

**Skoro już wiemy, jak bezpiecznie wycinać moduły, czy chciałbyś, abym przybliżył Ci temat Transactional Outbox? To kluczowy wzorzec, by mieć pewność, że dane w bazie i komunikat na szynie zawsze są ze sobą spójne.**

---

W systemach rozproszonych jednym z najczęstszych problemów nie jest sama technologia, ale **zbyt sztywne kontrakty komunikacyjne**. W tej lekcji analizujemy przypadek, w którym „rozmowność” systemu i specyficzne zdarzenia doprowadziły do paraliżu prac wielu zespołów.

Oto jak odwrócenie kierunku zależności i zmiana języka komunikacji pozwala odzyskać autonomię.

---

## 1. Problem: Zdarzenia, które paraliżują (Bottleneck)

Na początku mamy jeden zespół obsługujący atrybuty kierowcy. Wszystko działa w oparciu o sztywne wyliczenie `DriverAttributeName` oraz dedykowane zdarzenia dla każdego faktu (np. `DriverPenaltyPointsRegistered`).

Gdy do organizacji dołączają kolejne zespoły (weryfikacja praw jazdy, licencji, niekaralności), pojawia się **efekt domina**:

- **Zespół A** chce zapisać informację o licencji.
- **Zespół Atrybutów** musi: dodać nowy typ do Enuma, obsłużyć nowe zdarzenie, zaktualizować bazę.

**Skutek:** Zespół Atrybutów staje się „wąskim gardłem” (bottleneck). Żaden inny zespół nie może dowieźć swojej funkcji biznesowej bez ingerencji w kod Atrybutów. To zaprzeczenie idei mikroserwisów.

---

## 2. Przyczyna: Zbyt wysoki poziom detali w kontrakcie

Problem polega na tym, że model komunikacji jest **zbyt specyficzny**. Zdarzenia takie jak `DriverMedicalExaminationExpirationDateRegistered` niosą w nazwie całą logikę biznesową, która dla serwisu przechowującego dane jest... zbędna.

Serwis atrybutów w rzeczywistości pełni rolę **prostego magazynu (Key-Value Store)**. Nie musi wiedzieć, co oznacza „data wygaśnięcia badań”, by móc ją zapisać i wyświetlić.

---

## 3. Rozwiązanie: Odwrócenie zależności (Generic Command)

Zamiast prosić zespół Atrybutów o obsługę każdego nowego zdarzenia, zmieniamy model na **rozkazy (Commands)** oparte na generycznym kontrakcie.

**Nowy model komunikacji:**
Zamiast 20 różnych zdarzeń, wystawiamy jeden stabilny interfejs:
`SetDriverAttribute(driverId, attributeName, value)`

**Co to zmienia?**

1. **Autonomia:** Zespół weryfikujący licencje może zacząć wysyłać atrybut o nazwie `"LICENSE_VALID_UNTIL"` bez pytania kogokolwiek o zgodę.
2. **Stabilność:** Kod serwisu atrybutów nie zmienia się od miesięcy, mimo że system obsługuje coraz to nowsze dane.
3. **Odwrócenie zależności:** Teraz to serwisy zewnętrzne decydują, co jest atrybutem, a serwis centralny jedynie dostarcza „możliwość” (Capability) ich zapisu.

---

## 4. Kiedy stosować to podejście?

Ta technika nie jest „srebrną kulą”. Warto ją stosować, gdy:

- Dane są głównie **prezentacyjne** (tylko je wyświetlamy).
- Nie mamy skomplikowanych reguł walidacji krzyżowej między atrybutami (np. „jeśli atrybut A ma wartość X, to atrybut B musi być pusty”).
- Chcemy umożliwić zespołom szybkie eksperymentowanie z nowymi danymi bez narzutu biurokracji w kodzie.

> **Warto zapamiętać:**
> Jeśli każda zmiana w usłudze A wymaga zmiany w usłudze B, to prawdopodobnie nie masz mikroserwisów, tylko **rozproszony monolit**.

---

## Podsumowanie lekcji

| Cecha            | Stary model (Event-based)               | Nowy model (Generic Command)            |
| ---------------- | --------------------------------------- | --------------------------------------- |
| **Kontrakt**     | Bardzo specyficzny (Enums).             | Generyczny (String/Key-Value).          |
| **Zależność**    | Silna (wymaga synchronizacji zespołów). | Słaba (pełna autonomia).                |
| **Tempo zmian**  | Powolne (bottleneck).                   | Bardzo szybkie.                         |
| **Zastosowanie** | Krytyczna logika biznesowa.             | Dane prezentacyjne, atrybuty, metadane. |

**Czy w Twoim systemie masz taką usługę „magazynier”, która wie za dużo o typach danych, które przechowuje? Może warto rozważyć „rozluźnienie” jej kontraktu, aby przestała blokować rozwój innych modułów?**

---

W systemach monolitycznych problem spójności danych często rozwiązywaliśmy jednym słowem: `@Transactional`. Mechanizm ten gwarantował, że albo wszystkie zmiany w bazie danych zostaną zapisane, albo żadna. W świecie rozproszonym, gdzie każda usługa ma własną bazę, ta "magia" znika, a my musimy zmierzyć się z wyzwaniem **spójności końcowej (eventual consistency)**.

Oto jak zarządzać procesami biznesowymi, które przecinają granice wielu mikroserwisów.

---

### 1. Monolit vs Rozproszenie: Utrata transakcyjności

W monolicie, jak w przykładzie `ClaimService`, infrastruktura dbała o to, by przyznanie punktów lojalnościowych, powiadomienie klienta i zmiana statusu reklamacji były atomowe.

W systemie rozproszonym, gdy wydzielimy moduł `loyalty`, `billing` czy `notifications` jako osobne serwisy, tracimy tę gwarancję. Jeśli serwis reklamacji zmieni stan, a serwis lojalnościowy padnie – mamy niespójność.

---

### 2. Rozwiązanie: Wzorzec Saga

Saga to sekwencja transakcji lokalnych. Każda transakcja aktualizuje stan wewnątrz jednej usługi i publikuje zdarzenie lub wywołuje kolejny krok. Jeśli któryś krok się nie powiedzie, Saga musi wykonać **transakcje kompensujące**, aby cofnąć skutki poprzednich kroków.

Istnieją dwa główne podejścia do implementacji Sagi:

#### A. Orkiestracja (Orchestration)

Centralny obiekt (Orkiestrator) steruje procesem. Wie, jakie kroki należy wykonać i co zrobić w razie błędu.

- **Zalety:** Jasno określone miejsce definicji procesu, łatwe testowanie logiki sterowania, wbudowany monitoring.
- **Wady:** Ryzyko stworzenia "inteligentnego środka i głupich końcówek", co zwiększa sprzężenie.

#### B. Choreografia (Choreography)

Usługi wymieniają się zdarzeniami bez centralnego zarządcy. Każda usługa "wie", na co zareagować i co opublikować po zakończeniu swojej pracy.

- **Zalety:** Brak centralnego punktu awarii, luźne sprzężenie.
- **Wady:** Trudność w zrozumieniu przebiegu całego procesu "z lotu ptaka", ryzyko cyklicznych zależności.

---

### 3. Kompensacja – jak "cofnąć" to, co już się stało?

W systemach rozproszonych nie istnieje `rollback`. Jeśli system billingowy pobrał już pieniądze, a kolejny krok (np. wysyłka) zawiódł, musimy wykonać **akcję kompensującą** (np. zwrot środków).

- **Ważne:** Akcja kompensująca to nowa operacja biznesowa. Nie zawsze jest idealnym lustrzanym odbiciem (np. anulowanie faktury może wymagać wystawienia korekty, a nie po prostu usunięcia rekordu).

---

### 4. Heurystyki wyboru podejścia

Wybierz **Orkiestrację**, gdy:

- Proces jest skomplikowany (wiele kroków, rozgałęzienia).
- Potrzebujesz precyzyjnego monitoringu postępu (np. "gdzie jest moja paczka?").
- Chcesz uniknąć rozproszenia logiki procesu po wielu usługach.

Wybierz **Choreografię**, gdy:

- Proces jest krótki i prosty (2-3 kroki).
- Usługi są wysoce autonomiczne i reagują na generyczne zdarzenia domenowe.

---

**Podsumowując:** Rozproszenie systemu wymusza na nas akceptację faktu, że system przez pewien czas będzie niespójny. Wzorzec Saga pozwala nam jednak odzyskać kontrolę nad procesem biznesowym, czyniąc tę niespójność przewidywalną i zarządzalną.

**Czy w Twoim systemie proces reklamacji lub płatności jest obecnie rozproszony? Jeśli tak, czy chciałbyś, abym pomógł Ci zaprojektować przykładowy orkiestrator dla Twojego przypadku użycia?**
