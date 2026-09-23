#!/usr/bin/env python3
"""Generate concise, phone-readable SVG revision guides for the QCM app."""

from __future__ import annotations

import html
import math
import textwrap
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "assets" / "visual-guides"


def esc(value: str) -> str:
    return html.escape(str(value), quote=True)


def wrap(value: str, width: int) -> list[str]:
    return textwrap.wrap(str(value), width=width, break_long_words=False, break_on_hyphens=False) or [""]


def text_lines(lines: list[str], x: int, y: int, *, size: int, width: int, color: str, weight: int = 500, gap: int = 10) -> tuple[str, int]:
    out: list[str] = []
    cursor = y
    for raw in lines:
        for line in wrap(raw, width):
            out.append(f'<text x="{x}" y="{cursor}" class="body" font-size="{size}" font-weight="{weight}" fill="{color}">{esc(line)}</text>')
            cursor += size + gap
        cursor += 3
    return "".join(out), cursor


def cards_svg(title: str, subtitle: str, cards: list[tuple[str, list[str]]], accent: str) -> str:
    width, height = 1200, 820
    cols = 2 if len(cards) > 1 else 1
    rows = math.ceil(len(cards) / cols)
    gap = 26
    margin = 62
    top = 190
    card_w = (width - margin * 2 - gap * (cols - 1)) / cols
    card_h = (height - top - 56 - gap * (rows - 1)) / rows
    chunks = [f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} {height}" role="img" aria-labelledby="title desc">
<title id="title">{esc(title)}</title><desc id="desc">{esc(subtitle)}</desc>
<defs><filter id="shadow" x="-10%" y="-10%" width="120%" height="130%"><feDropShadow dx="0" dy="8" stdDeviation="10" flood-color="#14213d" flood-opacity=".12"/></filter></defs>
<rect width="1200" height="820" rx="34" fill="#f7f8fc"/>
<rect x="0" y="0" width="18" height="820" rx="9" fill="{accent}"/>
<circle cx="1080" cy="72" r="95" fill="{accent}" opacity=".09"/>
<text x="62" y="82" class="head" font-family="Inter,Arial,sans-serif" font-size="46" font-weight="850" fill="#14213d">{esc(title)}</text>
<text x="62" y="132" class="body" font-family="Inter,Arial,sans-serif" font-size="25" font-weight="520" fill="#516079">{esc(subtitle)}</text>
<style>.head,.body{{font-family:Inter,Arial,sans-serif}} .body{{dominant-baseline:auto}}</style>''']
    for i, (heading, lines) in enumerate(cards):
        row, col = divmod(i, cols)
        x = margin + col * (card_w + gap)
        y = top + row * (card_h + gap)
        chunks.append(f'<rect x="{x:.0f}" y="{y:.0f}" width="{card_w:.0f}" height="{card_h:.0f}" rx="24" fill="#ffffff" stroke="#dfe4ef" stroke-width="2" filter="url(#shadow)"/>')
        chunks.append(f'<rect x="{x:.0f}" y="{y:.0f}" width="10" height="{card_h:.0f}" rx="5" fill="{accent}"/>')
        chunks.append(f'<text x="{x+30:.0f}" y="{y+48:.0f}" class="head" font-size="29" font-weight="800" fill="{accent}">{esc(heading)}</text>')
        available = max(1, int((card_h - 92) // 39))
        rendered: list[str] = []
        for line in lines:
            rendered.extend(wrap("• " + line, 43 if cols == 2 else 88))
        rendered = rendered[:available]
        for j, line in enumerate(rendered):
            chunks.append(f'<text x="{x+32:.0f}" y="{y+92+j*39:.0f}" class="body" font-size="23" font-weight="540" fill="#26344d">{esc(line)}</text>')
    chunks.append('</svg>')
    return "".join(chunks)


def flow_svg(title: str, subtitle: str, steps: list[tuple[str, list[str]]], accent: str) -> str:
    width, height = 1200, 820
    top, left = 190, 88
    gap = 22
    box_h = (height - top - 58 - gap * (len(steps) - 1)) / len(steps)
    chunks = [f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} {height}" role="img" aria-labelledby="title desc">
<title id="title">{esc(title)}</title><desc id="desc">{esc(subtitle)}</desc>
<rect width="1200" height="820" rx="34" fill="#f7f8fc"/><rect width="18" height="820" rx="9" fill="{accent}"/>
<text x="62" y="82" font-family="Inter,Arial,sans-serif" font-size="46" font-weight="850" fill="#14213d">{esc(title)}</text>
<text x="62" y="132" font-family="Inter,Arial,sans-serif" font-size="25" font-weight="520" fill="#516079">{esc(subtitle)}</text>
<style>text{{font-family:Inter,Arial,sans-serif}}</style>''']
    for i, (heading, lines) in enumerate(steps):
        y = top + i * (box_h + gap)
        chunks.append(f'<circle cx="105" cy="{y+box_h/2:.0f}" r="31" fill="{accent}"/><text x="105" y="{y+box_h/2+9:.0f}" text-anchor="middle" font-size="26" font-weight="850" fill="#fff">{i+1}</text>')
        chunks.append(f'<rect x="158" y="{y:.0f}" width="954" height="{box_h:.0f}" rx="22" fill="#fff" stroke="#dfe4ef" stroke-width="2"/>')
        chunks.append(f'<text x="190" y="{y+43:.0f}" font-size="28" font-weight="820" fill="{accent}">{esc(heading)}</text>')
        line = " · ".join(lines)
        for j, part in enumerate(wrap(line, 78)[:2]):
            chunks.append(f'<text x="190" y="{y+79+j*31:.0f}" font-size="21" font-weight="540" fill="#26344d">{esc(part)}</text>')
        if i < len(steps)-1:
            chunks.append(f'<path d="M105 {y+box_h+3:.0f} V {y+box_h+gap-4:.0f}" stroke="{accent}" stroke-width="5" stroke-linecap="round"/><path d="M96 {y+box_h+gap-13:.0f} L105 {y+box_h+gap-4:.0f} L114 {y+box_h+gap-13:.0f}" fill="none" stroke="{accent}" stroke-width="5" stroke-linecap="round"/>')
    chunks.append('</svg>')
    return "".join(chunks)


