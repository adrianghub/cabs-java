Podstawy i Strategia

    Zacznij tutaj (strona główna/wprowadzenie)

    Dług techniczny

    Refactoring

    Obserwowalne zachowania

    Zwrot z inwestycji

    Generalna ścieżka refaktoryzacji

    EventStorming

🏗️ Wzorce Projektowe i Modelowanie (Moduły Techniczne)

    Value Object

        Refaktoryzacja do wzorca, walidacja (DriverLicense), zmienna reprezentacja (Money), prezentacja (Distance) oraz ukryte koncepty (Tariff).

    Aggregate

        Spójność danych (Transit), optymalizacja transakcji (CarType), mikrocykle refaktoryzacji, logika procesowa (Claim), zmienność reguł (AwardsAccount) oraz modelowanie agregatów przez EventStorming.

    CQRS

        Złożone odczyty, modele równoległe (Parallel Models), dopasowanie modelu danych oraz paradygmaty baz danych (TransitAnalyzer).

    Archetypy

        Logika zależna od ról, procesy dynamiczne.

    Lokalna struktura kodu

    Refaktoryzacja do wzorca Bounded Context

        Modularyzacja, rozplątywanie zależności, granice kontekstów, warstwy odpowiedzialności.

    Systemy rozproszone

        Rozpraszanie systemu, Strangler Pattern, kaskadowe zmiany, spójność baz danych.

🗣️ Aspekty Miękkie

    Marketing i komunikacja

        Metaprogramy w komunikacji, świadoma obserwacja, model kompetencji Dreyfus, Cykl Kolba.

🛠️ Narzędzia (Toolbox)

    Narzędziówka

    Toolbox Legacy Fightera

        Logika ortogonalna, analiza stosu wywołań, praca w „szumie” legacy, sterowanie czasem, ochrona przed degradacją kodu, Change Data Capture (Debezium).

---

Oto esencja i treść wyekstrahowana z sekcji Dług techniczny programu Legacy Fighter.
💸 Dług techniczny

Dług techniczny to świadoma decyzja strategiczna zespołu deweloperskiego o poświęceniu jakości kodu w celu przyspieszenia dostarczenia funkcjonalności. Nie należy go oceniać w kategoriach „dobry” lub „zły”, lecz traktować jako narzędzie o konkretnym przeznaczeniu, niosące ze sobą określone konsekwencje.
🔍 Kluczowe założenia

    Świadomość: Prawdziwy dług techniczny jest zaciągany celowo.

    Koszt odroczony: Poprawa jakości w przyszłości będzie wymagała dodatkowych nakładów pracy (spłata „odsetek”).

    Zagrożenie: Problemem nie jest sam dług, ale jego ignorowanie lub zaprzeczanie mu, co prowadzi do paraliżu systemu.

⚖️ Analogia finansowa
Dług Finansowy Dług Techniczny
Pozwala mieć mieszkanie przed uzbieraniem gotówki. Pozwala mieć funkcjonalność przed dopracowaniem kodu.
Płacisz odsetki – cena całkowita jest wyższa. Płacisz czasem dewelopmentu – cena całkowita jest wyższa.
Brak spłaty = utrata kontroli (bankructwo). Brak spłaty = paraliż systemu (techniczne bankructwo).
🛠️ Dług techniczny w praktyce

Poważność długu zależy od dwóch głównych czynników: świadomości jego istnienia oraz rozważności jego zaciągnięcia.
Kategorie spłacalności:

    Łatwa spłata: Występuje w miejscach degradowanych świadomie i rozważnie. Zespół wie, jak to naprawić i nie potrzebuje dodatkowej pomocy.

    Trudna spłata (Dług nieuświadomiony): Najgroźniejszy rodzaj długu. Występuje, gdy model kodu nie odwzorowuje świata biznesu lub robi to w sposób naiwny.

        Rozwiązanie: Sama refaktoryzacja mechaniczna nie wystarczy. Konieczny jest powrót do fazy modelowania.

        Sygnał postępu: Moment, w którym zespół zaczyna dostrzegać alternatywne ścieżki modelowania („Możemy to zrobić inaczej!”).

