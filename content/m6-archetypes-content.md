Czasem nie warto odkrywać koła na nowo, zwłaszcza gdy Eric Evans podpowiada, że DDD służy do eksploracji _nieznanego_, a to, co _znane_, zostało już dawno opisane w grubych książkach o archetypach. W tym module przechodzimy od „łatania dziur” w kodzie do solidnej inżynierii modeli.

Oto kluczowe filary podejścia opartego na archetypach i wzorcach analitycznych:

---

## 1. Archetyp vs Wzorzec Analityczny

Choć używane zamiennie, różnią się stopniem konkretności:

- **Archetyp modelu biznesowego:** To gotowy przepis na konkretną branżę (np. jak powinien wyglądać model magazynu, laboratorium czy CRM).
- **Wzorzec analityczny:** To model czystych relacji, oderwany od branży. Rozwiązuje generyczne problemy, takie jak: „kto za co odpowiada” (**Party-Role**) czy „ile czego mamy” (**Inventory**).

---

## 2. Strategia: Parallel Models (Modele Równoległe)

W przypadku archetypów rzadko bawimy się w małe, mechaniczne refaktoryzacje. Jeśli obecny model jest fundamentalnie błędny (np. oparty na sztywnej hierarchii dziedziczenia zamiast ról), stosujemy „cięcie chirurgiczne”:

1. **Budujemy nowy model obok starego** (na czystej kartce, bazując na wzorcu).
2. **Używamy starego kodu jako źródła danych**, ale logikę przenosimy do nowej struktury.
3. **Podpinamy klientów pod nowy interfejs**, gdy ten jest gotowy.

Dzięki temu unikasz ryzyka regresji w trakcie „przeszczepu” serca systemu.

---

## 3. Twoje narzędzia myślowe: Filtrowanie Rzeczywistości

Aby dopasować archetyp, musisz najpierw „oczyścić” problem biznesowy za pomocą trzech technik:

- **Uogólnienie (Generalization):** Przestajesz widzieć „fakturę” i „zamówienie”, a zaczynasz widzieć „dokument w obiegu”.
- **Wyabstrahowanie (Abstraction):** Z licencji prawniczej wyciągasz tylko to, co istotne dla kodu – np. liczbę dostępnych slotów dla użytkowników.
- **Zmiana reprezentacji:** Zamieniasz listę powiązań na graf lub macierz, aby łatwiej wyliczać ścieżki.

---

## 4. Problem: Błędne Abstrakcje

Najgorszy rodzaj kodu legacy to nie „spaghetti”, ale **elegancko napisany model, który modeluje nie to, co trzeba**.
Przykład: Sztywne dziedziczenie ról (np. `EmployeeDriver extends Employee`), które blokuje możliwość bycia jednocześnie kierowcą i mechanikiem. Archetypy (np. **Role Object**) pozwalają na dynamiczną zmianę odpowiedzialności bez „hakowania” kodu.

> **Pamiętaj:** Model tworzony dzisiaj odzwierciedla Twoje _dzisiejsze_ zrozumienie biznesu. Jeśli biznes się zmienia, a Ty „hakujesz” model zamiast go pielęgnować, budujesz dług, który spowolni system bardziej niż brak testów.

---

**Morał:** Jeśli poprawnie zidentyfikujesz problem (np. „potrzebuję dynamicznych ról”), wzorzec analityczny prawdopodobnie już istnieje. Model oparty na takich fundamentach zestarzeje się znacznie wolniej.

**Czy w Twoim projekcie masz obecnie problem z encją, która „puchnie” od nadmiaru ról lub stanów (np. użytkownik, który jest jednocześnie klientem, pracownikiem i administratorem)? Chcesz, żebyśmy spróbowali dopasować do tego wzorzec Party-Role?**

---

W starciu z systemami legacy największym wrogiem nie jest „brudny kod”, ale **błędna abstrakcja**. Jeśli fundamenty (np. hierarchia klas) zostały postawione w sposób sztywny, każda próba dodania nowej logiki kończy się duplikacją lub „hakowaniem” modelu.

