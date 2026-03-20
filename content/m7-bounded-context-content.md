W świecie systemów legacy modularyzacja to nie tylko porządkowanie folderów. To walka ze zjawiskiem, które roboczo nazywamy **„splątaniem kwantowo-bugowym”**.

Oto jak podejść do wyznaczania granic (Bounded Contextów) i dlaczego Twoje obecne „moduły” mogą być tylko iluzją, opierając się na materiale szkoleniowym.

---

## 1. Problem: Splątanie kwantowo-bugowe

W systemach legacy cząstki kodu są ze sobą powiązane w sposób nieintuicyjny. Zmieniasz prostego `if-a` w module płatności, a nagle „wybucha” raportowanie w zupełnie innej części systemu.

**Skutki braku granic:**

- **Konieczność znajomości całości:** Aby zmienić detal, musisz rozumieć 80% systemu.
- **Łatwość wprowadzenia błędu:** Każda zmiana to stąpanie po polu minowym.
- **Niska testowalność:** Nie da się przetestować „cząstki”, bo wszystko jest ze sobą sklejone.

---

## 2. ROI Modularyzacji – Maraton vs. Sprint

Modularyzacja to inwestycja. Na początku zwalnia pracę (time-to-market), ale w dłuższej perspektywie stabilizuje tempo dostarczania.

- Jeśli system ma żyć 2 tygodnie (kampania marketingowa) – **nie potrzebujesz modułów**.
- Jeśli budujesz system na lata (jak projekt Cabs) – **brak granic Cię zabije**.

---

## 3. Pułapka „Modułów Technicznych”

Często słyszymy: _„Mamy moduły: Web, Service i Data”_. To podział warstwowy. Ma on sens tylko wtedy, gdy wektorem zmian jest technologia (np. zmieniamy bazę danych). W 90% przypadków zmiana biznesowa (np. nowe pole w taryfie) i tak przechodzi przez wszystkie te warstwy, zmuszając wszystkich do zmiany wszystkiego.

Prawdziwa modularyzacja powinna opierać się na **aspektach biznesowych**, ale i tu czyha pułapka...

### GodClass – warkocz biznesowy

Często tworzymy moduł `Driver` lub `Transit` i wrzucamy tam wszystko, co kojarzy się z tymi słowami. Powstaje **GodClass** – gigantyczna klasa-węzeł.

- Wydaje się naturalna, bo ma wszystkie dane.
- W rzeczywistości plącze różne procesy (np. zarobki kierowcy z preferencjami klienta).
- Rozwijanie jej wymaga „ifo-judo”, by nie zepsuć istniejących powiązań.

---

## 4. Czym jest Bounded Context?

To granica modelu, wewnątrz której język jest jednoznaczny. Ta sama rzecz (np. „Przejazd”) może wyglądać zupełnie inaczej w zależności od kontekstu:

1. **Kontekst Kierowcy:** Przejazd to zarobek, procent prowizji, czas pracy.
2. **Kontekst Klienta:** Przejazd to koszt, wygoda, czas oczekiwania.

Rozdzielenie tych modeli na dwa osobne Bounded Contexty pozwala każdemu z nich rosnąć niezależnie. Słowo „Przejazd” odzyskuje sens, bo wiemy, w jakim kontekście o nim mówimy.

---

## 5. Jak szukać granic? (Twoja lista kontrolna)

Ponieważ nie ma jednego algorytmu, używamy kilku technik pomocniczych:

- **Język (Ubiquitous Language):** Czy to samo słowo zaczyna znaczyć co innego w ustach różnych osób z biznesu?
- **Generyczne problemy:** Fakturowanie, CRM, Powiadomienia – to naturalne kandydaty na osobne moduły (często gotowe rozwiązania zewnętrzne).
- **Archetypy:** Jeśli widzisz wzorzec (np. model Party, State Machine), to jest to sprawdzona granica.
- **Główne pytania:** Na jakie kluczowe pytanie odpowiada ten model? (np. „Ile to kosztuje?” vs. „Kto jest dostępny?”).
- **Pojedyncze źródło prawdy:** Model powinien być odpowiedzialny za jednoznaczną odpowiedź w swoim obszarze.

---

## Podsumowanie

Dobra modularyzacja to taka, gdzie **rzeczy, które zmieniają się razem, mieszkają razem**. Posiadanie osobnych pakietów czy mikroserwisów nie oznacza automatycznie dobrej modularyzacji – kluczowe jest to, co dzieje się wewnątrz modeli i jak są wyznaczone ich granice.

**W Twoim projekcie na pewno istnieje jakaś „klasa-warkocz”, która łączy zbyt wiele wątków. Czy chciałbyś, abyśmy spróbowali ją wspólnie „rozplątać”, analizując ją pod kątem różnych Bounded Contextów, tak jak zrobiliśmy to z klasą Transit?**

---

Zanim zaczniesz fizycznie przenosić klasy do nowych modułów, musisz przygotować grunt. Modularyzacja to proces, który wymaga zrozumienia strategii biznesowej, rewizji podejścia do testów oraz technicznego rozluźnienia więzi między obiektami.

