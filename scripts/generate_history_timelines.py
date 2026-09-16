#!/usr/bin/env python3
"""Generate the ten chapter timelines used by the curated history bank."""

from __future__ import annotations

import html
import textwrap
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "assets" / "history" / "timelines"

TIMELINES = [
    {
        "chapter": "I. Les fondements de la civilisation",
        "filename": "01-fondements-civilisation.svg",
        "period": "Des premiers hominidés à la naissance de l'islam",
        "events": [
            ("vers -3,3 M", "Premiers Australopithèques connus"),
            ("vers -2,5 M", "Premiers outils lithiques : début du Paléolithique"),
            ("vers -300 000", "Apparition d'Homo sapiens"),
            ("vers -10 000/-9 000", "Révolution néolithique : agriculture et sédentarisation"),
            ("vers -3 300", "Les Sumériens développent l'écriture cunéiforme"),
            ("vers -3 150", "Narmer unifie la Haute et la Basse-Égypte"),
            ("vers -1 750", "Code d'Hammourabi : droit écrit à Babylone"),
            ("vers -1 250", "Exode de Moïse dans la tradition juive"),
            ("-509", "Début de la République romaine"),
            ("-490 / -480", "Victoires grecques de Marathon puis de Salamine"),
            ("-27", "Auguste fonde l'Empire romain"),
            ("70", "Destruction du second Temple de Jérusalem"),
            ("313", "Édit de Milan : liberté de culte dans l'Empire romain"),
            ("380", "Le christianisme devient religion d'État"),
            ("476", "Chute de l'Empire romain d'Occident"),
            ("610", "Début de la révélation du Coran à Mahomet"),
            ("622", "Hégire : début du calendrier musulman"),
        ],
    },
    {
        "chapter": "II. La France des origines à la Révolution",
        "filename": "02-france-origines-revolution.svg",
        "period": "Des royaumes francs aux Lumières",
        "events": [
            ("vers 496", "Baptême de Clovis à Reims"),
            ("732", "Charles Martel remporte la bataille de Poitiers"),
            ("751", "Pépin le Bref fonde la dynastie carolingienne"),
            ("800", "Charlemagne est sacré empereur d'Occident"),
            ("987", "Hugues Capet inaugure la dynastie capétienne"),
            ("1226-1270", "Règne de Saint Louis"),
            ("1337-1453", "Guerre de Cent Ans entre la France et l'Angleterre"),
            ("1429", "Jeanne d'Arc contribue à la levée du siège d'Orléans"),
            ("vers 1450", "Diffusion de l'imprimerie de Gutenberg"),
            ("1492", "Christophe Colomb atteint les Antilles"),
            ("1494", "Traité de Tordesillas entre l'Espagne et le Portugal"),
            ("1498", "Vasco de Gama atteint l'Inde par le cap de Bonne-Espérance"),
            ("1515", "Marignan et début du règne de François Ier"),
            ("1517", "Martin Luther lance la Réforme protestante"),
            ("1598", "Henri IV promulgue l'édit de Nantes"),
            ("1661", "Début du règne personnel de Louis XIV"),
            ("1685", "Louis XIV révoque l'édit de Nantes"),
            ("1748", "Montesquieu publie De l'esprit des lois"),
            ("1751-1772", "Publication de l'Encyclopédie dirigée par Diderot"),
            ("1762", "Rousseau publie Du contrat social"),
        ],
    },
    {
        "chapter": "III. Révolution française et Empire",
        "filename": "03-revolution-empire.svg",
        "period": "De la crise de 1789 à la Restauration",
        "events": [
            ("mai 1789", "Ouverture des États généraux"),
            ("20 juin 1789", "Serment du Jeu de Paume"),
            ("14 juillet 1789", "Prise de la Bastille"),
            ("4 août 1789", "Abolition des privilèges"),
            ("26 août 1789", "Adoption de la Déclaration des droits de l'homme et du citoyen"),
            ("1791", "Première Constitution : monarchie constitutionnelle"),
            ("21 septembre 1792", "Proclamation de la République"),
            ("21 janvier 1793", "Exécution de Louis XVI"),
            ("1793-1794", "La Terreur et le Comité de salut public"),
            ("1795-1799", "Le Directoire"),
            ("9 novembre 1799", "Coup d'État du 18 Brumaire : début du Consulat"),
            ("1804", "Code civil et sacre de Napoléon Ier"),
            ("2 décembre 1805", "Victoire d'Austerlitz"),
            ("1812", "Échec de la campagne de Russie"),
            ("1814-1815", "Congrès de Vienne et réorganisation de l'Europe"),
            ("18 juin 1815", "Défaite de Waterloo : fin définitive de Napoléon"),
            ("1814-1830", "Restauration sous Louis XVIII puis Charles X"),
        ],
    },
    {
        "chapter": "IV. Le XIXe siècle",
        "filename": "04-xixe-siecle.svg",
        "period": "Révolutions politiques et transformations sociales",
        "events": [
            ("27-29 juillet 1830", "Trois Glorieuses : chute de Charles X"),
            ("1830-1848", "Monarchie de Juillet sous Louis-Philippe"),
            ("février 1848", "Deuxième République et suffrage universel masculin"),
            ("1848", "Abolition de l'esclavage et Manifeste du Parti communiste"),
            ("2 décembre 1851", "Coup d'État de Louis-Napoléon Bonaparte"),
            ("1852-1870", "Second Empire de Napoléon III"),
            ("1853-1870", "Transformation de Paris par Haussmann"),
            ("4 septembre 1870", "Proclamation de la Troisième République"),
            ("1875", "Lois constitutionnelles du régime parlementaire"),
            ("1881-1882", "Lois Jules Ferry : école gratuite, laïque et obligatoire"),
            ("1884", "Reconnaissance du droit syndical"),
            ("1894-1906", "Affaire Dreyfus"),
            ("1905", "Séparation des Églises et de l'État"),
        ],
    },
    {
        "chapter": "V. Les guerres mondiales et les totalitarismes",
        "filename": "05-guerres-totalitarismes.svg",
        "period": "De Sarajevo à la disparition de l'URSS",
        "events": [
            ("28 juin 1914", "Attentat de Sarajevo"),
            ("1914-1918", "Première Guerre mondiale"),
            ("1916", "Batailles de Verdun et de la Somme"),
            ("11 novembre 1918", "Armistice de Rethondes"),
            ("28 juin 1919", "Traité de Versailles et création de la SDN"),
            ("1922", "Mussolini arrive au pouvoir en Italie"),
            ("1929", "Krach de Wall Street et crise mondiale"),
            ("1933", "Hitler arrive au pouvoir en Allemagne"),
            ("1936-1939", "Guerre d'Espagne"),
            ("1er septembre 1939", "Invasion de la Pologne : début de la Seconde Guerre mondiale"),
            ("18 juin 1940", "Appel du général de Gaulle"),
            ("6 juin 1944", "Débarquement allié en Normandie"),
            ("8 mai / 2 septembre 1945", "Capitulations allemande et japonaise ; création de l'ONU"),
            ("1947", "Doctrine Truman : début de la Guerre froide"),
            ("1948-1949", "Blocus de Berlin et pont aérien"),
            ("1949", "Création de l'OTAN"),
            ("1950-1953", "Guerre de Corée"),
            ("1955", "Création du Pacte de Varsovie"),
            ("1962", "Crise des missiles de Cuba"),
            ("1969", "Apollo 11 : premiers pas sur la Lune"),
            ("1975", "Fin de la guerre du Vietnam"),
            ("9 novembre 1989", "Chute du mur de Berlin"),
            ("1991", "Dissolution de l'URSS : fin de la Guerre froide"),
        ],
    },
    {
        "chapter": "VI. La France contemporaine",
        "filename": "06-france-contemporaine.svg",
        "period": "Des acquis de la Libération à la Ve République",
        "events": [
            ("1944", "Droit de vote accordé aux femmes"),
            ("1945", "Création de la Sécurité sociale"),
            ("1946-1958", "IVe République : régime parlementaire instable"),
            ("1946-1954", "Guerre d'Indochine"),
            ("1954", "Début de la guerre d'Algérie"),
            ("4 octobre 1958", "Constitution de la Ve République"),
            ("1959-1969", "Présidence de Charles de Gaulle"),
            ("1962", "Accords d'Évian et élection présidentielle au suffrage universel direct"),
            ("1967", "Légalisation de la contraception"),
            ("mai 1968", "Mouvement étudiant et ouvrier"),
            ("1974", "Majorité civile et électorale abaissée à 18 ans"),
            ("1975", "Loi Veil légalisant l'interruption volontaire de grossesse"),
            ("1981", "Abolition de la peine de mort"),
            ("1982", "Lois Defferre sur la décentralisation"),
            ("1998", "Loi sur la semaine de 35 heures"),
            ("2000", "Parité politique et adoption du quinquennat"),
            ("2002", "Passage à l'euro"),
            ("2005", "Charte de l'environnement intégrée à la Constitution"),
            ("2013", "Ouverture du mariage aux couples de même sexe"),
            ("2020", "Pandémie de Covid-19"),
        ],
    },
    {
        "chapter": "VII. Présidents et hommes d'État à connaître",
        "filename": "07-presidents-hommes-etat.svg",
        "period": "Repères de mandat et grandes figures mondiales",
        "events": [
            ("1789-1797", "États-Unis - George Washington, premier président"),
            ("1861-1865", "États-Unis - Abraham Lincoln et abolition de l'esclavage"),
            ("1917", "Russie - Lénine dirige la révolution bolchevique"),
            ("1933-1945", "États-Unis - Franklin D. Roosevelt : New Deal et guerre mondiale"),
            ("1940-1945", "Royaume-Uni - Winston Churchill dirige le pays pendant la guerre"),
            ("1947", "Inde - Gandhi et l'indépendance"),
            ("1949", "Chine - Mao proclame la République populaire"),
            ("1959-1969", "France - Charles de Gaulle"),
            ("1961-1963", "États-Unis - John F. Kennedy"),
            ("1963-1968", "États-Unis - Martin Luther King et les droits civiques"),
            ("1969-1974", "France - Georges Pompidou"),
            ("1974-1981", "France - Valéry Giscard d'Estaing"),
            ("1979-1990", "Royaume-Uni - Margaret Thatcher"),
            ("1981-1989", "États-Unis - Ronald Reagan"),
            ("1981-1995", "France - François Mitterrand"),
            ("1994-1999", "Afrique du Sud - Nelson Mandela, premier président noir"),
            ("1995-2007", "France - Jacques Chirac"),
            ("2007-2012", "France - Nicolas Sarkozy"),
            ("2009-2017", "États-Unis - Barack Obama"),
            ("2012-2017", "France - François Hollande"),
            ("depuis 2017", "France - Emmanuel Macron"),
        ],
    },
    {
        "chapter": "VIII. Révolutions, indépendances et monde contemporain",
        "filename": "08-revolutions-independances-monde.svg",
        "period": "Des indépendances atlantiques aux crises du XXIe siècle",
        "events": [
            ("1775-1783", "Guerre d'indépendance des treize colonies américaines"),
            ("4 juillet 1776", "Déclaration d'indépendance des États-Unis"),
            ("1787", "Constitution fédérale américaine"),
            ("1917", "Révolutions de Février et d'Octobre en Russie"),
            ("1921", "Lénine lance la Nouvelle politique économique"),
            ("1922", "Création de l'URSS"),
            ("1947", "Indépendance et partition de l'Inde"),
            ("14 mai 1948", "Création de l'État d'Israël"),
            ("1946-1954", "Guerre d'Indochine et accords de Genève"),
            ("1955", "Conférence de Bandoung"),
            ("1956", "Indépendances du Maroc et de la Tunisie ; crise de Suez"),
            ("1960", "Année de l'Afrique : grande vague d'indépendances"),
            ("18-19 mars 1962", "Accords d'Évian et cessez-le-feu en Algérie"),
            ("1967", "Guerre des Six Jours"),
            ("1973", "Guerre du Kippour"),
            ("1979", "Révolution iranienne"),
            ("1990-1991", "Première guerre du Golfe après l'invasion du Koweït"),
            ("1991", "Dissolution de l'URSS"),
            ("11 septembre 2001", "Attentats aux États-Unis et guerre contre le terrorisme"),
            ("2003", "Invasion de l'Irak par une coalition menée par les États-Unis"),
            ("2007-2008", "Crise des subprimes puis crise financière mondiale"),
            ("2014", "Annexion de la Crimée par la Russie"),
            ("2020", "Pandémie mondiale de Covid-19"),
        ],
    },
    {
        "chapter": "IX. Culture, arts et littérature",
        "filename": "09-culture-arts-litterature.svg",
        "period": "Auteurs, œuvres et mouvements à situer",
        "events": [
            ("1694-1778", "Voltaire, philosophe des Lumières"),
            ("1712-1778", "Jean-Jacques Rousseau"),
            ("1759", "Candide de Voltaire"),
            ("1802-1885", "Victor Hugo, figure du romantisme"),
            ("1830", "La Liberté guidant le peuple de Delacroix"),
            ("1831", "Notre-Dame de Paris de Victor Hugo"),
            ("1840-1902", "Émile Zola, chef de file du naturalisme"),
            ("1862", "Les Misérables de Victor Hugo"),
            ("1872", "Impression, soleil levant de Claude Monet"),
            ("1885", "Germinal d'Émile Zola"),
            ("1900-1944", "Antoine de Saint-Exupéry"),
            ("1937", "Guernica de Pablo Picasso"),
            ("1943", "Le Petit Prince de Saint-Exupéry"),
            ("1973", "The Dark Side of the Moon de Pink Floyd"),
            ("1982", "E.T. de Steven Spielberg"),
        ],
    },
    {
        "chapter": "X. Repères chronologiques fondamentaux",
        "filename": "10-reperes-chronologiques.svg",
        "period": "Les dates qui structurent l'ensemble du programme",
        "events": [
            ("476", "Chute de l'Empire romain d'Occident"),
            ("800", "Sacre de Charlemagne"),
            ("987", "Hugues Capet devient roi de France"),
            ("1492", "Christophe Colomb atteint l'Amérique"),
            ("1515", "Victoire de Marignan"),
            ("1598", "Édit de Nantes"),
            ("1789", "Prise de la Bastille et début de la Révolution"),
            ("1792", "Proclamation de la République"),
            ("1804", "Code civil et sacre de Napoléon Ier"),
            ("1805", "Victoire d'Austerlitz"),
            ("1815", "Défaite de Waterloo"),
            ("1848", "Deuxième République et abolition de l'esclavage"),
            ("1870", "Proclamation de la Troisième République"),
            ("1905", "Séparation des Églises et de l'État"),
            ("1914", "Début de la Première Guerre mondiale"),
            ("1916", "Bataille de Verdun"),
            ("1918", "Armistice de la Première Guerre mondiale"),
            ("1939", "Début de la Seconde Guerre mondiale"),
            ("6 juin 1944", "Débarquement de Normandie"),
            ("1945", "Fin de la guerre et création de l'ONU"),
            ("1958", "Constitution de la Ve République"),
            ("1962", "Accords d'Évian et réforme de l'élection présidentielle"),
            ("1989", "Chute du mur de Berlin"),
            ("1991", "Dissolution de l'URSS"),
            ("2001", "Attentats du 11 septembre"),
        ],
    },
]


