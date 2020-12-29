const Instruction = ({ className }: { className?: string }) => (
  <div className={className}>
    <p>
      Asy Wywiadu jest to gra turowa, w której dwa zespoły zwiadowcze, Czerwony i Niebieski walczą o
      to który z nich najszybciej odkryje wszystkie hasła dotyczące ich sprawy. Każdy zespół składa
      się z jednego Szpiega i nieograniczonej liczby Detektywów.
    </p>
    <br />
    <p>
      Zadaniem Szpiega jest przekazywanie kolejnych wskazówek tak, żeby Detektywi z jego drużyny
      mogli w jak najmniejszej liczbie tur odkryć  wszystkie hasła w ich kolorze. Jest to jedyna
      forma komunikacji pomiędzy Szpiegiem a detektywami i jest jawna dla wszystkich graczy.
      Wskazówka może składać się tylko z jednego wyrazu oraz cyfry oznaczające ile haseł jest z nią
      związane. Na przykład: „Narzędzie 3” może być wskazówką do haseł: „Młotek”, „Zbrodnia”,
      „Skrzynka”. Wyrazem podanym we wskazówce nie może być żadne z haseł ani jego odmiana, nie
      wolno też używać tłumaczeń na inny język. Na przykład dla hasła „Okulary” wskazówka „Glasses
      1” jest niepoprawna. Wyjątkowo hasło może składać się z większej ilości słów jeśli jest to
      nazwa własna, na przykład tytuł filmu. Dozwolone są także imiona, nazwiska i
      dźwiękonaśladownictwo, np. „Miauu 2”
    </p>
    <br />
    <p>
      Detektywi pracujący nad swoją sprawą używając czatu gry powinni się wspólnie wspierać w
      wyborze haseł. W momencie kiedy wszyscy detektywi z zespołu wskażą to samo hasło, zostaje ona
      zaznaczona i wszyscy dowiadują się jakiego jest koloru.
    </p>
    <br />
    <p>
      Jeśli hasło jest koloru czarnego, oznacza to, że właśnie zawaliliście sprawę, trafiliście na bombę i
      przegraliście z kretesem. Kolor twojej drużyny oznacza natomiast, że dobrze trafiliście i
      możecie wskazać kolejne hasło jeśli pozwala na to wskazówka. Jeśli hasło jest koloru
      przeciwnej drużyny to właśnie pomogliście w sprawie drugiemu zespołowi i nie możecie dalej
      odsłaniać haseł. Pozostał jeszcze jeden kolor, żółty, który tak samo kończy waszą turę, ale
      nie posuwa do przodu drużyny przeciwnej. Pudło.{' '}
    </p>
    <br />
    <p>Powodzenia Asy Wywiadu!</p>
  </div>
);

export default Instruction;