Oto kluczowe filary przygotowań do modularyzacji na podstawie materiałów kursu:

---

## 1. Strategiczne rozpoznanie (Co i Dlaczego?)

Nie każdy fragment kodu zasługuje na taką samą uwagę. Musisz wiedzieć, gdzie bije serce Twojego biznesu.

- **Domena Core (Core Domain):** To Twój wyróżnik rynkowy (np. zaawansowany algorytm wyceny przejazdu). Tu inwestujemy najwięcej w jakość i modularyzację, by zmiany nie psuły tego, co najcenniejsze.
- **Problemy generyczne:** Fakturowanie, CRM, notyfikacje. Są powtarzalne i zazwyczaj łatwe do odseparowania, bo ich logika jest nam dobrze znana i mało specyficzna dla konkretnego biznesu.
- **Wektory zmian:** Musisz wiedzieć, które części systemu będą się często zmieniać (np. promocje), a które są stabilne. Separacja tych dwóch światów to klucz do elastyczności.

---

## 2. Perspektywa socjotechniczna: Prawo Conway’a

Architektura systemu często odzwierciedla strukturę komunikacyjną organizacji. Jeśli modularyzacja na papierze kłóci się z tym, jak współpracują zespoły, wdrożenie jej będzie drogą przez mękę. Znajomość **topologii zespołów** pozwala uniknąć blokowania pracy jednych zespołów przez drugie.

---

## 3. Pułapka „zabetonowanych” testów

Testy, które mają Cię chronić podczas refaktoryzacji, mogą stać się Twoim największym wrogiem.

- **Problem:** Testy jednostkowe pisane „klasa per klasa” (silne sprzężenie do struktury) betonują złe granice. Gdy rozbijasz obiekt na trzy mniejsze, testy przestają działać, mimo że zachowanie biznesowe się nie zmieniło.
- **Rozwiązanie:** * Stawiaj na **testy wyższego poziomu** (serwisy, kontrolery), które sprawdzają *CO* system robi, a nie *JAK\* jest zbudowany w środku.
- Stosuj **Fixtures/Buildery**, które ukrywają szczegóły tworzenia obiektów przed testami.

---

## 4. Rozluźnianie zależności (Decoupling)

Aby swobodnie przenosić obiekty między „kubełkami” (modułami) bez efektu domina, musisz zerwać kaskadowe połączenia.

### Od referencji do identyfikatorów

Zamiast trzymać w klasie `Claim` (reklamacja) referencję do całego obiektu `Client`, użyj jego **biznesowego identyfikatora** (`ownerId`).

> **Dlaczego to działa?**
>
> 1. **Pojemność biznesowa:** Łatwiej obsłużysz skargę od osoby bez konta w systemie (brak obiektu `Client`).
> 2. **Testowalność:** Nie musisz budować całego drzewa obiektów, by przetestować jedną funkcjonalność.
> 3. **Prawo Demeter:** Unikasz łańcuchów wywołań typu `claim.getOwner().getAddress().getCity()`.

---

## 5. Cel: Modularny Monolit

Dążymy do architektury, w której moduły komunikują się przez publiczne API, a ich wnętrze jest ukryte (hermetyzacja).

- **Łatwość migracji:** Dobrze wydzielony moduł to krok od mikroserwisu.
- **Usuwalność kodu:** Możesz napisać moduł od zera i podmienić go bez dotykania reszty systemu.
- **Wartość nad „Czystym Kodem”:** Lepiej mieć 10 dobrze odizolowanych modułów z „brudnym” kodem w środku, niż jeden wielki monolit z idealnie czystymi metodami. Lokalny brud łatwiej posprzątać.

---

**Podsumowując:** Przygotowanie to przede wszystkim **zmiana myślenia o powiązaniach**. Zamiast łączyć wszystko „po kablu” (referencje), zaczynamy łączyć „przez radio” (ID/API).

**Czy chciałbyś, abyśmy przeanalizowali teraz konkretny kawałek Twojego kodu pod kątem zamiany referencji obiektowych na identyfikatory, aby sprawdzić, ile zależności uda się dzięki temu „odciąć”?**

---

Rozplątywanie klas typu **God Object**, takich jak `Transit` i `TransitService`, to jedno z najtrudniejszych zadań w pracy z systemem legacy. Zamiast rzucać się z motyką na słońce, materiały kursu proponują systematyczne podejście oparte na separacji odczytu, analizie pytań biznesowych i badaniu spójności.

Oto kluczowe strategie rozplątywania Twoich „legendarnych” klas:

---

## 1. Strategia I: Uwolnij DTO (Separacja odczytu)

Najczęstszym powodem, dla którego nie możemy ruszyć klasy `Transit`, jest to, że zasila ona widok (`TransitDTO`). Każda zmiana w encji psuje UI.

- **Problem:** `TransitDTO` przyjmuje w konstruktorze cały `Transit`. To betonuje strukturę.
- **Rozwiązanie:** Wprowadź osobny model do odczytu (np. `TransitDetails`).
- **Technika:** **Parallel Models** – przez pewien czas buduj DTO na dwa sposoby (stary i nowy), aż upewnisz się, że nowy model działa poprawnie.