Oto jak rozmontować ten problem, łącząc archetypy biznesowe ze wzorcami projektowymi.

---

## 1. Pułapka Dziedziczenia

W zastanym kodzie (`CommonBaseAbstractUser`) poddostawca przyjął założenie, że to, **kim jest** użytkownik (pracownik, kontraktor), determinuje to, **co może zrobić**. To prowadzi do eksplozji klas, gdy dochodzą nowe parametry: forma własności auta, gwarancja czy ubezpieczenie.

**Problem:** Jeśli kierowca ma jedno auto w leasingu, a drugie na własność, musiałby być dwoma różnymi obiektami w hierarchii dziedziczenia. To „Single Point of Failure” dla logiki biznesowej.

---

## 2. Rozwiązanie: Archetyp _Party_

Zamiast budować drzewo dziedziczenia, używamy wzorca **Party** (Strona/Partycypant).

- **Party:** Osoba lub organizacja (np. Kierowca, Firma Leasingowa).
- **Party Role:** Rola, jaką pełni dany podmiot (np. Pracownik, Właściciel, Gwarant).
- **Party Relationship:** Powiązanie między rolami (np. Kierowca-Pracownik powiązany z Firmą-Pracodawcą).

Dzięki temu relacje stają się **danymi w bazie**, a nie sztywnym kodem. Możemy je zmieniać w runtime bez restartu aplikacji.

---

## 3. Dynamika: Wzorzec _Role Object_

Sam wzorzec _Party_ mówi nam tylko, „kto z kim trzyma”. Potrzebujemy jeszcze zachowań (logiki). Tu wchodzi **Role Object**.

- Każdej roli z modelu _Party_ przypisujemy konkretny **obiekt roli** w kodzie.
- Używamy mechanizmu **refleksji** (lub dynamicznego mapowania), aby na podstawie nazwy relacji „wyczarować” odpowiedni handler logiki (np. `LeasingRepairHandler`).

W efekcie:

1. System pyta model _Party_: „W jakiej relacji jest ten kierowca z tym autem?”.
2. Dostaje odpowiedź: „To leasing od Firmy X”.
3. System znajduje _Role Object_ dla leasingu i wykonuje obliczenia.

---

## 4. Architektura: Autonomia zamiast SPoF

Aby uniknąć stworzenia jednego „Uber-Serwisu” od wszystkiego, zamykamy mechanizm mapowania ról w reużywalnym **komponencie**.

- Każdy moduł (Naprawy, Serwis, Czyszczenie) ma **własną instancję** mappera.
- Każdy moduł przechowuje tylko te relacje, które go interesują (**Single Source of Truth** w danym kontekście).
- Awaria modułu napraw nie kładzie modułu serwisu bieżącego.

---

## Podsumowanie: Zachowania zamiast Rzeczowników

| Cecha         | Stary Model (Legacy)                | Nowy Model (Archetypowy)                         |
| ------------- | ----------------------------------- | ------------------------------------------------ |
| **Struktura** | Sztywna hierarchia dziedziczenia.   | Dynamiczne grafy relacji (_Party_).              |
| **Logika**    | Rozproszona w `instanceof` i ifach. | Zamknięta w dedykowanych rolach (_Role Object_). |
| **Zmiany**    | Wymagają programowania i wdrożenia. | Wymagają zmiany danych w bazie (runtime).        |
| **Skupienie** | Na rzeczownikach (Kto to jest?).    | Na zachowaniach (Co ma się stać?).               |

Przejście na ten model pozwala uniknąć „efektu zamrożenia”, gdy kod staje się tak zawiły, że nikt nie odważy się go zmienić. Pamiętaj: **co się zmienia** (logika), **jak się zmienia** (role) i **dlaczego się zmienia** (relacje) – to trzy pytania, które powinny prowadzić Twoją analizę.

**Nowy model jest gotowy do testowania. Czy chciałbyś, abym wyjaśnił, jak konkretnie zaimplementować „magię” refleksji w Javie, by dynamicznie ładować obiekty ról bez psucia silnego typowania?**

---

