#!/usr/bin/env python3
"""Generate the static France geography visuals used by the QCM app."""

from __future__ import annotations

import json
import math
from pathlib import Path


DATA = Path("/tmp/qcm-france-map")
OUT = Path(__file__).resolve().parents[1] / "assets" / "geography"
COUNTRIES = json.loads((DATA / "countries.geojson").read_text())
RIVERS = json.loads((DATA / "rivers.geojson").read_text())
REGIONS = json.loads((DATA / "regions.geojson").read_text())
WORLD = json.loads((DATA / "countries-110m.geojson").read_text())


def projection(bbox, rect):
    lon0, lat0, lon1, lat1 = bbox
    x0, y0, width, height = rect
    cos_lat = math.cos(math.radians((lat0 + lat1) / 2))
    span_x = (lon1 - lon0) * cos_lat
    span_y = lat1 - lat0
    scale = min(width / span_x, height / span_y)
    pad_x = (width - span_x * scale) / 2
    pad_y = (height - span_y * scale) / 2

    def project(lon, lat):
        x = x0 + pad_x + (lon - lon0) * cos_lat * scale
        y = y0 + pad_y + (lat1 - lat) * scale
        return x, y

    return project


def polygon_paths(geometry, project):
    kind = geometry["type"]
    coords = geometry["coordinates"]
    polygons = [coords] if kind == "Polygon" else coords if kind == "MultiPolygon" else []
    paths = []
    for polygon in polygons:
        pieces = []
        for ring in polygon:
            if len(ring) < 3:
                continue
            points = [project(lon, lat) for lon, lat in ring]
            pieces.append("M" + " L".join(f"{x:.1f},{y:.1f}" for x, y in points) + " Z")
        if pieces:
            paths.append(" ".join(pieces))
    return paths


def line_paths(geometry, project):
    kind = geometry["type"]
    coords = geometry["coordinates"]
    lines = [coords] if kind == "LineString" else coords if kind == "MultiLineString" else []
    result = []
    for line in lines:
        if len(line) < 2:
            continue
        points = [project(lon, lat) for lon, lat in line]
        result.append("M" + " L".join(f"{x:.1f},{y:.1f}" for x, y in points))
    return result


def base_map(project, france="#f3ede1", neighbours="#e7edf3", clip_id=None):
    wanted = {"France", "United Kingdom", "Belgium", "Netherlands", "Luxembourg", "Germany", "Switzerland", "Spain", "Italy"}
    shapes = []
    for feature in COUNTRIES["features"]:
        name = feature["properties"].get("ADMIN")
        if name not in wanted:
            continue
        fill = france if name == "France" else neighbours
        clip = f' clip-path="url(#{clip_id})"' if clip_id else ""
        for path in polygon_paths(feature["geometry"], project):
            shapes.append(f'<path d="{path}" fill="{fill}" stroke="#ffffff" stroke-width="1.5" fill-rule="evenodd"{clip}/>')
    return "".join(shapes)


STYLE = """
  .bg{fill:#f8fbff}.title{font:700 34px system-ui,sans-serif;fill:#172133}.subtitle{font:500 17px system-ui,sans-serif;fill:#526172}
  .label{font:700 18px system-ui,sans-serif;fill:#172133;paint-order:stroke;stroke:#fff;stroke-width:5;stroke-linejoin:round}.small{font:600 14px system-ui,sans-serif;fill:#334155}.note{font:500 14px system-ui,sans-serif;fill:#64748b}
  .panel{fill:#fff;stroke:#d8e1ea;stroke-width:1.5}.panelTitle{font:750 18px system-ui,sans-serif;fill:#172133}.panelText{font:500 15px system-ui,sans-serif;fill:#526172}.value{font:800 17px system-ui,sans-serif;fill:#172133}
"""


def svg_shell(title, desc, body, height=800):
    return f'''<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="{height}" viewBox="0 0 1200 {height}" role="img" aria-labelledby="title desc">
<title id="title">{title}</title><desc id="desc">{desc}</desc><style>{STYLE}</style><rect width="1200" height="{height}" rx="28" class="bg"/>{body}</svg>'''