Dzięki temu możesz „ciąć” klasę `Transit` bez obawy, że na ekranie pasażera znikną dane o przejeździe. Dane do odczytu mogą być zasilane bezpośrednio z serwisu lub przez zdarzenia.

---

## 2. Strategia II: Technika Głównych Pytań

Zamiast patrzeć na `Transit` jako na „rzeczownik”, zadaj sobie pytanie: **„Na jakie kluczowe pytania biznesowe odpowiada ta klasa?”**.

Dla `Transit` w systemie Cabs są to:

1. **„Ile to kosztuje?”** (wycena i taryfy).
2. **„Który kierowca może podjąć przejazd?”** (przypisanie i dostępność).
3. **„Czy mogę zmienić adres początkowy?”** (zarządzanie żądaniem).

**Ważne:** Geokodowanie czy pobieranie współrzędnych to pytania **poboczne**. Nie powinny zaciemniać głównej logiki modułu. Jeśli fragment kodu odpowiada na pytanie poboczne, to świetny kandydat do wydzielenia do osobnego obiektu lub modułu (np. moduł `tracking`).

---

## 3. Strategia III: Pojedyncze Źródło Prawdy

Jeśli odpowiedź na pytanie (np. „Czy kierowca jest dostępny?”) wymaga odpytania 5 różnych miejsc (przejazdy, przerwy, kolizje, GPS), masz problem ze spójnością i wydajnością.

- **Cel:** Zbierz wszystkie dane wpływające na daną odpowiedź w **jednym autonomicznym module**.
- **Zysk:** Unikasz sytuacji, w której system proponuje przejazd kierowcy, który właśnie zgłosił wypadek, bo informacja o wypadku „mieszka” w innym, nieodpytanym module.

---

## 4. Strategia IV: Analiza kohezji i lingwistyki

Nawet w wielkim węźle, jakim jest `Transit`, istnieją **klastry danych**.

- **Analiza kohezji:** Sprawdź, które metody używają których pól. Zauważysz, że np. taryfa i kilometry są używane tylko do ceny, ale nigdy nie pojawiają się w logice anulowania przejazdu. To sygnał, że te pola są tam tylko „dla widoku” i można je przenieść do modelu odczytowego.
- **Analiza lingwistyczna:** „Transit” znaczy co innego dla pasażera (cena!), a co innego dla kierowcy (zarobek i trasa). Szukaj momentów, w których jeden byt zamienia się w drugi.

---

## Efekt końcowy: Nowa struktura

Po zastosowaniu tych heurystyk, gigantyczny `Transit` rozpada się na mniejsze, wyspecjalizowane byty:

| Stara klasa | Nowa klasa / Moduł  | Główne pytanie                                   |
| ----------- | ------------------- | ------------------------------------------------ |
| `Transit`   | `RequestForTransit` | Czy i jak pasażer chce jechać?                   |
| `Transit`   | `DriverAssignment`  | Kto może i chce podjąć zlecenie?                 |
| `Transit`   | `TransitDemand`     | Jakie są aktualne parametry aktywnego przejazdu? |
| `Transit`   | `TransitDetails`    | Co mamy wyświetlić na ekranie? (Odczyt)          |

---

**Podsumowując:** Rozplątywanie zaczyna się od **uważnej obserwacji**. Zamiast walczyć z całym „warkoczem” na raz, wyciągaj z niego pojedyncze nitki – najpierw te odczytowe, potem te odpowiadające na konkretne pytania biznesowe.

**Czy w Twoim systemie masz klasę, która wydaje się „nietykalna” ze względu na liczbę pól i metod? Może spróbujemy wypisać 2-3 główne pytania, na które ona odpowiada, żeby zobaczyć, gdzie mogłyby przebiegać linie cięcia?**

---

Proces modularyzacji w systemach legacy to nie tylko techniczne wycinanie kodu, ale przede wszystkim walka z niepewnością. W tej lekcji przechodzimy przez dylematy, które pojawiają się zaraz po tym, jak „nożyce” pójdą w ruch.

Oto zestawienie typowych rozterek i heurystyk, które pomogą Ci podjąć właściwe decyzje architektoniczne.

---

## 1. Moduł czy tylko grupa obiektów?

Najczęstsze pytanie brzmi: czy to już osobny pod-projekt, czy tylko paczka wewnątrz dotychczasowego kodu?

- **Złota zasada:** Najlepsza decyzja to taka, którą **łatwo zmienić**. Jeśli trzymasz czyste kontrakty i rozmawiasz z bytami przez publiczne API, fizyczna lokalizacja kodu staje się wtórna.
- **Kiedy wydzielać osobno?**
- Gdy cząstka kodu będzie używana samodzielnie (np. wyszukiwanie kierowców przyda się nie tylko do taksówek, ale i do dostaw jedzenia).
- Gdy masz specyficzne drivery architektoniczne (np. moduł wyszukiwania musi skalować się inaczej niż moduł płatności).

- **Integracja:** Zamiast technicznych kluczy bazodanowych, używamy **UUID**. Dzięki temu moduły (np. `DriverAssignment` i `RequestForTransit`) mogą istnieć bez sztywnych więzów integralności na poziomie bazy.