GUIDES = [
    # Fiscalité et organisation
    ("fiscalite/impot-taxe-cotisation-redevance.svg", "cards", "Prélèvements : ne plus les confondre", "Le mot-clé à repérer dans chaque définition", "#d97706", [
        ("Impôt", ["Finance les charges publiques", "Pas de contrepartie directe individualisée", "Exemple : impôt sur le revenu"]),
        ("Taxe", ["Prélèvement lié à une situation ou un service", "Le lien n’est pas forcément proportionnel au service", "Exemple : taxe foncière"]),
        ("Cotisation sociale", ["Finance la protection sociale", "Ouvre des droits sociaux", "Exemple : retraite, maladie"]),
        ("Redevance", ["Paiement en échange d’un service rendu", "Montant lié à l’usage du service", "Logique de contrepartie directe"]),
    ]),
    ("fiscalite/direct-indirect.svg", "cards", "Impôt direct ou indirect ?", "La distinction dépend du mode de perception", "#d97706", [
        ("Impôt direct", ["Payé directement par le contribuable désigné", "Établi à son nom", "Exemples : impôt sur le revenu, taxe foncière"]),
        ("Impôt indirect", ["Prélevé lors d’une opération ou d’un achat", "Collecté par un intermédiaire", "Exemple central : TVA"]),
        ("Question réflexe", ["Qui verse matériellement l’impôt ?", "Sur quel acte ou quelle base est-il calculé ?", "Ne pas confondre avec progressif/proportionnel"]),
        ("Piège classique", ["Direct ne veut pas dire progressif", "Indirect ne veut pas dire faible", "Deux classifications différentes"]),
    ]),
    ("fiscalite/progressif-proportionnel.svg", "cards", "Progressif ou proportionnel ?", "Ici, on observe l’évolution du taux", "#d97706", [
        ("Proportionnel", ["Même taux quelle que soit la base", "Le montant augmente, mais pas le taux", "Exemple simple : 10 % pour tous"]),
        ("Progressif", ["Le taux augmente par tranches", "La part prélevée croît avec le revenu", "Exemple : barème de l’impôt sur le revenu"]),
        ("À ne pas dire", ["Progressif ≠ tout le revenu au taux maximal", "Seule chaque tranche reçoit son taux", "Le taux marginal n’est pas le taux moyen"]),
        ("Mémo", ["Proportionnel = proportion constante", "Progressif = progression des taux", "Direct/indirect répond à une autre question"]),
    ]),
    ("fiscalite/tva-circuit.svg", "flow", "Le circuit de la TVA", "L’entreprise collecte, déduit puis reverse", "#d97706", [
        ("Vente au consommateur", ["L’entreprise facture le prix HT + la TVA", "le consommateur final supporte la taxe"]),
        ("TVA collectée", ["TVA facturée sur les ventes", "elle n’appartient pas à l’entreprise"]),
        ("TVA déductible", ["TVA payée sur certains achats professionnels", "elle est retranchée sous conditions"]),
        ("TVA à payer", ["TVA collectée − TVA déductible", "le solde est reversé à l’État"]),
    ]),
    ("fiscalite/chaine-fiscale.svg", "flow", "La chaîne fiscale", "De la base imposable jusqu’au paiement", "#d97706", [
        ("Assiette", ["Déterminer ce qui est imposable", "la base de calcul"]),
        ("Liquidation", ["Appliquer les règles et les taux", "calculer la somme due"]),
        ("Recouvrement", ["Obtenir le paiement effectif", "amiable puis, si besoin, forcé"]),
        ("Contrôle et contentieux", ["Vérifier les déclarations", "traiter les contestations"]),
    ]),
    ("fiscalite/controle-recouvrement-contentieux.svg", "cards", "Contrôle, recouvrement, contentieux", "Trois moments différents de la relation fiscale", "#d97706", [
        ("Contrôle fiscal", ["Vérifier la sincérité des déclarations", "Comparer les données disponibles", "Rectifier si nécessaire"]),
        ("Recouvrement", ["Faire entrer la somme due", "Spontané ou amiable d’abord", "Forcé en cas d’impayé"]),
        ("Contentieux d’assiette", ["Contestation de la base ou du calcul", "Question : combien est dû ?"]),
        ("Contentieux du recouvrement", ["Contestation des poursuites ou du paiement", "Question : comment la somme est récupérée ?"]),
    ]),

    # Économie
    ("economie/pib-definition.svg", "cards", "PIB : ce qu’il mesure vraiment", "Un flux de production créé sur un territoire", "#2563eb", [
        ("Définition", ["Valeur des biens et services finaux produits", "Sur un territoire", "Pendant une période donnée"]),
        ("Approche production", ["Somme des valeurs ajoutées", "+ impôts sur les produits", "− subventions sur les produits"]),
        ("Ce que le PIB n’est pas", ["Pas un stock de patrimoine", "Pas le chiffre d’affaires total", "Pas une mesure complète du bien-être"]),
        ("PIB par habitant", ["PIB ÷ population", "Indicateur moyen", "Ne décrit pas les inégalités de revenu"]),
    ]),
    ("economie/pib-nominal-volume.svg", "cards", "PIB nominal ou PIB en volume ?", "Séparer l’effet des prix de l’effet des quantités", "#2563eb", [
        ("PIB nominal", ["Calculé aux prix courants", "Peut augmenter à cause de l’inflation", "Mélange prix et quantités"]),
        ("PIB en volume", ["Corrigé de l’évolution des prix", "Mesure mieux la production réelle", "Sert à calculer la croissance"]),
        ("Exemple", ["Quantités inchangées, prix +5 %", "PIB nominal : environ +5 %", "PIB en volume : environ 0 %"]),
        ("Réflexe QCM", ["Croissance économique → PIB en volume", "Taille monétaire courante → PIB nominal", "Toujours regarder l’unité et la période"]),
    ]),
    ("economie/croissance-inflation-chomage.svg", "cards", "Croissance, inflation, chômage", "Trois indicateurs, trois phénomènes différents", "#2563eb", [
        ("Croissance", ["Hausse du PIB en volume", "Mesure l’évolution de la production", "Peut être positive, nulle ou négative"]),
        ("Inflation", ["Hausse générale et durable des prix", "Réduit le pouvoir d’achat à revenu inchangé", "Mesurée notamment par un indice des prix"]),
        ("Chômage", ["Part des actifs sans emploi qui en recherchent un", "Ne se confond pas avec l’inactivité", "Taux = chômeurs ÷ population active"]),
        ("Attention", ["Inflation ≠ hausse d’un seul prix", "Croissance nominale ≠ croissance réelle", "Population active ≠ population totale"]),
    ]),
    ("economie/deficit-dette.svg", "cards", "Déficit public ou dette publique ?", "Le déficit est un flux ; la dette est un stock", "#2563eb", [
        ("Déficit public", ["Dépenses publiques > recettes sur une année", "Se mesure sur une période", "Flux annuel"]),
        ("Dette publique", ["Accumulation d’emprunts restant à rembourser", "Se mesure à une date", "Stock"]),
        ("Lien", ["Un déficit nouveau accroît généralement la dette", "Un excédent peut la réduire", "Les intérêts pèsent sur les dépenses futures"]),
        ("Mémo", ["Déficit = film de l’année", "Dette = photo à une date", "Les deux peuvent être rapportés au PIB"]),
    ]),
    ("economie/agents-circuit.svg", "cards", "Les agents économiques", "Qui produit, consomme, finance ou redistribue ?", "#2563eb", [
        ("Ménages", ["Consomment", "Fournissent du travail", "Épargnent et paient des prélèvements"]),
        ("Entreprises", ["Produisent des biens et services marchands", "Investissent et emploient", "Versent salaires et prélèvements"]),
        ("Administrations publiques", ["Produisent des services non marchands", "Prélèvent et redistribuent", "Mènent des politiques publiques"]),
        ("Institutions financières", ["Collectent l’épargne", "Accordent des financements", "Fournissent des moyens de paiement"]),
    ]),
    ("economie/redistribution.svg", "flow", "La redistribution des revenus", "Du revenu primaire au revenu disponible", "#2563eb", [
        ("Revenus primaires", ["Salaires, revenus du patrimoine, revenus mixtes", "avant redistribution"]),
        ("Prélèvements", ["Impôts directs et cotisations sociales", "diminuent le revenu disponible"]),
        ("Prestations sociales", ["Retraites, allocations, remboursements", "augmentent le revenu disponible"]),
        ("Revenu disponible", ["Revenu primaire − prélèvements + prestations", "sert à consommer ou épargner"]),
    ]),

    # Institutions et administrations
    ("institutions/institutions-francaises.svg", "cards", "Les institutions françaises", "Qui décide, vote, exécute et contrôle ?", "#7c3aed", [
        ("Président de la République", ["Chef de l’État", "Nomme le Premier ministre", "Garant des institutions et de l’indépendance nationale"]),
        ("Gouvernement", ["Détermine et conduit la politique de la Nation", "Dispose de l’administration", "Responsable devant l’Assemblée nationale"]),
        ("Parlement", ["Assemblée nationale + Sénat", "Vote la loi", "Contrôle le Gouvernement et évalue les politiques"]),
        ("Conseil constitutionnel", ["Contrôle la conformité des lois à la Constitution", "Juge certaines élections", "Traite les QPC"]),
    ]),
    ("institutions/parcours-loi.svg", "flow", "Le parcours d’une loi", "De l’initiative à la promulgation", "#7c3aed", [
        ("Initiative", ["Projet de loi : Gouvernement", "proposition de loi : parlementaire"]),
        ("Examen", ["Commission puis séance publique", "amendements et vote"]),
        ("Navette", ["Assemblée nationale et Sénat examinent le texte", "recherche d’un accord"]),
        ("Adoption et promulgation", ["Contrôle constitutionnel éventuel", "promulgation par le Président puis publication"]),
    ]),
    ("institutions/justice-deux-ordres.svg", "cards", "Les deux ordres de juridiction", "Repérer le bon juge selon le litige", "#7c3aed", [
        ("Ordre judiciaire", ["Litiges entre personnes privées", "Infractions pénales", "Sommet : Cour de cassation"]),
        ("Ordre administratif", ["Litiges impliquant l’administration dans l’exercice de ses prérogatives", "Sommet : Conseil d’État"]),
        ("Tribunal des conflits", ["Règle les conflits de compétence", "Évite un déni de justice", "Détermine l’ordre compétent"]),
        ("Ne pas confondre", ["Conseil constitutionnel ≠ troisième ordre", "Cour de cassation ne rejuge pas tous les faits", "Conseil d’État a aussi un rôle consultatif"]),
    ]),
    ("institutions/institutions-europeennes.svg", "cards", "Les institutions de l’Union européenne", "Une fonction principale pour chaque institution", "#7c3aed", [
        ("Commission européenne", ["Propose la plupart des textes", "Veille à l’application du droit de l’Union", "Défend l’intérêt général européen"]),
        ("Parlement européen", ["Élu au suffrage universel direct", "Vote les textes et le budget avec le Conseil", "Contrôle politique"]),
        ("Conseil de l’Union européenne", ["Réunit les ministres des États selon le sujet", "Co-législateur avec le Parlement"]),
        ("Conseil européen", ["Réunit chefs d’État ou de gouvernement", "Donne les grandes orientations", "Ne vote pas les lois ordinaires"]),
    ]),
    ("institutions/bercy-directions.svg", "cards", "Bercy : qui fait quoi ?", "Le périmètre dépasse largement les seuls impôts", "#7c3aed", [
        ("DGFiP", ["Fiscalité générale", "Recouvrement et contrôle", "Comptes et gestion publics"]),
        ("DGDDI", ["Flux de marchandises et frontières", "Droits de douane et contributions indirectes", "Lutte contre les trafics"]),
        ("DGCCRF", ["Concurrence", "Protection économique des consommateurs", "Lutte contre les fraudes commerciales"]),
        ("DG Trésor / Budget / Insee / AFT", ["Politique économique / finances de l’État", "Statistique publique", "Gestion de la dette et de la trésorerie de l’État"]),
    ]),
    ("institutions/dgfip-dgddi-dgccrf.svg", "cards", "DGFiP, DGDDI ou DGCCRF ?", "Trois directions, trois réflexes de classement", "#7c3aed", [
        ("DGFiP", ["Impôt sur le revenu, taxe foncière", "Comptes publics", "Paiement des recettes publiques"]),
        ("DGDDI", ["Importations et exportations", "Marchandises, droits de douane", "Tabacs, alcools, trafics"]),
        ("DGCCRF", ["Prix, pratiques commerciales, clauses", "Sécurité des produits", "Concurrence et protection du consommateur"]),
        ("Mémo", ["Contribuable → DGFiP", "Frontière/marchandise → DGDDI", "Consommateur/marché → DGCCRF"]),
    ]),
    ("institutions/ordonnateur-comptable.svg", "cards", "Ordonnateur et comptable public", "La séparation protège la régularité financière", "#7c3aed", [
        ("Ordonnateur", ["Décide de la recette ou de la dépense", "Constate et liquide", "Donne l’ordre de payer ou de recouvrer"]),
        ("Comptable public", ["Manie les fonds", "Contrôle les pièces et la régularité", "Paie ou recouvre puis comptabilise"]),
        ("Principe", ["Les fonctions sont séparées", "Celui qui décide ne manipule pas seul l’argent", "Contrôle réciproque"]),
        ("Ordre logique", ["Décision par l’ordonnateur", "Contrôle par le comptable", "Paiement ou encaissement"]),
    ]),
    ("institutions/tracfin.svg", "flow", "Le circuit d’un soupçon vers Tracfin", "Renseignement financier, pas jugement pénal", "#7c3aed", [
        ("Opération atypique", ["Un professionnel assujetti détecte des indices", "analyse du risque"]),
        ("Déclaration de soupçon", ["Transmission confidentielle à Tracfin", "le client n’en est pas informé"]),
        ("Analyse financière", ["Recoupements et enrichissement", "détection de circuits possibles"]),
        ("Transmission utile", ["À l’autorité judiciaire ou à un service compétent", "si les éléments le justifient"]),
    ]),

    # Arts et architecture
    ("arts/chronologie-arts.svg", "flow", "Grande chronologie des arts", "Situer les styles avant d’apprendre les œuvres", "#be185d", [
        ("Antiquité", ["Ordres grecs, temples, sculpture idéale", "jusqu’au Ve siècle environ"]),
        ("Roman puis gothique", ["XIe–XIIe : roman", "à partir du XIIe : gothique"]),
        ("Renaissance", ["XVe–XVIe siècles", "perspective, humanisme, Antiquité retrouvée"]),
        ("XVIIe–XVIIIe siècles", ["Baroque, classicisme puis Lumières", "mouvement contre ordre"]),
        ("XIXe–XXe siècles", ["Romantisme, réalisme, impressionnisme", "puis avant-gardes et art moderne"]),
    ]),
    ("arts/eglises-roman-gothique.svg", "cards", "Églises : roman ou gothique ?", "Regarder les arcs, les murs, la hauteur et la lumière", "#be185d", [
        ("Style roman · XIe–XIIe", ["Arc en plein cintre : arrondi", "Murs épais et ouvertures petites", "Édifice massif, plutôt sombre"]),
        ("Style gothique · dès le XIIe", ["Arc brisé : ogive", "Voûte sur croisée d’ogives", "Arcs-boutants et grandes verrières"]),
        ("Repères romans", ["Sainte-Foy de Conques", "Basilique de Vézelay", "Abbayes et églises massives"]),
        ("Repères gothiques", ["Notre-Dame de Paris", "Cathédrales de Chartres et Reims", "Hauteur, lumière, vitraux"]),
    ]),
    ("arts/chronologie-eglises.svg", "flow", "Chronologie de l’architecture des églises", "Suivre les grandes transformations, des basiliques aux édifices contemporains", "#be185d", [
        ("IVe–VIe siècles · paléochrétien", ["Plan basilical hérité de Rome", "nef centrale et abside"]),
        ("XIe–XIIe siècles · roman", ["Arc en plein cintre", "murs épais, petites ouvertures"]),
        ("XIIe–XVe siècles · gothique", ["Arc brisé et croisées d’ogives", "arcs-boutants, hauteur et vitraux"]),
        ("XVIe–XVIIIe siècles", ["Renaissance, classicisme et baroque", "Antiquité, ordre puis décor théâtral"]),
        ("XIXe–XXIe siècles", ["Néo-gothique puis matériaux modernes", "restaurations, béton, verre et formes nouvelles"]),
    ]),
    ("arts/renaissance-artistes.svg", "cards", "Renaissance : artistes et œuvres", "Associer immédiatement le nom au bon repère", "#be185d", [
        ("Léonard de Vinci", ["La Joconde", "La Cène", "L’Homme de Vitruve"]),
        ("Michel-Ange", ["David et la Pietà", "Plafond de la chapelle Sixtine", "Sculpteur, peintre, architecte"]),
        ("Raphaël", ["L’École d’Athènes", "Équilibre et harmonie", "Grand décorateur du Vatican"]),
        ("Botticelli et Titien", ["Botticelli : Naissance de Vénus, Printemps", "Titien : Vénus d’Urbin", "Florence / Venise"]),
    ]),
    ("arts/baroque-classicisme.svg", "cards", "Baroque ou classicisme ?", "Deux esthétiques majeures du XVIIe siècle", "#be185d", [
        ("Baroque", ["Mouvement et courbes", "Contrastes, théâtralité, émotion", "Caravage, Rubens, Le Bernin"]),
        ("Classicisme", ["Ordre, équilibre, clarté", "Composition maîtrisée", "Poussin, architecture de Versailles"]),
        ("Indice visuel baroque", ["Diagonales et torsions", "Clair-obscur dramatique", "Sensation d’action en cours"]),
        ("Indice visuel classique", ["Lignes stables", "Symétrie et hiérarchie", "Règles et mesure"]),
    ]),
    ("arts/xixe-mouvements.svg", "cards", "Les mouvements artistiques du XIXe siècle", "Une question centrale et un indice visuel par mouvement", "#be185d", [
        ("Romantisme", ["Émotion, drame, imagination", "Couleurs et mouvement", "Géricault, Delacroix"]),
        ("Réalisme", ["Vie contemporaine et monde social", "Refus de l’idéalisation", "Courbet, Millet"]),
        ("Impressionnisme", ["Lumière et instant", "Peinture en plein air, touches visibles", "Monet, Renoir, Degas"]),
        ("Postimpressionnisme", ["Couleur et construction plus personnelles", "Van Gogh, Cézanne, Gauguin", "Ouvre vers l’art moderne"]),
    ]),
    ("arts/impressionnisme-oeuvres.svg", "cards", "Impressionnisme : œuvres repères", "Reconnaître l’artiste grâce au sujet et au traitement", "#be185d", [
        ("Claude Monet", ["Impression, soleil levant", "Série des Nymphéas", "Variations de lumière"]),
        ("Auguste Renoir", ["Bal du moulin de la Galette", "Sociabilité et loisirs", "Lumière colorée"]),
        ("Edgar Degas", ["Danseuses et scènes de ballet", "Cadrages audacieux", "Étude du mouvement"]),
        ("Berthe Morisot", ["Scènes de la vie moderne", "Touche libre et lumineuse", "Figure majeure du groupe impressionniste"]),
    ]),
    ("arts/art-moderne.svg", "cards", "Art moderne : quatre ruptures", "Observer ce que chaque courant transforme", "#be185d", [
        ("Fauvisme", ["Couleurs pures et non réalistes", "Matisse", "Libération de la couleur"]),
        ("Cubisme", ["Décomposition des formes", "Plusieurs points de vue", "Picasso et Braque"]),
        ("Abstraction", ["Plus de sujet reconnaissable nécessaire", "Formes, lignes, couleurs", "Kandinsky, Mondrian"]),
        ("Surréalisme", ["Rêve et inconscient", "Associations inattendues", "Dalí, Magritte"]),
    ]),

    # EMC
    ("emc/textes-fondamentaux.svg", "flow", "Textes fondamentaux : la chronologie", "Chaque texte protège un niveau différent", "#dc2626", [
        ("1789 · DDHC", ["Liberté, égalité, souveraineté", "socle des droits en France"]),
        ("1946 · Préambule", ["Droits économiques et sociaux", "égalité femmes-hommes, droit syndical"]),
        ("1958 · Constitution", ["Institutions de la Ve République", "bloc de constitutionnalité"]),
        ("2004–2005 · Charte de l’environnement", ["Droits et devoirs environnementaux", "valeur constitutionnelle"]),
    ]),
    ("emc/valeurs-symboles.svg", "cards", "Valeurs, principes et symboles", "Trois catégories à ne pas mélanger", "#dc2626", [
        ("Valeurs", ["Liberté", "Égalité", "Fraternité"]),
        ("Principes constitutionnels", ["République indivisible", "Laïque, démocratique et sociale"]),
        ("Symboles", ["Drapeau tricolore", "Marianne, Marseillaise", "14 Juillet, devise"]),
        ("Langue et souveraineté", ["Français : langue de la République", "Peuple : source de la souveraineté", "Vote et représentation"]),
    ]),
    ("emc/laicite.svg", "cards", "La laïcité en quatre idées", "Liberté de conscience et neutralité de l’État", "#dc2626", [
        ("Liberté de conscience", ["Croire, ne pas croire, changer de conviction", "Liberté encadrée par l’ordre public"]),
        ("Neutralité de l’État", ["Les services publics ne privilégient aucun culte", "Les agents sont tenus à la neutralité"]),
        ("Égalité", ["Même droit pour tous quelles que soient les convictions", "Aucune religion d’État"]),
        ("Usagers et agents", ["Les obligations ne sont pas identiques", "Agent : neutralité stricte", "Usager : liberté, sous limites légales"]),
    ]),
    ("emc/citoyennete-vote.svg", "flow", "De la citoyenneté au vote", "Droits politiques, inscription, scrutin", "#dc2626", [
        ("Être citoyen", ["Nationalité et majorité pour les droits politiques nationaux", "droits et devoirs"]),
        ("Être électeur", ["Inscription sur une liste électorale", "jouissance des droits civils et politiques"]),
        ("Voter", ["Suffrage universel, égal et secret", "scrutin direct ou indirect selon l’élection"]),
        ("Participer autrement", ["Engagement associatif et syndical", "pétition, débat, mandat électif"]),
    ]),

    # Culture numérique
    ("numerique/internet-donnees.svg", "flow", "Comment une donnée circule sur Internet", "Adresse, paquets, routeurs et serveur", "#0f766e", [
        ("Appareil client", ["Formule une requête", "utilise une adresse IP sur le réseau"]),
        ("Paquets", ["Les données sont découpées", "chaque paquet peut suivre une route"]),
        ("Routeurs et DNS", ["DNS traduit le nom de domaine", "les routeurs acheminent les paquets"]),
        ("Serveur puis réponse", ["Le serveur traite la demande", "les paquets reviennent et sont réassemblés"]),
    ]),
    ("numerique/rgpd.svg", "cards", "RGPD : acteurs et droits", "Qui décide, qui traite, qui est protégée ?", "#0f766e", [
        ("Responsable du traitement", ["Détermine les finalités et les moyens", "doit justifier et sécuriser le traitement"]),
        ("Sous-traitant", ["Traite les données pour le responsable", "agit selon ses instructions"]),
        ("Personne concernée", ["Dispose de droits : accès, rectification, effacement", "opposition, limitation, portabilité selon les cas"]),
        ("CNIL", ["Informe et accompagne", "Contrôle", "Peut mettre en demeure et sanctionner"]),
    ]),
    ("numerique/cyber-reflexes.svg", "cards", "Cybermenaces : le bon réflexe", "Identifier le signal avant d’agir", "#0f766e", [
        ("Hameçonnage", ["Message pressant ou lien suspect", "Ne pas cliquer", "Vérifier l’adresse par un autre canal"]),
        ("Mot de passe", ["Long et unique par service", "Gestionnaire recommandé", "Double authentification"]),
        ("Logiciel malveillant", ["Pièce jointe ou programme piégé", "Mettre à jour et sauvegarder", "Isoler l’appareil en cas d’incident"]),
        ("Donnée sensible", ["Limiter le partage", "Vérifier le destinataire", "Chiffrer si nécessaire"]),
    ]),
    ("numerique/cloud-ia.svg", "cards", "Cloud, algorithme et intelligence artificielle", "Trois notions proches dans les usages, différentes dans leur nature", "#0f766e", [
        ("Cloud", ["Ressources informatiques accessibles à distance", "Stockage, calcul ou logiciel", "Les données restent sur des serveurs physiques"]),
        ("Algorithme", ["Suite d’instructions finies", "Transforme des entrées en résultats", "Peut fonctionner sans IA"]),
        ("Intelligence artificielle", ["Systèmes capables d’inférer à partir de données", "Prédiction, classification ou génération", "Peut produire des erreurs"]),
        ("Réflexe critique", ["Vérifier la source et la finalité", "Repérer biais et données personnelles", "Conserver une décision humaine responsable"]),
    ]),

    # Mathématiques
    ("mathematiques/pourcentages.svg", "cards", "Pourcentages : la carte mentale", "Choisir la bonne opération avant de calculer", "#15803d", [
        ("Calculer p % de Q", ["Q × p / 100", "15 % de 80 = 80 × 0,15"]),
        ("Augmenter de p %", ["Multiplier par 1 + p/100", "+20 % → × 1,20"]),
        ("Diminuer de p %", ["Multiplier par 1 − p/100", "−20 % → × 0,80"]),
        ("Variations successives", ["Multiplier les coefficients", "+10 % puis −10 % ne ramène pas au départ"]),
    ]),
    ("mathematiques/distance-vitesse-temps.svg", "cards", "Distance, vitesse et temps", "Le triangle des trois formules", "#15803d", [
        ("Distance", ["d = v × t", "Unité cohérente : km si km/h et heures"]),
        ("Vitesse", ["v = d ÷ t", "Vitesse moyenne = distance totale ÷ temps total"]),
        ("Temps", ["t = d ÷ v", "Convertir les minutes en heures si nécessaire"]),
        ("Piège", ["2 h 30 = 2,5 h", "Pas 2,30 h", "Toujours harmoniser les unités"]),
    ]),
    ("mathematiques/heures-durees.svg", "flow", "Heures et durées", "Le système horaire fonctionne en base 60", "#15803d", [
        ("Convertir", ["Minutes → heures : ÷ 60", "heures décimales → minutes : partie décimale × 60"]),
        ("Calculer la durée", ["Durée = arrivée − départ", "emprunter 60 minutes si nécessaire"]),
        ("Calculer l’arrivée", ["Arrivée = départ + trajet + arrêts", "gérer le passage à l’heure suivante"]),
        ("Vérifier", ["2 h 45 = 2,75 h", "0,5 h = 30 min", "0,25 h = 15 min"]),
    ]),
    ("mathematiques/aires-volumes.svg", "cards", "Aires et volumes : unités et formules", "Carré pour une surface, cube pour un volume", "#15803d", [
        ("Aires", ["Rectangle : L × l", "Triangle : b × h ÷ 2", "Disque : πr²"]),
        ("Volumes", ["Pavé : L × l × h", "Cylindre : πr²h", "Toujours en unités cubiques"]),
        ("Échelle", ["Longueur : coefficient n", "Aire : n²", "Volume : n³"]),
        ("Conversions", ["1 m² = 10 000 cm²", "1 m³ = 1 000 L", "Ne pas appliquer la conversion linéaire aux aires"]),
    ]),

    # Raisonnement logique
    ("logique/suites.svg", "cards", "Suites : ordre de recherche", "Tester les règles simples avant les règles compliquées", "#4f46e5", [
        ("1. Différences", ["Calculer les écarts entre termes", "Chercher une différence constante ou progressive"]),
        ("2. Rapports", ["Tester multiplications et divisions", "Repérer une proportion"]),
        ("3. Alternance", ["Séparer rangs pairs et impairs", "Deux suites peuvent être entremêlées"]),
        ("4. Structure", ["Carrés, cubes, nombres premiers", "Règle sur deux termes précédents", "Vérifier sur toute la suite"]),
    ]),
    ("logique/deduction.svg", "flow", "Tableau de déduction", "Transformer les phrases en contraintes visibles", "#4f46e5", [
        ("Lister", ["Personnes, objets, places ou jours", "une ligne ou colonne par catégorie"]),
        ("Traduire", ["✓ pour une association certaine", "× pour une impossibilité"]),
        ("Propager", ["Une certitude élimine les autres cases de sa ligne et colonne", "croiser les indices"]),
        ("Contrôler", ["Relire toutes les contraintes", "une seule solution doit rester"]),
    ]),
]


def main() -> None:
    for relative, kind, title, subtitle, accent, content in GUIDES:
        target = OUT / relative
        target.parent.mkdir(parents=True, exist_ok=True)
        svg = flow_svg(title, subtitle, content, accent) if kind == "flow" else cards_svg(title, subtitle, content, accent)
        target.write_text(svg, encoding="utf-8")
    print(f"Generated {len(GUIDES)} visual guides in {OUT}")


if __name__ == "__main__":
    main()