Ten problem to prawdziwy test dla każdego architekta. Kiedy klient mówi: „Chcę mieć panel, w którym sam wyklikam statusy i reguły”, większość klasycznych modeli obiektowych (OO) natychmiast się poddaje. Dlaczego? Bo OO kocha stabilne zachowania (metody), a tutaj same zachowania stają się danymi konfiguracyjnymi.

Oto jak przejść od sztywnego kodu do modelu, który „płynie” wraz z wymaganiami.

---

## 1. Wybór paradygmatu: OO czy Proceduralnie?

Zanim zaczniesz pisać klasy, musisz zdecydować, co w Twoim systemie jest „kotwicą”, a co „żaglem”.

- **Podejście Obiektowe (OO):** Ma sens, gdy masz **stabilne metody**, ale zmieniające się reguły wewnątrz nich.
- **Podejście Proceduralne:** Jest lepsze, gdy masz **stabilne struktury danych**, ale zachowania (serwisy/procesy) pojawiają się i znikają w zależności od konfiguracji.

W naszym przypadku dokumenty mają niestabilne statusy i reguły. Próba upchnięcia tego w metody `verify()` czy `publish()` w klasie `Document` to walka z wiatrakami.

---

## 2. Dekompozycja na autonomiczne moduły

Zamiast budować jeden wielki „Mega-Dokument”, dzielimy problem na mniejsze, wyspecjalizowane moduły. Każdy odpowiada na inne pytania biznesowe.

1. **Edytor Treści (CRUD):** Działa jak system kontroli wersji (Git). Nie interesują go statusy, tylko „zapisz nową wersję” i „pobierz treść”.
2. **Katalog (Read Model):** Zajmuje się tylko prezentacją. Reaguje na zdarzenia `DocumentPublished` i udostępnia PDF-y czytelnikom.
3. **Manager Zasobów (State Engine):** Serce systemu. Pilnuje reguł przejść między statusami.

---

## 3. Ewolucja modelu stanów: Od Dziedziczenia do Składania

### Poziom 1: Klasyczny wzorzec Stanu (Inheritance)

W pierwszej próbie tworzymy klasę dla każdego stanu (np. `DraftState`, `VerifiedState`).

- **Problem:** Musimy znać nazwy stanów w czasie kompilacji. Dodanie nowego stanu wymaga napisania nowej klasy i zmiany API. To nadal jest „legacy”, tylko w ładniejszym garniturze.

### Poziom 2: Składanie zachowań (Composition)

Zamiast tworzyć klasy `Draft`, `Verified`, tworzymy jedną generyczną klasę `State`, której wstrzykujemy **reguły** (np. `ContentChangePredicate`, `TransitionRule`).

- **Zaleta:** Stany i przejścia stają się danymi w bazie. Możesz wyklikać nowy proces biznesowy w panelu admina bez dotykania kodu.
- **Klucz:** Używamy **kompozycji zamiast dziedziczenia**. Dokument nie „jest” w danym stanie zdefiniowanym przez typ klasy, ale „posiada” stan opisany przez konfigurację.

---

## 4. Wersjonowanie – lekcja z systemów kontroli wersji

Zamiast trzymać historię zmian wewnątrz obiektu `Document` (co grozi wybuchem pamięci przy dużych dokumentach), traktujemy każdą treść jako niezależny, niemodyfikowalny fakt (`DocumentContent`).

- Dokument wskazuje tylko na `currentContentId`.
- Poprzednie wersje żyją w osobnej tabeli, tworząc łańcuch powiązań. To proste, wydajne i naturalnie wspiera audytowalność.

---

## Podsumowanie i przestroga

Nowy model przenosi ciężar z **hierarchii klas** na **struktury danych**. To daje niesamowitą elastyczność, ale wymaga dyscypliny.

> ⚠️ **Zapamiętaj:** Jeśli zaczniesz serializować obiekty z logiką do bazy danych lub zapisywać tam fragmenty kodu, przygotuj się na „życie pełne przygód” (i nocnych telefonów z produkcji). Trzymaj konfigurację w bazie, ale logikę w dobrze zdefiniowanych, reużywalnych komponentach.