---

## 2. Heurystyki oceny podziału

Skąd wiedzieć, czy Twój nowy podział jest dobry? Sprawdź go „na sucho” nowymi wymaganiami:

1. **Analiza Backlogu:** Ile modułów musisz dotknąć, aby dodać funkcję „przewozu żywności”? Jeśli wystarczy dopisać nowy kod i użyć istniejącego API – podział jest świetny. Jeśli musisz dodać flagę do `Transit` – coś poszło nie tak.
2. **Kompozycja:** Czy nowe wymagania da się „składać” z gotowych klocków?
3. **Autonomia:** Na ile moduł jest w stanie sam podjąć decyzję bez odpytywania połowy systemu?

---

## 3. Mit duplikacji danych i problem statusów

Wiele osób boi się duplikacji (np. taryfa w zapytaniu i taryfa w przejeździe).

- **To nie duplikacja, to inny kontekst:** Taryfa z godziny 23:50 (zapytanie) może być inna niż taryfa z 00:05 (start przejazdu). To dwa różne fakty biznesowe o różnym cyklu życia.
- **Statusy:** Zamiast jednego gigantycznego `status`, który robi wszystko, dzielimy go na:
- **Maszyny stanów:** Małe, lokalne statusy (np. `AssignmentStatus`), które pilnują reguł biznesowych.
- **Status odczytowy:** Notatka dla użytkownika w modelu odczytowym (`TransitDetails`), będąca projekcją mniejszych stanów.

---

## 4. Sprzątanie wnętrza i Serwisy Aplikacyjne

Po wydzieleniu granic lokalna refaktoryzacja staje się bezpieczniejsza. Nie musisz już stosować jednej architektury (np. 3 warstw) dla całego systemu.

- **Lokalna architektura:** Moduł płatności może być prostym CRUD-em, a moduł wyceny może korzystać z Pipe & Filters. Granice modułu chronią Cię przed efektem domino.
- **RideService jako Fasada:** Dawny `TransitService` zamienia się w **Serwis Aplikacyjny**. Jego rola to teraz wyłącznie koordynacja – deleguje pracę do mniejszych, wyspecjalizowanych serwisów (np. `RequestTransitService`), które dbają o konkretne procesy.

---

## Podsumowanie "rozterek"

| Wyzwanie               | Rozwiązanie Legacy Fighter                                 |
| ---------------------- | ---------------------------------------------------------- |
| **Sztywne powiązania** | Zamiana ID bazodanowych na UUID.                           |
| **Wielki Status**      | Rozbicie na mniejsze maszyny stanów + status odczytowy.    |
| **Duplikacja**         | Akceptacja duplikacji typów danych dla różnych kontekstów. |
| **God Service**        | Delegacja logiki do serwisów aplikacyjnych (fasada).       |

**Wniosek:** Modularyzacja to proces ciągły. Nawet jeśli na początku podział nie jest idealny, to autonomia modułów daje Ci szansę na poprawę decyzji w przyszłości bez przepisywania całego systemu.

**W Twoim systemie pewnie masz taką "legendarną" maszynę stanów z 15 statusami. Czy chciałbyś, abym pomógł Ci znaleźć w niej te mniejsze, ukryte maszyny, tak jak zrobiliśmy to z statusem przejazdu?**

---

EventStorming to nie tylko warsztat z kolorowymi karteczkami – w rękach inżyniera walczącego z legacy to potężne narzędzie analityczne. Pozwala ono wydobyć z gąszczu kodu biznesowe **„CO”** i precyzyjnie nakreślić granice Bounded Contextów.

Oto jak wykorzystać EventStorming do znalezienia „szwów” w Twoim systemie, opierając się na materiale kursu.

---

## 1. Perspektywy Being, Behaving, Becoming

Zamiast analizować tabelki w bazie danych, spójrz na każdy koncept (np. przejazd, licencję, ofertę) z trzech perspektyw:

- **Being (Bycie):** Jak ta rzecz wygląda? Jakie ma cechy? (Rzeczowniki i właściwości).
- **Behaving (Zachowanie):** Co można z nią zrobić? Przy jakich założeniach? (Czasowniki i zachowania).
- **Becoming (Przeistaczanie):** W co ta rzecz się zmienia? (Metamorfozy).

To podejście pozwala dostrzec, że jeden „byt” w kodzie (np. klasa `Transit`) w rzeczywistości przechodzi przez różne fazy, które rządzą się zupełnie innymi prawami.

---

## 2. Metamorfozy – Klucz do podziału

Najważniejszym wnioskiem z sesji jest uchwycenie **metamorfozy**. To moment, w którym zmienia się zestaw danych, zestaw reguł oraz zestaw dostępnych operacji.

**Przykład Licencji:**
Zamiast tworzyć jeden obiekt `Licencja` ze statusem `OCZEKUJĄCA`, EventStorming ujawnia dwa odrębne byty:

1. **Wniosek o licencję:** Tu liczą się reguły uzupełniania danych, wzywanie do poprawek, sprawdzanie załączników.
2. **Licencja:** Od momentu przyznania (zdarzenie graniczne), wniosek nas nie obchodzi. Licencję można zawiesić, przedłużyć lub odebrać. To zupełnie inny zestaw zachowań.