def reliefs():
    bbox = (-6.2, 41.0, 10.2, 52.0)
    rect = (55, 105, 710, 620)
    p = projection(bbox, rect)
    body = [f'<text x="55" y="48" class="title">Reliefs et points culminants de la France</text><text x="55" y="76" class="subtitle">Les massifs sont localisés ; les altitudes permettent de comparer leur ordre de grandeur.</text>', '<defs><clipPath id="reliefclip"><rect x="55" y="105" width="710" height="620" rx="20"/></clipPath></defs>', base_map(p, clip_id="reliefclip")]
    ranges = [
        ("Massif armoricain", -3.0, 48.1, 145, 55, -8, "#b9d8c4"),
        ("Massif central", 3.0, 45.3, 180, 155, -8, "#a8cfb6"),
        ("Pyrénées", 0.7, 42.85, 235, 48, 0, "#91bda4"),
        ("Alpes", 6.5, 45.2, 105, 180, -18, "#779f8b"),
        ("Jura", 6.0, 46.7, 58, 108, -18, "#a8cfb6"),
        ("Vosges", 7.0, 48.0, 52, 82, 0, "#b9d8c4"),
        ("Ardennes", 4.7, 49.8, 75, 45, 0, "#c9dfcf"),
    ]
    for name, lon, lat, rx, ry, rot, color in ranges:
        x, y = p(lon, lat)
        body.append(f'<ellipse cx="{x:.1f}" cy="{y:.1f}" rx="{rx/2:.1f}" ry="{ry/2:.1f}" transform="rotate({rot} {x:.1f} {y:.1f})" fill="{color}" opacity=".78"/>')
        body.append(f'<text x="{x:.1f}" y="{y+5:.1f}" text-anchor="middle" class="small">{name}</text>')
    peaks = [
        ("Mont Blanc", "≈ 4 809 m", 6.865, 45.833, -116, -22),
        ("Pic d’Aneto", "3 404 m · Espagne", 0.656, 42.631, -115, 44),
        ("Puy de Sancy", "1 885 m", 2.814, 45.528, -118, -18),
        ("Monte Cinto", "2 706 m", 8.946, 42.379, -115, 42),
    ]
    for name, alt, lon, lat, dx, dy in peaks:
        x, y = p(lon, lat)
        body.append(f'<path d="M{x:.1f},{y-12:.1f} l10,19 h-20 z" fill="#ef476f" stroke="#fff" stroke-width="2"/>')
        body.append(f'<text x="{x+dx:.1f}" y="{y+dy:.1f}" class="label">{name}</text><text x="{x+dx:.1f}" y="{y+dy+22:.1f}" class="small">{alt}</text>')
    body.append('<rect x="810" y="118" width="335" height="520" rx="20" class="panel"/><text x="840" y="156" class="panelTitle">Hauteurs comparées</text>')
    bars = [("Mont Blanc", 4809, "#ef476f"), ("Pic d’Aneto", 3404, "#d1788a"), ("Monte Cinto", 2706, "#789f8a"), ("Puy de Sancy", 1885, "#9bb9a6"), ("Grand Ballon", 1424, "#c1d4c7")]
    max_h = 330
    for i, (name, value, color) in enumerate(bars):
        x = 842 + i * 58
        h = value / 4809 * max_h
        y = 560 - h
        body.append(f'<rect x="{x}" y="{y:.1f}" width="38" height="{h:.1f}" rx="10" fill="{color}"/><text x="{x+19}" y="{y-10:.1f}" text-anchor="middle" class="small">{value}</text><text x="{x+19}" y="590" text-anchor="middle" class="small" transform="rotate(-55 {x+19} 590)">{name}</text>')
    body.append('<rect x="810" y="662" width="335" height="76" rx="16" fill="#fff2f4"/><text x="835" y="691" class="panelTitle">À retenir</text><text x="835" y="719" class="panelText">Mont Blanc = France + Alpes.</text>')
    body.append('<text x="55" y="772" class="note">Schéma pédagogique : zones de relief simplifiées ; altitude du mont Blanc variable selon la neige et la glace.</text>')
    return svg_shell("Reliefs et points culminants de la France", "Carte des principaux massifs français et comparaison de leurs points culminants, avec le mont Blanc à environ 4 809 mètres.", "".join(body), 800)