📌 Podsumowanie lekcji

    Warto zapamiętać:

        Dług techniczny nie zawsze jest zły – staje się szkodliwy, gdy nie jest spłacany.

        Dług stopniujemy poprzez jego poważność i świadomość zaciągnięcia.

        Dług architektoniczny (złe modelowanie) wymaga głębszych zmian niż tylko czyszczenie kodu.

---

Oto esencja i treść wyekstrahowana z sekcji Refactoring.
🔄 Refactoring

Zgodnie z literaturą, refaktoryzacja to proces zmiany wewnętrznej struktury oprogramowania bez zmiany jego obserwowalnych zachowań. W kontekście finansowym jest to moment spłaty długu technicznego wraz z należnymi odsetkami.
❓ „CO?” a „JAK?”

Aby zrozumieć różnicę między zachowaniem a strukturą, warto zadać dwa kluczowe pytania:

    „CO?” (to robi): Odpowiadają na nie publiczne funkcje wystawione przez system lub moduł. Są to obserwowalne zachowania, których podczas refaktoryzacji nie zmieniamy.

    „JAK?” (to działa): Odpowiedź kryje się w wewnętrznej strukturze, czyli prywatnej implementacji. To tutaj dokonujemy zmian, poprawiając jakość kodu wybraną (często niefortunnie) podczas zaciągania długu.

🏗️ Refactoring a Rewrite (Przepisanie)

Granica między refaktoryzacją a przepisaniem kodu bywa płynna, ale można ją określić na podstawie skali i technologii:

    Zmiana technologii: Jeśli wymieniamy stos technologiczny, mamy do czynienia z przepisaniem (rewrite). Zazwyczaj nie jest to motywowane chęcią poprawy samej struktury wewnętrznej.

    Skala zmian: Jeśli wewnątrz metody zmieniamy 100% kodu, ale jej zewnętrzne zachowanie pozostaje identyczne, to z perspektywy tej metody jest to rewrite. Jednak z szerszej perspektywy (klasy czy modułu) jest to nadal refaktoryzacja.

    Wniosek: Refaktoryzacja ma charakter fraktalny – aby zrefaktoryzować większą strukturę (np. moduł), często musimy całkowicie przepisać mniejsze struktury (np. metody).

📌 Podsumowanie lekcji

    Kluczowe punkty:

        Refaktoryzacja = zmiana „JAK?”, przy zachowaniu „CO?”.

        To proces spłaty długu technicznego.

        Całkowite przepisanie małej metody może być elementem składowym refaktoryzacji dużego modułu.

---

🛡️ Obserwowalne zachowania i ich bezpieczeństwo

Kluczem do udanej refaktoryzacji jest zrozumienie, że nie wolno zmieniać obserwowalnych zachowań systemu. Zmiana zachowania to błąd o wysokiej konsekwencji, który w systemach legacy często budzi strach i prowadzi do „hackowania” kodu zamiast jego rzetelnej poprawy.
🔍 Odkrywanie „CO” zamiast „JAK”

W refaktoryzacji musimy odróżnić cel biznesowy (CO?) od technicznej realizacji (JAK?).

    Przykład prosty: Funkcja sqrt(c) liczy pierwiastek (CO). Robi to metodą Newtona (JAK). Możemy zmienić algorytm na bisekcję – jeśli testy (wynik matematyczny) przechodzą, zachowanie pozostało nietknięte.

    Pułapka struktury: Jeśli testujemy to, że algorytm „sortuje listę” lub „filtruje liczby”, testujemy szczegóły implementacyjne. Utrudnia to zmianę struktury w przyszłości, bo test staje się „betonem” wiążącym nas z obecnym kodem.

Jak namierzyć zachowania w systemach legacy?

    Analiza klientów funkcji: Sprawdź, kto i w jakim kontekście wywołuje dany kod.

    Rozmowa z ekspertami: Zespół i dokumentacja (o ile jest aktualna).

    Śledzenie od UI: Przejdź drogę od przycisku w interfejsie do logiki w kodzie.

🏗️ Poziomy abstrakcji i przykład raportu

To, co dla modułu niższego poziomu jest obserwowalnym zachowaniem, dla modułu wyższego poziomu jest tylko szczegółem implementacyjnym.