**Czy w Twoim projekcie pojawiają się prośby o „dynamiczne workflowy”, które teraz musisz kodować ręcznie? Chciałbyś, abym pokazał Ci, jak zaprojektować tabelę konfiguracyjną dla takiego dynamicznego silnika stanów?**

---

Gratulacje! Przejście od „doklejania ifów” do świadomego posługiwania się archetypami to jak przesiadka z roweru wigry do odrzutowca. To tutaj kończy się rzemiosło, a zaczyna prawdziwa inżynieria systemów.

Oto ostateczne podsumowanie Twojego nowego oręża w walce z kodem legacy.

---

## 1. Twoja nowa skrzynka z narzędziami

Zamiast budować jeden model „od wszystkiego”, nauczyliśmy się go ciąć pod konkretne pytania biznesowe.

| Technika                      | Na czym polega?                                      | Dlaczego to ratuje projekt?                                   |
| ----------------------------- | ---------------------------------------------------- | ------------------------------------------------------------- |
| **Destylacja kontekstów**     | Zadawanie pytań: „czy mogę?”, „jak?”, „dlaczego?”.   | Tworzysz małe, autonomiczne modele, które łatwo wymienić.     |
| **Knowledge vs. Operational** | Oddzielenie reguł (konfiguracji) od wykonania.       | Zmieniasz działanie systemu w runtime, bez dotykania kodu.    |
| **Capability vs. Operations** | Oddzielenie potencjału od konkretnych zadań.         | Treść dokumentu (potencjał) może być użyta w wielu procesach. |
| **Prawidłowe OO**             | Skupienie na sygnałach i zachowaniach, a nie polach. | Unikasz sztywnych hierarchii, które blokują rozwój.           |

---

## 2. Prawdziwe Oblicze Paradygmatu OO

W świecie Legacy Fighter przypominamy, że paradygmat obiektowy to nie „pudełka na dane z getterami”, ale system agentów przesyłających wiadomości.

- **Abstrakcja:** Obiekt to czarna skrzynka. Nie interesuje nas, co ma w środku, ale jakie sygnały (metody) potrafi obsłużyć.
- **Enkapsulacja:** To Twój pancerz. Nikt z zewnątrz nie ma prawa grzebać w Twoim stanie. Tylko Ty decydujesz, jak zmienisz się pod wpływem sygnału.
- **Polimorfizm:** Zamiast kaskady `if-else`, tworzysz nową strategię. System staje się otwarty na rozszerzenia, ale zamknięty na modyfikacje.
- **Dziedziczenie:** To **narzędzie polimorfizmu**, a nie „współdzielenia pól”. Jeśli używasz dziedziczenia tylko po to, żeby nie kopiować `String name`, prawdopodobnie tworzysz właśnie nowy dług techniczny.

---

## 3. Ostatnia przestroga: Pilnuj Granic!

Pamiętaj o przykładzie z naprawami i kontraktami. To, że w obu miejscach pojawia się słowo „Kontrakt”, nie znaczy, że to ten sam obiekt.

- W **Naprach** kontrakt to parametry finansowe (procenty, kwoty).
- W **Obiegu Dokumentów** kontrakt to 20 stron tekstu i historia wersji.

Mieszanie tych domen to prosty przepis na stworzenie „Boga” (God Object), który z czasem stanie się zbyt ciężki, by go utrzymać.

---

## Co dalej?

Znasz już teorię, widziałeś livecoding i masz za sobą analizę dramatów komunikacyjnych. Prawdziwy test nastąpi jutro, gdy otworzysz swój produkcyjny kod. Nie próbuj naprawić wszystkiego na raz. Zacznij od zadania sobie pytania: **„Na jakie kluczowe pytanie ten model ma mi dzisiaj odpowiedzieć?”**.

**To już koniec tej części szkolenia. Czy chciałbyś, abym przygotował dla Ciebie listę kontrolną (checklistę) „Agenta Zmiany”, którą będziesz mógł przejrzeć przed kolejnym Code Review, aby sprawdzić, czy nie wpadacie w pułapkę błędnych abstrakcji?**