def seas():
    bbox = (-9.0, 40.0, 11.2, 53.5)
    rect = (90, 105, 1020, 600)
    p = projection(bbox, rect)
    body = ['<text x="55" y="48" class="title">Les mers et façades maritimes de la France</text><text x="55" y="76" class="subtitle">Quatre espaces bordent la métropole : Atlantique, Manche, mer du Nord et Méditerranée.</text>', '<defs><clipPath id="seaclip"><rect x="55" y="100" width="1090" height="615" rx="22"/></clipPath></defs>', '<rect x="55" y="100" width="1090" height="615" rx="22" fill="#dff3fa"/>', base_map(p, clip_id="seaclip")]
    labels = [
        ("OCÉAN ATLANTIQUE", -6.6, 45.1, -8, "#0e7490", 0),
        ("LA MANCHE", -1.4, 50.15, 0, "#155e75", -8),
        ("MER DU NORD", 3.0, 52.1, 0, "#155e75", 0),
        ("MER MÉDITERRANÉE", 3.4, 41.45, 0, "#0e7490", 0),
        ("Golfe de Gascogne", -4.1, 44.0, 0, "#3489a5", -12),
    ]
    for name, lon, lat, dy, color, rot in labels:
        x, y = p(lon, lat)
        size = 20 if name.isupper() else 15
        body.append(f'<text x="{x:.1f}" y="{y+dy:.1f}" text-anchor="middle" style="font:700 {size}px system-ui,sans-serif;fill:{color};letter-spacing:.8px" transform="rotate({rot} {x:.1f} {y+dy:.1f})">{name}</text>')
    cities = [("Brest", -4.49, 48.39), ("Le Havre", 0.11, 49.49), ("Dunkerque", 2.38, 51.03), ("Marseille", 5.37, 43.30)]
    for name, lon, lat in cities:
        x, y = p(lon, lat)
        body.append(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="5" fill="#172133"/><text x="{x+9:.1f}" y="{y-8:.1f}" class="small">{name}</text>')
    body.append('<text x="55" y="750" class="note">La Manche sépare la France du Royaume-Uni et s’ouvre vers l’Atlantique.</text><text x="55" y="774" class="note">Piège classique : la Seine se jette dans la Manche, près du Havre.</text>')
    return svg_shell("Les mers et façades maritimes de la France", "Carte situant l'océan Atlantique, la Manche, la mer du Nord et la mer Méditerranée autour de la France métropolitaine.", "".join(body), 800)


def rivers():
    bbox = (-7.0, 41.0, 10.8, 53.0)
    rect = (55, 105, 720, 610)
    p = projection(bbox, rect)
    body = ['<text x="55" y="48" class="title">Les cinq grands fleuves à connaître</text><text x="55" y="76" class="subtitle">Suis chaque cours d’eau jusqu’à son embouchure : c’est l’association la plus souvent interrogée.</text>', '<rect x="45" y="98" width="740" height="630" rx="22" fill="#dff3fa"/>', base_map(p, clip_id="mapclip")]
    colors = {"Loire":"#227c9d", "Seine":"#6b5ca5", "Garonne":"#ef476f", "Rhône":"#f59e0b", "Rhine":"#208a68"}
    for name, color in colors.items():
        for feature in RIVERS["features"]:
            if feature["properties"].get("name") != name:
                continue
            for path in line_paths(feature["geometry"], p):
                body.append(f'<path d="{path}" fill="none" stroke="#fff" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" clip-path="url(#mapclip)"/><path d="{path}" fill="none" stroke="{color}" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round" clip-path="url(#mapclip)"/>')
    # The Gironde estuary completes the Garonne route between Bordeaux and the Atlantic.
    gx1, gy1 = p(-0.58, 44.84); gx2, gy2 = p(-1.10, 45.57)
    body.append(f'<path d="M{gx1:.1f},{gy1:.1f} Q{gx1-18:.1f},{gy1-28:.1f} {gx2:.1f},{gy2:.1f}" fill="none" stroke="#ef476f" stroke-width="5" stroke-linecap="round"/>')
    labels = [("Loire", 0.3, 47.15), ("Seine", 1.2, 48.75), ("Garonne", -0.2, 44.15), ("Rhône", 5.2, 44.8), ("Rhin", 8.15, 49.0)]
    for name, lon, lat in labels:
        x, y = p(lon, lat); color = colors[name if name != "Rhin" else "Rhine"]
        body.append(f'<text x="{x:.1f}" y="{y:.1f}" class="label" style="fill:{color}">{name}</text>')
    cities = [("Paris", 2.35, 48.86), ("Toulouse", 1.44, 43.60), ("Bordeaux", -0.58, 44.84), ("Lyon", 4.84, 45.76), ("Strasbourg", 7.75, 48.58)]
    for name, lon, lat in cities:
        x, y = p(lon, lat)
        body.append(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="4" fill="#172133"/><text x="{x+8:.1f}" y="{y-7:.1f}" class="small">{name}</text>')
    mouths = [
        ("Atlantique", -2.20, 47.27, colors["Loire"]),
        ("Manche", 0.10, 49.48, colors["Seine"]),
        ("Gironde → Atlantique", -1.10, 45.57, colors["Garonne"]),
        ("Méditerranée", 4.48, 43.35, colors["Rhône"]),
        ("Mer du Nord", 4.10, 51.95, colors["Rhine"]),
    ]
    for label, lon, lat, color in mouths:
        x, y = p(lon, lat)
        body.append(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="8" fill="{color}" stroke="#fff" stroke-width="3"/>')
    body.insert(3, '<defs><clipPath id="mapclip"><rect x="45" y="98" width="740" height="630" rx="22"/></clipPath></defs>')
    body.append('<rect x="815" y="112" width="330" height="595" rx="20" class="panel"/><text x="842" y="151" class="panelTitle">Fleuve → embouchure</text>')
    facts = [
        ("Loire", "Atlantique", "≈ 1 006 km · entièrement française"),
        ("Seine", "Manche", "traverse Paris · estuaire au Havre"),
        ("Garonne", "Atlantique", "via l’estuaire de la Gironde"),
        ("Rhône", "Méditerranée", "delta de la Camargue"),
        ("Rhin", "Mer du Nord", "frontière franco-allemande par endroits"),
    ]
    for i, (name, sea, note) in enumerate(facts):
        y = 205 + i * 98; color = colors[name if name != "Rhin" else "Rhine"]
        body.append(f'<circle cx="842" cy="{y-5}" r="7" fill="{color}"/><text x="860" y="{y}" class="value">{name} → {sea}</text><text x="842" y="{y+29}" class="panelText">{note}</text>')
    body.append('<text x="55" y="772" class="note">Un fleuve se jette dans une mer ou un océan ; une rivière se jette dans un autre cours d’eau.</text>')
    return svg_shell("Les cinq grands fleuves français", "Carte de la Loire, la Seine, la Garonne, le Rhône et le Rhin, avec leurs principales villes et leurs embouchures.", "".join(body), 800)


def regions_capitals():
    width, height = 1400, 1160
    bbox = (-5.8, 41.0, 10.1, 51.8)
    rect = (45, 120, 790, 725)
    p = projection(bbox, rect)
    palette = ["#d8eee7", "#dcecfb", "#eee5fa", "#fde8d2", "#e6edf3"]
    region_data = {
        "Île-de-France": ("Paris", 2.3522, 48.8566, 1.65, 48.42, ["Île-de-France"]),
        "Centre-Val de Loire": ("Orléans", 1.9093, 47.9030, 1.65, 46.55, ["Centre-Val", "de Loire"]),
        "Bourgogne-Franche-Comté": ("Dijon", 5.0415, 47.3220, 5.35, 46.75, ["Bourgogne-", "Franche-Comté"]),
        "Normandie": ("Rouen", 1.0993, 49.4432, -0.30, 49.10, ["Normandie"]),
        "Hauts-de-France": ("Lille", 3.0573, 50.6292, 2.25, 50.05, ["Hauts-de-France"]),
        "Grand Est": ("Strasbourg", 7.7521, 48.5734, 5.25, 49.25, ["Grand Est"]),
        "Pays de la Loire": ("Nantes", -1.5536, 47.2184, -1.05, 46.45, ["Pays de", "la Loire"]),
        "Bretagne": ("Rennes", -1.6778, 48.1173, -3.25, 48.05, ["Bretagne"]),
        "Nouvelle-Aquitaine": ("Bordeaux", -0.5792, 44.8378, -0.40, 45.50, ["Nouvelle-", "Aquitaine"]),
        "Occitanie": ("Toulouse", 1.4442, 43.6047, 2.05, 43.10, ["Occitanie"]),
        "Auvergne-Rhône-Alpes": ("Lyon", 4.8357, 45.7640, 4.25, 45.10, ["Auvergne-", "Rhône-Alpes"]),
        "Provence-Alpes-Côte d'Azur": ("Marseille", 5.3698, 43.2965, 6.40, 43.85, ["Provence-Alpes-", "Côte d’Azur"]),
        "Corse": ("Ajaccio", 8.7386, 41.9192, 9.15, 42.30, ["Corse"]),
    }
    body = [
        '<style>.regionName{font:700 13px system-ui,sans-serif;fill:#24364a;text-anchor:middle;paint-order:stroke;stroke:#fff;stroke-width:4;stroke-linejoin:round}.capital{font:800 14px system-ui,sans-serif;fill:#9e3348;paint-order:stroke;stroke:#fff;stroke-width:4;stroke-linejoin:round}.pairRegion{font:700 15px system-ui,sans-serif;fill:#172133}.pairCity{font:700 15px system-ui,sans-serif;fill:#9e3348}.dromRegion{font:750 15px system-ui,sans-serif;fill:#172133}.dromCity{font:650 14px system-ui,sans-serif;fill:#9e3348}.dromPlace{font:500 12px system-ui,sans-serif;fill:#64748b}</style>',
        '<text x="55" y="49" class="title">Régions françaises et capitales régionales</text>',
        '<text x="55" y="78" class="subtitle">13 régions métropolitaines depuis 2016 · le terme administratif exact est « chef-lieu ».</text>',
        '<rect x="35" y="110" width="810" height="750" rx="22" fill="#eaf5f8"/>',
    ]
    for index, feature in enumerate(REGIONS["features"]):
        name = feature["properties"]["nom"]
        for path in polygon_paths(feature["geometry"], p):
            body.append(f'<path d="{path}" fill="{palette[index % len(palette)]}" stroke="#ffffff" stroke-width="3" fill-rule="evenodd"/>')
    for name, (city, clon, clat, rlon, rlat, lines) in region_data.items():
        rx, ry = p(rlon, rlat)
        offset = -9 * (len(lines) - 1)
        for line_no, line in enumerate(lines):
            body.append(f'<text x="{rx:.1f}" y="{ry+offset+line_no*18:.1f}" class="regionName">{line}</text>')
        cx, cy = p(clon, clat)
        body.append(f'<circle cx="{cx:.1f}" cy="{cy:.1f}" r="5.5" fill="#ef476f" stroke="#fff" stroke-width="2"/>')
        city_dx, city_dy, anchor = 9, -8, "start"
        if city in {"Strasbourg", "Marseille", "Ajaccio"}:
            city_dx, anchor = -9, "end"
        if city in {"Rouen", "Orléans", "Dijon", "Lyon", "Toulouse", "Bordeaux"}:
            city_dy = 17
        if city == "Nantes":
            city_dx, city_dy, anchor = -9, -8, "end"
        if city == "Orléans":
            city_dx, city_dy, anchor = 9, -8, "start"
        body.append(f'<text x="{cx+city_dx:.1f}" y="{cy+city_dy:.1f}" text-anchor="{anchor}" class="capital">{city}</text>')

    body.append('<rect x="870" y="110" width="495" height="750" rx="22" class="panel"/><text x="900" y="151" class="panelTitle">Région → chef-lieu</text>')
    pairs = [
        ("Auvergne-Rhône-Alpes", "Lyon"), ("Bourgogne-Franche-Comté", "Dijon"),
        ("Bretagne", "Rennes"), ("Centre-Val de Loire", "Orléans"), ("Corse", "Ajaccio"),
        ("Grand Est", "Strasbourg"), ("Hauts-de-France", "Lille"), ("Île-de-France", "Paris"),
        ("Normandie", "Rouen"), ("Nouvelle-Aquitaine", "Bordeaux"), ("Occitanie", "Toulouse"),
        ("Pays de la Loire", "Nantes"), ("Provence-Alpes-Côte d’Azur", "Marseille"),
    ]
    for i, (region, city) in enumerate(pairs):
        y = 191 + i * 49
        body.append(f'<circle cx="900" cy="{y-5}" r="4.5" fill="#ef476f"/><text x="916" y="{y}" class="pairRegion">{region}</text><text x="1329" y="{y}" text-anchor="end" class="pairCity">{city}</text>')

    body.append('<text x="55" y="905" class="sectionTitle">Les cinq DROM et leurs chefs-lieux</text>')
    droms = [
        ("Guadeloupe", "Basse-Terre", "Antilles"), ("Martinique", "Fort-de-France", "Antilles"),
        ("Guyane", "Cayenne", "Amérique du Sud"), ("La Réunion", "Saint-Denis", "océan Indien"),
        ("Mayotte", "Mamoudzou", "océan Indien"),
    ]
    for i, (region, city, place) in enumerate(droms):
        x = 55 + i * 266
        body.append(f'<rect x="{x}" y="932" width="242" height="142" rx="18" class="panel"/><circle cx="{x+24}" cy="{965}" r="7" fill="#0e7490"/><text x="{x+41}" y="970" class="dromRegion">{region}</text><text x="{x+24}" y="1010" class="dromCity">→ {city}</text><text x="{x+24}" y="1042" class="dromPlace">{place}</text>')
    body.append('<text x="55" y="1123" class="note">Pièges fréquents : Normandie → Rouen (et non Caen) · Occitanie → Toulouse (et non Montpellier) · Bretagne → Rennes (et non Nantes).</text>')
    return f'''<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" viewBox="0 0 {width} {height}" role="img" aria-labelledby="title desc"><title id="title">Régions françaises et capitales régionales</title><desc id="desc">Carte des treize régions métropolitaines avec leur chef-lieu et liste des cinq départements et régions d'outre-mer avec leur chef-lieu.</desc><style>{STYLE}</style><rect width="{width}" height="{height}" rx="28" class="bg"/>''' + "".join(body) + "</svg>"


def overseas_statuses():
    width, height = 1400, 1080
    bbox = (-180.0, -82.0, 180.0, 86.0)
    rect = (45, 155, 1310, 560)
    p = projection(bbox, rect)
    colors = {"DROM": "#0e8a87", "COM": "#7356ad", "TAAF": "#d47a24", "NC": "#d83f68"}
    body = [
        '<style>.oceanLabel{font:600 14px system-ui,sans-serif;fill:#6b91a2;letter-spacing:.6px}.territory{font:700 14px system-ui,sans-serif;fill:#172133;paint-order:stroke;stroke:#fff;stroke-width:4;stroke-linejoin:round}.statusTitle{font:800 20px system-ui,sans-serif}.statusList{font:600 14px system-ui,sans-serif;fill:#334155}.statusNote{font:500 13px system-ui,sans-serif;fill:#64748b}.legend{font:750 14px system-ui,sans-serif}</style>',
        '<text x="55" y="49" class="title">Outre-mer français : localisations et statuts</text>',
        '<text x="55" y="79" class="subtitle">DROM, COM, TAAF et Nouvelle-Calédonie ne relèvent pas du même statut juridique.</text>',
    ]
    legends = [("DROM", "Départements et régions d’outre-mer"), ("COM", "Collectivités d’outre-mer"), ("TAAF", "Terres australes et antarctiques françaises"), ("NC", "Nouvelle-Calédonie · sui generis")]
    x = 55
    for key, label in legends:
        body.append(f'<circle cx="{x+8}" cy="119" r="8" fill="{colors[key]}"/><text x="{x+24}" y="124" class="legend" fill="{colors[key]}">{label}</text>')
        x += {"DROM": 330, "COM": 295, "TAAF": 385, "NC": 0}[key]
    body.append('<rect x="35" y="145" width="1330" height="580" rx="22" fill="#dff3fa"/>')
    for lon in range(-120, 181, 60):
        x1, y1 = p(lon, -80); x2, y2 = p(lon, 85)
        body.append(f'<line x1="{x1:.1f}" y1="{y1:.1f}" x2="{x2:.1f}" y2="{y2:.1f}" stroke="#b9dbe7" stroke-width="1" opacity=".7"/>')
    for lat in [-60, -30, 0, 30, 60]:
        x1, y1 = p(-180, lat); x2, y2 = p(180, lat)
        body.append(f'<line x1="{x1:.1f}" y1="{y1:.1f}" x2="{x2:.1f}" y2="{y2:.1f}" stroke="#b9dbe7" stroke-width="1" opacity=".7"/>')
    for feature in WORLD["features"]:
        for path in polygon_paths(feature["geometry"], p):
            body.append(f'<path d="{path}" fill="#e7edf3" stroke="#ffffff" stroke-width=".8" fill-rule="evenodd"/>')
    for label, lon, lat in [("ATLANTIQUE", -28, 9), ("INDIEN", 78, -4), ("PACIFIQUE", -145, -4), ("PACIFIQUE", 150, 8)]:
        x1, y1 = p(lon, lat); body.append(f'<text x="{x1:.1f}" y="{y1:.1f}" text-anchor="middle" class="oceanLabel">OCÉAN {label}</text>')

    def marker(label, lon, lat, key, dx, dy, anchor="start", r=7):
        mx, my = p(lon, lat); tx, ty = mx + dx, my + dy
        line_end = tx - 5 if anchor == "start" else tx + 5
        return f'<line x1="{mx:.1f}" y1="{my:.1f}" x2="{line_end:.1f}" y2="{ty-5:.1f}" stroke="{colors[key]}" stroke-width="1.5"/><circle cx="{mx:.1f}" cy="{my:.1f}" r="{r}" fill="{colors[key]}" stroke="#fff" stroke-width="2.5"/><text x="{tx:.1f}" y="{ty:.1f}" text-anchor="{anchor}" class="territory">{label}</text>'

    # Atlantic and Caribbean territories.
    body.append(marker("Saint-Pierre-et-Miquelon", -56.2, 46.8, "COM", 14, -10))
    ax, ay = p(-62.0, 16.2)
    body.append(f'<circle cx="{ax-5:.1f}" cy="{ay+4:.1f}" r="7" fill="{colors["DROM"]}" stroke="#fff" stroke-width="2"/><circle cx="{ax+5:.1f}" cy="{ay-4:.1f}" r="7" fill="{colors["COM"]}" stroke="#fff" stroke-width="2"/><line x1="{ax+7:.1f}" y1="{ay:.1f}" x2="{ax+40:.1f}" y2="{ay+16:.1f}" stroke="#526172" stroke-width="1.5"/><text x="{ax+45:.1f}" y="{ay+21:.1f}" class="territory">Antilles françaises</text>')
    body.append(marker("Guyane", -53.1, 4.0, "DROM", 14, 22))
    # Indian Ocean and TAAF.
    body.append(marker("Mayotte", 45.17, -12.83, "DROM", -15, -12, "end"))
    body.append(marker("La Réunion", 55.53, -21.13, "DROM", 14, 20))
    body.append(marker("Îles Éparses", 47.2, -17.0, "TAAF", -20, 27, "end", 6))
    body.append(marker("Crozet", 51.8, -46.4, "TAAF", -12, 20, "end", 6))
    body.append(marker("Kerguelen", 69.2, -49.35, "TAAF", 11, 19, "start", 6))
    body.append(marker("Saint-Paul et Amsterdam", 77.5, -37.8, "TAAF", 12, -14, "start", 6))
    # Pacific territories and Antarctica.
    body.append(marker("Polynésie française", -149.4, -17.7, "COM", 13, -13))
    body.append(marker("Wallis-et-Futuna", -177.2, -13.3, "COM", 14, 23))
    body.append(marker("Nouvelle-Calédonie", 165.6, -21.4, "NC", -14, -13, "end"))
    body.append(marker("Terre Adélie", 140.0, -66.7, "TAAF", -14, -13, "end", 6))

    panels = [
        (55, "DROM · 5", colors["DROM"], ["Guadeloupe · Martinique · Guyane", "La Réunion · Mayotte"], "Même principe législatif que la métropole."),
        (390, "COM · 5", colors["COM"], ["Saint-Pierre-et-Miquelon", "Saint-Barthélemy · Saint-Martin", "Polynésie française · Wallis-et-Futuna"], "Statut adapté et autonomie plus large."),
        (755, "TAAF", colors["TAAF"], ["Crozet · Kerguelen", "Saint-Paul et Amsterdam · Îles Éparses", "Terre Adélie"], "Aucune population civile permanente."),
        (1090, "NOUVELLE-CALÉDONIE", colors["NC"], ["Collectivité sui generis", "Statut institutionnel particulier"], "Ni DROM, ni COM, ni TAAF."),
    ]
    widths = [305, 335, 305, 265]
    for i, (px, title, color, lines, note) in enumerate(panels):
        body.append(f'<rect x="{px}" y="752" width="{widths[i]}" height="235" rx="20" class="panel"/><text x="{px+24}" y="790" class="statusTitle" fill="{color}">{title}</text>')
        for j, line in enumerate(lines):
            body.append(f'<text x="{px+24}" y="{830+j*31}" class="statusList">{line}</text>')
        body.append(f'<line x1="{px+24}" y1="921" x2="{px+widths[i]-24}" y2="921" stroke="#d8e1ea"/><text x="{px+24}" y="953" class="statusNote">{note}</text>')
    body.append('<text x="55" y="1032" class="note">À retenir : DROM et COM sont des statuts ; les TAAF forment un territoire spécifique ; la Nouvelle-Calédonie possède un statut sui generis.</text>')
    return f'''<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" viewBox="0 0 {width} {height}" role="img" aria-labelledby="title desc"><title id="title">Carte des statuts de l'outre-mer français</title><desc id="desc">Carte mondiale localisant les cinq DROM, les cinq COM, les districts des TAAF et la Nouvelle-Calédonie, avec un code couleur par statut.</desc><style>{STYLE}</style><rect width="{width}" height="{height}" rx="28" class="bg"/>''' + "".join(body) + "</svg>"


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    (OUT / "reliefs-france.svg").write_text(reliefs())
    (OUT / "mers-france.svg").write_text(seas())
    (OUT / "fleuves-france.svg").write_text(rivers())
    (OUT / "regions-capitales-france.svg").write_text(regions_capitals())
    (OUT / "outre-mer-statuts-carte.svg").write_text(overseas_statuses())


if __name__ == "__main__":
    main()