Przykład: Generowanie raportu o kierowcach.

    Stara struktura: Koordynacja trzech serwisów (Driver, Session, Car).

    Nowa struktura: Pobranie danych z jednego serwisu śledzącego (DriverTrackingService).
    Pomimo całkowitej zmiany współpracy komponentów, treść raportu (obserwowalne zachowanie) pozostaje ta sama.

🧪 Strategie testowania w Legacy

W systemach legacy logika często jest rozmyta (np. instrukcje warunkowe w kontrolerach API). Wtedy jedynym sposobem na bezpieczną refaktoryzację jest pisanie testów „wysoko” – na poziomie API (testy integracyjne/akceptacyjne).
🧗 Zasada Wspinacza

Zainspirowana wspinaczką wysokogórską (zawsze 3 punkty podparcia):

    Mając stabilny kod produkcyjny -> piszemy/zmieniamy test.

    Mając stabilny test -> zmieniamy kod produkcyjny (refaktoryzujemy).

Dobre vs Złe testy

    ❌ Zły test (Mockowanie): Sprawdza, czy wywołano clientService.update(). Jeśli zmienisz sposób aktualizacji, test padnie, mimo że biznesowo wszystko działa.

    ✅ Dobry test (Zachowanie): Sprawdza, czy po aktywacji klient faktycznie ma status ACTIVE (poprzez wywołanie API/widoku).

📌 Podsumowanie lekcji

    Warto zapamiętać:

        Oddzielaj cel biznesowy od technicznych kroków algorytmu.

        Ukrywaj implementację (prywatne klasy/metody) – im mniej klientów widzi szczegóły, tym łatwiejsza refaktoryzacja.

        Testuj zachowania, nie strukturę wywołań.

        Stosuj zasadę wspinacza, by zawsze mieć „bezpieczny chwyt” podczas zmian.

---

Treść wiadomości Gemini
💰 Zwrot z inwestycji (ROI) w refaktoryzacji

Refaktoryzacja to nie tylko kwestia estetyki czy "czystego kodu" – to przede wszystkim decyzja biznesowa. Każda godzina spędzona na poprawianiu struktury systemu musi przynieść wymierny zysk w przyszłości. Jeśli koszt refaktoryzacji przewyższa oszczędności czasu, które ona wygeneruje, mamy do czynienia z inwestycją, która nigdy się nie spłaci.
📉 Kalkulacja opłacalności: Przykład

Wyobraź sobie "brzydki" fragment kodu (np. zawiłe instrukcje if, niejasne nazewnictwo, techniczne obejścia).

    Koszt refaktoryzacji: Tydzień pracy (40h) na poprawę kodu i testy.

    Zysk: Skrócenie czasu zrozumienia metody z 30 minut do 10 minut (zysk = 20 min).

    Problem: Jeśli ten kod nie był zmieniany od 5 lat (kod stabilny), to czytamy go sporadycznie. Przy założeniu, że zaglądamy tam 3 razy w tygodniu, inwestycja zacznie się zwracać dopiero po 40 tygodniach.

    Wniosek: Jeśli cykl życia produktu jest krótszy niż czas zwrotu, refaktoryzacja staje się "sztuką dla sztuki".

🔍 Analiza repozytorium (Zasada 80/20)

Badania (m.in. Google) wskazują na ciekawą prawidłowość: często zmienia się tylko około 20% kodu, podczas gdy pozostałe 80% pozostaje stabilne.

    To w tych "gorących" 20% (tzw. hotspots) refaktoryzacja ma największy sens.

    Kod stabilny, nawet jeśli jest nieczytelny, "wytestował się" na produkcji przez lata i nie generuje kosztów deweloperskich, dopóki nie musimy go zmieniać.

Jak znaleźć problematyczne miejsca?

Możesz użyć prostego polecenia w GIT, aby wylistować 10 najczęściej zmienianych plików:
Bash

git log --pretty=format: --name-only | sort | uniq -c | sort -rg | head -10

📊 Macierz stabilności