> **Wniosek:** Cięcie biznesowe między Wnioskiem a Licencją to idealne miejsce na granicę modułu (Bounded Contextu).

---

## 3. Heurystyki odkrywania granic

Jak na sesji EventStormingowej poczuć, że zbliżasz się do granicy kontekstu? Szukaj tych sygnałów:

- **Zmiana znaczenia słowa:** Jeśli słowo „Oferta” dla handlowca oznacza rabaty, a dla działu finansowania oznacza ratę leasingu – masz dwa konteksty.
- **Zmiana aktora:** Gdy jeden pracownik „przekazuje pałeczkę” drugiemu (np. dealer przekazuje ofertę do analityka bankowego).
- **Utrata zainteresowania „JAK”:** Jeśli handlowca interesuje tylko **CZY** finansowanie zostało przyznane, a nie **JAK** analityk obliczył zdolność kredytową – to sygnał autonomii modułów.

---

## 4. Skuteczny EventStorming – Twoja lista kontrolna

| Cecha                     | Na co zwrócić uwagę?                                                      |
| ------------------------- | ------------------------------------------------------------------------- |
| **Głęboka analiza**       | Nie ślizgaj się po powierzchni; szukaj reguł, które blokują zdarzenia.    |
| **Precyzyjny język**      | Unikaj ogólników. Jeśli ekspert mówi „Zapytanie”, nie pisz „Transit”.     |
| **Granice lingwistyczne** | Słuchaj, gdzie kończy się kompetencja jednego aktora, a zaczyna drugiego. |

---

**Podsumowując:** EventStorming pozwala Ci przestać myśleć o systemie jako o zbiorze tabel, a zacząć widzieć go jako **proces przeistaczania się informacji**. Zrozumienie, gdzie zachodzą metamorfozy (Becoming), to najkrótsza droga do stabilnej i skalowalnej architektury.

**Czy w Twoim systemie jest proces, który wydaje się „ciągnąć” przez wiele statusów (np. od zapytania do faktury)? Czy chciałbyś, abyśmy spróbowali go wspólnie przeanalizować pod kątem metamorfoz Being, Behaving, Becoming?**

---

W złożonych systemach samo wydzielenie modułów to często za mało. Aby zapanować nad logiką biznesową, warto wprowadzić **warstwy odpowiedzialności** (Responsibility Layers). Pozwalają one ustrukturyzować kod nie według technologii, ale według roli, jaką dany element pełni w strategii przedsiębiorstwa.

---

## 5 Warstw Odpowiedzialności

Zamiast mieszać reguły naliczania zniżek z zarządzaniem flotą, dzielimy system na logiczne piętra.

### 1. Warstwa Możliwości (Capability)

To fundament – zasoby i potencjał, jakimi dysponuje firma. Nie mówimy tu o procesach, ale o "stanie posiadania".

- **Przykład:** Czas pracy kierowcy, wolne miejsce w taksówce, fizyczna sala w kinie.
- **Charakterystyka:** Bardzo stabilna. Rzadko przestajemy dysponować czasem pracowników lub przestrzenią.

### 2. Warstwa Operacji (Operations)

Opisuje konkretne sposoby wykorzystania potencjału z warstwy niżej.

- **Przykład:** Płatny przejazd z pasażerem, darmowy przejazd na stację benzynową w celu zatankowania, wynajem sali na konferencję.
- **Charakterystyka:** Bardzo zmienna. Tu firma eksperymentuje, szukając nowych źródeł zysku (np. taksówkarz zaczyna dowozić pizzę).

### 3. Warstwa Polityk (Policy)

To "bezpieczniki" i reguły, które dookreślają, jak operacje mają być wykonywane w konkretnych warunkach.

- **Przykład:** Zasada zostawiania wolnego miejsca obok pasażera (COVID), wymóg zatankowania auta raz na dobę, zakaz rezerwacji z dużymi lukami czasowymi.
- **Charakterystyka:** Średnio stabilna. Często wynika z regulacji prawnych lub odgórnych strategii.

### 4. Warstwa Wspierania Decyzji (Decision Support)

Mózg systemu. Modele analityczne, które patrzą na dane i mówią operacjom, co mają robić, aby zoptymalizować zysk.

- **Przykład:** System sugerujący kierowcom przejazd pod stadion przed końcem meczu (predictive dispatching), optymalizacja repertuaru kinowego.

### 5. Warstwa Zobowiązań (Commitments)

Modeluje umowy z podmiotami zewnętrznymi, które wymuszają konkretne zachowania, nawet jeśli są one chwilowo nieopłacalne.

- **Przykład:** Umowa z dystrybutorem filmu wymuszająca jego emisję mimo pustej sali, kontrakty z właścicielami apartamentów w condo-hotelu.

---

## Kierunek zależności i tempo zmian

Kluczem do sukcesu jest zrozumienie, że **warstwy wyższe wiedzą o niższych, ale nigdy odwrotnie**.