def wrap_label(label: str, width: int = 38) -> list[str]:
    return textwrap.wrap(label, width=width, break_long_words=False, break_on_hyphens=False)


def wrap_date(date: str) -> list[str]:
    return textwrap.wrap(date, width=10, break_long_words=False, break_on_hyphens=False)


def svg_text(x: int, y: int, text: str, css_class: str, anchor: str = "start") -> str:
    return f'<text x="{x}" y="{y}" class="{css_class}" text-anchor="{anchor}">{html.escape(text)}</text>'


def render_timeline(item: dict) -> str:
    title_lines = textwrap.wrap(item["chapter"], width=42, break_long_words=False, break_on_hyphens=False)
    wrapped = [(wrap_date(date), wrap_label(label)) for date, label in item["events"]]
    heights = [max(82, 42 + 29 * max(len(date_lines), len(lines))) for date_lines, lines in wrapped]
    subtitle_y = 91 + (len(title_lines) - 1) * 38
    note_y = subtitle_y + 31
    top = note_y + 62
    bottom = 54
    height = top + sum(heights) + bottom
    spine_x = 178
    parts = [
        f'<svg xmlns="http://www.w3.org/2000/svg" width="760" height="{height}" viewBox="0 0 760 {height}" role="img" aria-labelledby="title desc">',
        f'<title id="title">{html.escape(item["chapter"])}</title>',
        f'<desc id="desc">Frise chronologique verticale : {html.escape(item["period"])}. Échelle non proportionnelle.</desc>',
        "<defs>",
        '<filter id="shadow" x="-10%" y="-10%" width="120%" height="130%"><feDropShadow dx="0" dy="3" stdDeviation="4" flood-color="#172133" flood-opacity="0.10"/></filter>',
        "<style>",
        ".bg{fill:#f4f7fb}.title{font:700 31px Arial,sans-serif;fill:#172133}.subtitle{font:400 18px Arial,sans-serif;fill:#5b6575}.note{font:400 15px Arial,sans-serif;fill:#6b7280}.spine{stroke:#6558d9;stroke-width:5}.dot{fill:#ffffff;stroke:#6558d9;stroke-width:5}.date{font:700 19px Arial,sans-serif;fill:#3f348f}.event{font:600 22px Arial,sans-serif;fill:#172133}.card-a{fill:#ffffff;stroke:#dfe5ef;stroke-width:2}.card-b{fill:#eef1ff;stroke:#d8dcfb;stroke-width:2}",
        "</style>",
        "</defs>",
        f'<rect class="bg" width="760" height="{height}" rx="30"/>',
    ]
    for line_index, line in enumerate(title_lines):
        parts.append(svg_text(34, 55 + line_index * 38, line, "title"))
    parts.extend(
        [
            svg_text(34, subtitle_y, item["period"], "subtitle"),
            svg_text(34, note_y, "Repères du cours - échelle volontairement non proportionnelle", "note"),
            f'<line x1="{spine_x}" y1="{top - 24}" x2="{spine_x}" y2="{height - bottom}" class="spine"/>',
        ]
    )
    y = top
    for index, ((date_lines, lines), event_height) in enumerate(zip(wrapped, heights)):
        center_y = y + event_height // 2 - 5
        card_y = y + 3
        card_h = event_height - 10
        card_class = "card-a" if index % 2 == 0 else "card-b"
        parts.extend(
            [
                f'<rect x="212" y="{card_y}" width="514" height="{card_h}" rx="18" class="{card_class}" filter="url(#shadow)"/>',
                f'<circle cx="{spine_x}" cy="{center_y}" r="10" class="dot"/>',
            ]
        )
        date_start_y = center_y - ((len(date_lines) - 1) * 11) + 6
        for date_index, date_line in enumerate(date_lines):
            parts.append(svg_text(151, date_start_y + date_index * 22, date_line, "date", "end"))
        text_start_y = center_y - ((len(lines) - 1) * 15) + 8
        for line_index, line in enumerate(lines):
            parts.append(svg_text(236, text_start_y + line_index * 29, line, "event"))
        y += event_height
    parts.append("</svg>")
    return "\n".join(parts) + "\n"


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    for timeline in TIMELINES:
        target = OUT / timeline["filename"]
        target.write_text(render_timeline(timeline), encoding="utf-8")
        print(f"{target.relative_to(ROOT)} : {len(timeline['events'])} repères")


if __name__ == "__main__":
    main()