Wybór miejsc do naprawy ułatwia podział systemu na cztery ćwiartki, biorąc pod uwagę stabilność oraz trudność wprowadzenia zmiany:
Stabilność Trudność zmiany Decyzja
Częste zmiany Łatwa zmiana Największy i najszybszy zwrot z inwestycji.
Rzadkie zmiany Trudna zmiana Ignoruj. Koszt naprawy jest zbyt wysoki względem zysków.
Częste zmiany Trudna zmiana Strategiczny obszar do naprawy – tutaj rodzi się paraliż systemu.
🚦 Kiedy refaktoryzować mimo braku ROI?

Istnieją sytuacje, w których zmieniamy nawet stabilny kod:

    Rozszerzalność: Przygotowujemy model pod nową, dużą funkcję biznesową.

    Wydajność: Kod jest stabilny (nie zmienia się), ale jest krytyczny wydajnościowo (często się wykonuje).

    Ćwiczenie techniczne: Budowanie kompetencji zespołu (inwestycja w ludzi, nie w kod).

📌 Podsumowanie

    System to zbiór komponentów: Każdy ma inną charakterystykę i wymaga innego podejścia.

    Dobieraj rozwiązanie do klasy problemu: Brak czytelności w rzadko używanym module jest cechą neutralną, a nie błędem.

    Pobudka ma znaczenie: Optymalizujemy albo czytelność (ROI z czasu pracy), albo rozszerzalność (możliwość dodania funkcji), albo wydajność (czas działania systemu).

Materiały dodatkowe:

    Moduł 1, Lekcja 1.5 Zwrot z inwestycji [video]

# 🛣️ Generalna Ścieżka Refaktoryzacji

Niezależnie od skali zmian, każda skuteczna refaktoryzacja opiera się na powtarzalnym procesie. Pozwala on uniknąć pułapek wynikających z automatycznych nawyków i skupić się na dostarczeniu realnej wartości biznesowej.

## 🎯 Krok 1: Nazwanie problemu

Zanim rzucisz się do poprawiania kodu (np. wprowadzania enkapsulacji tylko dlatego, że "tak trzeba"), zadaj sobie kluczowe pytanie: **"Jaki konkretny problem to rozwiązuje w tym miejscu systemu?"**.

Brak nazwanego problemu często prowadzi do refaktoryzacji, której zwrot z inwestycji (ROI) jest zerowy. Przykładowe realne problemy to:

- **Niespójność danych:** Zmiana statusu obiektu wymaga jednoczesnej aktualizacji daty, ale obecny kod (settery) pozwala o tym zapomnieć.
- **Duplikacja logiki:** Ta sama sekwencja zmian stanów powtarza się w wielu miejscach, co obniża stabilność systemu.
- **Boilerplate:** Nadmiarowa liczba getterów i setterów w klasach, które służą jedynie do transportu danych (DTO), co zaciemnia obraz kodu.

---

## 🏗️ Drivery architektoniczne

Nazywanie problemów to często wytykanie braków w tzw. **driverach architektonicznych**. System musi zapewniać różne cechy w zależności od kontekstu:

- Wydajność (Performance)
- Czytelność (Readability)
- Testowalność (Testability)
- Rozszerzalność (Extensibility)

Refaktoryzacja powinna przybliżać system do realizacji tych driverów tam, gdzie są one aktualnie potrzebne.

---

## 📋 Kroki Generalnej Ścieżki

Proces refaktoryzacji to pętla oparta na planowaniu i obserwacji:

1. **Nazwanie problemu:** Zdefiniuj bolączkę (np. model niedopasowany do biznesu, niewydajne widoki).
2. **Wybór rozwiązania:** Dopasuj technikę (np. Value Object, CQRS, zmiana granic modułów) do kontekstu.
3. **Zaplanowanie pracy:** Ustal punkt startu i sposób zabezpieczenia się przed błędami (np. testy automatyczne).
4. **Wykonanie:** Wprowadzanie zmian krok po kroku.
5. **Obserwacja efektów:** Sprawdzenie, czy zdefiniowany na początku problem faktycznie zniknął i czy inwestycja się zwraca.

---

## 📌 Podsumowanie