| Warstwa                             | Tempo zmian   | Elastyczność                                                            |
| ----------------------------------- | ------------- | ----------------------------------------------------------------------- |
| **Wsparcie Decyzji / Zobowiązania** | Niskie        | Bardzo stabilne modele analityczne.                                     |
| **Polityki**                        | Średnie       | Wymagają konfiguracji (strategie/wzorce).                               |
| **Operacje**                        | **Wysokie**   | Tu musimy mieć interfejsy i możliwość szybkiego dodawania nowych typów. |
| **Możliwości**                      | Bardzo niskie | Fundament systemu, rzadko refaktoryzowany.                              |

### Dlaczego to ważne w projekcie Cabs?

Wprowadzenie nowych wymagań (np. tankowanie floty czy wysyłanie aut pod stadion) za pomocą pola `type` w klasie `Transit` to prosta droga do **splątania kwantowo-bugowego**.

Zastosowanie warstw odpowiedzialności pozwala nam:

- Zostawić klasę `Transit` (operacja: przejazd z klientem) w spokoju.
- Dodać nowe operacje (np. `InternalDispatch`), które współdzielą jedynie **możliwość** (czas kierowcy).
- Dodać **polityki** i **wsparcie decyzji**, które koordynują te operacje niezależnie od siebie.

---

## Podsumowanie

Dzielenie systemu na warstwy odpowiedzialności chroni Cię przed efektem domino. Jeśli zmieniasz sposób, w jaki system sugeruje kierowcom postój (Decision Support), nie powinieneś musieć dotykać kodu odpowiedzialnego za naliczanie opłaty za kilometr (Operations/Policy).

**W Twoim systemie na pewno istnieją reguły, które "puchną" od nadmiaru instrukcji `if` (np. różne typy zamówień). Czy chciałbyś, abyśmy spróbowali rozbić jeden taki proces na warstwy Operacji i Polityk, aby odchudzić główną logikę?**

---

Wchodzimy na wyższy poziom wtajemniczenia. O ile wydzielenie modelu odczytowego (CQRS) to zazwyczaj „bezpieczna zabawa”, o tyle stosowanie **Parallel Models** dla logiki zapisu (zmiany stanu) to już operacja na otwartym sercu systemu.

Gdy decydujesz się zbudować nowy model od zera obok starego, musisz zmierzyć się z synchronizacją dwóch światów, które z czasem zaczną do siebie nie pasować.

---

## 1. Wyzwanie: Podwójny Zapis (Dual Write)

W tradycyjnym refaktoryzowaniu zmieniamy klasy krok po kroku. W strategii równoległej wysyłasz tę samą intencję biznesową do dwóch różnych implementacji.

- **Mechanizm:** Twoja aplikacja staje się „rozgałęźnikiem”. Każda metoda w serwisie musi teraz wywołać logikę w starym systemie oraz w nowym agregacie/module.
- **Obserwowalne zachowanie:** Nowy model musi być „przezroczysty”. Jeśli stary model rzuca `InsufficientFundsException`, nowy musi zachować się identycznie, aby reszta systemu nie oszalała.

---

## 2. Strategia Weryfikacji: Gdzie szukać błędów?

Jak sprawdzić, czy nowy model „myśli” tak samo jak stary, skoro komendy zazwyczaj nic nie zwracają (zasada CQS)?

| Punkt weryfikacji   | Co sprawdzamy?                                             | Korzyść                                                                          |
| ------------------- | ---------------------------------------------------------- | -------------------------------------------------------------------------------- |
| **Moment Zapisu**   | Czy oba modele rzuciły ten sam wyjątek?                    | Natychmiastowe wykrycie różnic w regułach walidacji.                             |
| **Moment Odczytu**  | Czy dane zwrócone przez stary model są identyczne z nowym? | Wykrycie błędów w logice przetwarzania danych, które nie objawiły się wyjątkiem. |
| **Asynchronicznie** | Porównanie stanów baz danych (np. nocny raport).           | Najmniejszy wpływ na wydajność użytkownika końcowego.                            |

> **Pro-tip:** Porównywanie przy odczycie jest najbezpieczniejsze. Jeśli użytkownik prosi o `TransitDTO`, pobierz dane z obu modeli i zaloguj różnice (diff), ale zwróć mu wynik ze starego modelu. Dzięki temu widzisz błąd, ale nie psujesz mu pracy.

---

## 3. Problem Spójności (Consistency)

To tutaj najczęściej dochodzi do „rozsynchronizowania światów”.

- **Wspólna baza danych:** Możesz objąć oba zapisy jedną transakcją. To najbezpieczniejsze, ale... co jeśli nowy model (który jest jeszcze w fazie testów) zablokuje stary zapis? Zazwyczaj chcemy, aby błąd w nowym modelu **nie przerywał** pracy starego.
- **Rozłączne bazy:** Tutaj wchodzi **Eventual Consistency**. Nowy model może być spójny ze starym dopiero po kilku milisekundach (lub sekundach). Twoje porównania przy odczycie muszą to uwzględniać, aby nie generować fałszywych alarmów.

---

## 4. Feature Flags i „Wielkie Przełączenie”

Kiedy masz już pewność, że diffy między modelami wynoszą 0%, pora na zmianę lidera.

1. **Tryb Cienia (Shadow Mode):** Zapisujesz do obu, czytasz ze starego, porównujesz wyniki.
2. **Tryb Przejściowy:** Czytasz z nowego dla 10% użytkowników (Feature Flag).
3. **Cutover:** Nowy model staje się źródłem prawdy. Stary zapisuje dane tylko jako „backup”.
4. **Decomissioning:** Usuwasz stary kod.

---

## Podsumowanie – Kiedy warto cierpieć?

Budowanie równoległego modelu zapisu jest drogie i skomplikowane. Warto to robić tylko wtedy, gdy:

- Stary kod jest tak splątany, że każda mała zmiana powoduje błędy w nieoczywistych miejscach.
- Zmieniasz drastycznie paradygmat (np. z anemicznego modelu na pełny DDD/Event Sourcing).
- System musi działać 24/7 i nie możesz pozwolić sobie na błąd przy klasycznej refaktoryzacji.

**Pamiętaj:** Jeśli nowy model „rozjedzie się” ze starym (np. z powodu awarii), musisz mieć skrypt, który go wyczyści i odbuduje na podstawie danych ze starego źródła prawdy.

**Czy w Twoim systemie masz proces, który jest tak krytyczny, że boisz się go dotknąć „na żywo”? Może spróbujemy zaprojektować dla niego taki „Shadow Model”, który będzie śledził zmiany bez ryzyka awarii produkcji?**

---

W tej lekcji przechodzimy do kolejnego „poziomu wtajemniczenia” w rozplątywaniu systemów legacy. Tym razem nie będziemy tylko ciąć klasy na kawałki, ale nauczymy się rozpoznawać moment, w którym **cała struktura rozwiązania jest błędna** i wymaga zastąpienia jej czymś zupełnie innym.

Oto analiza przypadku systemu dostaw żywności i nowa strategia walki z „węzłami gordyjskimi” w kodzie.

---

## 1. Diagnoza: Kiedy „generyczny” model staje się przekleństwem?

W naszym systemie dostaw mamy model `CustomerOrderGroup`, który za pomocą technicznego mechanizmu (drzewa/grafu) próbuje odpowiedzieć na zbyt wiele pytań naraz.

**Na jakie pytania GŁÓWNE odpowiada ten model?**

1. **Uprawnienia:** Kto może zobaczyć dane zamówienie?
2. **Własność:** Do kogo należy to zamówienie? (Grupowanie).
3. **Struktura:** Jak wygląda hierarchia wewnątrz firmy klienta?

**Problem:** Zastosowano język **rozwiązania** (węzeł, rodzic, dziecko, rekurencja) zamiast języka **problemu** (administrator, departament, firma). To klasyczna pułapka: model jest tak generyczny, że zmiana w jednym miejscu (np. dodanie admina) psuje wszystko inne (np. wydajność raportów).

---

## 2. Dlaczego rozcinanie (jak w przypadku Transit) tutaj nie zadziała?

W przypadku klasy `Transit` mieliśmy kilka modeli biznesowych sklejonych w jeden kod. Rozcięcie go przywracało porządek. Tutaj mamy model, który od początku jest **techniczną pomyłką** w kontekście najważniejszego celu biznesowego: _white labelingu_.

- **Transit:** Suma modeli, które do siebie pasują. (Rozwiązanie: Podział).
- **Order Groups:** Model techniczny (graf), który nie pasuje do żadnej z ról biznesowych. (Rozwiązanie: Budowa nowego modelu „obok”).

---

## 3. Strategia: Nowy model „obok” (Flattening)

Zamiast walczyć z rekurencyjnym drzewem, które dławi bazę danych, proponujemy **rozpłaszczenie uprawnień**. Zamiast pytać drzewa „kto jest Twoim pra-pra-dziadkiem?”, nadajemy użytkownikom bezpośrednie **prawa (Rights)** do konkretnych podmiotów (`partyId`).

**Zalety nowego podejścia:**

- **Przejrzystość:** Widzisz czarno na białym: „Jan ma prawo do firmy X i departamentu Y”.
- **Wydajność:** Proste zapytanie SQL zamiast rekurencyjnych procedur.
- **Elastyczność:** Możesz łatwo dodać administratora, który widzi tylko dwie wybrane firmy (w starym modelu musiałbyś tworzyć dla niego sztuczne węzły w drzewie).

---

## 4. Bezpieczne wpinanie: Inny sposób testowania

Przy tak drastycznej zmianie (z drzewa na płaską listę) małe kroki refaktoryzacyjne mogą być zbyt ryzykowne. Tutaj stosujemy strategię **Parallel Models** z silnym naciskiem na weryfikację wyników.

1. **Implementacja modelu Right:** Tworzymy nową tabelę i logikę uprawnień.
2. **Podwójne sprawdzanie:** W serwisie odczytowym wywołujemy obie metody – starą (drzewo) i nową (płaską).
3. **Logowanie różnic:** Jeśli nowy model zwraca inne zamówienia niż stary – logujemy błąd, ale użytkownikowi ciągle serwujemy dane ze starego (sprawdzonego) modelu.
4. **Przełączenie:** Gdy błędy (diffy) przestaną się pojawiać – ucinamy stare drzewo.