- **Unikaj sztuki dla sztuki:** Refaktoryzacja bez nazwanego problemu to strata czasu.
- **Dostosuj rozwiązanie do technologii:** W DTO czasem lepszym rozwiązaniem od enkapsulacji są pola publiczne (redukcja boilerplate).
- **Planuj złożone zmiany:** Wielowarstwowe refaktoryzacje wymagają mapy i ewoluującego planu.
- **Weryfikuj zysk:** Jeśli po zmianie dodanie nowej funkcji nadal jest trudne, być może wybrałeś złe rozwiązanie.

---

## 1. Od Big Picture do Agregatu

W sesji Big Picture szukamy szerokiego kontekstu. W sesji procesowej (Process Level) schodzimy głębiej, wprowadzając **rozkazy (Commands)** i **reguły (Rules)**.

To właśnie tutaj odkrywamy, co musi dziać się **natychmiastowo i transakcyjnie**, a co może zostać odroczone. Jeśli dwa zdarzenia muszą zajść „zawsze razem”, aby system był spójny, prawdopodobnie znaleźliśmy granicę naszego Agregatu.

---

## 2. Katalog Reguł: Nie każda karteczka jest tak samo ważna

W systemach legacy często mieszamy proste sprawdzanie formatu danych z krytycznymi ograniczeniami biznesowymi. EventStorming uczy nas je rozróżniać:

| Rodzaj reguły     | Za co odpowiada?                                         | Przykład z systemu Cabs                    |
| ----------------- | -------------------------------------------------------- | ------------------------------------------ |
| **Walidacyjna**   | Poprawność danych wejściowych.                           | „Czy współrzędne to liczby?”               |
| **Niezmiennik**   | **Klucz spójności Agregatu.** Musi być zachowany zawsze. | „Max 2 zmiany adresu odbioru”.             |
| **Obliczeniowa**  | Sposób wyliczania wartości (bez zmiany stanu).           | „Kara = 10% kwoty przejazdu”.              |
| **Koordynacyjna** | Sterowanie procesem między Agregatami.                   | „Jeśli reklamacja VIP, zablokuj prowizję”. |

> 💡 **Wskazówka:** Przy refaktoryzacji skupiamy się najpierw na **niezmiennikach**. To one decydują o tym, jakie dane muszą być zamknięte wewnątrz Agregatu, aby nikt nie mógł ich zmienić „z boku”.

---

## 3. Pułapka „Pozornej Symetrii”

Bardzo łatwo jest wpaść w schemat: zdarzenie „Zakończono przejazd” -> rozkaz „Zakończ przejazd”. To zbyt płytkie. Prawdziwa moc symulacji na warsztacie polega na pytaniu: **„Co jeszcze się zmienia?”**.

Dopiero gdy zauważymy, że zakończenie przejazdu musi jednocześnie:

1. Zwolnić kierowcę (aby był widoczny dla innych),
2. Naliczyć opłatę,
3. Wystawić fakturę,

...widzimy pełny obraz zależności. Brak jednego zdarzenia (np. o wolnym kierowcy) sprawia, że proces się „zacina”, co symulacja natychmiast obnaża.

---

## 4. Agregat to nie tylko dane, to ochrona reguł

Agregat w ES to zestaw zdarzeń, które zachodzą razem, chronione przez wspólne niezmienniki.

- **Dane** są tylko po to, by reguły miały na czym operować.
- **Granica Agregatu** to tarcza, która pilnuje, by system nie stał się niespójny.

Jeśli reguła wymaga danych z dwóch różnych miejsc, to albo te miejsca powinny być jednym Agregatem, albo musimy pogodzić się z **ewentualną spójnością (eventual consistency)**.

---

## Podsumowanie inwestycji

Refaktoryzacja oparta na EventStormingu to przejście z modelu technicznego (tabelki w bazie) na model biznesowy (procesy i reguły). Dzięki temu:

- Unikasz „pustych” rozkazów (które są tylko odczytami),
- Precyzyjnie nazywasz wymagania (zamiast „dane muszą być poprawne”, piszesz „max 250 m różnicy”),
- Budujesz Agregaty, które faktycznie chronią biznes, a nie tylko grupują pola w Javie.

**Czy chciałbyś, abym pomógł Ci rozpisać konkretny rozkaz z Twojego systemu (np. „Złóż zamówienie”) na zdarzenia i niezmienniki, abyśmy mogli wyznaczyć granice Agregatu?**