---

## Podsumowanie – Warto zapamiętać

| Cecha              | Podejście „Transit”                  | Podejście „Order Groups”                  |
| ------------------ | ------------------------------------ | ----------------------------------------- |
| **Główny problem** | Splątanie logiki (God Object).       | Błędna abstrakcja (Język techniczny).     |
| **Metoda**         | Rozcięcie na mniejsze klasy/moduły.  | Budowa nowego modelu od zera.             |
| **Język**          | Wydobycie ukrytych nazw biznesowych. | Całkowita zmiana słownictwa na biznesowe. |
| **Bezpieczeństwo** | Testy jednostkowe/integracyjne.      | Parallel Models i porównywanie wyników.   |

**Wniosek:** Czasem najlepszym sposobem na „rozplątanie” jest po prostu odwiązanie najważniejszej liny i zbudowanie nowej konstrukcji obok. Często okazuje się, że to, co zostało ze starego węzła, przestaje być problemem, gdy nie musi już dźwigać całego ciężaru systemu.

**Czy w Twoim kodzie masz taką strukturę (np. generyczny graf lub drzewo), która „puchnie” od technicznych hacków, by obsłużyć proste biznesowe przypadki? Może spróbujemy zdefiniować „płaski” model dla jednego z jej zadań?**

---

Dotarliśmy do finału rozplątywania klasy `Transit`. To, co na początku było jedną, „puchnącą” encją, stało się eleganckim zestawem współpracujących ze sobą modeli. Kluczem do sukcesu nie było tylko pocięcie kodu, ale zmiana sposobu myślenia o tym, czym **w danym momencie** jest przejazd.

Oto esencja wzorca **Bounded Context** w praktyce systemu Cabs:

---

## 1. Refaktoryzacja `Transit` – Od Monolitu do Precyzji

Zamiast jednego obiektu, który robi wszystko, mamy teraz sztafetę, w której każdy zawodnik zna swoją rolę:

- **`RequestForTransit`**: To nasza „obietnica”. Skupia się na tym, co ustalamy na początku: taryfa, dystans i estymacja. To tu rodzi się cena.
- **`TransitDemands`**: To faza „oczekiwania”. Jej jedynym zadaniem jest pilnowanie, aby zmiany miejsca odbioru nie złamały zasad biznesowych (niezmienników).
- **`Transit`**: To „realizacja”. Tu liczy się tylko finalny koszt oparty na faktycznie przebytej trasie.
- **`TransitDetails`**: Nasza „wystawa”. To model odczytowy, który sprawia, że dla reszty systemu (i UI) to rozbicie jest kompletnie niewidoczne.

---

## 2. Bounded Context – Twoja tarcza przed chaosem

Najważniejszą lekcją jest to, że **„Przejazd” nie jest jeden**.

W module **`ride`** przejazd to skomplikowany proces z fazami, regułami i adresami. W module **`driverfleet`**, przejazd to po prostu… **liczba (cena)**, od której trzeba naliczyć prowizję.

> **Zapamiętaj:** Bounded Context to granica lingwistyczna. Wewnątrz niej słowa mają jedno, precyzyjne znaczenie. Poza nią – mogą znaczyć coś zupełnie innego i to jest OK.

---

## 3. Modele Głębokie: "Make the Implicit Explicit"

Czasem warto zejść poziom niżej i poszukać matematycznej prawdy o problemie. W module `pricing` zamiast setek instrukcji `if`, możemy zobaczyć taryfę jako funkcję liniową:

$$Price = (Distance \cdot kmRate) + baseFee$$

Taki model jest potężniejszy, bo pozwala wyceniać nie tylko przejazd, ale też czas oczekiwania czy kary za spóźnienie, używając tej samej logiki. **Głęboki model to taki, który usuwa szum i zostawia czystą esencję biznesu.**

---

## 4. Jak to wdrożyć u siebie? (Mini-ściąga)

Zanim zaczniesz refaktoryzację, zadaj swojemu kodowi te pytania:

1. **Jakie pytanie tu zadajemy?** (np. „Czy ten kierowca może jechać?” zamiast „Daj mi obiekt Driver”).
2. **Czy to słowo ma dwa znaczenia?** Jeśli „Zamówienie” znaczy co innego dla magazyniera i księgowej – potrzebujesz dwóch Bounded Contextów.
3. **Co jest zbędne?** Jeśli w modelu uprawnień masz pole `carColor`, to znaczy, że Twój kontekst przecieka. Usuń to.

---

**Podsumowując:** Bounded Context to nie jest tylko podział na pakiety w Javie czy C#. To przede wszystkim **granica Twojej odpowiedzialności**. Pozwala Ci ona tworzyć modele, które są proste, bo rozwiązują tylko jeden, konkretny problem.

**W Twoim projekcie na pewno jest taki termin-widmo (jak „Przejazd” u nas), który pojawia się wszędzie, ale każdy rozumie go inaczej. Może spróbujemy go zidentyfikować i nakreślić jego pierwszą, lingwistyczną granicę?**
